// src/features/community/components/styles/SpaceDetail.styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { gap: 14 },
  header: { gap: 6 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 14, lineHeight: 21 },
  meta: { fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  body: { fontSize: 14, lineHeight: 21 },
  button: {
    alignSelf: 'flex-start', paddingVertical: 11, paddingHorizontal: 18,
    borderRadius: 16, borderWidth: 1.5, borderColor: 'transparent',
  },
  buttonText: { fontSize: 13, fontWeight: '800' },
  dimmed: { opacity: 0.6 },
  error: { fontSize: 13, lineHeight: 19 },
  infoBox: { padding: 14, borderRadius: 16, borderWidth: 1 },
  infoText: { fontSize: 13, lineHeight: 19 },
});