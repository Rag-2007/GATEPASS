import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

import { styles } from "./SearchBar.styles";

interface SearchBarProps {
  placeholder: string;
  elevated?: boolean;
  value: string;
  onChangeText: (value: string) => void;
}

export default function SearchBar({
  placeholder,
  elevated = false,
  value,
  onChangeText,
}: SearchBarProps) {
  return (
    <View style={[styles.container, elevated && styles.elevated]}>
      <Ionicons name="search-outline" size={21} color="#44474E" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        style={styles.input}
        autoCorrect={false}
      />
    </View>
  );
}

