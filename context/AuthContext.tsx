// context/AuthContext.tsx

import { supabase } from '@/lib/supabase';
import type { User as AppUser } from '@/types';
import React, {
    createContext,
    FC,
    ReactNode,
    useContext,
    useEffect,
    useState
} from 'react';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDbUser(authUser: any) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();
    setUser(profile ?? null);
  }

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const authUser = data?.session?.user ?? null;
      if (authUser) {
        await fetchDbUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user ?? null;
      if (authUser) {
        fetchDbUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = (email: string, password: string) =>
    supabase.auth.signUp({ email, password });
  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });
  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
