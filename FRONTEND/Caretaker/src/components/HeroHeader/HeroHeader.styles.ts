import { StyleSheet } from "react-native";

import { COLORS, SPACING } from "../../utils/constants";

export const styles = StyleSheet.create({
  hero: {
    width: "100%",
    justifyContent: "flex-end",
  },
  heroImage: {
    transform: [{ scale: 1.12 }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 10, 30, 0.42)",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: SPACING.topBarHeight,
    paddingHorizontal: SPACING.screen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  portalTitle: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  copy: {
    paddingHorizontal: SPACING.screen,
    paddingBottom: 24,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
  },
  compactTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "serif",
    fontWeight: "400",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
});

