import React from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import campusImage from "../../assets/images/gatepass/campus-active.png";
import GatepassLayout from "../../components/GatepassLayout/GatepassLayout";
import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import { styles } from "./ActivePassScreen.styles";

export default function ActivePassScreen() {
  const router = useRouter();

  return (
    <GatepassLayout activeTab="apply" heroSource={campusImage} heroHeight={180}>
      <View style={styles.warningCard}>
        <View style={styles.warningIcon}>
          <GatepassSymbol name="exclamationmark.triangle" fallback="!" size={28} color="#BA1A1A" />
        </View>
        <Text style={styles.warningTitle}>Active Pass Found</Text>
        <Text style={styles.warningCopy}>
          You already have an active pass. Only one{"\n"}pass can be active at a time.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryHeaderText}>CURRENT ACTIVE PASS</Text>
          <View style={styles.checkedBadge}>
            <Text style={styles.checkedText}>CHECKED IN</Text>
          </View>
        </View>
        <View style={styles.summaryBody}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryColumn}>
              <Text style={styles.summaryLabel}>PASS TYPE</Text>
              <Text style={styles.summaryValue}>Homepass</Text>
            </View>
            <View style={styles.summaryColumnRight}>
              <Text style={styles.summaryLabel}>VALID UNTIL</Text>
              <Text style={styles.summaryValueRight}>24 Oct, 09:00 PM</Text>
            </View>
          </View>
          <View style={styles.appliedRow}>
            <GatepassSymbol name="clock.arrow.circlepath" fallback="O" size={16} color="#74777F" />
            <Text style={styles.appliedText}>Applied today at 07:30 AM</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push("/" as never)}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
        >
          <GatepassSymbol name="eye" fallback="E" size={22} color="#708AB5" />
          <Text style={styles.primaryButtonText}>View Active Pass</Text>
        </Pressable>
        <Pressable style={styles.disabledButton}>
          <GatepassSymbol name="plus.circle" fallback="+" size={22} color="#74777F" />
          <Text style={styles.disabledButtonText}>Raise New Pass</Text>
        </Pressable>
      </View>
    </GatepassLayout>
  );
}

