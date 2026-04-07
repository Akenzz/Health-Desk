function emptySummary() {
  return {
    symptoms: [],
    diagnosis: [],
    prescription: [],
    vitals: [],
    lifestyle_advice: [],
    tests_recommended: [],
    follow_up_plan: [],
  };
}

function asStringList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || '').trim())
    .filter((item) => item.length > 0);
}

function normalizeSummary(summary) {
  const source = summary || {};
  return {
    symptoms: asStringList(source.symptoms),
    diagnosis: asStringList(source.diagnosis),
    prescription: asStringList(source.prescription),
    vitals: asStringList(source.vitals),
    lifestyle_advice: asStringList(source.lifestyle_advice),
    tests_recommended: asStringList(source.tests_recommended),
    follow_up_plan: asStringList(source.follow_up_plan),
  };
}

function isEmptySummary(summary) {
  const normalized = normalizeSummary(summary);
  return Object.values(normalized).every((list) => list.length === 0);
}

function buildSummaryFromText(text) {
  const normalized = String(text || '').trim();
  if (!normalized) {
    return emptySummary();
  }

  // Lightweight deterministic fallback summary for current frontend expectations.
  return normalizeSummary({
    symptoms: [normalized.slice(0, 160)],
    diagnosis: [],
    prescription: [],
    vitals: [],
    lifestyle_advice: [],
    tests_recommended: [],
    follow_up_plan: [],
  });
}

module.exports = { buildSummaryFromText, emptySummary, normalizeSummary, isEmptySummary };
