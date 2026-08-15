import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";

import { styles } from "./ProfileField.styles";

type IconSource = "person-outline" | "mail-outline" | "call-outline" | "office-building-outline";

interface ProfileFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  icon?: IconSource;
  strong?: boolean;
  editable?: boolean;
}

export default function ProfileField({
  label,
  value,
  onChangeText,
  icon,
  strong = false,
  editable = true,
}: ProfileFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        {icon === "office-building-outline" ? (
          <MaterialCommunityIcons name={icon} size={16} color="#526070" />
        ) : icon ? (
          <Ionicons name={icon} size={16} color="#526070" />
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          style={[styles.value, strong && styles.valueStrong]}
          placeholderTextColor="#74777F"
        />
        <View style={styles.grow} />
        {icon === "office-building-outline" ? (
          <MaterialCommunityIcons name="office-building-outline" size={16} color="#526070" />
        ) : (
          <Ionicons name="pencil" size={16} color="#9AA6B2" />
        )}
      </View>
    </View>
  );
}

