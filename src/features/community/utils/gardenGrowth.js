// src/features/community/utils/gardenGrowth.js
import { toDateKey } from './dateKeys';

// Builds the last `days` days, oldest first. Each day gets a stage:
// 'soil' (nothing), 'seed' (checked in), 'sprout' (goal kept), 'bloom' (both).
export const buildGarden = ({ checkIns, goals, days = 14 }) => {
  const checkedIn = new Set(checkIns.map((c) => c.date));
  const kept = new Set(goals.flatMap((g) => g.completedDates));

  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const date = toDateKey(d);
    const hasCheckIn = checkedIn.has(date);
    const hasGoal = kept.has(date);

    let stage = 'soil';
    if (hasCheckIn && hasGoal) stage = 'bloom';
    else if (hasGoal) stage = 'sprout';
    else if (hasCheckIn) stage = 'seed';

    return { date, stage };
  });
};

// Counts how many days in a row are not soil, ending today
export const gardenStreak = (garden) => {
  let count = 0;
  for (let i = garden.length - 1; i >= 0 && garden[i].stage !== 'soil'; i--) count++;
  return count;
};