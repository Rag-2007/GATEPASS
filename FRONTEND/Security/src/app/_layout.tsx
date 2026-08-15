import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="scanner" />
      <Stack.Screen name="scan-result" />
      <Stack.Screen name="track-pass" />
      <Stack.Screen name="apply" />
      <Stack.Screen name="active-pass" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}

