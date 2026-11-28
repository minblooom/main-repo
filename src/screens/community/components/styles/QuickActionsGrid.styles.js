import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  actionLauncherDeck: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  actionButtonCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionButtonTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconEmoji: { fontSize: 20 },
  arrowMiniCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowMiniText: { fontSize: 12, fontWeight: '800' },
  actionButtonTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  actionButtonSub: {
    fontSize: 11.5,
    lineHeight: 16,
  },
});

