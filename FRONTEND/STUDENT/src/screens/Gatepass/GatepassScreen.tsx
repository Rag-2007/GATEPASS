import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import QRCode from "react-native-qrcode-svg";
import { useRouter } from "expo-router";

import campusImage from "../../assets/images/gatepass/campus-qr.png";
import GatepassCard from "../../components/GatepassCard/GatepassCard";
import GatepassLayout from "../../components/GatepassLayout/GatepassLayout";
import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import {
  getMyPassesApi,
  Pass,
  QR_VISIBLE_STATUSES,
} from "../../api/passes.api";
import { api } from "../../api/config";
import { styles } from "./GatepassScreen.styles";

const STATUS_BADGE_COLOR: Record<string, string> = {
  PENDING: "#F4B942",
  Parentapproved: "#708AB5",
  CareTakerapproved: "#1D7A42",
  CHECKEDOUT: "#4CAF50",
  CHECKEDIN: "#2196F3",
  CANCELLED: "#BA1A1A",
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  const [h, m] = parts;
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

function PassCard({ pass, profile, onSelect }: { pass: Pass; profile?: any; onSelect: () => void }) {
  const qrVisible = QR_VISIBLE_STATUSES.includes(pass.Status);
  const viewRef = useRef<View>(null);
  const [mediaPermission, requestPermission] = MediaLibrary.usePermissions({ writeOnly: true });

  const handleSaveToGallery = async () => {
    try {
      if (!mediaPermission || mediaPermission.status !== "granted") {
        const { status } = await requestPermission();
        if (status !== "granted") {
          Alert.alert("Permission required", "Please allow access to your photo library.");
          return;
        }
      }
      const uri = await captureRef(viewRef, { format: "png", quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Gatepass saved to gallery!");
    } catch {
      Alert.alert("Error", "Could not save image.");
    }
  };

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewRef, { format: "png", quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Error", "Sharing is not available on this device.");
      }
    } catch {
      Alert.alert("Error", "Could not share image.");
    }
  };

  const statusColor: Record<string, string> = {
    PENDING: "#F4B942",
    Parentapproved: "#708AB5",
    CareTakerapproved: "#1D7A42",
    CHECKEDOUT: "#4CAF50",
    CHECKEDIN: "#2196F3",
    CANCELLED: "#BA1A1A",
  };

  const badgeColor = statusColor[pass.Status] ?? "#74777F";

  return (
    <View style={{ marginBottom: 20 }}>
      <View ref={viewRef} collapsable={false} style={{ gap: 16 }}>
        <GatepassCard style={styles.profileCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.studentName}>{pass.RollNo}</Text>
            <Text style={styles.studentId} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
              QR: {pass.QRCODE}
            </Text>
          </View>
        </GatepassCard>

        <GatepassCard padded={false} style={styles.qrCard}>
          {qrVisible ? (
            <>
              <View style={[styles.approvedBanner, { backgroundColor: badgeColor }]}>
                <Text style={styles.approvedText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                  {pass.Status.replace("approved", " APPROVED").toUpperCase()}
                </Text>
              </View>
              <View style={styles.qrBody}>
                <Text style={styles.qrCaption}>SCAN AT MAIN GATE</Text>
                <View style={styles.qrFrame}>
                  <QRCode
                    value={pass.QRCODE}
                    size={160}
                    backgroundColor="transparent"
                    color="#000A1E"
                  />
                </View>
                <View style={styles.validBadge}>
                  <GatepassSymbol name="seal.fill" fallback="*" size={14} color="#44474E" />
                  <Text style={styles.validBadgeText}>Valid Digital Pass</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.approvedBanner, { backgroundColor: "#2A2D35" }]}>
                <Text style={[styles.approvedText, { color: "#F4B942" }]}>
                  {pass.Status === "PENDING" ? "AWAITING APPROVAL" : pass.Status.toUpperCase()}
                </Text>
              </View>
              <View style={styles.qrBody}>
                <Text style={styles.qrCaption}>QR CODE LOCKED</Text>
                <View style={[styles.qrFrame, { justifyContent: "center", alignItems: "center", height: 180 }]}>
                  <GatepassSymbol name="lock.fill" fallback="L" size={52} color="#74777F" />
                  <Text style={{ color: "#74777F", fontSize: 12, marginTop: 12, textAlign: "center" }}>
                    {"QR unlocks after\nCaretaker approval"}
                  </Text>
                </View>
                <View style={styles.validBadge}>
                  <GatepassSymbol name="clock" fallback="O" size={14} color="#74777F" />
                  <Text style={[styles.validBadgeText, { color: "#74777F" }]}>Pending Approval</Text>
                </View>
              </View>
            </>
          )}
        </GatepassCard>

        <View style={styles.detailsGrid}>
          <View style={styles.detailsTopRow}>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>Pass Type</Text>
              <Text style={styles.detailValue}>
                {pass.passType === "HOME_PASS" || pass.passtype === "HOME_PASS" ? "Home Pass" : "Day Pass"}
              </Text>
            </View>
            <View style={[styles.detailCell, styles.detailCellBorder]}>
              <Text style={styles.detailLabel}>Hostel</Text>
              <Text style={styles.detailValue}>{pass.HostelId || profile?.Hostel_Id || "—"}</Text>
            </View>
          </View>
          <View style={styles.validityCell}>
            <Text style={styles.detailLabel}>Expected Return</Text>
            <Text style={styles.detailValue}>
              {formatDate(pass.Expected_Date)}, {formatTime(pass.Expected_Time)}
            </Text>
          </View>
          <View style={styles.validityCell}>
            <Text style={styles.detailLabel}>Destination</Text>
            <Text style={styles.detailValue}>{pass.Destination}</Text>
          </View>
        </View>
      </View>

      {qrVisible && (
        <View style={[styles.actionRow, { marginTop: 12 }]}>
          <Pressable
            onPress={handleSaveToGallery}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          >
            <GatepassSymbol name="square.and.arrow.down" fallback="D" size={18} color="#000A1E" />
            <Text style={styles.secondaryButtonText}>Save to Gallery</Text>
          </Pressable>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          >
            <GatepassSymbol name="square.and.arrow.up" fallback="S" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Share</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        onPress={onSelect}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.buttonPressed,
          { marginTop: 12 },
        ]}
      >
        <GatepassSymbol name="magnifyingglass" fallback="T" size={16} color="#000A1E" />
        <Text style={styles.secondaryButtonText}>View Pass Details</Text>
      </Pressable>
    </View>
  );
}

