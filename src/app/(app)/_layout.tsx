import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (

    <Tabs screenOptions={{ 
      headerShown: true ,
      headerStyle: { backgroundColor: '#002374ff' }, 
      headerTintColor: '#ffffff', 
      
      tabBarStyle: { backgroundColor: '#002374ff' }, 
      tabBarActiveTintColor: '#ffffff', 
      tabBarInactiveTintColor: '#888888'  
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
        name="clientes/index"
        options={{
          title: 'Clientes',   
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" color={color} size={size} />
          ),
        }}
      />

      {/* OCULTOS */}
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
      />

    </Tabs>
  );
}



