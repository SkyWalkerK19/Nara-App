import { useRouter } from "expo-router"; // Add this
import React from "react";
import { Alert, View } from "react-native";

import { AuthButton } from "@/components/AuthButton";
import { AuthTextField } from "@/components/AuthTextField";
import { useAuth } from "@/context/AuthContext";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const router = useRouter(); // Add this

  const [fullName, setFullName] = React.useState("");
  const [teamName, setTeamName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    fullName?: string;
    teamName?: string;
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!fullName) next.fullName = "Full name is required";
    if (!teamName) next.teamName = "Team name is required";
    if (!email) {
      next.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      next.email = "Please enter a valid email";
    }
    if (!password || password.length < 6) next.password = "Min 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      setBusy(true);
      await signUp({
        email: email.trim(),
        password,
        data: {
          full_name: fullName.trim(),
          team_name: teamName.trim(),
          display_name: fullName.trim(),
        },
      });

      // Add success message or navigation
      Alert.alert(
        "Success!",
        "Account created successfully. Please check your email for verification.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.message ?? "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <AuthTextField
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="John Doe" // or "Enter your full name"
        error={errors.fullName || null}
      />
      <AuthTextField
        label="Team Name"
        value={teamName}
        onChangeText={setTeamName}
        placeholder="e.g., Stir & Essence Ops"
        error={errors.teamName || null}
      />
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
      <AuthButton title="Create Account" onPress={onSubmit} loading={busy} />
    </View>
  );
}
