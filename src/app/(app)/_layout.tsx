import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      
      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />

      {/* CLIENTES → INDEX */}
      <Tabs.Screen
        name="clientes/index"
        options={{
          title: 'Clientes',   // 👈 AQUÍ está la clave
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" color={color} size={size} />
          ),
        }}
      />

      {/* OCULTOS */}
      <Tabs.Screen
        name="clientes/crear"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="clientes/[id]"
        options={{ href: null }}
      />

    </Tabs>
  );
}
