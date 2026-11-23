// src/features/community/components/styles/GoalList.styles.js
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: { padding: 18, gap: 12, borderRadius: 22, borderWidth: 1 },
  heading: { fontSize: 16, fontWeight: '800' },
  hint: { fontSize: 12.5, lineHeight: 18 },
  goal: { padding: 14, gap: 8, borderRadius: 18, borderWidth: 1 },
  goalTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  goalTitle: { flex: 1, fontSize: 15, fontWeight: '800' },
  remove: { fontSize: 12, fontWeight: '700' },
  meta: { fontSize: 11.5, fontWeight: '600' },
  toggle: { alignSelf: 'flex-start', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5 },
  toggleText: { fontSize: 13, fontWeight: '800' },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, minHeight: 44, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, fontSize: 14 },
  addButton: { paddingVertical: 11, paddingHorizontal: 18, borderRadius: 16 },
  addText: { fontSize: 13, fontWeight: '800' },
  dimmed: { opacity: 0.45 },
});