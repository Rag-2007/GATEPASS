import { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, StatusBar, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import SecurityLayout, { SecurityLogo } from "../../components/SecurityLayout/SecurityLayout";
import scannerCampus from "../../assets/images/security/scanner-campus.png";
import scannerLogo from "../../assets/images/security/scanner-logo.png";
import { ScanMode } from "../../utils/securityGatepass";

export default function SecurityScannerScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const scanMode: ScanMode = mode === "out" ? "out" : "in";
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [manualQr, setManualQr] = useState("");
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const headerHeight = Math.max(insets.top, 12) + 84;
  const stageHeight = Math.max(height - headerHeight - 82, 520);

  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [laserAnim]);

  const topPosition = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["10%", "90%"],
  });

  const onBarcodeScanned = (result: BarcodeScanningResult) => {
    if (!scanning) {
      return;
    }

    setScanning(false);
    router.replace({
      pathname: "/scan-result",
      params: {
        mode: scanMode,
        qr: result.data,
      },
    } as never);
  };

  const handleManualSubmit = () => {
    if (!manualQr.trim()) {
      return;
    }
    setManualEntryOpen(false);
    router.replace({
      pathname: "/scan-result",
      params: {
        mode: scanMode,
        qr: manualQr.trim(),
      },
    } as never);
  };

  return (
    <SecurityLayout activeTab={scanMode}>
      <StatusBar barStyle="light-content" />

      <Modal
        visible={manualEntryOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setManualEntryOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setManualEntryOpen(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Manual Entry</Text>
            <Text style={styles.modalSubtitle}>Enter the Student's QR ID shown on their pass (e.g. QR-1002)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. QR-XXXX"
              placeholderTextColor="#9CA3AF"
              value={manualQr}
              onChangeText={setManualQr}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalCancelBtn} onPress={() => setManualEntryOpen(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSubmitBtn} onPress={handleManualSubmit}>
                <Text style={styles.modalSubmitText}>Verify Pass</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Image source={scannerCampus} contentFit="cover" style={StyleSheet.absoluteFillObject} />
        <View style={styles.headerShade} />
        <View style={styles.headerRow}>
          <View style={styles.brand}>
            <SecurityLogo source={scannerLogo} size={44} />
            <View style={styles.titleBlock}>
              <Text style={styles.title}>Gatepass Scanner</Text>
              <Text style={styles.subtitle}>{scanMode === "in" ? "Check-in Verification" : "Check-out Verification"}</Text>
            </View>
          </View>
          <Pressable accessibilityRole="button" style={styles.profileButton}>
            <GatepassSymbol name="person.circle" size={30} color="#FFFFFF" weight="regular" />
          </Pressable>
        </View>
      </View>

      <View style={[styles.cameraStage, { minHeight: stageHeight }]}>
        {!permission?.granted ? (
          <View style={styles.permissionSurface}>
            <GatepassSymbol name="qrcode.viewfinder" size={48} color="#A9C8E5" />
            <Text style={styles.permissionTitle}>Camera access is required</Text>
            <Text style={styles.permissionCopy}>Allow camera access to verify gatepass QR codes.</Text>
            <Pressable style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Enable Camera</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              enableTorch={torch}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={scanning ? onBarcodeScanned : undefined}
            />
            <View style={styles.cameraOverlay} />
            <View style={styles.scanContent} pointerEvents="box-none">
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
                <Animated.View style={[styles.laser, { top: topPosition }]} />
              </View>
              <Text style={styles.scanInstruction}>Position QR code within the frame to scan</Text>
              <View style={styles.controls}>
                <Pressable style={styles.controlButton} onPress={() => setTorch((enabled) => !enabled)}>
                  <GatepassSymbol name="bolt" size={21} color={torch ? "#FFE38A" : "#FFFFFF"} weight="semibold" />
                  <Text style={styles.controlText}>Flashlight</Text>
                </Pressable>
                <Pressable style={styles.controlButton} onPress={() => { setManualQr(""); setManualEntryOpen(true); }}>
                  <GatepassSymbol name="keyboard" size={20} color="#FFFFFF" weight="regular" />
                  <Text style={styles.controlText}>Manual Entry</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
      </View>
    </SecurityLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 96,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "#000A1E",
  },
  headerShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 10, 30, 0.72)",
  },
  headerRow: {
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
  titleBlock: {
    flexShrink: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0,
  },
  subtitle: {
    color: "#D2DCEC",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0,
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraStage: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#000A1E",
  },
  permissionSurface: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    backgroundColor: "#0B1730",
  },
  permissionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 18,
  },
  permissionCopy: {
    color: "#B9C8DA",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
  permissionButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#0A84C6",
    paddingHorizontal: 20,
    marginTop: 22,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 10, 30, 0.42)",
  },
  scanContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  scanFrame: {
    width: "76%",
    maxWidth: 280,
    aspectRatio: 1,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 42,
    height: 42,
    borderColor: "#9AD8FF",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    right: 0,
    bottom: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  laser: {
    position: "absolute",
    right: 7,
    left: 7,
    height: 2,
    backgroundColor: "#FE4A49",
    shadowColor: "#FE4A49",
    shadowOpacity: 0.9,
    shadowRadius: 7,
  },
  scanInstruction: {
    maxWidth: 260,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 25,
  },
  controls: {
    position: "absolute",
    bottom: 32,
    flexDirection: "row",
    gap: 30,
  },
  controlButton: {
    minWidth: 86,
    alignItems: "center",
    gap: 6,
  },
  controlText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 10, 30, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#0B1730",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(154, 216, 255, 0.2)",
    padding: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalSubtitle: {
    color: "#9CA3AF",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  modalInput: {
    width: "100%",
    height: 48,
    backgroundColor: "#111E38",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4B5563",
  },
  modalCancelText: {
    color: "#D1D5DB",
    fontSize: 14,
    fontWeight: "700",
  },
  modalSubmitBtn: {
    flex: 1,
    height: 44,
    backgroundColor: "#0A84C6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  modalSubmitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});

