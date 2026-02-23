import { AuthProvider } from "@/providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryProvider } from "@/providers/QueryProvider";
import "../../services/i18next";

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
      <QueryProvider>
        <AuthProvider>
          <Navegacion />
        </AuthProvider>
      </QueryProvider>
    </PaperProvider>
  );
}
