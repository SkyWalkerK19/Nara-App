import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { Link } from 'expo-router';
import { Button, Pressable, Text, View } from 'react-native';

export default function Home() {
  const auth = useAuth();

  return (
    <RequireAuth>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Home</Text>
        
        <View style={{ marginTop: 12 }}>
          <Link href="/analytics" asChild>
            <Pressable
              style={{
                backgroundColor: "#1f2937",
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#334155",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "700", textAlign: "center" }}>
                Open Analytics
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 12, textAlign: "center", marginTop: 4 }}>
                Orders & Conversations
              </Text>
            </Pressable>
          </Link>
        </View>

        <Button title="Sign out" onPress={auth?.signOut} />
      </View>
    </RequireAuth>
  );
}
