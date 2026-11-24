// src/screens/profile/styles/CustomizeCompanionBanner.styles.js
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 22,
    fontWeight: '300',
  },
});
