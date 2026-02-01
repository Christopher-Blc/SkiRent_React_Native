import { font } from "@/styles/typography";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: font.display,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: font.body,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  metaPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontFamily: font.display,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "800",
    fontFamily: font.display,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    borderRadius: 18,
    elevation: 4,
    shadowColor: "#0f172a",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
});
