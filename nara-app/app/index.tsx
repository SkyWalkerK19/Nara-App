import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';


export default function Index() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setRole(data?.role ?? null);
      } catch (err) {
        console.error('❌ Failed to fetch role:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  if (!user) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading user...</ThemedText>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading user role...</ThemedText>
      </ThemedView>
    );
  }

  if (!role) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Role not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title">Welcome to Nara!</ThemedText>
      <ThemedText>User ID: {user.id}</ThemedText>
      <ThemedText>User Role: {role}</ThemedText>

      {role === 'server' && <ThemedText>🍽 Server dashboard coming soon...</ThemedText>}
      {role === 'bar' && <ThemedText>🍸 Bar staff screen incoming...</ThemedText>}
      {role === 'hookah' && <ThemedText>💨 Hookah zone will go here...</ThemedText>}
      {role === 'admin' && <ThemedText>🛠 Admin access detected...</ThemedText>}
    </ThemedView>
  );
}
