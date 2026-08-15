import React from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import campusImage from "../../assets/images/gatepass/campus-apply-empty.png";
import GatepassLayout from "../../components/GatepassLayout/GatepassLayout";
import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import { styles } from "./ApplyPassScreen.styles";

export default function ApplyPassScreen() {
  const router = useRouter();

  return (
    <GatepassLayout activeTab="apply" heroSource={campusImage} heroHeight={180}>
      <View style={styles.emptyCard}>
        <View style={styles.iconWrap}>
          <GatepassSymbol name="info.circle" fallback="i" size={28} color="#BA1A1A" />
        </View>
        <Text style={styles.title}>Need to head out?</Text>
        <Text style={styles.description}>Apply for a Daypass or Homepass to leave{"\n"}the campus.</Text>
      </View>

      <Pressable
        onPress={() => router.push("/active-pass" as never)}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
      >
        <GatepassSymbol name="plus.circle" fallback="+" size={22} color="#708AB5" />
        <Text style={styles.primaryButtonText}>Raise New Pass</Text>
      </Pressable>
    </GatepassLayout>
  );
}

