// app/auth/callback/index.tsx
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function AuthCallback() {
  const { code, next, redirect_to } = useLocalSearchParams<{ code?: string; next?: string; redirect_to?: string }>();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (typeof code === "string") {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          router.replace(
            next === "home"
              ? "/home"
              : next === "runEtlButton"
              ? "/runEtlButton"
              : redirect_to === "home"
              ? "/home"
              : redirect_to === "runEtlButton"
              ? "/runEtlButton"
              : "/"
          );
        } else {
          router.replace("/auth/sign-in");
        }
      } catch (e: any) {
        setErr(e?.message ?? "Auth failed");
      }
    })();
  }, [code]);

  if (err) return <View className="flex-1 items-center justify-center p-6"><Text>{err}</Text></View>;
  return <View className="flex-1 items-center justify-center"><ActivityIndicator /><Text>Finishing sign-in…</Text></View>;
}
