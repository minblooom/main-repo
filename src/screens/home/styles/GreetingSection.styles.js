// src/screens/home/styles/GreetingSection.styles.js
// Dedicated styles for GreetingSection component.

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  overline: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.9,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 13.5,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
});
