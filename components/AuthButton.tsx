import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";


type BtnProps = {
title: string;
onPress: () => void;
disabled?: boolean;
loading?: boolean;
variant?: "primary" | "ghost";
};


export const AuthButton: React.FC<BtnProps> = ({ title, onPress, disabled, loading, variant = "primary" }) => {
const base = {
paddingVertical: 14,
alignItems: "center" as const,
borderRadius: 12,
borderWidth: variant === "ghost" ? 1 : 0,
borderColor: "#d1d5db",
marginVertical: 6,
};
const bg = variant === "primary" ? { backgroundColor: "#111827" } : { backgroundColor: "transparent" };
const textColor = variant === "primary" ? "#ffffff" : "#111827";
return (
<TouchableOpacity onPress={onPress} disabled={disabled || loading} style={{ ...base, ...bg, opacity: disabled ? 0.6 : 1 }}>
{loading ? <ActivityIndicator /> : <Text style={{ color: textColor, fontWeight: "700" }}>{title}</Text>}
</TouchableOpacity>
);
};