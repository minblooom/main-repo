// src/features/community/utils/spaceMeta.js
// Private spaces never show a member count.
export const getSpaceMeta = (space) =>
  [
    space.dateLabel && space.timeLabel ? `${space.dateLabel} · ${space.timeLabel}` : null,
    space.availability,
    space.memberCount != null && !space.privateMembership ? `${space.memberCount} members` : null,
    space.hasMeetupSpots ? 'Includes meet-up spots' : null,
  ].filter(Boolean);