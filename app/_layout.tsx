import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="index" // Explicitly set initial route
      />
    </AuthProvider>
  );
}
