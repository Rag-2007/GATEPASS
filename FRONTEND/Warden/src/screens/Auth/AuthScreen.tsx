import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native';

import { portalImages } from '../../assets';
import { loginWarden } from '../../api/wardenApi';
import { saveTokens } from '../../utils/tokenStore';
import { styles } from './AuthScreen.styles';

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { accessToken, refreshToken, UserID } = await loginWarden(email.trim(), password);
      await saveTokens(accessToken, refreshToken, UserID);
      router.replace('/dashboard' as Href);
    } catch (e: any) {
      setError(e?.message ?? 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Image
          source={portalImages.instituteLogo}
          resizeMode="contain"
          style={styles.logo}
        />

        <Text style={styles.title}>Warden Login</Text>
        <Text style={styles.subtitle}>Hostel Gatepass Portal</Text>

        <View style={styles.form}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Warden ID / Email</Text>
          </View>
          <View style={styles.inputBox}>
            <MaterialCommunityIcons name="badge-account" size={24} color="#7A7D85" />
            <TextInput
              accessibilityLabel="Warden ID or Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your ID or email"
              placeholderTextColor="#9DA1A8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.label}>Password</Text>
          </View>
          <View style={styles.inputBox}>
            <MaterialCommunityIcons name="lock" size={24} color="#7A7D85" />
            <TextInput
              accessibilityLabel="Password"
              placeholder="Enter your password"
              placeholderTextColor="#9DA1A8"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error ? (
            <Text style={{ color: '#BA1A1A', fontSize: 13, marginBottom: 8, textAlign: 'center' }}>
              {error}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.signInButton,
              pressed && styles.signInButtonPressed,
              loading && { opacity: 0.7 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInText}>Sign In</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

