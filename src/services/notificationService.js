// src/services/notificationService.js
// Registers device push tokens with the MindBloom backend.
// Called once on app start (after auth) so the server can send
// Baraza circle message notifications and event RSVP confirmations.

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { apiClient } from '../core/api/client';

let _tokenRegistered = false;

/**
 * Request permission, get the Expo push token, and POST it to the backend.
 * Safe to call multiple times — only registers once per session.
 */
export async function registerForPushNotifications() {
  if (_tokenRegistered) return;

  try {
    // Push notifications are only meaningful on a physical device,
    // but we still set the handler on web so foreground banners work.
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // On native, ask permission
    if (Platform.OS !== 'web') {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        // User declined — that's fine, notifications just won't arrive
        return;
      }
    }

    // Get the Expo push token (works on native; on web it returns undefined)
    const tokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
    const token = tokenData?.data;
    if (!token) return;

    // Ship it to the backend silently
    await apiClient.post('/user/push-token', { token });
    _tokenRegistered = true;
  } catch {
    // Never crash on notification setup failures
  }
}

/**
 * Handle a notification tap — navigate to the right screen.
 * Wire this up in App.js with Notifications.addNotificationResponseReceivedListener.
 */
export function handleNotificationTap(response, navigation) {
  const data = response?.notification?.request?.content?.data;
  if (!data) return;

  if (data.type === 'circle_message' && data.circleId && navigation) {
    // Navigate to the Baraza community tab
    navigation.navigate('CommunityBaraza', { openCircleId: data.circleId });
  }
}
