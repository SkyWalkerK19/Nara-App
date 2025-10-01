import React from "react";
import { Text, TextInput, View } from "react-native";

type Props = {
label: string;
value: string;
onChangeText: (t: string) => void;
placeholder?: string;
secureTextEntry?: boolean;
autoCapitalize?: "none" | "sentences" | "words" | "characters";
keyboardType?: "default" | "email-address";
error?: string | null;
};


export const AuthTextField: React.FC<Props> = ({
label,
value,
onChangeText,
placeholder,
secureTextEntry,
autoCapitalize = "none",
keyboardType = "default",
error,
}) => {
return (
<View style={{ marginBottom: 12 }}>
<Text style={{ marginBottom: 6, fontWeight: "600" }}>{label}</Text>
<TextInput
value={value}
onChangeText={onChangeText}
placeholder={placeholder}
autoCapitalize={autoCapitalize}
keyboardType={keyboardType}
secureTextEntry={secureTextEntry}
style={{
borderWidth: 1,
borderColor: error ? "#ef4444" : "#d1d5db",
borderRadius: 10,
padding: 12,
fontSize: 16,
}}
/>
{!!error && (
<Text style={{ color: "#ef4444", marginTop: 4, fontSize: 12 }}>{error}</Text>
)}
</View>
);
};