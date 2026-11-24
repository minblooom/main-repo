import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { padding: 18, gap: 12, borderRadius: 22, borderWidth: 1 },
  heading: { fontSize: 16, fontWeight: '800' },
  hint: { fontSize: 12.5, lineHeight: 18 },
  empty: { fontSize: 13, lineHeight: 19 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1 },
  chipText: { fontSize: 12.5, fontWeight: '700' },
  card: { padding: 14, gap: 4, borderRadius: 18, borderWidth: 1 },
  name: { fontSize: 15, fontWeight: '800' },
  meta: { fontSize: 12, fontWeight: '600' },
  address: { fontSize: 12.5 },
  notes: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  button: { alignSelf: 'flex-start', marginTop: 8, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5 },
  buttonText: { fontSize: 12.5, fontWeight: '800' },
});