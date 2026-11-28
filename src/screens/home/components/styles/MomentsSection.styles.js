import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';

export const styles = StyleSheet.create({
  section: {
    marginVertical: 4,
    gap: 12,
  },
  header: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardRow: {
    flexDirection: 'column',
    gap: 14,
  },
  cardRowWide: {
    flexDirection: 'row',
  },
  card: {
    flex: 1,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 160,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTag: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  cardBody: {
    gap: 4,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
  },
  cardCta: {
    fontSize: 12.5,
    fontWeight: '800',
  },
});

