import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Pressable } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import { darkColors, lightColors } from "../estilos/Colors";

type Variant = String;

interface Props {
    label: string;
    onPress: () => void;
    variant?: Variant;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    loading?: boolean;
}

export default function CustomButton({
    label,
    onPress,
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
                hovered && { backgroundColor: colors.backgroundHover },
                pressed && { backgroundColor: colors.backgroundPressed },
            ]}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                (state: any) => (
                    <Text style={[styles.label, textStyle, { color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : "#fff" }]}>
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

    return StyleSheet.create({
        base: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 8,
            alignItems: "center",
            opacity: disabled ? 0.8 : 1,
            backgroundColor:
                variant === "primary" ? '#09238eff' :
                    variant === "secondary" ? '#098e12ff' :
                        variant === "danger" ? "#e63946" :
                            variant === "gris" ? "#868686ff" : null,
        },
        label: {
            fontSize: stylesGlobal.texto.fontSize,
            fontWeight: "600",
            color: "#fff",
        },
    });
};
