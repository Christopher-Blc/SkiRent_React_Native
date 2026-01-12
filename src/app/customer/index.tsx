import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ButtonRectangular } from "../../components/ButtonRectangular";



export default function customerHome() {
  const router = useRouter();

  const volver = () => {
    return router.replace("/login")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Para customers</Text>
      <ButtonRectangular text={"volver"} colorBG={"#0029a4"} colorTxt={"#ffffff"} onPressed={volver}></ButtonRectangular>
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
