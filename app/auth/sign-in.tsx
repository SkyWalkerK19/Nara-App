// app/auth/sign-in.tsx
import { router } from "expo-router";
import React from "react";
import { Alert, View } from "react-native";

import { AuthButton } from "@/components/AuthButton";
import { AuthTextField } from "@/components/AuthTextField";
import { useAuth } from "@/context/AuthContext";

export default function SignInScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!email) next.email = "Email is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      setBusy(true);
      await signIn(email.trim(), password);
      // router.replace("/home"); // uncomment if you don't auto-redirect in provider
    } catch (e: any) {
      Alert.alert("Sign in failed", e?.message ?? "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <AuthTextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        error={errors.email || null}
      />
      <AuthTextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        error={errors.password || null}
      />
      <AuthButton title="Sign In" onPress={onSubmit} loading={busy} />
      <AuthButton
        title="Create Account"
        variant="ghost"
        onPress={() => router.push("/auth/sign-up")}
        disabled={busy}
      />
    </View>
  );
}
