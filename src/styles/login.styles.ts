import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "90%",
    padding: 16,
    margin: 16,
    backgroundColor: "#d1d7ff4f",
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
  },
  lockCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ebe9ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 6,
  },
  passwordRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  forgot: {
    color: "#4f46e5",
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    color: "#6b7280",
    marginHorizontal: 10,
  },
  bottomText: {
    marginTop: 18,
    color: "#6b7280",
  },
  register: {
    color: "#4f46e5",
    fontWeight: "600",
  },
});
