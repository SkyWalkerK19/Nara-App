// lib/supabase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto"; // keep this

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// SSR-safe noop storage for when window isn't available
const createNoopStorage = () => ({
  getItem: async (_key: string) => null,
  setItem: async (_key: string, _value: string) => {},
  removeItem: async (_key: string) => {},
});

// Choose storage per environment
const storage =
  Platform.OS === "web"
    ? (typeof window === "undefined" ? createNoopStorage() : window.localStorage)
    : AsyncStorage;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    persistSession: true,
    autoRefreshToken: true,
    // Only parse the URL on web; harmless on native but not needed
    detectSessionInUrl: Platform.OS === "web",
  },
});
