import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GatepassSymbol from "../GatepassSymbol/GatepassSymbol";
import { ScanMode } from "../../utils/securityGatepass";

type SecurityTab = "dashboard" | ScanMode;

interface SecurityLayoutProps {
  activeTab: SecurityTab;
  children: ReactNode;
}

interface SecurityLogoProps {
  source: number;
  size?: number;
}

const tabs = [
  { key: "dashboard", label: "Dashboard", icon: "square.grid.2x2.fill" },
  { key: "in", label: "In-Scan", icon: "arrow.right.square" },
  { key: "out", label: "Out-Scan", icon: "rectangle.portrait.and.arrow.right" },
] as const;

export function SecurityLogo({ source, size = 44 }: SecurityLogoProps) {
  return <Image source={source} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />;
}

export default function SecurityLayout({ activeTab, children }: SecurityLayoutProps) {
  const insets = useSafeAreaInsets();

  const openTab = (key: SecurityTab) => {
    if (key === "dashboard") {
      router.replace("/");
      return;
    }

    router.replace({ pathname: "/scanner", params: { mode: key } } as never);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>{children}</View>
      <View style={[styles.navigation, { paddingBottom: Math.max(insets.bottom, 6) }]}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Pressable key={tab.key} style={styles.navItem} onPress={() => openTab(tab.key)}>
              <GatepassSymbol
                name={tab.icon as never}
                size={22}
                color={isActive ? "#0077B6" : "#4B5563"}
                weight={isActive ? "bold" : "medium"}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  content: {
    flex: 1,
  },
  navigation: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DCE2EA",
    backgroundColor: "#FFFFFF",
    paddingBottom: 6,
  },
  navItem: {
    width: 88,
    minHeight: 62,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  navLabel: {
    color: "#4B5563",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0,
  },
  navLabelActive: {
    color: "#0077B6",
    fontWeight: "800",
  },
});

