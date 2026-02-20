import { StyleSheet } from "react-native";
import { font } from "@/styles/typography";

export const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: font.display,
    marginBottom: 16,
    alignSelf: "center",
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  previewWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    borderWidth: 1,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  selector: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  selectorText: {
    fontFamily: font.body,
    fontSize: 15,
  },
  gap: {
    marginTop: 14,
  },
  activeRow: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeText: {
    fontFamily: font.body,
    fontSize: 15,
  },
  activePill: {
    minWidth: 42,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  actions: {
    marginTop: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    maxHeight: "65%",
  },
  modalTitle: {
    fontFamily: font.display,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  modalLoading: {
    paddingVertical: 16,
    alignItems: "center",
  },
  modalItem: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  modalItemText: {
    fontFamily: font.body,
    fontSize: 15,
  },
  separator: {
    height: 1,
    width: "100%",
  },
});
