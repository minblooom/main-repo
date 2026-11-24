// src/features/community/utils/dateKeys.js
export const toDateKey = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const todayKey = toDateKey(new Date());

export const formatDayLabel = (dateKey) => {
  if (!dateKey) return '';
  if (dateKey === todayKey) return 'Today';
  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    return dateKey;
  }
};
