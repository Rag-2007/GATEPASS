import { StyleSheet } from "react-native";

import { COLORS, SPACING } from "../../utils/constants";

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 24,
    gap: 24,
  },
  tabs: {
    flexDirection: "row",
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    color: COLORS.textMuted,
    fontFamily: "serif",
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 4,
    paddingBottom: 14,
  },
  tabActive: {
    color: COLORS.textStrong,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.textStrong,
  },
  searchShell: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 9,
  },
  list: {
    gap: 16,
  },
});

