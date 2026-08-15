import React from "react";
import { Pressable, Text, View } from "react-native";

import campusImage from "../../assets/images/gatepass/campus-track.png";
import GatepassCard from "../../components/GatepassCard/GatepassCard";
import GatepassLayout from "../../components/GatepassLayout/GatepassLayout";
import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import { styles } from "./TrackPassScreen.styles";

const details = [
  { label: "Destination", value: "New Delhi, NCR", icon: "location" },
  { label: "Purpose", value: "Family Event", icon: "doc.text" },
  { label: "Departure", value: "22 Oct, 08:30 AM", icon: "airplane.departure" },
  { label: "Expected Return", value: "24 Oct, 09:00 PM", icon: "calendar" },
] as const;

const timeline = [
  {
    title: "Gatepass Raised",
    description: "System recorded request",
    status: "done",
    icon: "checkmark",
  },
  {
    title: "Parental Approval",
    description: "In Progress / Waiting",
    status: "waiting",
    icon: "clock",
  },
  {
    title: "Hostel Block Approval",
    description: "Awaiting previous steps",
    status: "locked",
    icon: "lock",
  },
] as const;

export default function TrackPassScreen() {
  return (
    <GatepassLayout activeTab="passes" heroSource={campusImage} heroHeight={160}>
      <GatepassCard style={styles.statusCard}>
        <View>
          <Text style={styles.eyebrow}>GATEPASS ID</Text>
          <Text style={styles.passId}>GP-2026-8841</Text>
        </View>
        <View style={styles.pendingBadge}>
          <GatepassSymbol name="doc.badge.clock" fallback="P" size={16} color="#191C1E" />
          <Text style={styles.pendingText}>PENDING</Text>
        </View>
      </GatepassCard>

      <GatepassCard style={styles.cardBody}>
        <Text style={styles.sectionTitle}>Pass Details</Text>
        <View style={styles.separator} />
        <View style={styles.detailsGrid}>
          {details.map((detail) => (
            <View key={detail.label} style={styles.detailItem}>
              <View style={styles.detailLabelRow}>
                <GatepassSymbol name={detail.icon} fallback="*" size={13} color="#44474E" />
                <Text style={styles.detailLabel}>{detail.label}</Text>
              </View>
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
                      name={item.icon}
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
        <Pressable style={({ pressed }) => [styles.neutralButton, pressed && styles.buttonPressed]}>
          <GatepassSymbol name="headphones" fallback="H" size={15} color="#191C1E" />
          <Text style={styles.neutralButtonText}>Contact Warden</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}>
          <GatepassSymbol name="xmark.circle" fallback="X" size={16} color="#BA1A1A" />
          <Text style={styles.dangerButtonText}>Cancel Request</Text>
        </Pressable>
      </View>
    </GatepassLayout>
  );
}

