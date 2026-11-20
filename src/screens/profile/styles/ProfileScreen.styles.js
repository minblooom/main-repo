// src/screens/profile/styles/ProfileScreen.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF6EF',
  },
  layoutContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FAF6EF',
    height: '100%',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
  },
  scrollContainerWide: {
    paddingHorizontal: 36,
    paddingTop: 16,
    paddingBottom: 48,
  },
  contentMaxWrapper: {
    width: '100%',
  },
  contentMaxWrapperWide: {
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },
});
