import { StyleSheet } from "react-native";

import { COLORS } from "../../utils/constants";

export const styles = StyleSheet.create({
  row: {
    minHeight: 122,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    padding: 17,
    flexDirection: "row",
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBrown: {
    backgroundColor: "#3D1500",
  },
  avatarText: {
    color: "#708AB5",
    fontSize: 16,
    lineHeight: 24,
  },
  avatarTextBrown: {
    color: "#B97958",
  },
  info: {
    flex: 1,
    gap: 8,
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },
  detailLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  rollNo: {
    color: COLORS.text,
    fontFamily: "monospace",
    fontSize: 15,
    lineHeight: 24,
  },
  roomChip: {
    borderRadius: 2,
    backgroundColor: COLORS.chip,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roomText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },
});

