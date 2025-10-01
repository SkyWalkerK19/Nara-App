import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (options: {
    email: string;
    password: string;
    data?: {
      full_name?: string;
      team_name?: string;
      display_name?: string;
    };
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>; // Add this
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data.session ?? null);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Auth error');
          setLoading(false);
        }
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (mounted) {
        if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
          setError(null);
        }
        setSession(s ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      error,
      signUp: async (options: {
        email: string;
        password: string;
        data?: {
          full_name?: string;
          team_name?: string;
          display_name?: string;
        };
      }) => {
        setError(null);
        const { data, error } = await supabase.auth.signUp({
          email: options.email,
          password: options.password,
          options: {
            data: options.data,
          },
        });

        if (error) {
          throw error;
        }

        // If email confirmation is required, the user won't be signed in immediately
        // The session will be null until they confirm their email
      },
      signIn: async (email: string, password: string) => { // Add this function
        setError(null);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        // The session will be automatically set via onAuthStateChange
      },
      signOut: async () => {
        try {
          setLoading(true);
          setError(null);
          await supabase.auth.signOut();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Sign out failed');
          setLoading(false);
        }
      },
    }),
    [session, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
