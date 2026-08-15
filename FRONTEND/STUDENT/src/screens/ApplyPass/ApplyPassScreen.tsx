import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import campusImage from "../../assets/images/gatepass/campus-apply-empty.png";
import campusActive from "../../assets/images/gatepass/campus-active.png";
import GatepassLayout from "../../components/GatepassLayout/GatepassLayout";
import { getMyPassesApi, Pass, ACTIVE_STATUSES } from "../../api/passes.api";
import { styles } from "./ApplyPassScreen.styles";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(t: string | null | undefined): string {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending Approval",
  Parentapproved: "Parent Approved",
  CareTakerapproved: "Caretaker Approved",
  CHECKEDOUT: "Checked Out",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#F4B942",
  Parentapproved: "#708AB5",
  CareTakerapproved: "#1D7A42",
  CHECKEDOUT: "#4CAF50",
};

export default function ApplyPassScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activePass, setActivePass] = useState<Pass | null>(null);

  useEffect(() => {
    getMyPassesApi()
      .then((passes: Pass[]) => {
        const found = passes.find((p: Pass) => ACTIVE_STATUSES.includes(p.Status)) ?? null;
        setActivePass(found);
      })
      .catch(() => setActivePass(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <GatepassLayout activeTab="apply" heroSource={campusImage} heroHeight={180}>
        <View style={{ flex: 1, alignItems: "center", paddingTop: 60 }}>
          <ActivityIndicator size="large" color="#708AB5" />
        </View>
      </GatepassLayout>
    );
  }

  if (activePass) {
    const badgeColor = STATUS_COLOR[activePass.Status] ?? "#74777F";
    return (
      <GatepassLayout activeTab="apply" heroSource={campusActive} heroHeight={180}>

        <View style={activeCard.warningCard}>
          <Text style={activeCard.warningTitle}>Active Pass Found</Text>
          <Text style={activeCard.warningBody}>
            You already have an active pass. Only one pass can be active at a time.
          </Text>
        </View>

        <View style={activeCard.summaryCard}>
          <View style={activeCard.summaryHeader}>
            <Text style={activeCard.summaryHeaderLabel}>CURRENT ACTIVE PASS</Text>
            <View style={[activeCard.statusPill, { backgroundColor: badgeColor + "22", borderColor: badgeColor }]}>
              <Text style={[activeCard.statusPillText, { color: badgeColor }]}>
                {STATUS_LABEL[activePass.Status] ?? activePass.Status}
              </Text>
            </View>
          </View>
          <View style={activeCard.summaryBody}>
            <View style={activeCard.summaryRow}>
              <View>
                <Text style={activeCard.summaryLabel}>PASS TYPE</Text>
                <Text style={activeCard.summaryValue}>
                  {activePass.passType === "HOME_PASS" || activePass.passtype === "HOME_PASS" ? "Home Pass" : "Day Pass"}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={activeCard.summaryLabel}>VALID UNTIL</Text>
                <Text style={activeCard.summaryValue}>
                  {formatDate(activePass.Expected_Date)}, {formatTime(activePass.Expected_Time)}
                </Text>
              </View>
            </View>
            <Text style={activeCard.summaryMeta}>Destination: {activePass.Destination}</Text>
            <Text style={activeCard.summaryMeta}>Raised: {formatDate(activePass.RaisedAt)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={() => router.push("/passes" as never)}
            style={({ pressed }) => [activeCard.primaryBtn, pressed && { opacity: 0.75 }]}
          >
            <Text style={activeCard.primaryBtnText}>View Active Pass</Text>
          </Pressable>
          <View style={activeCard.disabledBtn}>
            <Text style={activeCard.disabledBtnText}>Raise New Pass</Text>
          </View>
        </View>
      </GatepassLayout>
    );
  }

  return (
    <GatepassLayout activeTab="apply" heroSource={campusImage} heroHeight={180}>
      <View style={styles.emptyCard}>
        <Text style={styles.title}>Need to head out?</Text>
        <Text style={styles.description}>
          Apply for a Day Pass or Home Pass{"\n"}to leave the campus.
        </Text>
      </View>

      <Pressable
        onPress={() => router.push("/apply-form" as never)}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.primaryButtonText}>Raise New Pass</Text>
      </Pressable>
    </GatepassLayout>
  );
}

import { StyleSheet } from "react-native";
const activeCard = StyleSheet.create({
  warningCard: {
    backgroundColor: "#FFF8EC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F4C870",
    padding: 16,
    gap: 6,
    marginTop: 12,
    marginBottom: 4,
  },
  warningTitle: {
    color: "#7A4800",
    fontSize: 16,
    fontWeight: "700",
  },
  warningBody: {
    color: "#6B5000",
    fontSize: 13,
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE2E8",
    overflow: "hidden",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#F5F7FA",
    borderBottomWidth: 1,
    borderBottomColor: "#DDE2E8",
  },
  summaryHeaderLabel: {
    color: "#44474E",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  statusPill: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  summaryBody: {
    padding: 16,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: "#74777F",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryValue: {
    color: "#000A1E",
    fontSize: 15,
    fontWeight: "700",
  },
  summaryMeta: {
    color: "#505F76",
    fontSize: 13,
  },
  primaryBtn: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#002147",
    borderRadius: 10,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  disabledBtn: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDE2E8",
  },
  disabledBtnText: {
    color: "#B0B8C1",
    fontSize: 15,
    fontWeight: "700",
  },
});

