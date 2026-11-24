// src/features/community/data/seedPrompts.js
export const SEED_PROMPTS = [
  'What\'s one small thing you\'d like to grow this week?',
  'Where did you feel steady today?',
  'What is one thing you did for yourself, however small?',
  'Who or what helped you this week?',
  'What would make tomorrow a little easier?',
  'What is one thing you can let go of today?',
];

// Same prompt for the whole day, so it doesn't change on every visit
export const dailySeedPrompt = (dateKey) => {
  const seed = [...dateKey].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return SEED_PROMPTS[seed % SEED_PROMPTS.length];
};