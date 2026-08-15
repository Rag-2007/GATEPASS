import { StyleSheet } from "react-native";

import { COLORS } from "../../utils/constants";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 17,
    gap: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardOverdue: {
    borderWidth: 2,
    borderColor: COLORS.dangerSurface,
    padding: 18,
  },
  header: {
    minHeight: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "serif",
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
  overdueBadge: {
    backgroundColor: COLORS.dangerSurface,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  overdueBadgeText: {
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
  detailDanger: {
    color: COLORS.danger,
  },
});

