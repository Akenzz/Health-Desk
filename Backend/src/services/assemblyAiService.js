const { env } = require('../config/env');

async function uploadAudio(buffer) {
  const response = await fetch(`${env.ASSEMBLYAI_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      authorization: env.ASSEMBLYAI_API_KEY,
      'content-type': 'application/octet-stream',
    },
    body: buffer,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`AssemblyAI upload failed: ${response.status} ${detail}`);
  }

  const data = await response.json();
  return data.upload_url;
}

async function createTranscript(uploadUrl) {
  const response = await fetch(`${env.ASSEMBLYAI_BASE_URL}/transcript`, {
    method: 'POST',
    headers: {
      authorization: env.ASSEMBLYAI_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: uploadUrl,
      language_detection: true,
      speech_model: 'best',
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`AssemblyAI transcript creation failed: ${response.status} ${detail}`);
  }

  const data = await response.json();
  return data.id;
}

async function waitForTranscript(transcriptId) {
  const maxAttempts = 24;
  const delayMs = 5000;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetch(`${env.ASSEMBLYAI_BASE_URL}/transcript/${transcriptId}`, {
      method: 'GET',
      headers: {
        authorization: env.ASSEMBLYAI_API_KEY,
      },
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`AssemblyAI transcript poll failed: ${response.status} ${detail}`);
    }

    const data = await response.json();

    if (data.status === 'completed') {
      return String(data.text || '').trim();
    }

    if (data.status === 'error') {
      throw new Error(`AssemblyAI transcription failed: ${data.error || 'Unknown error'}`);
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error('AssemblyAI transcription timed out');
}

async function transcribeAudioWithAssemblyAI(audioBuffer) {
  if (!env.ASSEMBLYAI_API_KEY) {
    throw new Error('ASSEMBLYAI_API_KEY is missing');
  }

  const uploadUrl = await uploadAudio(audioBuffer);
  const transcriptId = await createTranscript(uploadUrl);
  return waitForTranscript(transcriptId);
}

module.exports = { transcribeAudioWithAssemblyAI };
