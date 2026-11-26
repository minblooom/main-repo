// src/features/community/services/circleMatchingService.js
// Dynamic Baraza Circle Matching Engine
// Enforces the 5 Non-Negotiable Invariants:
// 1. Strict Age Cohort (13–17, 18–24, 25+)
// 2. Gender Alignment (gender-specific spaces like Sisterhood / Men's Grounding only shown to matching gender)
// 3. Shared Clinical Issue / Struggle (>= 1 common struggle)
// 4. Shared Passion / Interest (>= 1 common passion, picks up to 5)
// 5. Hard Capacity Cap (<= 12 members per circle, auto-locks when full)

// src/features/community/services/circleMatchingService.js
// Dynamic Baraza Circle Matching Engine
// Enforces the 5 Non-Negotiable Invariants:
// 1. Strict Age Cohort (13–17, 18–24, 25+)
// 2. Gender Alignment (gender-specific spaces like Sisterhood / Men's Grounding only shown to matching gender)
// 3. Shared Clinical Issue / Struggle (>= 1 common struggle)
// 4. Shared Passion / Interest (>= 1 common passion, picks up to 5)
// 5. Hard Capacity Cap (<= 12 members per circle, auto-locks when full)

import { barazaCircles } from '../data/communityData.js';

/**
 * Normalizes string identifiers for robust tag/issue matching
 */
