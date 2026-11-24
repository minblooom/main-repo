import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { padding: 18, gap: 10, borderRadius: 22, borderWidth: 1 },
  heading: { fontSize: 16, fontWeight: '800' },
  hint: { fontSize: 12.5, lineHeight: 18 },
  input: { minHeight: 44, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, fontSize: 14 },
  multiline: { minHeight: 80, paddingVertical: 12 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counter: { fontSize: 11.5 },
  button: { paddingVertical: 11, paddingHorizontal: 18, borderRadius: 16 },
  buttonText: { fontSize: 13, fontWeight: '800' },
  dimmed: { opacity: 0.45 },
  error: { fontSize: 12, lineHeight: 17 },
});