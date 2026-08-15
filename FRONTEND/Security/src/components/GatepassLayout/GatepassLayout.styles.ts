import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E8ECF2",
  },
  shell: {
    flex: 1,
    maxWidth: 430,
    backgroundColor: "#F7F9FB",
    position: "relative",
    overflow: "hidden",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(196,198,207,0.35)",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F7F9FB",
    borderBottomWidth: 1,
    borderBottomColor: "#C4C6CF",
  },
  title: {
    color: "#000A1E",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    minHeight: "100%",
  },
  hero: {
    width: "100%",
    backgroundColor: "#ECEEF0",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlayLight: {
    backgroundColor: "rgba(247,249,251,0.12)",
  },
  heroOverlayDark: {
    backgroundColor: "rgba(0,33,71,0.28)",
  },
  content: {
    width: "100%",
    gap: 24,
    paddingHorizontal: 16,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingHorizontal: 22,
    backgroundColor: "#F7F9FB",
    borderTopWidth: 1,
    borderTopColor: "#C4C6CF",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
  navItem: {
    minWidth: 74,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  navItemActive: {
    backgroundColor: "#D0E1FB",
  },
  navItemPressed: {
    opacity: 0.75,
  },
  navLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0,
  },
});

