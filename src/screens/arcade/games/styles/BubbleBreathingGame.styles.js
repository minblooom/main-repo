import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 36,
  },
  progressBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressText: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bubbleArea: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 280,
    width: 280,
  },
  outerHalo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  bubbleCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    backgroundColor: 'rgba(25, 35, 45, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  phaseLabel: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  secondsCounter: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  instructionCard: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    maxWidth: 320,
  },
  instructionText: {
    color: '#ECEFF1',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});
