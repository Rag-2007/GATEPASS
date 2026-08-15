import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import SecurityLayout, { SecurityLogo } from "../../components/SecurityLayout/SecurityLayout";
import dashboardCampus from "../../assets/images/security/dashboard-campus.png";
import dashboardLogo from "../../assets/images/security/dashboard-logo.png";
import { ScanMode } from "../../utils/securityGatepass";
import { api } from "../../api/config";

const actions: {
  mode: ScanMode;
  title: string;
  subtitle: string;
  icon: "rectangle.portrait.and.arrow.right" | "arrow.right.square";
}[] = [
  { mode: "out", title: "Scan Out", subtitle: "Departure", icon: "rectangle.portrait.and.arrow.right" },
  { mode: "in", title: "Scan In", subtitle: "Return", icon: "arrow.right.square" },
];

export default function SecurityDashboardScreen() {
  const insets = useSafeAreaInsets();
  const [dayOut, setDayOut] = useState<number | null>(null);
  const [homeOut, setHomeOut] = useState<number | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    api.get("/Passes/getByStatus/CHECKEDOUT")
      .then((res: any) => {
        const passes: any[] = Array.isArray(res.data) ? res.data : [];
        setDayOut(passes.filter((p) => p.passType === "DAY_PASS" || p.passtype === "DAY_PASS").length);
        setHomeOut(passes.filter((p) => p.passType === "HOME_PASS" || p.passtype === "HOME_PASS").length);
      })
      .catch(() => {
        setDayOut(0);
        setHomeOut(0);
      })
      .finally(() => setLoadingCounts(false));
  }, []);

  const openScanner = (mode: ScanMode) => {
    router.push({ pathname: "/scanner", params: { mode } } as never);
  };

  return (
    <SecurityLayout activeTab="dashboard">
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={[styles.headerRow, { paddingTop: Math.max(insets.top, 12) }]}>
          <View style={styles.brand}>
            <SecurityLogo source={dashboardLogo} size={44} />
            <Text style={styles.brandTitle} numberOfLines={1} adjustsFontSizeToFit>
              IIIT Sri City Security
            </Text>
          </View>
          <Pressable accessibilityRole="button" style={styles.profileButton}>
            <GatepassSymbol name="person.circle" size={30} color="#FFFFFF" weight="regular" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={dashboardCampus} contentFit="cover" style={StyleSheet.absoluteFillObject} />
          <View style={styles.heroShade} />
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>CURRENT STATUS</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Main Gate Active</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.actionsRow}>
            {actions.map((action) => {
              const isOut = action.mode === "out";

              return (
                <Pressable
                  key={action.mode}
                  accessibilityRole="button"
                  style={[styles.actionCard, isOut ? styles.actionOut : styles.actionIn]}
                  onPress={() => openScanner(action.mode)}
                >
                  <GatepassSymbol name={action.icon} size={30} color={isOut ? "#FFFFFF" : "#000A1E"} weight="regular" />
                  <View>
                    <Text style={[styles.actionTitle, isOut && styles.actionTitleOut]}>{action.title}</Text>
                    <Text style={[styles.actionSubtitle, isOut && styles.actionSubtitleOut]}>{action.subtitle}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.metricsHeading}>
            <Text style={styles.metricsTitle}>Pass Metrics Today</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>REAL-TIME</Text>
            </View>
          </View>

          <View style={styles.metricsList}>
            {[
              { title: "DAY PASS", color: "#E9F4FF", count: dayOut, icon: "calendar" as const },
              { title: "HOME PASS", color: "#FAF1DD", count: homeOut, icon: "house" as const },
            ].map((metric) => (
              <View key={metric.title} style={styles.metricCard}>
                <View style={[styles.metricTop, { backgroundColor: metric.color }]}>
                  <GatepassSymbol name={metric.icon} size={22} color="#000A1E" />
                  <Text style={styles.metricName}>{metric.title}</Text>
                </View>
                <View style={styles.countRow}>
                  <View style={styles.countCell}>
                    <GatepassSymbol name="arrow.up.right" size={18} color="#BA1A1A" />
                    {loadingCounts ? (
                      <ActivityIndicator size="small" color="#BA1A1A" style={{ marginTop: 4 }} />
                    ) : (
                      <Text style={styles.countNumberOut}>{metric.count ?? "—"}</Text>
                    )}
                    <Text style={styles.countLabel}>CURRENTLY OUT</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SecurityLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    zIndex: 2,
    backgroundColor: "#000A1E",
  },
  headerRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  brand: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingRight: 12,
  },
  brandTitle: {
    flexShrink: 1,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0,
  },
  profileButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  hero: {
    height: 192,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 10, 30, 0.48)",
  },
  heroText: {
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  eyebrow: {
    color: "#D9E2F2",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#32D583",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minHeight: 102,
    borderRadius: 8,
    justifyContent: "space-between",
    padding: 16,
  },
  actionOut: {
    backgroundColor: "#000A1E",
  },
  actionIn: {
    borderWidth: 1,
    borderColor: "#E0E6ED",
    backgroundColor: "#FFFFFF",
  },
  actionTitle: {
    color: "#000A1E",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0,
  },
  actionTitleOut: {
    color: "#FFFFFF",
  },
  actionSubtitle: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 2,
  },
  actionSubtitleOut: {
    color: "#BDCADC",
  },
  metricsHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 32,
    marginBottom: 14,
  },
  metricsTitle: {
    color: "#000A1E",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 4,
    backgroundColor: "#E5F8EF",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0E9F6E",
  },
  liveText: {
    color: "#087A54",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0,
  },
  metricsList: {
    gap: 14,
  },
  metricCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E6ED",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  metricTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  metricName: {
    color: "#000A1E",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  countRow: {
    flexDirection: "row",
    minHeight: 89,
  },
  countCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  verticalDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#E0E6ED",
    marginVertical: 16,
  },
  countNumberOut: {
    color: "#BA1A1A",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 2,
  },
  countNumberIn: {
    color: "#000A1E",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 2,
  },
  countLabel: {
    color: "#6B7280",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 2,
  },
});

