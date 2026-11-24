import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  list: { gap: 10 },
  heading: { fontSize: 16, fontWeight: '800' },
  empty: { fontSize: 13, lineHeight: 19 },
  card: { padding: 16, gap: 6, borderRadius: 20, borderWidth: 1 },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  title: { flex: 1, fontSize: 15, fontWeight: '800' },
  badge: { fontSize: 11, fontWeight: '800' },
  description: { fontSize: 13, lineHeight: 19 },
  reason: { fontSize: 12, lineHeight: 17 },
});