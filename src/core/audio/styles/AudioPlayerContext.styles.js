import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sidebarPlayer: {
    marginTop: 'auto',
    marginBottom: 10,
    backgroundColor: '#2A192E',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  bottomBarPlayer: {
    width: '100%',
    backgroundColor: '#2A192E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  thumbSidebar: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
  thumbBottom: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  subtitle: {
    color: '#D6CCC2',
    fontSize: 10.5,
    marginTop: 1,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E06D3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    padding: 3,
  },
  closeBtn: {
    padding: 4,
  },
});
