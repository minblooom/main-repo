// src/core/safety/safetyFilter.js
// Safety filter — keyword-based crisis detection running locally on device

const CRISIS_PATTERNS = {
  crisis: [
    /kill\s+myself/i,
    /end\s+my\s+life/i,
    /want\s+to\s+die/i,
    /better\s+off\s+dead/i,
    /going\s+to\s+kill/i,
    /ending\s+it\s+today/i,
    /ending\s+it\s+tonight/i,
    /suicide\s+plan/i,
  ],
  high: [
    /suicid(e|al)/i,
    /self[- ]harm/i,
    /hurt\s+myself/i,
    /can'?t\s+go\s+on/i,
    /no\s+reason\s+to\s+live/i,
    /tired\s+of\s+living/i,
    /disappear\s+forever/i,
  ],
  moderate: [
    /hopeless/i,
    /can'?t\s+handle\s+this/i,
    /nobody\s+cares\s+about\s+me/i,
    /falling\s+apart/i,
    /giving\s+up/i,
  ],
};

export function analyzeTextSafety(text) {
  if (!text || text.trim().length === 0) {
    return { isCritical: false, tier: 'none' };
  }

  for (const regex of CRISIS_PATTERNS.crisis) {
    if (regex.test(text)) {
      return {
        isCritical: true,
        tier: 'crisis',
        detectedKeyword: text.match(regex)?.[0],
      };
    }
  }

  for (const regex of CRISIS_PATTERNS.high) {
    if (regex.test(text)) {
      return {
        isCritical: true,
        tier: 'high',
        detectedKeyword: text.match(regex)?.[0],
      };
    }
  }

  for (const regex of CRISIS_PATTERNS.moderate) {
    if (regex.test(text)) {
      return {
        isCritical: false,
        tier: 'moderate',
        detectedKeyword: text.match(regex)?.[0],
      };
    }
  }

  return { isCritical: false, tier: 'none' };
}
