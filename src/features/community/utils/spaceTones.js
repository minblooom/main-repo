// src/features/community/utils/spaceTones.js
import { useTheme } from '../../../theme/ThemeContext';

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
