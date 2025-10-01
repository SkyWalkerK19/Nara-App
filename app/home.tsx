import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { Button, Text, View } from "react-native";

export default function Home() {
  const auth = useAuth();

  return (
    <RequireAuth>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <Text>Home</Text>
        <Button title="Sign out" onPress={auth?.signOut} />
      </View>
    </RequireAuth>
  );
}
