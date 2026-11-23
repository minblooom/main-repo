// src/features/community/components/styles/EncouragementFeed.styles.js
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: { gap: 12 },
  dailyCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18, borderRadius: 22, borderWidth: 1 },
  bubbleCol: { flex: 1, gap: 8 },
  kicker: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.7 },
  bubble: { padding: 14, borderRadius: 18 },
  message: { fontSize: 14, lineHeight: 21, fontWeight: '700' },
  anotherButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5 },
  anotherText: { fontSize: 12.5, fontWeight: '800' },
  heading: { fontSize: 16, fontWeight: '800' },
  empty: { fontSize: 13, lineHeight: 19 },
  row: { padding: 14, gap: 4, borderRadius: 18, borderWidth: 1 },
  rowDate: { fontSize: 11.5, fontWeight: '700' },
  rowMood: { fontSize: 14, fontWeight: '700' },
  rowNote: { fontSize: 13, lineHeight: 19 },
});