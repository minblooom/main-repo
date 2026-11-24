import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { gap: 10 },
  strip: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4 },
  plantWrap: { flex: 1, alignItems: 'center' },
  plantArea: { height: 40, width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  stem: { width: 3, borderRadius: 2, position: 'absolute', bottom: 8 },
  bloom: { width: 12, height: 12, borderRadius: 6, position: 'absolute', bottom: 28 },
  seed: { width: 6, height: 6, borderRadius: 3, position: 'absolute', bottom: 10 },
  soil: { width: '100%', height: 8, borderRadius: 4, borderWidth: 1 },
  caption: { fontSize: 12.5, lineHeight: 18 },
  streak: { fontSize: 12, fontWeight: '800' },
});