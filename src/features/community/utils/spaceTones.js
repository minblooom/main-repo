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