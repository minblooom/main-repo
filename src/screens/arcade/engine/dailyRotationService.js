// src/screens/arcade/engine/dailyRotationService.js
// Daily game rotation engine for Bloom Arcade.
// Assigns a specific game per day-of-week (deterministic, calendar-stable).

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAMES_CATALOG } from './gameRegistry';

const DAILY_RECORD_KEY = '@mindbloom:arcade:daily_played_date';

// Day-of-week rotation (0=Sunday, 1=Monday, ..., 6=Saturday)
// Carefully curated for mood fit:
const DAY_OF_WEEK_ROTATION = {
  0: 'colour_crush',   // Sunday   – gentle reset, botanical match-3
  1: 'memory_match',   // Monday   – calm focus to start the week
  2: 'colour_crush',   // Tuesday  – puzzle challenge
  3: 'bubble_pop',     // Wednesday – midweek float & relax
  4: 'stack_attack',   // Thursday – exciting tower challenge
  5: 'canopy_runner',  // Friday   – fun savanna dash to end the week
  6: 'block_puzzle',   // Saturday – strategic grid weekend
};

/**
 * Returns the stable Game of the Day for a given timestamp/date.
 * Uses day-of-week assignment, with a fallback hash if game not found.
 */
export const getGameOfTheDay = (date = new Date()) => {
  const dayOfWeek = date.getDay(); // 0–6
  const targetId = DAY_OF_WEEK_ROTATION[dayOfWeek];

  // Try to find the assigned game
  const assigned = GAMES_CATALOG.find((g) => g.id === targetId && g.isPlayable);
  if (assigned) return assigned;

  // Fallback: pick from eligible games by day-of-year hash
  const eligible = GAMES_CATALOG.filter((g) => g.isDailyEligible && g.isPlayable);
  if (eligible.length === 0) return GAMES_CATALOG[0];

  const year = date.getFullYear();
  const start = new Date(year, 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = (year * 365 + dayOfYear) % eligible.length;
  return eligible[index];
};

/**
 * Checks if the user already played today's game
 */
export const hasPlayedToday = async () => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const saved = await AsyncStorage.getItem(DAILY_RECORD_KEY);
    return saved === todayStr;
  } catch {
    return false;
  }
};

/**
 * Records that the user completed today's daily game
 */
export const markPlayedToday = async () => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(DAILY_RECORD_KEY, todayStr);
  } catch {}
};