export default function GatepassScreen() {
  const router = useRouter();
  const [passes, setPasses] = useState<Pass[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getMyPassesApi(),
      api.get("/student/getMe").then(res => res.data).catch(() => null)
    ])
      .then(([allPasses, userProfile]) => {
        setPasses(allPasses.filter((p) => p.Status !== "CANCELLED"));
        setProfile(userProfile);
      })
      .catch((e: any) => setError(e?.response?.data?.message || "Failed to load passes"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <GatepassLayout activeTab="passes" heroSource={campusImage} heroHeight={192} heroOverlap={0} heroTone="light">
      {loading ? (
        <View style={{ alignItems: "center", paddingTop: 60 }}>
          <ActivityIndicator size="large" color="#708AB5" />
          <Text style={{ color: "#74777F", marginTop: 12 }}>Loading passes...</Text>
        </View>
      ) : error ? (
        <View style={{ alignItems: "center", paddingTop: 60 }}>
          <Text style={{ color: "#FF8A80", fontSize: 14 }}>{error}</Text>
        </View>
      ) : passes.length === 0 ? (
        <View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
          <GatepassSymbol name="doc.text.magnifyingglass" fallback="!" size={48} color="#74777F" />
          <Text style={{ color: "#74777F", fontSize: 16, fontWeight: "600" }}>No passes yet</Text>
          <Text style={{ color: "#505F76", fontSize: 13, textAlign: "center" }}>
            Apply for a Day Pass or Home Pass from the Apply tab
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 16 }}>
          {passes.map((pass) => (
            <PassCard
              key={pass.passID}
              pass={pass}
              profile={profile}
              onSelect={() =>
                router.push({ pathname: "/track-pass", params: { passID: pass.passID } } as never)
              }
            />
          ))}
        </ScrollView>
      )}
    </GatepassLayout>
  );
}

