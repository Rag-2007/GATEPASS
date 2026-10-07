import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import { SecurityLogo } from "../../components/SecurityLayout/SecurityLayout";
import failedCampus from "../../assets/images/security/failed-campus.png";
import failedLogo from "../../assets/images/security/failed-logo.png";
import successCampus from "../../assets/images/security/success-campus.png";
import successLogo from "../../assets/images/security/success-logo.png";
import { ScanMode } from "../../utils/securityGatepass";
import { api, buildSecuritySig } from "../../api/config";

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ScanResultScreen() {
  const { mode, qr } = useLocalSearchParams<{ mode?: string; qr?: string }>();
  const scanMode: ScanMode = mode === "out" ? "out" : "in";
  const insets = useSafeAreaInsets();
  const verificationLabel = scanMode === "out" ? "Check-out" : "Check-in";

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<{
    name: string;
    rollNumber: string;
    passType: string;
    room: string;
    photoUrl: string | null;
  } | null>(null);

  useEffect(() => {
    if (!qr) {
      setErrorMsg("No QR ID scanned.");
      setLoading(false);
      return;
    }

    const endpoint = `/Passes/Scan/${scanMode}/${qr}`;
    const sig = buildSecuritySig(qr);

    api.get(endpoint, { headers: { "x-security-sig": sig } })
      .then((res: any) => {
        const student = res.data?.student;
        const pass = res.data?.pass;
        if (!student || !pass) {
          throw new Error("Invalid response payload from server.");
        }
        setStudentInfo({
          name: student.Name || "—",
          rollNumber: student.Roll_No || "—",
          passType: pass.passType === "HOME_PASS" || pass.passtype === "HOME_PASS" ? "Home Pass" : "Day Pass",
          room: student.Block_Id || "—",
          photoUrl: student.Photo_Url ?? null,
        });
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || "An unknown error occurred.";
        setErrorMsg(Array.isArray(msg) ? msg.join(", ") : String(msg));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [qr, scanMode]);

  const handleConfirm = async () => {
    if (!qr) return;
    try {
      setLoading(true);
      const endpoint = scanMode === "in" ? `/Passes/Checkin/${qr}` : `/Passes/Checkout/${qr}`;
      const sig = buildSecuritySig(qr);
      await api.put(endpoint, {}, { headers: { "x-security-sig": sig } });
      router.replace("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "An unknown error occurred.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : String(msg));
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000A1E" }}>
        <ActivityIndicator size="large" color="#FFE38A" />
        <Text style={{ color: "#FFFFFF", marginTop: 16, fontWeight: "700" }}>Verifying Gatepass...</Text>
      </View>
    );
  }

  if (errorMsg || !studentInfo) {
    return (
      <View style={styles.failedScreen}>
        <StatusBar barStyle="light-content" />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.failedScroll}>
          <View style={[styles.failedHero, { paddingTop: Math.max(insets.top, 12) }]}>
            <Image source={failedCampus} contentFit="cover" style={StyleSheet.absoluteFillObject} />
            <View style={styles.failedHeroShade} />
            <View style={styles.failedHeader}>
              <View style={styles.brand}>
                <SecurityLogo source={failedLogo} size={44} />
                <Text style={styles.headerTitle}>IIIT Sri City Security</Text>
              </View>
              <GatepassSymbol name="person.circle" size={30} color="#FFFFFF" weight="regular" />
            </View>
          </View>

          <View style={styles.failedCard}>
            <View style={styles.failureMark}>
              <GatepassSymbol name="xmark" size={38} color="#FFFFFF" weight="bold" />
            </View>
            <Text style={styles.failedTitle}>Invalid / Blocked</Text>
            <Text style={styles.failedCopy}>
              {errorMsg || "The student cannot leave or enter using this gatepass. Please check their block status."}
            </Text>

            <View style={styles.failedDetails}>
              <DetailItem label="QR CODE / ID" value={qr || "—"} />
              <DetailItem label="ERROR DETAIL" value={errorMsg || "Verification Failed"} />
            </View>

            <Pressable style={styles.retryButton} onPress={() => router.replace({ pathname: "/scanner", params: { mode: scanMode } } as never)}>
              <GatepassSymbol name="arrow.clockwise" size={20} color="#FFFFFF" weight="semibold" />
              <Text style={styles.retryButtonText}>Retry Scan</Text>
            </Pressable>
            <Pressable style={styles.dashboardLink} onPress={() => router.replace("/")}>
              <Text style={styles.dashboardLinkText}>Return to Dashboard</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.successScreen}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.successHero, { paddingTop: Math.max(insets.top, 12) }]}>
          <Image source={successCampus} contentFit="cover" style={StyleSheet.absoluteFillObject} />
          <View style={styles.successHeroShade} />
          <View style={styles.successHeader}>
            <View style={styles.brand}>
              <SecurityLogo source={successLogo} size={44} />
              <Text style={styles.headerTitle}>IIIT Sri City Security</Text>
            </View>
            <GatepassSymbol name="person.circle" size={30} color="#FFFFFF" weight="regular" />
          </View>
        </View>

        <View style={styles.successBody}>
          <View style={styles.successCard}>

            <View style={styles.photoWrapper}>
              {studentInfo.photoUrl ? (
                <Image
                  source={{ uri: studentInfo.photoUrl }}
                  style={styles.studentPhoto}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.studentPhotoFallback}>
                  <GatepassSymbol name="person.fill" size={44} color="#FFE38A" weight="regular" />
                </View>
              )}
              <View style={styles.verifyBadge}>
                <GatepassSymbol name="checkmark" size={14} color="#FFFFFF" weight="bold" />
              </View>
            </View>

            <Text style={styles.studentName}>{studentInfo.name}</Text>
            <Text style={styles.studentRoll}>{studentInfo.rollNumber}</Text>

            <View style={styles.verifyBanner}>
              <GatepassSymbol name="checkmark.shield.fill" size={16} color="#087A54" weight="regular" />
              <Text style={styles.verifyBannerText}>Identity Verified — {verificationLabel}</Text>
            </View>

            <View style={styles.successDetails}>
              <DetailItem label="BLOCK / HOSTEL" value={studentInfo.room} />
              <DetailItem label="PASS TYPE" value={studentInfo.passType} />
            </View>
          </View>

          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <GatepassSymbol name="checkmark" size={21} color="#FFFFFF" weight="bold" />
            <Text style={styles.confirmButtonText}>Confirm {scanMode === "out" ? "Exit" : "Entry"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  successScreen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  successHero: {
    height: 202,
    overflow: "hidden",
    backgroundColor: "#000A1E",
  },
  successHeroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 10, 30, 0.56)",
  },
  successHeader: {
    minHeight: 72,
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
  headerTitle: {
    flexShrink: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0,
  },
  successBody: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: Math.max(26, 80),
  },
  successCard: {
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
    marginTop: -50,
    shadowColor: "#00122F",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  photoWrapper: {
    marginTop: -50,
    marginBottom: 14,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  studentPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    backgroundColor: "#0D1B2A",
  },
  studentPhotoFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    backgroundColor: "#0D1B2A",
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#129C5B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  studentName: {
    color: "#000A1E",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0,
    textAlign: "center",
  },
  studentRoll: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 3,
    textAlign: "center",
  },
  verifyBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EDFAF4",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 12,
    marginBottom: 4,
  },
  verifyBannerText: {
    color: "#087A54",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
  },
  successDetails: {
    alignSelf: "stretch",
    borderTopWidth: 1,
    borderTopColor: "#E6EAF0",
    marginTop: 16,
  },
  detailItem: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E6EAF0",
    gap: 14,
  },
  detailLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
  },
  detailValue: {
    flexShrink: 1,
    color: "#000A1E",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
    textAlign: "right",
  },
  confirmButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 6,
    backgroundColor: "#000A1E",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
  failedScreen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  failedScroll: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  failedHero: {
    height: 260,
    overflow: "hidden",
    backgroundColor: "#000A1E",
  },
  failedHeroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 10, 30, 0.56)",
  },
  failedHeader: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  failedCard: {
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    marginHorizontal: 20,
    marginTop: -98,
    shadowColor: "#00122F",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  failureMark: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
    backgroundColor: "#C62828",
  },
  failedTitle: {
    color: "#000A1E",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 14,
  },
  failedCopy: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
  },
  failedDetails: {
    alignSelf: "stretch",
    borderTopWidth: 1,
    borderTopColor: "#E6EAF0",
    marginTop: 20,
  },
  retryButton: {
    alignSelf: "stretch",
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 6,
    backgroundColor: "#000A1E",
    marginTop: 22,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0,
  },
  dashboardLink: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  dashboardLinkText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
});
