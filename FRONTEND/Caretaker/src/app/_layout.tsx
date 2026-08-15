import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { getAccessToken } from "../utils/tokenStore";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      const isLoggedIn = !!token;
      setHydrated(true);

      const firstSeg = segments[0] as string | undefined;
      const onAuthScreen = !firstSeg || firstSeg === "index" || firstSeg === "auth";

      if (!isLoggedIn && !onAuthScreen) {
        router.replace("/");
      } else if (isLoggedIn && onAuthScreen) {
        router.replace("/dashboard" as never);
      }
    })();
  }, [segments]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" }}>
        <ActivityIndicator size="large" color="#002147" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthGuard>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Caretaker Login", headerShown: false }} />
        <Stack.Screen name="auth" options={{ title: "Caretaker Login", headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ title: "Caretaker", headerShown: false }} />
        <Stack.Screen name="approvals" options={{ title: "Approvals", headerShown: false }} />
        <Stack.Screen name="currently-out" options={{ title: "Currently Out", headerShown: false }} />
        <Stack.Screen name="students" options={{ title: "Students", headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Profile", headerShown: false }} />
      </Stack>
    </AuthGuard>
  );
}

