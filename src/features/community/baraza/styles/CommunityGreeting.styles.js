import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: { padding: 18, gap: 16, borderRadius: 22, borderWidth: 1 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  textCol: { flex: 1, gap: 8 },
  greeting: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  bubble: { padding: 12, borderRadius: 16 },
  line: { fontSize: 13.5, lineHeight: 20, fontWeight: '600' },
  prompt: { fontSize: 13, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1 },
  chipText: { fontSize: 12.5, fontWeight: '700' },
  support: { alignSelf: 'flex-start' },
  supportText: { fontSize: 12.5, fontWeight: '800' },
});