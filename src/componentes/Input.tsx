import React, { useState } from "react";
import { TextInput, StyleSheet, Text, View, TouchableOpacity, Platform, TouchableWithoutFeedback, FlatList } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import { Eye, EyeOff } from "lucide-react-native";
import { useGlobalStyles } from "../estilos/GlobalStyles";

interface Props {
    label?: string;
    disabled?: boolean;
    secureTextEntry?: boolean;
    data?: string[];
    value: string;
    onChangeText?: (text: string) => void;
    onSelectItem?: (item: string) => void;
    style?: object;
    placeholder?: string;
}

export default function CustomInput({
    label,
    style,
    secureTextEntry,
    disabled,
    data = [],
    value,
    onChangeText,
    onSelectItem,
    placeholder,
    ...props
}: Props) {
    const { isDark } = useThemeCustom();
    const styles = stylesLocal();
    const [showPassword, setShowPassword] = useState(false);
    const [filteredData, setFilteredData] = useState<string[]>([]);
    const [showList, setShowList] = useState(false);

    const handleChange = (text: string) => {
        onChangeText(text);
        if (data.length > 0 && text.length > 0) {
            const filtered = data.filter((item) =>
                item.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
            setShowList(true);
        } else {
            setShowList(false);
        }
    };

    const handleSelect = (item: string) => {
        onChangeText?.(item);
        onSelectItem?.(item);
        setShowList(false);
    };

    return (
        <>
            <View style={[styles.container, style, disabled && { opacity: 0.6 }]}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={isDark ? darkColors.texto : lightColors.texto}
                    style={[styles.input, { cursor: disabled ? "not-allowed" : "pointer" }]}
                    secureTextEntry={secureTextEntry && !showPassword}
                    editable={!disabled}
                    value={value}
                    onChangeText={handleChange}
                    onFocus={() => {
                        if (data.length > 0 && value?.length > 0) setShowList(true);
                    }}
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
            {showList && filteredData.length > 0 && (
                <View style={styles.dropdown}>
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ overflow: "visible", zIndex: 1 }}
                        data={filteredData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => handleSelect(item)}
                            >
                                <Text
                                    style={{
                                        color: isDark
                                            ? darkColors.texto
                                            : lightColors.texto,
                                    }}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </>
    );
}

const stylesLocal = () => {
    const { isDark } = useThemeCustom();
    const stylesGlobal = useGlobalStyles();
    const colors = isDark ? darkColors : lightColors;

    return StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.linea,
            borderRadius: 5,
            marginVertical: 10,
            backgroundColor: colors.backgroundBar,
        },
        input: {
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            color: colors.texto,
            fontSize: stylesGlobal.texto.fontSize,
            width: "100%",
        },
        iconContainer: {
            paddingHorizontal: 8,
        },
        dropdown: {
            position: "absolute",
            top: 55,
            left: 0,
            right: 0,
            backgroundColor: colors.backgroundBar,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.linea,
            maxHeight: 150,
            zIndex: 9999,
            elevation: 5,
        },
        item: {
            backgroundColor: colors.backgroundBar,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.linea,
        },
    });
};
