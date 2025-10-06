import React, { useState } from "react";
import { TextInput, StyleSheet, TextInputProps, View, TouchableOpacity, Platform } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import { Eye, EyeOff } from "lucide-react-native";
import { useGlobalStyles } from "../estilos/GlobalStyles";

interface Props extends TextInputProps {
    label?: string;
    disabled?: boolean;
}

export default function CustomInput({ label, style, secureTextEntry, disabled, ...props }: Props) {
    const { isDark } = useThemeCustom();
    const styles = stylesLocal();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, style, disabled && { opacity: 0.6 }]}>
            <TextInput
                placeholderTextColor={isDark ? darkColors.texto : lightColors.texto}
                style={[styles.input, { cursor: disabled ? "not-allowed" : "pointer" }]}
                secureTextEntry={secureTextEntry && !showPassword}
                editable={!disabled}
                {...(Platform.OS === "web" ? { disabled } : {})}
                {...props}
            />

            {secureTextEntry && (
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <EyeOff size={20} color={isDark ? darkColors.texto : lightColors.texto} />
                    ) : (
                        <Eye size={20} color={isDark ? darkColors.texto : lightColors.texto} />
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}

const stylesLocal = () => {
    const { isDark } = useThemeCustom();
    const stylesGlobal = useGlobalStyles();

    return StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: isDark ? darkColors.linea : lightColors.linea,
            borderRadius: 5,
            marginVertical: 10,
            backgroundColor: isDark ? darkColors.backgroundContainer : lightColors.backgroundContainer,
        },
        input: {
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            color: isDark ? darkColors.texto : lightColors.texto,
            fontSize: stylesGlobal.texto.fontSize,
        },
        iconContainer: {
            paddingHorizontal: 8,
        },
    });
};
