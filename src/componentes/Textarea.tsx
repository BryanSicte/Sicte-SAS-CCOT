import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import { useGlobalStyles } from "../estilos/GlobalStyles";

interface Props {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    disabled?: boolean;
    maxLength?: number;
    style?: object;
    numberOfLines?: number;
    showCount?: boolean;
}

export default function CustomTextarea({
    label,
    placeholder,
    value,
    onChangeText,
    disabled = false,
    maxLength = 500,
    numberOfLines = 4,
    style,
    showCount = true,
}: Props) {
    const { isDark } = useThemeCustom();
    const stylesGlobal = useGlobalStyles();
    const colors = isDark ? darkColors : lightColors;
    const styles = stylesLocal(colors, stylesGlobal);

    const [height, setHeight] = useState<number>(numberOfLines * 25);

    return (
        <View style={[styles.container]}>
            {label && <Text style={[styles.label]}>{label}</Text>}

            <View style={styles.textareaWrapper}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={colors.texto || "#888"}
                    value={value}
                    onChangeText={onChangeText}
                    editable={!disabled}
                    multiline
                    numberOfLines={numberOfLines}
                    maxLength={maxLength}
                    style={[
                        style,
                        styles.textarea,
                        { height },
                        disabled && { opacity: 0.6 },
                    ]}
                    onContentSizeChange={(event) =>
                        setHeight(event.nativeEvent.contentSize.height)
                    }
                />

                {showCount && (
                    <Text style={styles.count}>
                        {value.length}/{maxLength}
                    </Text>
                )}
            </View>
        </View>
    );
}

const stylesLocal = (colors: any, stylesGlobal: any) =>
    StyleSheet.create({
        container: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.linea,
            borderRadius: 5,
            marginVertical: 12,
            backgroundColor: colors.backgroundBar,
            width: "calc(100% - 22px - 8px)",
        },
        label: {
            color: colors.texto,
            marginBottom: 5,
            fontSize: stylesGlobal.texto.fontSize,
            fontWeight: "500",
        },
        textareaWrapper: {
            position: "relative",
            width: "100%",
        },
        textarea: {
            backgroundColor: colors.backgroundContainer,
            borderWidth: 1,
            borderColor: colors.linea,
            padding: 10,
            fontSize: stylesGlobal.texto.fontSize,
            color: colors.texto,
            minHeight: 80,
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            width: "100%",
        },
        count: {
            position: "absolute",
            bottom: 6,
            right: 10,
            fontSize: 12,
            color: colors.textoSecundario || "#aaa",
            backgroundColor: "transparent",
        },
    });
