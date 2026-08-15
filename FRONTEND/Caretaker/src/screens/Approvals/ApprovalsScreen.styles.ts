import { StyleSheet } from "react-native";

import { COLORS, SPACING } from "../../utils/constants";

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 24,
    gap: 24,
  },
  summary: {
    minHeight: 104,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(196, 198, 207, 0.6)",
    backgroundColor: COLORS.background,
    padding: 17,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  summaryValue: {
    marginTop: 20,
    color: COLORS.danger,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
  },
  summaryHint: {
    flex: 1,
    color: COLORS.textSubtle,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "right",
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
  emptyState: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  emptyText: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});

