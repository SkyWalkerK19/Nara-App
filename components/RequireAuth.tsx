import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth();
  if (!auth) return null;

  const { session, loading } = auth;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) return <Redirect href="/auth/sign-in" />;

  return <>{children}</>;
}
