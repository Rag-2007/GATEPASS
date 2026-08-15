import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { caretakerImages } from "../../assets";
import { styles } from "./HeroHeader.styles";

interface HeroHeaderProps {
  title?: string;
  subtitle?: string;
  meta?: string;
  height?: number;
  compactTitle?: boolean;
}

export default function HeroHeader({
  title,
  subtitle,
  meta,
  height = 224,
  compactTitle = false,
}: HeroHeaderProps) {
  const router = useRouter();

  return (
    <ImageBackground
      source={caretakerImages.campusGate}
      resizeMode="cover"
      style={[styles.hero, { height }]}
      imageStyle={styles.heroImage}
    >
      <View style={styles.overlay} />
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to dashboard"
          onPress={() => router.push("/dashboard")}
          style={styles.iconButton}
        >
          <Ionicons name="home-outline" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.portalTitle}>Caretaker Portal</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push("/profile")}
          style={styles.iconButton}
        >
          <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
      <View style={styles.copy}>
        {title ? (
          <Text style={[styles.title, compactTitle && styles.compactTitle]}>
            {title}
          </Text>
        ) : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {meta ? (
          <View style={styles.metaRow}>
            <Ionicons name="analytics-outline" size={15} color="#FFFFFF" />
            <Text style={styles.metaText}>{meta}</Text>
          </View>
        ) : null}
      </View>
    </ImageBackground>
  );
}

