// src/features/community/components/styles/CheckInForm.styles.js
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: { padding: 18, gap: 10, borderRadius: 22, borderWidth: 1 },
  heading: { fontSize: 16, fontWeight: '800' },
  hint: { fontSize: 12.5, lineHeight: 18 },
  options: { gap: 8 },
  option: { minHeight: 46, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, borderWidth: 1 },
  optionText: { fontSize: 14, fontWeight: '600' },
  input: { minHeight: 72, padding: 12, borderRadius: 16, borderWidth: 1, fontSize: 14, lineHeight: 20 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  feedback: { flex: 1, fontSize: 12, lineHeight: 17 },
  button: { paddingVertical: 11, paddingHorizontal: 18, borderRadius: 16 },
  buttonText: { fontSize: 13, fontWeight: '800' },
  dimmed: { opacity: 0.45 },
});