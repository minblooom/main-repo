// src/features/community/utils/dateKeys.js
const pad = (n) => String(n).padStart(2, '0');

// Local calendar date, so "today" follows the user's clock
export const toDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayKey = () => toDateKey();

// Consecutive days completed, counting back from today.
// If today isn't done yet, the streak still counts through yesterday.
export const currentStreak = (dateKeys) => {
  const done = new Set(dateKeys);
  const cursor = new Date();
  if (!done.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let count = 0;
  while (done.has(toDateKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
};

// "2026-11-19" -> "Thu, 19 Nov"
export const formatDayLabel = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short', day: 'numeric', month: 'short',
  });
};