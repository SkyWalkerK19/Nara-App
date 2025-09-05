// context/AuthContext.tsx

import { supabase } from '@/lib/supabase';
import type { User as AppUser } from '@/types';
import type { AuthContextType } from '@/types/AuthContextType';
import type { AuthProviderProps } from '@/types/AuthProviderProps';
import {
    createContext,
    FC,
    useContext,
    useEffect,
    useState
} from 'react';


const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDbUser(authUser: any) {
    const { data: chatData, error } = await supabase
  .from('chats')
  .insert({ created_by: authUser.id, is_group: false }) //may edit later
  .select()
  .single();
  if (error) {
    console.error('Error inserting chat:', error);
    return;
  }
if (chatData && !error) {
  // Now update user's chat_id to this new chat's ID:
  const { data: profile } = await supabase
    .from('users')
    .update({ chat_id: chatData.id }) // <--- use the actual chat's ID!
    .eq('id', user ? user.id : null)
    .select('*')
    .single();
  setUser(profile ?? null);
}

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
