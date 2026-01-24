import { Feather } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useAuth } from '@/contexts/authcontext';

export default function AppLayout() {
  const { isAuthenticated, isLoading, logout } = useAuth();

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
      headerStyle: { backgroundColor: '#002374ff' },
      headerTintColor: '#ffffff',

      tabBarStyle: { backgroundColor: '#002374ff' },
      tabBarActiveTintColor: '#ffffff',
      tabBarInactiveTintColor: '#888888',
      headerRight: () => (
        <Pressable
          onPress={() => {
            logout();
          }}
          style={{ marginRight: 15 }}
        >
          <Feather name="log-out" size={22} color="#fff" />
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

      {/* <Tabs.Screen
        name="customers"
        options={{
          title: 'Customers',
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" color={color} size={size} />
          ),
        }}
      /> */}

      {/* OCULTOS
      <Tabs.Screen
      
        name="clientes/crear"
        options={{title: "", href: null }}
      />

      <Tabs.Screen
        name="clientes/[id]"
        options={{title:"",href: null }}
      />

      <Tabs.Screen
        name="customer/index"
        options={{title:"",href: null }}
      /> */}

    </Tabs>
  );
}


