import React from "react";
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native";

import BottomNav, { type BottomNavKey } from "../BottomNav/BottomNav";
import { styles } from "./AppShell.styles";

interface AppShellProps {
  activeTab: BottomNavKey;
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function AppShell({
  activeTab,
  children,
  contentContainerStyle,
}: AppShellProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, contentContainerStyle]}
      >
        {children}
      </ScrollView>
      <BottomNav activeTab={activeTab} />
    </View>
  );
}

