import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  statusCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  eyebrow: {
    color: "#44474E",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0,
  },
  passId: {
    marginTop: 4,
    color: "#191C1E",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  pendingBadge: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#C4C6CF",
    borderRadius: 4,
    backgroundColor: "#E0E3E5",
  },
  pendingText: {
    color: "#191C1E",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0,
  },
  cardBody: {
    padding: 20,
    gap: 14,
  },
  timelineCard: {
    padding: 20,
    gap: 18,
  },
  sectionTitle: {
    color: "#191C1E",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  separator: {
    height: 1,
    backgroundColor: "#C4C6CF",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
    columnGap: 24,
  },
  detailItem: {
    width: "46%",
    minWidth: 130,
    gap: 4,
  },
  detailLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailLabel: {
    color: "#44474E",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0,
  },
  detailValue: {
    color: "#191C1E",
    fontSize: 14,
    lineHeight: 20,
  },
  timeline: {
    gap: 0,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 68,
  },
  timelineRail: {
    width: 24,
    alignItems: "center",
    marginRight: 16,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineDotDone: {
    backgroundColor: "#002147",
  },
  timelineDotWaiting: {
    borderWidth: 1,
    borderColor: "#74777F",
    backgroundColor: "#E0E3E5",
  },
  timelineDotMuted: {
    borderWidth: 1,
    borderColor: "#C4C6CF",
    backgroundColor: "#ECEEF0",
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#C4C6CF",
  },
  timelineText: {
    flex: 1,
    paddingTop: 2,
  },
  timelineTitle: {
    color: "#191C1E",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800",
  },
  timelineTitleMuted: {
    color: "#74777F",
  },
  timelineDescription: {
    marginTop: 2,
    color: "#44474E",
    fontSize: 14,
    lineHeight: 20,
  },
  timelineDescriptionMuted: {
    color: "#C4C6CF",
  },
  actions: {
    gap: 12,
    paddingTop: 6,
  },
  neutralButton: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C4C6CF",
    backgroundColor: "#ECEEF0",
  },
  dangerButton: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BA1A1A",
    backgroundColor: "#FFFFFF",
  },
  neutralButtonText: {
    color: "#191C1E",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
  dangerButtonText: {
    color: "#BA1A1A",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
  buttonPressed: {
    opacity: 0.75,
  },
});

