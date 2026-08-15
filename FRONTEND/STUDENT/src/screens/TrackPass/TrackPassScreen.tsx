import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import campusImage from "../../assets/images/gatepass/campus-track.png";
import GatepassCard from "../../components/GatepassCard/GatepassCard";
import GatepassLayout from "../../components/GatepassLayout/GatepassLayout";
import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import {
  cancelPassApi,
  getMyPassesApi,
  Pass,
  PassStatus,
} from "../../api/passes.api";
import { styles } from "./TrackPassScreen.styles";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(t: string | null | undefined): string {
  if (!t) return "";
  const parts = t.split(":");
  if (parts.length < 2) return t;
  const [h, m] = parts;
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

function formatRaisedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type TimelineStep = {
  title: string;
  description: string;
  status: "done" | "waiting" | "locked";
  icon: string;
};

function buildTimeline(passStatus: PassStatus): TimelineStep[] {
  const ORDER: PassStatus[] = [
    "PENDING",
    "Parentapproved",
    "CareTakerapproved",
    "CHECKEDOUT",
    "CHECKEDIN",
  ];

  const idx = ORDER.indexOf(passStatus);

  const steps: { title: string; description: string; threshold: number; icon: string }[] = [
    { title: "Gatepass Raised", description: "System recorded request", threshold: 0, icon: "checkmark" },
    { title: "Parental Approval", description: "Parent reviewed & approved", threshold: 1, icon: "person" },
    { title: "Caretaker Approval", description: "Hostel block approved", threshold: 2, icon: "building.2" },
    { title: "Checked Out", description: "Student left campus", threshold: 3, icon: "arrow.right.circle" },
    { title: "Checked In", description: "Student returned to hostel", threshold: 4, icon: "arrow.left.circle" },
  ];

  return steps.map((s) => ({
    title: s.title,
    description: s.description,
    icon: s.icon,
    status:
      passStatus === "CANCELLED"
        ? "locked"
        : idx > s.threshold
        ? "done"
        : idx === s.threshold
        ? "waiting"
        : "locked",
  }));
}

const STATUS_BADGE_COLOR: Record<string, string> = {
  PENDING: "#F4B942",
  Parentapproved: "#708AB5",
  CareTakerapproved: "#1D7A42",
  CHECKEDOUT: "#4CAF50",
  CHECKEDIN: "#2196F3",
  CANCELLED: "#BA1A1A",
};

export default function TrackPassScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ passID?: string }>();
  const passId = params.passID;

  const [pass, setPass] = useState<Pass | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPass = () => {
    setLoading(true);
    getMyPassesApi()
      .then((passes: Pass[]) => {
        if (passId) {
          const found = passes.find((p: Pass) => p.passID === passId) ?? null;
          setPass(found);
          if (!found) setError("Pass not found.");
        } else {

          const active = passes.find(
            (p: Pass) => p.Status !== "CHECKEDIN" && p.Status !== "CANCELLED"
          ) ?? passes[0] ?? null;
          setPass(active);
          if (!active) setError("No pass found.");
        }
      })
      .catch(() => setError("Failed to load pass."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPass();
  }, [passId]);

  const handleCancel = () => {
    if (!pass) return;
    Alert.alert(
      "Cancel Pass",
      "Are you sure you want to cancel this pass request?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              await cancelPassApi(pass.passID);
              Alert.alert("Cancelled", "Your pass has been cancelled.", [
                { text: "OK", onPress: () => router.replace("/passes" as never) },
              ]);
            } catch (e: any) {
              Alert.alert(
                "Error",
                e?.response?.data?.message || "Could not cancel pass."
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <GatepassLayout activeTab="passes" heroSource={campusImage} heroHeight={160}>
        <View style={{ alignItems: "center", paddingTop: 60 }}>
          <ActivityIndicator size="large" color="#708AB5" />
        </View>
      </GatepassLayout>
    );
  }

  if (error || !pass) {
    return (
      <GatepassLayout activeTab="passes" heroSource={campusImage} heroHeight={160}>
        <View style={{ alignItems: "center", paddingTop: 60 }}>
          <Text style={{ color: "#FF8A80", fontSize: 14 }}>{error ?? "Pass not found."}</Text>
        </View>
      </GatepassLayout>
    );
  }

  const timeline = buildTimeline(pass.Status);
  const badgeColor = STATUS_BADGE_COLOR[pass.Status] ?? "#74777F";
  const canCancel = pass.Status !== "CHECKEDIN" && pass.Status !== "CHECKEDOUT" && pass.Status !== "CANCELLED";

  const details = [
    { label: "Destination", value: pass.Destination, icon: "location" },
    { label: "Purpose", value: pass.Purpose, icon: "doc.text" },
    {
      label: "Raised At",
      value: formatRaisedAt(pass.RaisedAt),
      icon: "clock.arrow.circlepath",
    },
    {
      label: "Expected Return",
      value: `${formatDate(pass.Expected_Date)}, ${formatTime(pass.Expected_Time)}`,
      icon: "calendar",
    },
    ...(pass.ModeofTransport
      ? [{ label: "Transport", value: pass.ModeofTransport, icon: "car" }]
      : []),
    ...(pass.Actual_Return_Date
      ? [
          {
            label: "Actual Return",
            value: `${formatDate(pass.Actual_Return_Date)}, ${formatTime(pass.Actual_Return_Time ?? "")}`,
            icon: "arrow.left.circle",
          },
        ]
      : []),
  ] as const;

  return (
    <GatepassLayout activeTab="passes" heroSource={campusImage} heroHeight={160}>

      <GatepassCard style={styles.statusCard}>
        <Text style={styles.eyebrow}>GATEPASS ID</Text>
        <Text style={styles.passId} selectable>{pass.passID}</Text>
        <View style={[styles.pendingBadge, { alignSelf: "flex-start", backgroundColor: badgeColor + "22", borderColor: badgeColor + "44" }]}>
          <Text style={[styles.pendingText, { color: badgeColor }]}>{pass.Status.toUpperCase()}</Text>
        </View>
      </GatepassCard>

      <GatepassCard style={styles.cardBody}>
        <Text style={styles.sectionTitle}>Pass Details</Text>
        <View style={styles.separator} />
        <View style={styles.detailsGrid}>
          {details.map((detail) => (
            <View key={detail.label} style={styles.detailItem}>
              <Text style={styles.detailLabel}>{detail.label}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          ))}
        </View>
      </GatepassCard>

      <GatepassCard style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Approval Timeline</Text>
        <View style={styles.separator} />
        <View style={styles.timeline}>
          {timeline.map((item, index) => {
            const done = item.status === "done";
            const waiting = item.status === "waiting";
            const muted = item.status === "locked";

            return (
              <View key={item.title} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View
                    style={[
                      styles.timelineDot,
                      done && styles.timelineDotDone,
                      waiting && styles.timelineDotWaiting,
                      muted && styles.timelineDotMuted,
                    ]}
                  >
                    <GatepassSymbol
                      name={item.icon as any}
                      fallback={done ? "Y" : waiting ? "O" : "L"}
                      size={12}
                      color={done ? "#D0E1FB" : muted ? "#74777F" : "#44474E"}
                    />
                  </View>
                  {index < timeline.length - 1 ? <View style={styles.timelineLine} /> : null}
                </View>
                <View style={styles.timelineText}>
                  <Text style={[styles.timelineTitle, muted && styles.timelineTitleMuted]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.timelineDescription, muted && styles.timelineDescriptionMuted]}>
                    {item.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </GatepassCard>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.neutralButton, pressed && styles.buttonPressed]}
          onPress={() => router.replace("/passes" as never)}
        >
          <GatepassSymbol name="qrcode" fallback="Q" size={15} color="#191C1E" />
          <Text style={styles.neutralButtonText}>View My Passes</Text>
        </Pressable>
        {canCancel && (
          <Pressable
            style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed, cancelling && { opacity: 0.6 }]}
            onPress={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator color="#BA1A1A" size="small" />
            ) : (
              <>
                <GatepassSymbol name="xmark.circle" fallback="X" size={16} color="#BA1A1A" />
                <Text style={styles.dangerButtonText}>Cancel Request</Text>
              </>
            )}
          </Pressable>
        )}
      </View>
    </GatepassLayout>
  );
}

