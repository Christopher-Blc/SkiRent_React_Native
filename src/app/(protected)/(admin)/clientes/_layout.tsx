import { Stack } from "expo-router";

export default function ClientesLayout() {
  return <Stack screenOptions={{ headerShown: false }}>

    <Stack.Screen  name="index" options={{ title:"Clientes" , headerTitleAlign: "center"}} />

  </Stack> ;
}
