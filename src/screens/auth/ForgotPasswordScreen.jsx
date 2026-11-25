// src/screens/auth/ForgotPasswordScreen.jsx
// 3-step password reset flow: Request 6-digit OTP -> Verify OTP -> Set New Password

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

export const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: contact | 2: otp | 3: new password
  const [contact, setContact] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [devHint, setDevHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!contact.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await AuthService.sendOtp({ contact: contact.trim(), purpose: 'RESET_PASSWORD' });
      if (res?.devCode) setDevHint(res.devCode);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send reset code. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const clean = code.trim();
    if (!/^\d{6}$/.test(clean)) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await AuthService.verifyOtp({
        contact: contact.trim(),
        code: clean,
        purpose: 'RESET_PASSWORD',
      });
      setResetToken(res.resetToken);
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await AuthService.resetPassword({ resetToken, newPassword });
      navigation.replace('Login');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView
        contentContainerStyle={[s.scrollContainer, { justifyContent: 'center', padding: 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[s.formContainer, { maxWidth: 440, alignSelf: 'center', width: '100%' }]}>
          <Text style={s.formTitle}>Reset password</Text>
          <Text style={s.formSubhead}>
            {step === 1
              ? 'Enter the email or phone number you used to sign up and we will send a 6-digit reset code.'
              : step === 2
                ? `Enter the 6-digit code sent to ${contact.trim()}.`
                : 'Choose a new password (at least 6 characters).'}
          </Text>

          {devHint && step === 2 ? (
            <View style={{ backgroundColor: '#ECFDF5', borderRadius: 10, padding: 10, marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: '#065F46', fontWeight: '700' }}>
                Dev Mode OTP: {devHint}
              </Text>
            </View>
          ) : null}

          {error ? <Text style={[s.errorText, { marginBottom: 10 }]}>{error}</Text> : null}

          {step === 1 && (
            <>
              <View style={s.fieldGroup}>
                <Text style={s.fieldLabel}>EMAIL OR PHONE NUMBER</Text>
                <TextInput
                  style={s.textInput}
                  placeholder="e.g. wanjiku@gmail.com or 0712345678"
                  placeholderTextColor="#76648E"
                  autoCapitalize="none"
                  value={contact}
                  onChangeText={(v) => {
                    setContact(v);
                    setError('');
                  }}
                />
              </View>
              <TouchableOpacity style={[s.primaryBtn, { marginTop: 18 }]} onPress={handleSendCode} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={s.primaryBtnText}>Send reset code →</Text>}
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
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
              <TouchableOpacity style={[s.primaryBtn, { marginTop: 18 }]} onPress={handleVerifyCode} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={s.primaryBtnText}>Verify code →</Text>}
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <View style={s.fieldGroup}>
                <Text style={s.fieldLabel}>NEW PASSWORD</Text>
                <TextInput
                  style={s.textInput}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#76648E"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={(v) => {
                    setNewPassword(v);
                    setError('');
                  }}
                />
              </View>
              <View style={[s.fieldGroup, { marginTop: 12 }]}>
                <Text style={s.fieldLabel}>CONFIRM NEW PASSWORD</Text>
                <TextInput
                  style={s.textInput}
                  placeholder="Re-enter password"
                  placeholderTextColor="#76648E"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={(v) => {
                    setConfirmPassword(v);
                    setError('');
                  }}
                />
              </View>
              <TouchableOpacity style={[s.primaryBtn, { marginTop: 18 }]} onPress={handleResetPassword} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={s.primaryBtnText}>Update password →</Text>}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={{ marginTop: 16, alignItems: 'center' }} onPress={() => navigation.goBack()}>
            <Text style={s.forgotBtnText}>← Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
