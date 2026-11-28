import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 32,
  },
  orbWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  starGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  innerCore: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#070D1B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  phaseName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 1.5,
  },
  countdownNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 28,
    minHeight: 24,
  },
  constellationTrack: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  starItem: {
    alignItems: 'center',
    gap: 6,
  },
  starDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  starDotActive: {
    backgroundColor: 'rgba(147, 197, 253, 0.25)',
    borderColor: '#93C5FD',
  },
  starIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  starLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
  starLabelActive: {
    color: '#93C5FD',
  },
  startBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 24,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  comfortNote: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },
});
