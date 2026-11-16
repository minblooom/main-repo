// src/hooks/useResponsiveLayout.js
// Responsive layout hook for mobile, tablet, and desktop viewports

import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  sm: 480,   // Small phones
  md: 768,   // Tablets
  lg: 1024,  // Small desktops / large tablets
  xl: 1280,  // Standard desktops
};

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = width < BREAKPOINTS.sm;
  const isMobile = width < BREAKPOINTS.md;
  const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isDesktop = width >= BREAKPOINTS.lg;

  // Compute a content max width for mobile-first centered views on web/desktop
  const containerMaxWidth = isDesktop ? 480 : isTablet ? 460 : width;

  return {
    width,
    height,
    isSmallPhone,
    isMobile,
    isTablet,
    isDesktop,
    containerMaxWidth,
  };
}
