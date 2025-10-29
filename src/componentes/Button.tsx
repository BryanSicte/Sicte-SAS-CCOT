import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Pressable } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import { darkColors, lightColors } from "../estilos/Colors";

type Variant = String;

interface Props {
    label: string;
    onPress: () => void;
    children?: any;
    variant?: Variant;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    loading?: boolean;
}

export default function CustomButton({
    label,
    onPress,
    children,
    variant = "primary",
    style,
    textStyle,
    disabled,
    loading
}: Props) {
    const { isDark } = useThemeCustom();
    const styles = stylesLocal(variant, disabled);
    const colors = isDark ? darkColors : lightColors;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed, hovered }: any) => [
                styles.base,
                style,
                !disabled && hovered && { backgroundColor: colors.backgroundHover },
                !disabled && pressed && { backgroundColor: colors.backgroundPressed },
            ]}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : children ? (
                children
            ) : (
                (state: any) => (
                    <Text style={[styles.label, textStyle, disabled && { color: "#b0b0b0" }, { color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : "#fff" }]}>
                        {label}
                    </Text>
                )
            )}
        </Pressable>
    );
}

const stylesLocal = (variant, disabled) => {
    const { isDark } = useThemeCustom();
    const stylesGlobal = useGlobalStyles();

    const colorBase =
        variant === "primary"
            ? "#09238E"
            : variant === "secondary"
                ? "#098E12"
                : variant === "danger"
                    ? "#E63946"
                    : variant === "gris"
                        ? "#868686"
                        : null;

    const colorDisabled = isDark ? "#444" : "#ccc";

    return StyleSheet.create({
        base: {
            cursor: disabled ? "not-allowed" : "pointer",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 8,
            alignItems: "center",
            opacity: disabled ? 0.8 : 1,
            backgroundColor: disabled ? colorDisabled : colorBase,
        },
        label: {
            fontSize: stylesGlobal.texto.fontSize,
            fontWeight: "600",
            color: "#fff",
        },
    });
};
