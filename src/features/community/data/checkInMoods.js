// src/features/community/data/checkInMoods.js
export const MOODS = [
  { key: 'showed_up', label: 'I showed up for myself' },
  { key: 'progress', label: 'I made a little progress' },
  { key: 'need', label: 'I need some encouragement' },
];

export const moodLabel = (key) => MOODS.find((m) => m.key === key)?.label ?? '';