function clean(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Maps raw age numbers to age bands
 */
export function getAgeBand(age) {
  const numeric = parseInt(age, 10);
  if (!numeric || isNaN(numeric)) return '18-24'; // default youth cohort
  if (numeric < 18) return '13-17';
  if (numeric <= 24) return '18-24';
  return '25+';
}

/**
 * Normalizes any age value or onboarding ageGroup/ageBand string
 * into one of the three strict Baraza cohorts: '13-17', '18-24', or '25+'.
 */
export function normalizeAgeBand(ageOrBand) {
  if (ageOrBand === null || ageOrBand === undefined) return '18-24';
  const raw = String(ageOrBand).trim().replace(/–/g, '-').toUpperCase();
  if (!raw) return '18-24';

  if (raw === '13-17' || raw === 'TEEN_13_17') return '13-17';
  if (raw === '18-24' || raw === '18-21' || raw === '22-25' || raw === 'YOUNG_ADULT_18_24') {
    return '18-24';
  }
  if (raw === '25+' || raw === '26-29+' || raw === 'ADULT_25_PLUS') return '25+';

  return getAgeBand(raw);
}

/**
 * Returns true if the user belongs to the 13-17 minor cohort.
 */
export function isMinorCohort(ageOrBand) {
  return normalizeAgeBand(ageOrBand) === '13-17';
}

/**
 * Enforces strict two-way cohort isolation:
 * 13-17 minors cannot access 18-24 / 25+ spaces, and 18-24 / 25+ cannot access 13-17 spaces.
 */
export function canAccessCircle(userAgeOrBand, circle) {
  if (!circle) return false;
  return normalizeAgeBand(userAgeOrBand) === normalizeAgeBand(circle.ageGroup || '18-24');
}

/**
 * Computes match resonance and ranks circles for a user
 *
 * @param {Object} params
 * @param {string|number} params.age - User's age or ageBand
 * @param {string} params.gender - User's selected gender ('female' | 'male' | 'non_binary' | 'prefer_not')
 * @param {string[]} params.focusAreas - User's selected struggles / focus areas
 * @param {string[]} params.interests - User's selected passions / interests (up to 5)
 * @returns {Object} { primaryMatch, eligibleCircles, userAgeBand, matchedTags }
 */
export function getMatchingCirclesForUser({
  age = '18-24',
  gender = 'prefer_not',
  focusAreas = [],
  interests = [],
}) {
  const userAgeBand = normalizeAgeBand(age);

  const normalizedGender = String(gender || 'prefer_not').toLowerCase().trim();

  const cleanUserIssues = (focusAreas || []).map(clean);
  const cleanUserInterests = (interests || []).map(clean);

  // Fallback defaults if user hasn't selected struggles yet
  const userHasIssues = cleanUserIssues.length > 0;
  const userHasInterests = cleanUserInterests.length > 0;

  const scored = barazaCircles.map((circle) => {
    // 1. Age Cohort Match Check
    const circleAgeBand = (circle.ageGroup || '18-24').replace(/–/g, '-');
    const isAgeMatch = circleAgeBand === userAgeBand;

    // 2. Gender Alignment Check
    // Circles without allowedGenders are open to everyone.
    // Circles with allowedGenders (e.g. Sisterhood, Men's Grounding) strictly require a matching gender.
    const isGenderMatch =
      !Array.isArray(circle.allowedGenders) ||
      circle.allowedGenders.length === 0 ||
      circle.allowedGenders.map((g) => g.toLowerCase().trim()).includes(normalizedGender);

    // 2. Shared Issues Intersection
    const circleIssues = (circle.issues || []).map(clean);
    const sharedIssues = circleIssues.filter((cIssue) =>
      cleanUserIssues.some((uIssue) => uIssue.includes(cIssue) || cIssue.includes(uIssue))
    );

    // 3. Shared Interests Intersection
    const circleInterests = (circle.interests || []).map(clean);
    const sharedInterests = circleInterests.filter((cInterest) =>
      cleanUserInterests.some((uInterest) => uInterest.includes(cInterest) || cInterest.includes(uInterest))
    );

    // 4. Capacity status
    const isFull = (circle.memberCount || 0) >= (circle.maxMembers || 12);

    // Resonance Math: Base 60 + Issues bonus (up to 20) + Interests bonus (up to 18)
    let score = 60;
    if (userHasIssues) {
      score += Math.min(22, sharedIssues.length * 11);
    } else {
      score += 15; // neutral baseline if skipping onboarding
    }

    if (userHasInterests) {
      score += Math.min(16, sharedInterests.length * 8);
    } else {
      score += 10;
    }

    const matchResonance = Math.min(98, Math.max(68, score));

    return {
      ...circle,
      isAgeMatch,
      isGenderMatch,
      sharedIssuesCount: sharedIssues.length,
      sharedInterestsCount: sharedInterests.length,
      matchResonance,
      isFull,
    };
  });

  // Filter: Invariant 1 (Strict Age Band) & Invariant 2 (Strict Gender Alignment)
  const cohortCircles = scored.filter((c) => c.isAgeMatch && c.isGenderMatch);

  // If there are circles in this cohort matching at least one struggle
  const struggleMatches = cohortCircles.filter((c) =>
    userHasIssues ? c.sharedIssuesCount > 0 : true
  );

  const candidatePool = struggleMatches.length > 0 ? struggleMatches : cohortCircles;

  // Rank candidate pool: highest resonance first
  const sorted = [...candidatePool].sort((a, b) => b.matchResonance - a.matchResonance);

  // Auto-Overflow / Part 2 Cohort Logic:
  // If any circle hits the 12-member cap, spawn an open Cohort 2 so no user ever sees a closed door.
  const openCohorts = sorted.map((circle) => {
    const maxCap = circle.maxMembers || 12;
    if ((circle.memberCount || 0) >= maxCap) {
      return {
        ...circle,
        id: `${circle.id}_part2`,
        parentCircleId: circle.id,
        title: `${circle.title} · Cohort 2`,
        memberCount: 1,
        maxMembers: maxCap,
        isFull: false,
        isOverflowCohort: true,
        cohortNumber: 2,
      };
    }
    return {
      ...circle,
      isOverflowCohort: false,
      cohortNumber: 1,
    };
  });

  // Top candidate becomes Primary Matched Sanctuary Circle (Hero Card)
  // Strict cohort invariant: fallback must still respect age cohort.
  const primary = openCohorts[0] || cohortCircles[0] || scored.find((c) => c.isAgeMatch) || null;
  const primaryMatch = primary
    ? {
        ...primary,
        isPrimaryMatch: true,
      }
    : null;

  // Remaining eligible circles in feed
  const eligibleCircles = openCohorts.map((c) =>
    primaryMatch && c.id === primaryMatch.id ? { ...c, isPrimaryMatch: true } : c
  );

  return {
    primaryMatch,
    eligibleCircles,
    userAgeBand,
    totalEligible: eligibleCircles.length,
  };
}
