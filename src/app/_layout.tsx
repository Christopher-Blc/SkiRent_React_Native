import { AuthProvider } from "@/providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

function Navegacion() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="index" />        // login
      ) : (
        <Stack.Screen name="(protected)" /> // app
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Navegacion />
      </AuthProvider>
    </PaperProvider>
  );
}
