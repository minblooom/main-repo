import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 22, 34, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  stage: {
    width: '100%',
    maxWidth: 380,
    minHeight: 340,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 243, 208, 0.55)',
  },
  orb: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(167, 243, 208, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  orbEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  orbSnippet: {
    fontSize: 11.5,
    color: '#ECFDF5',
    textAlign: 'center',
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    padding: 26,
    alignItems: 'center',
    width: '100%',
  },
  messageEmoji: {
    fontSize: 34,
    marginBottom: 10,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  messageBody: {
    fontSize: 13.5,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.82)',
    textAlign: 'center',
    marginBottom: 20,
  },
  doneBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 16,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

