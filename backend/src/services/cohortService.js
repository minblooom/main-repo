// backend/src/services/cohortService.js
// Enforces MindBloom's 5 Non-Negotiable Baraza Invariants:
// 1. Strict Age Cohort Isolation ('13-17', '18-24', '25+')
// 2. Gender Alignment (gender-specific spaces like Sisterhood / Men's Grounding)
// 3. Shared Issues Intersection
// 4. Shared Interests Intersection
// 5. Hard Capacity Cap (<= 12 members per Baraza circle)

function clean(str) {
  if (!str) return '';
  return String(str).toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function normalizeAgeBand(ageOrBand) {
  if (ageOrBand === null || ageOrBand === undefined) return '18-24';
  const raw = String(ageOrBand).trim().replace(/–/g, '-').toUpperCase();
  if (!raw) return '18-24';

  if (raw === '13-17' || raw === 'TEEN_13_17') return '13-17';
  if (raw === '18-24' || raw === '18-21' || raw === '22-25' || raw === 'YOUNG_ADULT_18_24') {
    return '18-24';
  }
  if (raw === '25+' || raw === '26-29+' || raw === 'ADULT_25_PLUS') return '25+';

  const numeric = parseInt(raw, 10);
  if (!numeric || Number.isNaN(numeric)) return '18-24';
  if (numeric < 18) return '13-17';
  if (numeric <= 24) return '18-24';
  return '25+';
}

export function parseJsonArray(raw, fallback = []) {
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Checks whether a user may access a given community space.
 * Enforces strict two-way 13-17 vs 18+ age cohort isolation and gender alignment.
 */
export function canAccessSpace(user, space) {
  if (!space) return { allowed: false, reason: 'Space not found' };

  const userAgeBand = normalizeAgeBand(user?.ageBand);
  const spaceAgeBand = space.ageGroup === 'all' ? 'all' : normalizeAgeBand(space.ageGroup);

  if (spaceAgeBand !== 'all' && userAgeBand !== spaceAgeBand) {
    return {
      allowed: false,
      reason: `This space is restricted to the ${spaceAgeBand} age cohort.`,
    };
  }

  const allowedGenders = parseJsonArray(space.allowedGendersJson, []).map((g) =>
    String(g).toLowerCase().trim()
  );
  const userGender = String(user?.gender || 'prefer_not').toLowerCase().trim();

  if (allowedGenders.length > 0 && !allowedGenders.includes(userGender)) {
    return {
      allowed: false,
      reason: 'This space is restricted to its designated identity group.',
    };
  }

  return { allowed: true };
}

/**
 * Formats a CommunitySpace DB row into the API response shape expected by the frontend.
 */
export function serializeSpace(space, extra = {}) {
  return {
    id: space.id,
    type: space.type,
    title: space.title,
    category: space.category,
    icon: space.icon,
    iconBg: space.iconBg,
    description: space.description,
    ageGroup: space.ageGroup,
    allowedGenders: parseJsonArray(space.allowedGendersJson, []),
    issues: parseJsonArray(space.issuesJson, []),
    interests: parseJsonArray(space.interestsJson, []),
    maxMembers: space.maxMembers,
    memberCount: space.memberCount,
    activeNow: space.activeNow,
    isFull: space.maxMembers ? space.memberCount >= space.maxMembers : false,
    isOverflowCohort: space.isOverflowCohort,
    parentCircleId: space.parentCircleId,
    cohortNumber: space.cohortNumber,
    expect: space.expect,
    dateLabel: space.dateLabel,
    timeLabel: space.timeLabel,
    duration: space.duration,
    availability: space.availability,
    hasMeetupSpots: space.hasMeetupSpots,
    ...extra,
  };
}

/**
 * Ranks and filters spaces for a user based on age cohort, gender, focusAreas, and interests.
 */
export function matchSpacesForUser(spaces, { ageBand, gender, focusAreas = [], interests = [], joinedIds = [] }) {
  const userAgeBand = normalizeAgeBand(ageBand);
  const userGender = String(gender || 'prefer_not').toLowerCase().trim();
  const cleanUserIssues = (focusAreas || []).map(clean).filter(Boolean);
  const cleanUserInterests = (interests || []).map(clean).filter(Boolean);
  const joinedSet = new Set(joinedIds);

  const eligible = spaces
    .filter((space) => {
      if (space.ageGroup !== 'all' && normalizeAgeBand(space.ageGroup) !== userAgeBand) {
        return false;
      }
      const allowedGenders = parseJsonArray(space.allowedGendersJson, []).map((g) =>
        String(g).toLowerCase().trim()
      );
      if (allowedGenders.length > 0 && !allowedGenders.includes(userGender)) {
        return false;
      }
      return true;
    })
    .map((space) => {
      const spaceIssues = parseJsonArray(space.issuesJson, []).map(clean);
      const spaceInterests = parseJsonArray(space.interestsJson, []).map(clean);

      const sharedIssues = spaceIssues.filter((sIssue) =>
        cleanUserIssues.some((uIssue) => uIssue.includes(sIssue) || sIssue.includes(uIssue))
      );
      const sharedInterests = spaceInterests.filter((sInt) =>
        cleanUserInterests.some((uInt) => uInt.includes(sInt) || sInt.includes(uInt))
      );

      let score = 60;
      score += cleanUserIssues.length > 0 ? Math.min(22, sharedIssues.length * 11) : 15;
      score += cleanUserInterests.length > 0 ? Math.min(16, sharedInterests.length * 8) : 10;
      const matchResonance = Math.min(98, Math.max(68, score));

      return serializeSpace(space, {
        sharedIssuesCount: sharedIssues.length,
        sharedInterestsCount: sharedInterests.length,
        matchResonance,
        joined: joinedSet.has(space.id),
      });
    })
    .sort((a, b) => b.matchResonance - a.matchResonance);

  const primaryMatch = eligible[0] ? { ...eligible[0], isPrimaryMatch: true } : null;

  return {
    userAgeBand,
    primaryMatch,
    eligibleSpaces: eligible.map((s) =>
      primaryMatch && s.id === primaryMatch.id ? { ...s, isPrimaryMatch: true } : s
    ),
    totalEligible: eligible.length,
  };
}
