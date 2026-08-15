import { StyleSheet } from "react-native";

import { COLORS } from "../../utils/constants";

export const styles = StyleSheet.create({
  card: {
    height: 106,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(196, 198, 207, 0.6)",
    backgroundColor: COLORS.background,
    padding: 17,
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  value: {
    color: COLORS.textStrong,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
  },
  valueDanger: {
    color: COLORS.danger,
  },
});

