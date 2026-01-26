import { StyleSheet } from "react-native";
import { font } from "@/styles/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    paddingTop: 44,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: font.display,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
    fontFamily: font.body,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    fontFamily: font.display,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontFamily: font.body,
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statPill: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: font.body,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "800",
    fontFamily: font.display,
  },
  avatarButton: {
    position: "relative",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: font.display,
  },
  roleText: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: font.body,
  },
})
