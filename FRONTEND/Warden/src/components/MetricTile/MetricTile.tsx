import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { styles } from "./MetricTile.styles";

interface MetricTileProps {
  label: string;
  value: string;
  tone?: "default" | "danger";
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress?: () => void;
}

export default function MetricTile({
  label,
  value,
  tone = "default",
  icon,
  onPress,
}: MetricTileProps) {
  const danger = tone === "danger";

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color="#C4C6CF" />
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, danger && styles.valueDanger]}>{value}</Text>
        <MaterialCommunityIcons
          name={icon ?? (danger ? "clipboard-clock-outline" : "logout-variant")}
          size={24}
          color={danger ? "#BA1A1A" : "#9BBDF7"}
        />
      </View>
    </Pressable>
  );
}

