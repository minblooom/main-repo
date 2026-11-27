// src/screens/auth/VerifyOtpModal.jsx
// Cute popup modal for 6-digit email/phone OTP verification

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { AuthService } from '../../core/api/authService';

export const VerifyOtpModal = ({
  visible,
  contact = '',
  initialDevCode = '',
  initialError = '',
  onVerified,
  onClose,
}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [devHint, setDevHint] = useState(initialDevCode);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [verified, setVerified] = useState(false);

  const inputRefs = useRef([]);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    setDevHint(initialDevCode || '');
  }, [initialDevCode]);

  useEffect(() => {
    if (visible) {
      setDigits(['', '', '', '', '', '']);
      setError(initialError);
      setInfo('');
      setVerified(false);
      scaleAnim.setValue(0.92);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 120,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -4,
            duration: 1800,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
      loop.start();

      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 200);

      return () => {
        loop.stop();
        clearTimeout(timer);
      };
    }
  }, [visible, initialError]);

  const code = digits.join('');
  const isEmail = contact.includes('@');

  const handleDigitChange = (text, index) => {
    const cleaned = text.replace(/\D/g, '');
    setError('');

    // Handle pasting a full 6-digit code
    if (cleaned.length > 1) {
      const next = ['', '', '', '', '', ''];
      for (let i = 0; i < Math.min(cleaned.length, 6); i++) {
        next[i] = cleaned[i];
      }
      setDigits(next);
      const focusIdx = Math.min(cleaned.length, 5);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(code)) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await AuthService.verifyOtp({
        contact,
        code,
        purpose: 'VERIFY_CONTACT',
      });
      setVerified(true);
      setTimeout(() => {
        if (onVerified) onVerified();
      }, 650);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'That code did not match or expired. Try again or resend.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setResending(true);
    try {
      const res = await AuthService.sendOtp({
        contact,
        purpose: 'VERIFY_CONTACT',
      });
      if (res?.devCode) setDevHint(res.devCode);
      setInfo('A fresh 6-digit code is on its way ✨');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not resend code right now. Please try again.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
        >
          {/* Close button */}
          {onClose ? (
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Close verification popup"
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          ) : null}

          {/* Cute floating envelope / sparkle badge */}
          <View style={styles.badgeWrap}>
            <Animated.View
              style={[
                styles.iconCircle,
                { transform: [{ translateY: bounceAnim }] },
              ]}
            >
              <Text style={styles.iconEmoji}>
                {verified ? '🌸' : isEmail ? '💌' : '📱'}
              </Text>
            </Animated.View>
            <Text style={[styles.sparkle, styles.sparkleLeft]}>✦</Text>
            <Text style={[styles.sparkle, styles.sparkleRight]}>✦</Text>
          </View>

          <Text style={styles.tag}>ALMOST THERE · VERIFY</Text>
          <Text style={styles.title}>
            {verified
              ? 'You are verified!'
              : isEmail
              ? 'Check your inbox ✨'
              : 'Check your messages ✨'}
          </Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{' '}
            <Text style={styles.contactHighlight}>{contact}</Text> so your space
            stays truly yours.
          </Text>

          {devHint ? (
            <View style={styles.devBanner}>
              <Text style={styles.devText}>Dev Mode OTP: {devHint}</Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {info ? (
            <View style={styles.infoBanner}>
              <Text style={styles.infoText}>{info}</Text>
            </View>
          ) : null}

          {/* 6 Cute Digit Boxes */}
          <View style={styles.otpRow}>
            {digits.map((digit, idx) => {
              const isFocused = focusedIndex === idx;
              const isFilled = digit !== '';
              return (
                <TextInput
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  style={[
                    styles.otpBox,
                    isFilled && styles.otpBoxFilled,
                    isFocused && styles.otpBoxFocused,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleDigitChange(text, idx)}
                  onKeyPress={(e) => handleKeyPress(e, idx)}
                  onFocus={() => setFocusedIndex(idx)}
                  keyboardType="number-pad"
                  maxLength={6}
                  selectTextOnFocus
                  editable={!loading && !verified}
                  placeholder="•"
                  placeholderTextColor="#B8A9CE"
                />
              );
            })}
          </View>

          {/* Verify button */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              (loading || verified) && styles.primaryBtnDisabled,
            ]}
            onPress={handleVerify}
            disabled={loading || verified}
            activeOpacity={0.86}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : verified ? (
              <Text style={styles.primaryBtnText}>Welcome in 🌸</Text>
            ) : (
              <Text style={styles.primaryBtnText}>Verify & bloom →</Text>
            )}
          </TouchableOpacity>

          {/* Resend + change email */}
          <View style={styles.footerActions}>
            <TouchableOpacity
              onPress={handleResend}
              disabled={resending || verified}
              activeOpacity={0.75}
            >
              <Text style={styles.resendText}>
                {resending
                  ? 'Sending a fresh code...'
                  : "Didn't get a code? Resend"}
              </Text>
            </TouchableOpacity>

            {onClose ? (
              <TouchableOpacity
                onPress={onClose}
                disabled={loading || verified}
                activeOpacity={0.75}
              >
                <Text style={styles.changeContactText}>
                  Wrong {isEmail ? 'email' : 'number'}? Edit it
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(46, 30, 70, 0.56)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.splashBg,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderWidth: 1.5,
    borderColor: colors.lavenderSheetBorder,
    shadowColor: '#2E1E46',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lavenderSheet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badgeWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    width: 96,
    height: 76,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.lavenderSheet,
    borderWidth: 2,
    borderColor: colors.archBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 30,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 13,
    color: colors.dotGold,
    fontWeight: '700',
  },
  sparkleLeft: {
    top: 6,
    left: 6,
    color: colors.dotPeach,
  },
  sparkleRight: {
    bottom: 6,
    right: 6,
    color: colors.brand,
  },
  tag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  contactHighlight: {
    fontWeight: '700',
    color: colors.brand,
  },
  devBanner: {
    width: '100%',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  devText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#065F46',
  },
  errorBanner: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#B91C1C',
    textAlign: 'center',
  },
  infoBanner: {
    width: '100%',
    backgroundColor: '#F6ECF4',
    borderWidth: 1,
    borderColor: colors.lavenderSheetBorder,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.brand,
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    width: '100%',
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.lavenderSheetBorder,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  otpBoxFilled: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brandLight,
  },
  otpBoxFocused: {
    borderColor: colors.brand,
    borderWidth: 2,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.78,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  footerActions: {
    marginTop: 14,
    alignItems: 'center',
    gap: 8,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.brand,
    textDecorationLine: 'underline',
  },
  changeContactText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
