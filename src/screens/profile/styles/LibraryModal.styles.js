// src/screens/profile/styles/LibraryModal.styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 16, 36, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '88%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tag: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 6,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(73, 37, 66, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: '#8B6DA8',
    fontWeight: '700',
  },
  scroll: {
    gap: 12,
    paddingVertical: 4,
  },
  itemCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    gap: 6,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemCat: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  itemDate: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  itemDesc: {
    fontSize: 12.5,
    color: '#444',
    lineHeight: 18,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  playBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  unsaveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  unsaveBtnText: {
    color: '#76648E',
    fontSize: 11.5,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  emptyWrap: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#341528',
  },
  emptySub: {
    fontSize: 12,
    color: '#76648E',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 17,
  },
  doneBtn: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
