import { StyleSheet } from "react-native";

import { COLORS, SPACING } from "../../utils/constants";

export const styles = StyleSheet.create({
  main: {
    margin: SPACING.screen,
    marginTop: 19,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 24,
    gap: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingBottom: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.background,
    backgroundColor: "#D6E3FF",
  },
  profileCopy: {
    gap: 4,
  },
  name: {
    color: COLORS.textStrong,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
  },
  staffBadge: {
    alignSelf: "flex-start",
    borderRadius: 4,
    backgroundColor: COLORS.selected,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  staffBadgeText: {
    color: COLORS.selectedText,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E3E5",
  },
  fields: {
    gap: 24,
    paddingTop: 8,
  },
  buttonRow: {
    paddingTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.textSubtle,
  },
  primaryButton: {
    backgroundColor: COLORS.navy,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  logoutButton: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  officialBadge: {
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  officialBadgeText: {
    color: COLORS.textSubtle,
    fontSize: 10,
    lineHeight: 15,
  },
});

