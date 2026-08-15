import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { styles } from "./GatepassCard.styles";

interface GatepassCardProps {
  children: React.ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function GatepassCard({ children, padded = true, style }: GatepassCardProps) {
  return <View style={[styles.card, padded && styles.padded, style]}>{children}</View>;
}

