import { StyleSheet } from "react-native";

import { COLORS } from "../../utils/constants";

export const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 17,
  },
  field: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  value: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 0,
  },
  valueStrong: {
    fontWeight: "600",
  },
  grow: {
    width: 0,
  },
});

