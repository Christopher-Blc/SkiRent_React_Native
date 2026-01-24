import { Feather } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, View, Image } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from "@/store/userStore";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";



export default function AppLayout() {

  //con eso podemos coger los datos del usuario desde el usuario almacenado en zustand
  const user = useUserStore((s) => s.user);
  const avatarUrl = user?.avatar ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const { isAuthenticated, isLoading, logout } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (

    <Tabs screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: theme.colors.header },
      headerTintColor: theme.colors.headerText,

      tabBarStyle: { backgroundColor: theme.colors.tabBar },
      tabBarActiveTintColor: theme.colors.headerText,
      tabBarInactiveTintColor: theme.colors.tabBarInactive,
      headerRight: () => (
        <Pressable
          onPress={() => {
            router.push('/profile');
          }}
          style={{ marginRight: 15 }}
        >
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
        </Pressable>
      ),
    }}>

      {/* HOME */}
      <Tabs.Screen
        name="home"
        
        options={{
          title: 'Inicio',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />


      {/* CLIENTES → INDEX */}
      <Tabs.Screen
        name="(admin)/clientes"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" color={color} size={size} />
          ),
        }}
      />

      {/* para esconder del tab que sino aparecen abajo y no quiero eso  */}
      <Tabs.Screen
        name="profile"
        options={{ href: null, headerShown: false }}
      />

      <Tabs.Screen
        name="preferences"
        options={{ href: null, headerShown: false }}
      />


    </Tabs>
  );
}
