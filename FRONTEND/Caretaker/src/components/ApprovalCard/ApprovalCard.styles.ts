import { StyleSheet } from "react-native";

import { COLORS } from "../../utils/constants";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 17,
    gap: 14,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardUrgent: {
    borderWidth: 2,
    borderColor: COLORS.dangerSurface,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  identity: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontFamily: "serif",
    fontSize: 16,
    lineHeight: 24,
  },
  rollNo: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  badgeStack: {
    alignItems: "flex-end",
    gap: 4,
  },
  badge: {
    minHeight: 23,
    borderRadius: 2,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  urgentBadge: {
    backgroundColor: COLORS.dangerSurface,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  urgentBadgeText: {
    color: "#93000A",
  },
  details: {
    gap: 8,
  },
  detailRow: {
    minHeight: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  reasonBox: {
    marginTop: 2,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceMuted,
    padding: 10,
    gap: 2,
  },
  reasonLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  reasonText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E3E5",
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submitted: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  submittedText: {
    color: COLORS.textSubtle,
    fontSize: 12,
    lineHeight: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 38,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.surface,
  },
  approveButton: {
    backgroundColor: COLORS.navy,
  },
});

