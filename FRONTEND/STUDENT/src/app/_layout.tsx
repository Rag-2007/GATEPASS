import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../store/auth.store";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!state.isHydrated) return;

    const firstSeg = segments[0] as string | undefined;
    const inAuthGroup = !firstSeg || firstSeg === "index";

    if (!state.isLoggedIn && !inAuthGroup) {
      router.replace("/");
    } else if (state.isLoggedIn && inAuthGroup) {
      router.replace("/passes" as never);
    }
  }, [state.isHydrated, state.isLoggedIn, segments]);

  if (!state.isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000A1E" }}>
        <ActivityIndicator size="large" color="#708AB5" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="passes" />
          <Stack.Screen name="track-pass" />
          <Stack.Screen name="apply" />
          <Stack.Screen name="active-pass" />
          <Stack.Screen name="apply-form" />
          <Stack.Screen name="profile" />
        </Stack>
      </AuthGuard>
    </AuthProvider>
  );
}

