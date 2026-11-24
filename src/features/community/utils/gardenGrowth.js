// src/features/community/utils/gardenGrowth.js
export const buildGarden = (seeds = [], keepsakes = {}) => {
  return seeds.map((s, idx) => ({
    id: s.id || `garden-${idx}`,
    title: s.title || '',
    stage: (s.completedDates?.length || 0) > 3 ? 'blooming' : 'sprouting',
    bloomsCount: s.completedDates?.length || 0,
  }));
};

export const gardenStreak = (seeds = []) => {
  if (!Array.isArray(seeds)) return 0;
  const completed = seeds.filter((s) => (s.completedDates?.length || 0) > 0);
  return completed.length;
};
