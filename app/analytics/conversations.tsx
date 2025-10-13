// app/analytics/conversations.tsx
import { supabase } from "@/lib/supabase";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

// Small card component
const Card: React.FC<{ title: string; value?: string | number; children?: React.ReactNode }>=({ title, value, children })=>{
  return (
    <View style={{ backgroundColor: "#0f172a", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#1f2937" }}>
      <Text style={{ color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>{title}</Text>
      {value !== undefined ? (
        <Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>{value}</Text>
      ) : children}
    </View>
  );
};

export default function ConversationsAnalytics() {
  const [kpis, setKpis] = useState<{ sessions_today?: number; users_today?: number; avg_latency_today?: number } | null>(null);
  const [sessionsDaily, setSessionsDaily] = useState<Array<{ ddate: string; sessions: number }>>([]);
  const [usersDaily, setUsersDaily] = useState<Array<{ ddate: string; users: number }>>([]);
  const [latencyDaily, setLatencyDaily] = useState<Array<{ ddate: string; avg_latency_ms: number }>>([]);
  const [keywords, setKeywords] = useState<Array<{ token: string; cnt: number }>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const screenWidth = Dimensions.get("window").width - 24;
// Coerce to finite numbers and pad empty datasets to prevent RNSVG crashes
const num = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const padChart = (labels: string[], data: number[]) => {
  const clean = data.map(num);
  if (labels.length === 0 || clean.length === 0) {
    return { labels: ["—"], datasets: [{ data: [0] }] };
  }
  // if everything is 0, still safe to render
  return { labels, datasets: [{ data: clean }] };
};

  async function fetchAll() {
    setError(null);
    
    // Updated KPI fetch with maybeSingle()
    const { data: kpi, error: kpiErr } = await supabase
      .from("analytics_conv_kpis")
      .select("sessions_today,users_today,avg_latency_today")
      .eq("id", true)
      .maybeSingle();

    if (kpiErr) setError(kpiErr.message);
    else setKpis(kpi ?? { sessions_today: 0, users_today: 0, avg_latency_today: null });

    // Fetch other data
    const [sessRes, userRes, latRes, kwRes] = await Promise.all([
      supabase.from("analytics_conv_sessions_daily").select("ddate,sessions").order("ddate", { ascending: true }),
      supabase.from("analytics_conv_users_daily").select("ddate,users").order("ddate", { ascending: true }),
      supabase.from("analytics_conv_latency_daily").select("ddate,avg_latency_ms").order("ddate", { ascending: true }),
      supabase.from("analytics_conv_keywords").select("token,cnt").order("cnt", { ascending: false }).limit(15),
    ]);

    if (sessRes.error) setError(prev => prev ?? sessRes.error!.message); else setSessionsDaily(sessRes.data || []);
    if (userRes.error) setError(prev => prev ?? userRes.error!.message); else setUsersDaily(userRes.data || []);
    if (latRes.error) setError(prev => prev ?? latRes.error!.message); else setLatencyDaily(latRes.data || []);
    if (kwRes.error) setError(prev => prev ?? kwRes.error!.message); else setKeywords(kwRes.data || []);
  }

  useEffect(() => { fetchAll(); }, []);

  const onRefresh = async () => { setRefreshing(true); await fetchAll(); setRefreshing(false); };

  const sessionsChart = useMemo(() => {
  const labels = sessionsDaily
    .filter(r => r?.ddate)
    .map(r => new Date(r.ddate).toLocaleDateString());
  const data = sessionsDaily
    .filter(r => r?.ddate)
    .map(r => num(r.sessions));
  return padChart(labels, data);
}, [sessionsDaily]);

const usersChart = useMemo(() => {
  const labels = usersDaily
    .filter(r => r?.ddate)
    .map(r => new Date(r.ddate).toLocaleDateString());
  const data = usersDaily
    .filter(r => r?.ddate)
    .map(r => num(r.users));
  return padChart(labels, data);
}, [usersDaily]);

const latencyChart = useMemo(() => {
  const labels = latencyDaily
    .filter(r => r?.ddate)
    .map(r => new Date(r.ddate).toLocaleDateString());
  const data = latencyDaily
    .filter(r => r?.ddate)
    .map(r => num(r.avg_latency_ms));
  return padChart(labels, data);
}, [latencyDaily]);

const kwChart = useMemo(() => {
  const labels = keywords
    .filter(k => k?.token)
    .map(k => (k.token.length > 10 ? k.token.slice(0, 10) + "…" : k.token));
  const data = keywords
    .filter(k => k?.token)
    .map(k => num(k.cnt));
  return padChart(labels, data);
}, [keywords]);


  const chartCfg = {
    backgroundGradientFrom: "#0b1220",
    backgroundGradientTo: "#0b1220",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    labelColor: (opacity = 1) => `rgba(203,213,225,${opacity})`,
    propsForBackgroundLines: { stroke: "#1f2937" },
    propsForDots: { r: "3" },
  } as const;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0b1220", padding: 12 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}>
      <View style={styles.container}>
        <Text style={styles.title}>Conversations Analytics</Text>
        <Text style={styles.subtitle}>Monitor chat interactions here</Text>
      </View>

      {error && (
        <View style={{ backgroundColor: "#7f1d1d", padding: 12, borderRadius: 12, marginBottom: 12 }}>
          <Text style={{ color: "#fecaca" }}>Error: {error}</Text>
        </View>
      )}

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Card title="Sessions (Today)" value={kpis?.sessions_today ?? "—"} />
        </View>
        <View style={{ flex: 1 }}>
          <Card title="Users (Today)" value={kpis?.users_today ?? "—"} />
        </View>
      </View>
      <Card title="Avg Latency Today (ms)" value={kpis?.avg_latency_today?.toFixed ? kpis.avg_latency_today.toFixed(0) : "—"} />

      <Card title="Sessions by Day">
        <LineChart data={sessionsChart} width={screenWidth} height={220} chartConfig={chartCfg} bezier style={{ borderRadius: 12 }} />
      </Card>

      <Card title="Users by Day">
        <LineChart data={usersChart} width={screenWidth} height={220} chartConfig={chartCfg} bezier style={{ borderRadius: 12 }} />
      </Card>

      <Card title="Avg Latency by Day (ms)">
        <LineChart data={latencyChart} width={screenWidth} height={220} chartConfig={chartCfg} style={{ borderRadius: 12 }} />
      </Card>

      <Card title="Top Keywords (last load)">
        <BarChart
          data={kwChart}
          width={screenWidth}
          height={220}
          chartConfig={chartCfg}
          fromZero
          style={{ borderRadius: 12 }}
          yAxisLabel=""
          yAxisSuffix=""
        />
      </Card>

      <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 8 }}>
        Pull to refresh. Source: Supabase tables populated by Lambda from Athena views.
      </Text>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
  },
});
