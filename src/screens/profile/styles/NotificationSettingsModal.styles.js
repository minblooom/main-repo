// src/screens/profile/styles/NotificationSettingsModal.styles.js
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
    maxWidth: 820,
    maxHeight: '92%',
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    gap: 12,
  },
  modalCardWide: {
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: '#8B6DA8',
    fontWeight: '700',
  },
  titleWrap: {
    gap: 4,
    marginBottom: 6,
  },
  tag: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  scroll: {
    paddingVertical: 4,
  },
  contentLayout: {
    flexDirection: 'column',
    gap: 20,
  },
  contentLayoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  formCard: {
    flex: 1.4,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
    gap: 14,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  formSubtitle: {
    fontSize: 12,
    color: '#8B6DA8',
    marginTop: -8,
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  toggleText: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  toggleDesc: {
    fontSize: 11.5,
    color: '#8B6DA8',
  },
  timeSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6E5D87',
    fontWeight: '600',
  },
  timeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
  },
  timeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E1E46',
  },
  timePillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 4,
  },
  timePill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE3F7',
  },
  timePillText: {
    fontSize: 11,
    color: '#6E5D87',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(73, 37, 66, 0.06)',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cancelBtnText: {
    fontSize: 13,
    color: '#8B6DA8',
    fontWeight: '600',
  },
  companionCard: {
    flex: 1,
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
    gap: 10,
  },
  mascotWrap: {
    marginVertical: 4,
  },
  companionTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  companionDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
  },
  companionMuted: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
});
