import { StyleSheet } from "react-native";

import { COLORS, SPACING } from "../../utils/constants";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SPACING.navHeight,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
  item: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  itemActive: {
    backgroundColor: COLORS.selected,
  },
  label: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 15,
    textAlign: "center",
    fontWeight: "500",
  },
  labelActive: {
    color: COLORS.selectedText,
    fontWeight: "700",
  },
});

