import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FED7AA',
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
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 20,
  },
  hearthJar: {
    width: '100%',
    maxWidth: 400,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(251, 146, 60, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 146, 60, 0.3)',
    marginBottom: 20,
    alignItems: 'center',
  },
  hearthVisual: {
    alignItems: 'center',
    gap: 6,
  },
  hearthFireIcon: {
    fontSize: 36,
  },
  hearthWarmthText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FED7AA',
  },
  cardsWrap: {
    width: '100%',
    maxWidth: 420,
    gap: 12,
  },
  sparkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  sparkCardIgnited: {
    backgroundColor: 'rgba(251, 146, 60, 0.18)',
    borderColor: '#FB923C',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconWrapIgnited: {
    backgroundColor: '#FB923C',
  },
  icon: {
    fontSize: 22,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  cardTitleIgnited: {
    color: '#FED7AA',
  },
  cardDesc: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 17,
  },
  encouragementCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    maxWidth: 380,
    alignItems: 'center',
  },
  encourageTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FED7AA',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  encourageText: {
    fontSize: 13.5,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
