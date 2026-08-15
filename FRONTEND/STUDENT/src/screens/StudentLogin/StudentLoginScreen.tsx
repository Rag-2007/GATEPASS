import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import studentLogo from "../../assets/images/login/student-logo.png";
import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import { useAuth } from "../../store/auth.store";
import { styles } from "./StudentLoginScreen.styles";

export default function StudentLoginScreen() {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const shellWidth = Math.min(width, 430);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Login failed. Please try again.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.shell, { width: shellWidth, paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <View style={styles.loginPanel}>
          <Image source={studentLogo} style={styles.logo} contentFit="contain" />

          <View style={styles.headingBlock}>
            <Text style={styles.title}>Student Login</Text>
            <Text style={styles.subtitle}>Hostel Gatepass Portal</Text>
          </View>

          <View style={styles.form}>
            {error ? (
              <View style={{ backgroundColor: "#3A0A0A", borderRadius: 10, padding: 12, marginBottom: 4 }}>
                <Text style={{ color: "#FF8A80", fontSize: 13, textAlign: "center" }}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Student ID / Email</Text>
              <View style={styles.inputWrap}>
                <GatepassSymbol
                  name="person.text.rectangle"
                  fallback=""
                  size={20}
                  color="#74777F"
                  style={styles.inputIcon}
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  placeholderTextColor="#A7A9AF"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.label}>Password</Text>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </View>
              <View style={styles.inputWrap}>
                <GatepassSymbol
                  name="lock.fill"
                  fallback=""
                  size={20}
                  color="#74777F"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#A7A9AF"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
              </View>
            </View>

            <Pressable
              onPress={handleSignIn}
              disabled={loading}
              style={({ pressed }) => [
                styles.signInButton,
                (pressed || loading) && styles.buttonPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

