// -------------------------
// GRADIENT COLOR CATEGORY
// -------------------------
export const getGradientForValue = (value: number) => {
  if (value >= 35) return "perfect"; // gold flame
  if (value >= 25) return "high"; // green/teal
  if (value >= 10) return "medium"; // blue
  return "low"; // red/orange
};

// -------------------------
// DISPLAY FORMAT
// -------------------------
export const formatMinutes = (min: number) => {
  if (!min || min <= 0) return "0 min";
  return `${min} min`;
};

// -------------------------
// SAFE BEST DAY
// returns { day, value }
// -------------------------
export const getBestDay = (
  data: { day: string; value: number }[] | null | undefined
) => {
  if (!data || data.length === 0) return { day: "-", value: 0 };

  const best = data.reduce((a, b) => (b.value > a.value ? b : a));
  return best;
};

// -------------------------
// TOTAL MINUTES
// -------------------------
export const getTotalMinutes = (
  data: { value: number }[] | null | undefined
) => {
  if (!data || data.length === 0) return 0;
  return data.reduce((sum, v) => sum + (v.value || 0), 0);
};

// -------------------------
// WEEKLY STREAK
// consecutive > 0 days from left to right
// -------------------------
export const getWeeklyStreak = (
  data: { value: number }[] | null | undefined
) => {
  if (!data || data.length === 0) return 0;

  let streak = 0;
  for (const day of data) {
    if (day.value > 0) streak++;
    else break;
  }
  return streak;
};
