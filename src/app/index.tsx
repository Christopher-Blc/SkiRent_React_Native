import { View, Text } from 'react-native';
import { TextInputRectangle } from '@/components/TextInputRectangle';
import { Feather } from '@expo/vector-icons';
import { ButtonRectangular } from '@/components/ButtonRectangular';
import { useLogin } from '@/hooks/useLogin';
import { styles } from '@/styles/login.styles';

export default function Login() {

  const { emailError, passwordError, setEmail, setPassword, login } =
    useLogin();

  return (
    <View style={styles.screen}>
      <View style={styles.card}>

        {/* Top Icon */}
        <View style={styles.lockCircle}>
          <Feather name="lock" size={34} color="#5a4ff7" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Bienvenido</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Introduce tus credenciales para continuar
        </Text>

        {/* Email label */}
        <Text style={styles.label}>Correo Electrónico</Text>

        <TextInputRectangle
          placeholder="nombre@ejemplo.com"
          iconLeft="mail"
          onChangeText={setEmail}
        />

        {emailError !== "" && (
          <Text style={{ color: "red", alignSelf: "flex-start" }}>
            {emailError}
          </Text>
        )}


        {/* Forgot password row */}
        <View style={styles.passwordRow}>
          <Text style={styles.label}>Contraseña</Text>
          <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
        </View>

        <TextInputRectangle
          iconLeft="lock"
          isSecure={true}
          onChangeText={setPassword}
        />

        {passwordError !== "" && (
          <Text style={{ color: "red", alignSelf: "flex-start" }}>
            {passwordError}
          </Text>
        )}

        <View style={{ marginTop: 20 }} />

        {/* Login button */}
        <ButtonRectangular
          text="Iniciar Sesión"
          colorBG="#4f46e5"
          colorTxt="#ffffff"
          onPressed={login}
        />

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>O continúa con</Text>
          <View style={styles.divider} />
        </View>

        {/* Google button */}
        <ButtonRectangular
          text="Google"
          icon="globe"
          iconSize={20}
          colorBG="#ffffff"
          colorTxt="#374151"
          colorBorder="#d1d5db"
          colorIcon="#ea4335"

        />

        {/* Bottom text */}
        <Text style={styles.bottomText}>
          ¿No tienes una cuenta? <Text style={styles.register}>Regístrate ahora</Text>
        </Text>

      </View>
    </View>
  );
}
