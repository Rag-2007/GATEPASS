import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  emptyCard: {
    width: "100%",
    minHeight: 178,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(186,26,26,0.2)",
    backgroundColor: "#F7F9FB",
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    color: "#191C1E",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    marginTop: 4,
    color: "#44474E",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  primaryButton: {
    width: "100%",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    backgroundColor: "#002147",
  },
  primaryButtonText: {
    color: "#708AB5",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.75,
  },
});

