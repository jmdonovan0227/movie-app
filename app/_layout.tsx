import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  // using headerShown: false on tabs will hide header for all routes in the route group under (tabs)
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
