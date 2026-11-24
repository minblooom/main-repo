// src/features/community/utils/spaceTones.js
import { useTheme } from '../../../theme/ThemeContext';

// Maps each space type to a theme token. The accent is used for the left
// border and tag text only, so the card itself stays neutral in every palette.
const TYPE_ACCENT = {
  group: 'accent',
  circle: 'accent',
  identity: 'accent',
  resource: 'accent',
  encouragement: 'accent',
};

export const useSpaceTone = (type) => {
  const { theme } = useTheme();
  const key = TYPE_ACCENT[type] ?? 'accent';

  return {
    card: theme.cardBg,
    border: theme.divider,
    accent: theme[key],
    title: theme.textPrimary,
    body: theme.textSecondary,
    muted: theme.textMuted,
    navActive: theme.navActive,
  };
};
export const useSpaceTone = (type = 'group') => {
  const { theme, isDark } = useTheme();

  const tones = {
    group: {
      card: theme?.cardBg || '#FFFFFF',
      border: theme?.divider || '#EADCCB',
      accent: theme?.accent || '#E07A5F',
      title: theme?.textPrimary || '#2B1E16',
      sub: theme?.textSecondary || '#6B5A4D',
    },
    circle: {
      card: isDark ? '#231E28' : '#FAF4F8',
      border: isDark ? '#3D3444' : '#E8D7E3',
      accent: '#9B5DE5',
      title: theme?.textPrimary || '#2B1E16',
      sub: theme?.textSecondary || '#6B5A4D',
    },
    identity: {
      card: isDark ? '#1C2422' : '#F2F7F5',
      border: isDark ? '#30423D' : '#D1E3DC',
      accent: '#5B8A72',
      title: theme?.textPrimary || '#2B1E16',
      sub: theme?.textSecondary || '#6B5A4D',
    },
  };

  return tones[type] || tones.group;
};
