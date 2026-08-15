import React from "react";
import { StyleProp, Text, ViewStyle } from "react-native";
import { SymbolView } from "expo-symbols";

import { styles } from "./GatepassSymbol.styles";

type SymbolName = React.ComponentProps<typeof SymbolView>["name"];
type SymbolWeight = React.ComponentProps<typeof SymbolView>["weight"];

interface GatepassSymbolProps {
  name: SymbolName;
  size?: number;
  color?: string;
  fallback?: string;
  weight?: SymbolWeight;
  style?: StyleProp<ViewStyle>;
}

export default function GatepassSymbol({
  name,
  size = 20,
  color = "#000A1E",
  fallback = "",
  weight = "semibold",
  style,
}: GatepassSymbolProps) {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      weight={weight}
      resizeMode="scaleAspectFit"
      style={[styles.symbol, { width: size, height: size }, style]}
      fallback={
        <Text
          style={[
            styles.fallback,
            { color, fontSize: Math.max(11, size * 0.65), lineHeight: size },
          ]}
        >
          {fallback}
        </Text>
      }
    />
  );
}

