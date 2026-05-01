const { env } = require('../config/env');
const { normalizeSummary } = require('../utils/summary');

const SUMMARY_PROMPT_PREFIX =
  'Analyze the following medical text. Extract only explicit information. Return ONLY a single-line JSON object with this exact shape: ' +
  '{"symptoms":[],"diagnosis":[],"prescription":[],"vitals":[],"lifestyle_advice":[],"tests_recommended":[],"follow_up_plan":[]}. ' +
  'No markdown, no explanations, no extra fields. If unknown, use empty arrays.';

function extractJsonObject(text) {
  const raw = String(text || '').trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) {
    throw new Error('Gemini did not return JSON object');
  }
  return raw.slice(start, end + 1);
}

async function callGemini(prompt) {
  if (!env.GENAI_API_KEY) {
    throw new Error('GENAI_API_KEY is missing');
  }

  const model = env.GENAI_MODEL || 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GENAI_API_KEY}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Gemini request failed: ${response.status} ${detail}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('') || '';

  if (!text.trim()) {
    throw new Error('Gemini returned empty response');
  }

  return text;
}

async function generateMedicalSummary(transcriptText) {
  const transcript = String(transcriptText || '').trim();
  if (!transcript) {
    return normalizeSummary({});
  }

  const prompt = `${SUMMARY_PROMPT_PREFIX}\n\nText to analyze: ${transcript}`;
  const raw = await callGemini(prompt);
  const jsonText = extractJsonObject(raw);
  const parsed = JSON.parse(jsonText);

  return normalizeSummary(parsed);
}

module.exports = { generateMedicalSummary };
