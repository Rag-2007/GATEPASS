import { StyleSheet } from "react-native";

import { COLORS } from "../../utils/constants";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  requestStrip: {
    minHeight: 27,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 33, 71, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
  },
  requestId: {
    color: "#708AB5",
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "700",
    letterSpacing: 0,
  },
  passBadge: {
    minHeight: 21,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 10, 30, 0.2)",
    backgroundColor: "rgba(0, 10, 30, 0.05)",
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  passBadgeText: {
    color: COLORS.textStrong,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "700",
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  name: {
    color: COLORS.textStrong,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
  },
  rollNo: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  detailRows: {
    gap: 4,
  },
  detailRow: {
    minHeight: 20,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
  },
  detailLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  detailValue: {
    flexShrink: 1,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    textAlign: "right",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  actionButton: {
    flex: 1,
    minHeight: 36,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButton: {
    backgroundColor: "#C9181D",
  },
  approveButton: {
    backgroundColor: "#16631F",
  },
  actionText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
});

