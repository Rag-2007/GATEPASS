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
          <View style={styles.successMark}>
            <GatepassSymbol name="checkmark" size={36} color="#FFFFFF" weight="bold" />
          </View>
          <Text style={styles.successTitle}>Valid Gatepass</Text>
          <Text style={styles.readyLabel}>Ready for {verificationLabel}</Text>

          <View style={styles.successDetails}>
            <DetailItem label="NAME" value={studentInfo.name} />
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
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    marginTop: -50,
    shadowColor: "#00122F",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  successMark: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
    backgroundColor: "#129C5B",
  },
  successTitle: {
    color: "#000A1E",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 14,
  },
  readyLabel: {
    color: "#087A54",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 6,
  },
  successDetails: {
    alignSelf: "stretch",
    borderTopWidth: 1,
    borderTopColor: "#E6EAF0",
    marginTop: 22,
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
  contactButton: {
    alignSelf: "stretch",
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#0077B6",
    borderRadius: 6,
    marginTop: 12,
  },
  contactButtonText: {
    color: "#0077B6",
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

