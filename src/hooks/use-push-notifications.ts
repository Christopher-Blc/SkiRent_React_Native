import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { EXPO_PUSH_API_URL } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

// Configura como se muestran las notificaciones al recibirlas.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type PushTokenRow = {
  token: string;
  user_id?: string | null;
};

type UsePushNotificationsOptions = {
  userId?: string | null;
};

type PushAudience = 'all' | 'admins';

type SendPushNotificationOptions = {
  excludeToken?: string | null;
  audience?: PushAudience;
  title?: string;
  data?: Record<string, unknown>;
};

const ADMIN_ROLE_ID = 2;

export function usePushNotifications(options: UsePushNotificationsOptions = {}) {
  const { t } = useTranslation();
  const { userId } = options;
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  const projectId = useMemo(() => {
    return Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas?.projectId ?? undefined;
  }, []);

  // Escucha notificaciones entrantes.
  useEffect(() => {
    // En web los listeners de Expo no tienen efecto; evitamos registrarlos.
    const notificationSub =
      Platform.OS === 'web'
        ? null
        : Notifications.addNotificationReceivedListener((notification) => {
            // Guardamos el texto para mostrarlo en pantalla.
            const body = notification.request.content.body ?? t('notificationReceived');
            setLastNotification(body);
          });

    return () => {
      notificationSub?.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      // Captura la data extra cuando el usuario interactua con la notificacion.
      const data = response.notification.request.content.data;
      console.log(t('notificationInteractionLog'), data);
    });

    // Limpia el listener al desmontar para evitar duplicados.
    return () => responseSub.remove();
  }, []);

  // Registra el token push cuando hay un usuario autenticado.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!userId) return;
    registerForPush();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Solicita permisos, obtiene el token de Expo y lo guarda en Supabase.
  const registerForPush = async () => {
    setRegistering(true);
    try {
      if (Platform.OS === 'web') {
        return;
      }
      if (!Device.isDevice) {
        Alert.alert(t('physicalDeviceRequired'), t('pushNotSupportedSimulator'));
        return;
      }

      // Android requiere un canal de notificacion.
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      // Aseguramos que el usuario otorgue permisos.
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(t('permissionsRequired'), t('pushPermissionsRequiredMessage'));
        return;
      }

      // El token de Expo se usa en el gateway de push de Expo.
      const tokenResponse = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined,
      );

      setPushToken(tokenResponse.data);
      console.log(t('expoPushTokenRegistered'), tokenResponse.data);

      // Guardamos/actualizamos el token en Supabase para futuros envios.
      if (userId) {
        const { error } = await supabase
          .from('push_tokens')
          .upsert(
            {
              token: tokenResponse.data,
              user_id: userId,
              device_name: Device.deviceName ?? 'unknown',
            },
            { onConflict: 'token' },
          );
        if (error) {
          Alert.alert(t('error'), error.message);
        }
      }
    } catch (error) {
      Alert.alert(t('error'), error instanceof Error ? error.message : t('registerTokenFailed'));
    } finally {
      setRegistering(false);
    }
  };

  // Envia una notificacion push a todos los tokens excepto `excludeToken`.
  const sendNotification = async (message: string, excludeToken?: string | null) => {
    setSending(true);
    try {
      const result = await sendPushNotification(message, { excludeToken });
      if (!result.ok) {
        if (result.reason === 'EMPTY_MESSAGE') {
          Alert.alert(t('missingMessageTitle'), t('missingMessageDescription'));
          return false;
        }
        if (result.reason === 'NO_RECIPIENTS') {
          Alert.alert(t('noRecipientsTitle'), t('noRecipientsDescription'));
          return false;
        }
        Alert.alert(t('error'), result.error ?? t('sendNotificationFailed'));
        return false;
      }

      Alert.alert(t('sentTitle'), t('notificationSent'));
      return true;
    } catch (error) {
      Alert.alert(t('error'), error instanceof Error ? error.message : t('sendNotificationFailed'));
      return false;
    } finally {
      setSending(false);
    }
  };

  return {
    pushToken,
    registering,
    sending,
    lastNotification,
    sendNotification,
  };
}

export async function sendNotificationToAdmins(
  message: string,
  title = i18next.t('newClientNotificationTitle'),
) {
  return sendPushNotification(message, { audience: 'admins', title });
}

export async function sendPushNotification(
  message: string,
  options: SendPushNotificationOptions = {},
) {
  const text = message.trim();
  if (!text) {
    return { ok: false as const, reason: 'EMPTY_MESSAGE' as const };
  }

  const audience = options.audience ?? 'all';
  const title = options.title ?? i18next.t('notificationTitle');
  const tokens = await fetchRecipientTokens(audience, options.excludeToken);

  if (tokens.length === 0) {
    return { ok: false as const, reason: 'NO_RECIPIENTS' as const };
  }

  try {
    // Expo recomienda enviar en lotes; 80 es un tamano seguro.
    const chunks = chunkArray(tokens, 80);
    for (const chunk of chunks) {
      const messages = chunk.map((token) => ({
        to: token,
        title,
        body: text,
        data: options.data,
      }));

      const response = await fetch(EXPO_PUSH_API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || i18next.t('sendingNotificationsError'));
      }
    }

    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : i18next.t('sendNotificationFailed'),
    };
  }
}

async function fetchRecipientTokens(audience: PushAudience, excludeToken?: string | null) {
  if (audience === 'admins') {
    const { data: admins, error: adminsError } = await supabase
      .from('clientes')
      .select('id')
      .eq('role_id', ADMIN_ROLE_ID);

    if (adminsError) {
      throw new Error(adminsError.message);
    }

    const adminIds = (admins ?? []).map((admin: { id: string }) => admin.id).filter(Boolean);

    if (adminIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from('push_tokens')
      .select('token,user_id')
      .in('user_id', adminIds);

    if (error) {
      throw new Error(error.message);
    }

    const allowedIds = new Set(adminIds);
    return (data ?? [])
      .filter((row: PushTokenRow) => row.user_id && allowedIds.has(row.user_id))
      .map((row: PushTokenRow) => row.token)
      .filter(Boolean)
      .filter((token) => (excludeToken ? token !== excludeToken : true));
  }

  const { data, error } = await supabase.from('push_tokens').select('token');
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .map((row: PushTokenRow) => row.token)
    .filter(Boolean)
    .filter((token) => (excludeToken ? token !== excludeToken : true));
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
