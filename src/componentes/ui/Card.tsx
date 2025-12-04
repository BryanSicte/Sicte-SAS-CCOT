// src/componentes/ui/InfoCard.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable, ViewStyle, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeCustom } from "../../contexto/ThemeContext";
import { lightColors, darkColors } from "../../estilos/Colors";

type Row = { label: string; value: React.ReactNode };

interface Props {
    iconName?: React.ComponentProps<typeof Ionicons>["name"];
    data: Row[];
    onPress?: () => void;
    style?: ViewStyle;
}

export default function Card({ iconName = "server-outline", data, onPress, style }: Props) {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [
                styles.base,
                {
                    backgroundColor: colors?.backgroundBar ?? "#fff",
                    borderColor: colors?.linea ?? "#e5e7eb",
                    opacity: onPress && pressed ? 0.96 : 1,
                },
                style,
            ]}
        >
            <View style={styles.iconColumn}>
                <Ionicons name={iconName} size={28} color={colors?.texto ?? "#111"} />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.linea ?? "#e5e7eb" }]} />

            <View style={styles.infoColumn}>
                {data.map((item) => (
                    <View key={item.label} style={styles.row}>
                        <Text style={[styles.label, { color: colors?.texto ?? "#6b7280" }]}>{item.label}:</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                            style={{ flex: 1 }}
                        >
                            <Text style={[styles.value, { color: colors?.texto ?? "#111", flex: 1 }]}>
                                {item.value}
                            </Text>
                        </ScrollView>
                    </View>
                ))}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
        gap: 12,
    },
    iconColumn: {
        width: 32,
        alignItems: "center"
    },
    divider: {
        width: 1,
        height: "100%"
    },
    infoColumn: {
        flex: 1,
        gap: 6
    },
    row: {
        flexDirection: "row",
        gap: 6,
        alignItems: "flex-start"
    },
    label: {
        fontWeight: "600",
        fontSize: 14
    },
    value: {
        flex: 1,
        fontSize: 14
    },
});
