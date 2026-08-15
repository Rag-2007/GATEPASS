import React from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import campusImage from "../../assets/images/gatepass/campus-qr.png";
import qrCode from "../../assets/images/gatepass/qr-code.png";
import GatepassCard from "../../components/GatepassCard/GatepassCard";
import GatepassLayout from "../../components/GatepassLayout/GatepassLayout";
import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import { styles } from "./GatepassScreen.styles";

export default function GatepassScreen() {
  return (
    <GatepassLayout activeTab="passes" heroSource={campusImage} heroHeight={192} heroOverlap={48} heroTone="light">
      <GatepassCard style={styles.profileCard}>
        <View>
          <Text style={styles.studentName}>Raghuveer</Text>
          <Text style={styles.studentId}>ID: S20240010107</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RK</Text>
        </View>
      </GatepassCard>

      <GatepassCard padded={false} style={styles.qrCard}>
        <View style={styles.approvedBanner}>
          <Text style={styles.approvedText}>APPROVED</Text>
        </View>
        <View style={styles.qrBody}>
          <Text style={styles.qrCaption}>SCAN AT MAIN GATE</Text>
          <View style={styles.qrFrame}>
            <Image source={qrCode} style={styles.qrImage} contentFit="cover" />
          </View>
          <View style={styles.validBadge}>
            <GatepassSymbol name="seal.fill" fallback="*" size={14} color="#44474E" />
            <Text style={styles.validBadgeText}>Valid Digital Pass</Text>
          </View>
        </View>
      </GatepassCard>

      <View style={styles.detailsGrid}>
        <View style={styles.detailsTopRow}>
          <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>Pass Type</Text>
            <Text style={styles.detailValue}>Daypass</Text>
          </View>
          <View style={[styles.detailCell, styles.detailCellBorder]}>
            <Text style={styles.detailLabel}>Hostel / Room</Text>
            <Text style={styles.detailValue}>BH1, 515</Text>
          </View>
        </View>
        <View style={styles.validityCell}>
          <Text style={styles.detailLabel}>Validity</Text>
          <Text style={styles.detailValue}>22 Oct, 06:00 PM - 10:00 PM</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
          <GatepassSymbol name="square.and.arrow.down" fallback="D" size={18} color="#000A1E" />
          <Text style={styles.secondaryButtonText}>Save to Gallery</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
          <GatepassSymbol name="square.and.arrow.up" fallback="S" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Share</Text>
        </Pressable>
      </View>
    </GatepassLayout>
  );
}

