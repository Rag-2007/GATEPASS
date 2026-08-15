import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { type Href, useRouter } from "expo-router";

import AppShell from "../../components/AppShell/AppShell";
import HeroHeader from "../../components/HeroHeader/HeroHeader";
import MetricTile from "../../components/MetricTile/MetricTile";
import { dashboardMetrics } from "../../services/caretakerService";
import { getMe, getParentApprovedPasses, getCurrentlyOut } from "../../api/caretakerApi";
import { styles } from "./DashboardScreen.styles";

export default function DashboardScreen() {
  const router = useRouter();
  const [awaitingCount, setAwaitingCount] = useState<number | null>(null);
  const [outCount, setOutCount] = useState<number | null>(null);
  const [hostelId, setHostelId] = useState<string>("Loading...");

  const loadMetrics = useCallback(async () => {
    try {
      const me = await getMe();
      const hid = me.hostel?.Block_Id;
      setHostelId(hid || "Unknown");

      if (hid) {
        const [passes, out] = await Promise.all([
          getParentApprovedPasses(hid),
          getCurrentlyOut(hid),
        ]);

        setAwaitingCount(passes.filter((p) => p.passType === "HOME_PASS").length);
        setOutCount(out.length);
      }
    } catch (e) {
      console.error("Failed to load dashboard metrics", e);
      setAwaitingCount(0);
      setOutCount(0);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  return (
    <AppShell activeTab="dashboard" contentContainerStyle={styles.content}>
      <HeroHeader
        height={192}
        title={`Block ${hostelId} Control Center`}
        subtitle="Hostel Management & Gatepass Oversight"
      />
      <View style={styles.metrics}>
        {dashboardMetrics.map((metric) => {
          let val = metric.value;
          if (metric.id === "awaiting" && awaitingCount !== null) {
            val = awaitingCount.toString().padStart(2, "0");
          } else if (metric.id === "out" && outCount !== null) {
            val = outCount.toString().padStart(2, "0");
          }

          return (
            <MetricTile
              key={metric.id}
              label={metric.label}
              value={val}
              tone={metric.tone}
              onPress={() => {
                if (metric.id === "awaiting") router.push("/approvals" as Href);
                if (metric.id === "out") router.push("/currently-out" as Href);
              }}
            />
          );
        })}
      </View>
    </AppShell>
  );
}

