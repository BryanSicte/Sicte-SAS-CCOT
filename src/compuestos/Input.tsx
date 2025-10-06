import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import CustomInput from "../componentes/Input";

interface Props extends TextInputProps {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    containerStyle?: ViewStyle;
    disabled?: boolean;
}

export default function LabeledInput({
    label,
    icon = "calendar-outline",
    containerStyle,
    style,
    disabled,
    ...textInputProps
}: Props) {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const stylesGlobal = useGlobalStyles();
    const styles = stylesLocal();

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[stylesGlobal.texto, styles.label]}>{label}</Text>
            <View style={[styles.inputWrapper]}>
                {icon && <Ionicons name={icon} size={22} color={colors.icono} style={styles.icon} />}
                <CustomInput placeholder="Selecciona la fecha" style={{ flex: 1 }} disabled={disabled} {...textInputProps} />
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
            borderRadius: 8,
            paddingHorizontal: 10,
            minHeight: 55,
        },
        icon: {
            marginRight: 8,
        },
    });
};
