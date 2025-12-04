import React, { useEffect, useRef, useState } from "react";
import { TextInput, StyleSheet, Text, View, TouchableOpacity, Platform, TouchableWithoutFeedback, FlatList, Pressable } from "react-native";
import { useThemeCustom } from "../../contexto/ThemeContext";
import { darkColors, lightColors } from "../../estilos/Colors";
import { Eye, EyeOff } from "lucide-react-native";
import { useGlobalStyles } from "../../estilos/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    label?: string;
    icon?: string;
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
    icon,
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
    const colors = isDark ? darkColors : lightColors;
    const containerRef = useRef<View>(null);

    useEffect(() => {
        if (Platform.OS === "web") {
            const handleClickOutside = (event) => {
                if (Platform.OS !== "web") return;

                if (containerRef.current && !containerRef.current.contains?.(event.target)) {
                    setShowList(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
                document.removeEventListener("touchstart", handleClickOutside);
            };
        }
    }, []);

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
                        if (data.length > 0) {
                            if (value?.length > 0) {
                                const filtered = data.filter((item) =>
                                    item.toLowerCase().includes(value.toLowerCase())
                                );
                                setFilteredData(filtered);
                            } else {
                                setFilteredData(data);
                            }
                            setShowList(true);
                        }
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
                <View style={styles.dropdown} ref={containerRef}>
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={filteredData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => handleSelect(item)}
                                style={({ pressed, hovered }: any) => [
                                    styles.item,
                                    hovered && { backgroundColor: colors.backgroundHover },
                                    pressed && { backgroundColor: colors.backgroundPressed },
                                ]}
                            >
                                {(state: any) => (
                                    <>
                                        <Text
                                            style={{ color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : colors.texto }}
                                        >
                                            {item}
                                        </Text>
                                    </>
                                )}
                            </Pressable>
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
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.linea,
            borderRadius: 5,
            marginVertical: 5,
            backgroundColor: colors.backgroundBar,
        },
        icon: {
            marginRight: 8,
        },
        input: {
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            color: colors.texto,
            fontSize: stylesGlobal.texto.fontSize,
            backgroundColor: colors.backgroundContainer,
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
