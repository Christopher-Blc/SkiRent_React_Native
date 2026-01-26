import { StyleSheet } from "react-native";
import { font } from "@/styles/typography";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 32,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  lockCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    fontFamily: font.display,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: font.body,
    textAlign: "center",
    marginBottom: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 18,
  },
  infoText: {
    fontSize: 12,
    fontFamily: font.body,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: font.display,
    letterSpacing: 0.6,
    textTransform: "uppercase",
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
    fontWeight: "600",
    fontFamily: font.body,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: font.body,
    marginHorizontal: 10,
  },
  bottomText: {
    marginTop: 18,
    fontFamily: font.body,
  },
  register: {
    fontWeight: "700",
    fontFamily: font.display,
  },
});
