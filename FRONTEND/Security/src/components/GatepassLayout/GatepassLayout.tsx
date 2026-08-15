import React from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GatepassSymbol from "../GatepassSymbol/GatepassSymbol";
import { styles } from "./GatepassLayout.styles";

type TabKey = "passes" | "apply" | "profile";
type HeroTone = "none" | "light" | "dark";

interface GatepassLayoutProps {
  activeTab: TabKey;
  children: React.ReactNode;
  heroSource?: number;
  heroHeight?: number;
  heroOverlap?: number;
  heroTone?: HeroTone;
  contentStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const tabs = [
  { key: "passes", label: "My Passes", route: "/", icon: "ticket", fallback: "T", size: 20 },
  { key: "apply", label: "Apply", route: "/apply", icon: "plus.circle", fallback: "+", size: 20 },
  { key: "profile", label: "Profile", route: "/profile", icon: "person", fallback: "P", size: 18 },
] as const;

export default function GatepassLayout({
  activeTab,
  children,
  heroSource,
  heroHeight = 180,
  heroOverlap = 0,
  heroTone = "none",
  contentStyle,
  contentContainerStyle,
}: GatepassLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const shellWidth = Math.min(width, 430);
  const topHeight = 64 + insets.top;
  const bottomHeight = 80 + insets.bottom;

  const navigate = (route: string) => {
    router.push(route as never);
  };

  return (
    <View style={styles.page}>
      <View style={[styles.shell, { width: shellWidth }]}>
        <View style={[styles.topBar, { height: topHeight, paddingTop: insets.top }]}>
          <GatepassSymbol name="building.columns" fallback="B" size={22} color="#000A1E" />
          <Text style={styles.title}>HOSTEL GATEPASS</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: topHeight, paddingBottom: bottomHeight + 24 },
            contentContainerStyle,
          ]}
        >
          {heroSource ? (
            <View style={[styles.hero, { height: heroHeight, marginBottom: -heroOverlap }]}>
              <Image source={heroSource} style={styles.heroImage} contentFit="cover" />
              {heroTone !== "none" ? (
                <View
                  style={[
                    styles.heroOverlay,
                    heroTone === "dark" ? styles.heroOverlayDark : styles.heroOverlayLight,
                  ]}
                />
              ) : null}
            </View>
          ) : null}

          <View style={[styles.content, heroOverlap > 0 && { marginTop: heroOverlap }, contentStyle]}>
            {children}
          </View>
        </ScrollView>

        <View style={[styles.bottomNav, { height: bottomHeight, paddingBottom: insets.bottom }]}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            const color = isActive ? "#000A1E" : "#38485D";

            return (
              <Pressable
                key={tab.key}
                onPress={() => navigate(tab.route)}
                style={({ pressed }) => [
                  styles.navItem,
                  isActive && styles.navItemActive,
                  pressed && styles.navItemPressed,
                ]}
              >
                <GatepassSymbol
                  name={tab.icon}
                  fallback={tab.fallback}
                  size={tab.size}
                  color={color}
                />
                <Text style={[styles.navLabel, { color }]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

