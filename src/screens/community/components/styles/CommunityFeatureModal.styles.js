import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 16, 36, 0.55)',
  },
  floatingModalCard: {
    width: '100%',
    maxWidth: 780,
    maxHeight: '92%',
    borderRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    shadowColor: '#1A1024',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 16,
  },
  floatingModalCardWide: { paddingHorizontal: 32 },
  modalTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalBackBtn: { paddingVertical: 4, paddingHorizontal: 6 },
  modalBackBtnText: { fontSize: 13, fontWeight: '700' },
  modalCloseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseCircleText: { fontSize: 14, color: '#8B6DA8', fontWeight: '700' },
  modalTitleBlock: { gap: 4, marginBottom: 12 },
  modalKickerTag: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.9 },
  modalMainTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  modalSubTitle: { fontSize: 13, lineHeight: 18 },
  modalInnerScroll: { paddingVertical: 4 },
});

