// src/services/arcadeApiService.js
// Hybrid Public API service for MindBloom Arcade
// Integrates with The Open Mindfulness API (The Holistic Care) and Open CBT metadata
// with resilient local fallback for offline support.

const THE_HOLISTIC_CARE_API = 'https://api.theholisticcare.com/v1';

export class ArcadeApiService {
  /**
   * Fetches live external mindfulness games and mini-interventions from The Holistic Care API
   */
  static async fetchExternalMindfulnessGames() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const res = await fetch(`${THE_HOLISTIC_CARE_API}/mindfulness-games`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch {
      // Offline fallback: Returns null to tell caller to use offline-first local catalog
    }
    return null;
  }

  /**
   * Fetches fresh cognitive distortion cases for Thought Detective
   */
  static async fetchCbtScenarios(category = 'anxiety') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${THE_HOLISTIC_CARE_API}/mindfulness-games/feelings-detective`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return json.scenarios || null;
      }
    } catch {
      // Graceful offline fallback
    }
    return null;
  }

  /**
   * Fetches daily wisdom and reflection prompts for after game completion
   */
  static async fetchDailyReflectionQuote() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch('https://api.quotable.io/random?tags=wisdom|mindfulness', {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          content: data.content,
          author: data.author,
        };
      }
    } catch {
      // Fallback to grounded East African sanctuary proverbs
    }
    return {
      content: 'Mti mkuu haulali kwa upepo. Polepole ndio mwendo.',
      author: 'East African Wisdom',
    };
  }
}
