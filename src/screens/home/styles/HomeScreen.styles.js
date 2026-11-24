// src/screens/home/styles/HomeScreen.styles.js
// Dedicated styles for HomeScreen layout and containers.

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.splashBg,
  },
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.splashBg,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  scrollContainerWide: {
    paddingHorizontal: 36,
    paddingTop: 16,
    paddingBottom: 40,
  },
  contentMaxWrapper: {
    width: '100%',
    maxWidth: 1040,
    alignSelf: 'center',
    gap: 20,
  },
  contentMaxWrapperWide: {
    paddingVertical: 8,
  },
});
