import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const { data, error } = await signUp(email, password);
    if (error) {
      Alert.alert('Signup error', error.message);
      return;
    }

    const userId = data?.user?.id;
    if (!userId) return;


    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!profile && !profileError) {
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, role: null });

      if (insertError) {
        console.error('❌ Failed to insert profile:', insertError);
      } else {
        console.log('✅ Profile row created with null role');
      }
    } else if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking profile:', profileError.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}
