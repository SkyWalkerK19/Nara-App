import { useAuth } from "@/context/AuthContext";
import { Redirect, Slot } from "expo-router";

export default function AuthLayout() {
  const auth = useAuth();
  if (!auth) return null; // provider not ready yet

  const { session, loading } = auth;
  if (loading) return null;        // show spinner if you want
  if (session) return <Redirect href="/home" />; // already signed in

  return <Slot />; // sign-in, sign-up screens render here
}
