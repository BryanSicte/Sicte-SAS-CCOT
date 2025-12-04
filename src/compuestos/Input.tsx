import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import CustomInput from "../componentes/ui/Input";

interface Props extends TextInputProps {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    containerStyle?: ViewStyle;
    disabled?: boolean;
    value: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    data?: string[];
    onSelectItem?: (item: string) => void;
}

export default function LabeledInput({
    label,
    icon = "calendar-outline",
    containerStyle,
    value,
    onChangeText,
    disabled,
    placeholder,
    data = [],
    onSelectItem,
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
                <CustomInput placeholder={placeholder} style={{ flex: 1 }} disabled={disabled} value={value} onChangeText={onChangeText} data={data} onSelectItem={onSelectItem}/>
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
            position: "relative",
        },
        label: {
            marginBottom: 5,
            fontWeight: "500",
        },
        inputWrapper: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            backgroundColor: colors.backgroundBar,
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
