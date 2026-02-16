import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { EXPO_PUSH_API_URL } from '@/lib/constants';
import { supabase } from '@/lib/supabase';


// Configura cómo se muestran las notificaciones al recibirlas.
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
};

type UsePushNotificationsOptions = {
  userId?: string | null;
};

export function usePushNotifications(options: UsePushNotificationsOptions = {}) {
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
          const body = notification.request.content.body ?? 'Notificacion recibida';
          setLastNotification(body);
        });

    return () => {
      notificationSub?.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const responseSub =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Captura la data extra cuando el usuario interactua con la notificacion.
        const data = response.notification.request.content.data;
        console.log('Usuario interactuó con notificación. Data:', data);
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
        Alert.alert('Dispositivo fisico requerido', 'Las notificaciones push no funcionan en simulador.');
        return;
      }

      // Android requiere un canal de notificación.
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
        Alert.alert('Permiso requerido', 'Necesitas aceptar permisos para recibir push.');
        return;
      }

      // El token de Expo se usa en el gateway de push de Expo.
      const tokenResponse = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined,
      );

      setPushToken(tokenResponse.data);
      console.log('Token de Expo registrado:', tokenResponse.data);

      // Guardamos/actualizamos el token en Supabase para futuros envíos.
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
          Alert.alert('Error', error.message);
        }
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo registrar el token');
    } finally {
      setRegistering(false);
    }
  };

  // Envía una notificación push a todos los tokens excepto `excludeToken`.
  const sendNotification = async (message: string, excludeToken?: string | null) => {
    if (!message.trim()) {
      Alert.alert('Falta mensaje', 'Escribe el texto de la notificacion.');
      return false;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.from('push_tokens').select('token');
      if (error) {
        Alert.alert('Error', error.message);
        return false;
      }

      // Filtramos tokens vacíos y opcionalmente el token actual.
      const tokens = (data ?? [])
        .map((row: PushTokenRow) => row.token)
        .filter(Boolean)
        .filter((token) => (excludeToken ? token !== excludeToken : true));
      if (tokens.length === 0) {
        Alert.alert('Sin destinatarios', 'No hay tokens registrados.');
        return false;
      }

      // Expo recomienda enviar en lotes; 80 es un tamaño seguro.
      const chunks = chunkArray(tokens, 80);
      for (const chunk of chunks) {
        const messages = chunk.map((token) => ({
          to: token,
          title: 'Notificacion',
          body: message.trim(),
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
          throw new Error(errorBody || 'Error enviando notificaciones');
        }
      }

      Alert.alert('Enviado', 'La notificacion se ha enviado.');
      return true;
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo enviar');
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

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
