// src/components/navigation/styles/SidebarNav.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: '#FAF5EE',
    borderRightWidth: 1,
    borderRightColor: 'rgba(73, 37, 66, 0.08)',
    paddingVertical: 28,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  brandContainer: {
    paddingHorizontal: 10,
    marginBottom: 28,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: -0.6,
  },
  section: {
    marginBottom: 22,
    gap: 4,
  },
  sectionHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.9,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  navItemActive: {
    backgroundColor: '#EAE3F7',
  },
  navLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#6E5D87',
    letterSpacing: -0.1,
  },
  navLabelActive: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  mascotIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: '#FAF5EE',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  mascotIconImg: {
    width: '100%',
    height: '100%',
  },
  supportCardsSection: {
    gap: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  supportCardMint: {
    backgroundColor: '#EDF5EE',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D8ECDA',
    gap: 3,
  },
  supportCardPeach: {
    backgroundColor: '#FFF5E8',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE6C9',
    gap: 3,
  },
  supportCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  supportCardQuote: {
    fontSize: 10.5,
    fontStyle: 'italic',
    color: '#497354',
    lineHeight: 14,
  },
  supportCardLinkText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8A531C',
  },
  helpLinkBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  helpLinkText: {
    fontSize: 11,
    color: '#8B6DA8',
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  footerText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.textMuted,
  },
});
