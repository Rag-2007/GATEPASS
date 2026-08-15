import { StyleSheet } from "react-native";

import { COLORS, SPACING } from "../../utils/constants";

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 24,
    gap: 24,
  },
  filterCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(196, 198, 207, 0.5)",
    backgroundColor: COLORS.background,
    padding: 17,
    gap: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  toolButton: {
    minHeight: 38,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(196, 198, 207, 0.6)",
    backgroundColor: COLORS.background,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toolText: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
  logCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(196, 198, 207, 0.5)",
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },
  logRow: {
    minHeight: 70,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  logRowBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
  },
  logIdentity: {
    flex: 1,
    paddingRight: 12,
  },
  logName: {
    color: COLORS.textStrong,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  rollNo: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  logMeta: {
    flexShrink: 1,
    alignItems: "flex-end",
    gap: 6,
  },
  statusChip: {
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  outChip: {
    backgroundColor: "rgba(255, 218, 214, 0.5)",
  },
  inChip: {
    backgroundColor: "rgba(208, 225, 251, 0.5)",
  },
  alertChip: {
    backgroundColor: "rgba(255, 218, 214, 0.5)",
  },
  neutralChip: {
    backgroundColor: "rgba(224, 227, 229, 0.5)",
  },
  statusChipText: {
    fontSize: 11,
    lineHeight: 16,
  },
  outChipText: {
    color: "#93000A",
  },
  inChipText: {
    color: COLORS.selectedText,
  },
  alertText: {
    color: "#93000A",
  },
  neutralText: {
    color: COLORS.textMuted,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  pagination: {
    minHeight: 74,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: "rgba(242, 244, 246, 0.3)",
    paddingHorizontal: 25,
    paddingVertical: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paginationText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  pageButtons: {
    flexDirection: "row",
    gap: 8,
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(196, 198, 207, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  pageDisabled: {
    opacity: 0.5,
  },
  pageButtonActive: {
    backgroundColor: COLORS.navy,
    borderColor: "rgba(0, 10, 30, 0.2)",
  },
  pageText: {
    color: COLORS.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  pageTextActive: {
    color: "#708AB5",
  },
});

