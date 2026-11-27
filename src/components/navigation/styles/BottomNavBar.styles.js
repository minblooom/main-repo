// src/components/navigation/styles/BottomNavBar.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(73, 37, 66, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 4,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    minHeight: 52,
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: '#EAE3F7',
  },
  tabInner: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabMascotWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  tabMascotImg: {
    width: '100%',
    height: '100%',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B6DA8',
  },
  tabLabelActive: {
    fontWeight: '800',
    color: colors.brand,
  },
});
