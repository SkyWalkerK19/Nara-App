import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { runEtl } from "../api/runEtl";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function onPress() {
    setLoading(true);
    setMsg("");
    try {
      const r = await runEtl();
      setMsg(`OK: ${r.ok} | total=${r.kpi} | by_year=${r.by_year} | by_major=${r.by_major}`);
    } catch (e: any) {
      setMsg(`Error: ${e?.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Pressable
        onPress={onPress}
        style={{ padding: 12, borderRadius: 10, borderWidth: 1, alignItems: "center" }}
        disabled={loading}
      >
        <Text>{loading ? "Running ETL…" : "Run ETL"}</Text>
      </Pressable>

      {loading && <ActivityIndicator />}
      {!!msg && <Text>{msg}</Text>}
    </View>
  );
}
