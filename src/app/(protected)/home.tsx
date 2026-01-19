import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ButtonRectangular } from "@/components/ButtonRectangular";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#0053a6ff",
  },
});
