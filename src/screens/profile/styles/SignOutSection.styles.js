// src/screens/profile/styles/SignOutSection.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 40,
    alignItems: 'center',
    gap: 16,
  },
  btn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
