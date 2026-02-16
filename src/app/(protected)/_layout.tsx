import { Feather } from '@expo/vector-icons';
import { router, Tabs, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, View, Image } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from "@/store/userStore";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/styles/theme";
import { font } from "@/styles/typography";
import { supabase } from "@/lib/supabase";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


export default function AppLayout() {

  //con eso podemos coger los datos del usuario desde el usuario almacenado en zustand
  const user = useUserStore((s) => s.user);
  const avatarUrl = user?.avatarUrl
  ? `${supabase.storage.from("userData").getPublicUrl(user.avatarUrl).data.publicUrl}?t=${Date.now()}`
  : null;
  const avatarFallback = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const { isAuthenticated, isLoading, logout } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);
  const segments = useSegments();
  const isInClientes = segments.includes("clientes");
  const isClienteDetalle = segments.includes("[id]");
  const esAdmin = String(user?.roleId) === "2";


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
      headerTitleStyle: {
        fontFamily: font.display,
        fontWeight: "800",
        letterSpacing: 0.2,
      },
      headerShadowVisible: false,

      tabBarStyle: {
        backgroundColor: theme.colors.tabBar,
        borderTopColor: theme.colors.border,
        borderTopWidth: 1,
      },
      tabBarActiveTintColor: theme.colors.headerText,
      tabBarInactiveTintColor: theme.colors.tabBarInactive,
      tabBarLabelStyle: { fontFamily: font.body, fontSize: 12 },
      headerTitle: isInClientes ? "Clientes" : "Inicio",
      headerLeft: () => {
        if (!isInClientes) return null;
        return (
          <Pressable
            onPress={() =>
              router.replace(isClienteDetalle ? "/clientes" : "/home")
            }
            style={{ paddingHorizontal: 8 }}
          >
            <Feather name="arrow-left" size={20} color={theme.colors.headerText} />
          </Pressable>
        );
      },
      headerRight: () => (
        <Pressable
          onPress={() => {
            router.push('/profile');
          }}
          style={{ marginRight: 15 }}
        >
          <Image
            source={{ uri: avatarUrl || avatarFallback }}
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
      {user?.roleId === 2 ? (
        <Tabs.Screen
          name="(admin)/clientes"
          options={{
            title: "Clientes",
            tabBarIcon: ({ color, size }) => (
              <Feather name="users" color={color} size={size} />
            ),
          }}
        />
      ) : null}

      {/* productos */}
      <Tabs.Screen
        name="productos/index"
        
        options={{
          title: 'Productos',
          tabBarLabel: 'Productos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="skiing" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="productos/crear"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="productos/editar/[id]"
        options={{ href: null }}
      />



    <Tabs.Screen
      name="(admin)"
      options={{
        title: "Admin",
        tabBarLabel: "Admin",
        tabBarIcon: ({ color, size }) => (
          <Feather name="shield" color={color} size={size} />
        ),
        href: esAdmin ? undefined : null, // 👈 si no es admin, NO aparece
      }}
    />

    <Tabs.Screen
      name="(customer)"
      options={{ href: null }}
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

      <Tabs.Screen
        name="(admin)/preferences"
        options={{ href: null, headerShown: false }}
      />


    </Tabs>
  );
}
