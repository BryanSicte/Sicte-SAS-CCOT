import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import CustomDatePicker from "../componentes/ui/Date";

interface Props {
    label: string;
    date: Date | null;
    onChange: (date: Date | null) => void;
    mode?: "date" | "time" | "datetime";
    showSeconds?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    containerStyle?: ViewStyle;
    disabled?: boolean;
}

export default function LabeledDatePicker({
    label,
    date,
    onChange,
    mode = "date",
    showSeconds = false,
    icon = "calendar-outline",
    containerStyle,
    disabled,
}: Props) {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const stylesGlobal = useGlobalStyles();
    const styles = stylesLocal();

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[stylesGlobal.texto, styles.label]}>{label}</Text>
            <View style={[styles.inputWrapper]}>
                <Ionicons name={icon} size={22} color={colors.icono} style={styles.icon} />
                <CustomDatePicker
                    date={date}
                    onChange={onChange}
                    mode={mode}
                    showSeconds={showSeconds}
                    disabled={disabled}
                />
            </View>
        </View>
    );
}

const stylesLocal = () => {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const stylesGlobal = useGlobalStyles();

    return StyleSheet.create({
        container: {
            marginBottom: 15,
        },
        label: {
            marginBottom: 5,
            fontWeight: "500",
        },
        inputWrapper: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.linea,
            backgroundColor: colors.backgroundBar,
            borderRadius: 8,
            paddingHorizontal: 10,
            minHeight: 55,
        },
        icon: {
            marginRight: 8,
        },
    });
};