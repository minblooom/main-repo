// src/screens/arcade/styles/ArcadeScreen.styles.js
// Dedicated styles for ArcadeScreen and ArcadeContent layout.

import { StyleSheet } from 'react-native';

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
    paddingTop: 8,
    paddingBottom: 48,
  },
  scrollContainerWide: {
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 64,
  },
  contentMaxWrapper: {
    width: '100%',
  },
  contentMaxWrapperWide: {
    maxWidth: 1080,
    alignSelf: 'center',
    width: '100%',
  },
  greetingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  greetingSub: {
    fontSize: 13.5,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});
