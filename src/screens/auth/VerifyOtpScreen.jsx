// src/screens/auth/VerifyOtpScreen.jsx
// 6-digit email/phone OTP verification screen after account creation

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authStyles as s } from './authStyles';
import { AuthService } from '../../core/api/authService';

export const VerifyOtpScreen = ({ navigation, route }) => {
  const contact = route?.params?.contact || '';
  const initialDevCode = route?.params?.devCode || '';

  const [code, setCode] = useState('');
  const [devHint, setDevHint] = useState(initialDevCode);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleVerify = async () => {
    const clean = code.trim();
    if (!/^\d{6}$/.test(clean)) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await AuthService.verifyOtp({
        contact,
        code: clean,
        purpose: 'VERIFY_CONTACT',
      });
      navigation.replace('GentleHello');
    } catch (err) {
      setError(err?.response?.data?.message || 'Incorrect or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setResending(true);
    try {
      const res = await AuthService.sendOtp({ contact, purpose: 'VERIFY_CONTACT' });
      if (res?.devCode) setDevHint(res.devCode);
      setInfo('A new 6-digit code has been sent.');
    } catch {
      setError('Could not resend code right now. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView
        contentContainerStyle={[s.scrollContainer, { justifyContent: 'center', padding: 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[s.formContainer, { maxWidth: 440, alignSelf: 'center', width: '100%' }]}>
          <Text style={s.formTitle}>Verify your contact</Text>
          <Text style={s.formSubhead}>
            We sent a 6-digit verification code to <Text style={{ fontWeight: '700' }}>{contact}</Text> so nobody else can register with your address.
          </Text>

          {devHint ? (
            <View style={{ backgroundColor: '#ECFDF5', borderRadius: 10, padding: 10, marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: '#065F46', fontWeight: '700' }}>
                Dev Mode OTP: {devHint}
              </Text>
            </View>
          ) : null}

          {error ? <Text style={[s.errorText, { marginBottom: 10 }]}>{error}</Text> : null}
          {info ? <Text style={{ color: '#10B981', fontSize: 12.5, fontWeight: '600', marginBottom: 10 }}>{info}</Text> : null}

          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>6-DIGIT CODE</Text>
            <TextInput
              style={[s.textInput, { letterSpacing: 6, fontSize: 18, fontWeight: '800', textAlign: 'center' }]}
              placeholder="000000"
              placeholderTextColor="#76648E"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={(v) => {
                setCode(v.replace(/\D/g, ''));
                setError('');
              }}
            />
          </View>

          <TouchableOpacity
            style={[s.primaryBtn, { marginTop: 18 }]}
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={s.primaryBtnText}>Verify & continue →</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 14, alignItems: 'center' }}
            onPress={handleResend}
            disabled={resending}
          >
            <Text style={s.forgotBtnText}>
              {resending ? 'Sending...' : 'Did not get a code? Resend'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
