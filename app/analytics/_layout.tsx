import { Tabs } from "expo-router";


export default function AnalyticsTabsLayout() {
return (
<Tabs
screenOptions={{
tabBarActiveTintColor: "#fff",
tabBarInactiveTintColor: "#94a3b8",
tabBarStyle: { backgroundColor: "#0b1220", borderTopColor: "#1f2937" },
headerStyle: { backgroundColor: "#0b1220" },
headerTitleStyle: { color: "#fff", fontWeight: "800" },
}}
>
<Tabs.Screen
name="index"
options={{
title: "Orders",
headerTitle: "Analytics · Orders",
tabBarLabel: "Orders",
}}
/>
<Tabs.Screen
name="conversations"
options={{
title: "Convos",
headerTitle: "Analytics · Conversations",
tabBarLabel: "Convos",
}}
/>
</Tabs>
);
}