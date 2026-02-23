import { View, Text, ActivityIndicator } from 'react-native';
import { TextInputRectangle } from '@/components/TextInputRectangle';
import { Feather } from '@expo/vector-icons';
import { ButtonRectangular } from '@/components/ButtonRectangular';
import { useLogin } from '@/hooks/useLogin';
import { styles } from '@/styles/login.styles';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { getTheme } from '@/styles/theme';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

//pagina de login, se muestra mientras se verifica el estado de autenticacion, si no esta autenticado se muestra el formulario de login, si esta autenticado se redirige a la pagina principal del app
export default function Login() {

  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const { emailError, passwordError, setEmail, setPassword, login } = useLogin();
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(protected)/home");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>

        {/* Top Icon */}
        <View
          style={[
            styles.lockCircle,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Feather name="lock" size={34} color={theme.colors.primary} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{t("welcome")}</Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Introduce tus credenciales para continuar
        </Text>

        <View style={styles.infoRow}>
          <Feather name="shield" size={14} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Acceso seguro y cifrado
          </Text>
        </View>

        {/* Email label */}
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {t("email")}
        </Text>

        <TextInputRectangle
          placeholder={t("exampleEmail")}
          iconLeft="mail"
          onChangeText={setEmail}
        />

        {emailError !== "" && (
          <Text style={{ color: theme.colors.error, alignSelf: "flex-start" }}>
            {emailError}
          </Text>
        )}


        {/* Forgot password row */}
        <View style={styles.passwordRow}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {t("password")}
        </Text>
          <Text style={[styles.forgot, { color: theme.colors.textSecondary }]}>
            {t("forgotPassword")}
          </Text>
        </View>

        <TextInputRectangle
          iconLeft="lock"
          isSecure={true}
          onChangeText={setPassword}
        />

        {passwordError !== "" && (
          <Text style={{ color: theme.colors.error, alignSelf: "flex-start" }}>
            {passwordError}
          </Text>
        )}

        <View style={{ marginTop: 20 }} />

        {/* Login button */}
        <ButtonRectangular
          text={t("login")}
          colorBG={theme.colors.primary}
          colorTxt={theme.colors.primaryContrast}
          onPressed={login}
        />

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
            {t("orContinueWith")}
          </Text>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        </View>

        {/* Google button */}
        <ButtonRectangular
          text="Google"
          icon={{ type: "google" }}
          iconSize={20}
          colorBG={theme.colors.surface}
          colorTxt={theme.colors.textPrimary}
          colorBorder={theme.colors.border}
          colorIcon="#ea4335"

        />

        {/* Bottom text */}
        <Text style={[styles.bottomText, { color: theme.colors.textSecondary }]}>
          {t("noAccount")}{" "}
          <Text style={[styles.register, { color: theme.colors.primary }]}>
            {t("registerNow")}
          </Text>
        </Text>

      </View>
    </View>
  );
}
