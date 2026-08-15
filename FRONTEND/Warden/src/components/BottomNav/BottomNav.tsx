import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { type Href, useRouter } from "expo-router";

import { styles } from "./BottomNav.styles";

export type BottomNavKey =
  | "dashboard"
  | "approvals"
  | "audit"
  | "students"
  | "out";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "view-dashboard-outline",
    route: "/dashboard" as Href,
  },
  {
    key: "approvals",
    label: "Approvals",
    icon: "clipboard-check-outline",
    route: "/approvals" as Href,
  },
  {
    key: "audit",
    label: "Audit",
    icon: "clipboard-text-outline",
    route: "/audit" as Href,
  },
  {
    key: "students",
    label: "Students",
    icon: "account-group-outline",
    route: "/students" as Href,
  },
  {
    key: "out",
    label: "Currently Out",
    icon: "logout-variant",
    route: "/currently-out" as Href,
  },
] as const;

interface BottomNavProps {
  activeTab: BottomNavKey;
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const active = item.key === activeTab;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => router.push(item.route)}
            style={[styles.item, active && styles.itemActive]}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={22}
              color={active ? "#54647A" : "#44474E"}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

