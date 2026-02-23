import { StyleSheet  } from "react-native";
import {font} from "@/styles/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },

  header: {
    paddingTop: 12,
    paddingBottom: 16,
  },

  kicker: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
    fontFamily: font.display,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.2,
    fontFamily: font.display,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: font.body,
  },

  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    fontFamily: font.display,
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: font.display,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: font.body,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  label: {
    fontSize: 13,
    fontFamily: font.body,
  },

  value: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: font.display,
  },

  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1
  }
});