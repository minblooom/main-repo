import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', borderRadius: 22, borderWidth: 1, overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  pressed: { opacity: 0.88 },
  accentBar: { width: 4 },
  body: { flex: 1, padding: 18, gap: 6 },
  badge: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.7 },
  title: { fontSize: 16, fontWeight: '800', lineHeight: 22 },
  description: { fontSize: 12.5, lineHeight: 18 },
  preview: { marginTop: 4, fontSize: 12, fontWeight: '700' },
  meta: { fontSize: 11.5, fontWeight: '600', marginTop: 2 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  action: { fontSize: 12.5, fontWeight: '800' },
  quick: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5 },
  quickText: { fontSize: 12.5, fontWeight: '800' },
});