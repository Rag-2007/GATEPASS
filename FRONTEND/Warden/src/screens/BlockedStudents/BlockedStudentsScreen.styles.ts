import { StyleSheet } from "react-native";

import { COLORS, SPACING } from "../../utils/constants";

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 24,
    gap: 24,
  },
  list: {
    gap: 24,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(196, 198, 207, 0.5)",
    backgroundColor: COLORS.surface,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardHeader: {
    minHeight: 69,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    color: COLORS.textStrong,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  reasonBand: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(242, 244, 246, 0.3)",
  },
  reason: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  remarksInput: {
    minHeight: 38,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(196, 198, 207, 0.5)",
    backgroundColor: COLORS.background,
    paddingHorizontal: 9,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  unblockButton: {
    minHeight: 36,
    borderRadius: 4,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  unblockText: {
    color: COLORS.white,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  emptyState: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});

