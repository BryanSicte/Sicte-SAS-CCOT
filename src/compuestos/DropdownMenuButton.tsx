import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import CustomButton from "../componentes/Button";

interface MenuOption {
    label: string;
    screen: string;
}

interface Props {
    options: MenuOption[];
    pageSelect: String;
    onSelect: (option: MenuOption) => void;
    style?: any;
}

export default function DropdownMenuButton({ options, pageSelect, onSelect, style }: Props) {
    const styles = stylesLocal();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (opt: MenuOption) => {
        setIsOpen(false);
        onSelect(opt);
    };

    return (
        <View style={[{ position: "relative" }, style]}>

            <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
                <CustomButton
                    onPress={() => setIsOpen(!isOpen)}
                >
                    {(state: any) => (
                        <Ionicons
                            name={isOpen ? "close-outline" : "menu-outline"}
                            size={18}
                            color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : "#fff"}
                        />
                    )}
                </CustomButton>
                <Text
                    style={{
                        marginLeft: 10,
                        fontSize: 20,
                        color: colors.texto,
                        fontWeight: "500",
                    }}
                >
                    {pageSelect ? pageSelect : "Selecciona una opción"}
                </Text>
            </Pressable>

            {isOpen && (
                <View style={[styles.dropdown, { backgroundColor: colors.backgroundBar }]}>
                    {options.map((opt) => (
                        <Pressable
                            key={opt.screen}
                            style={({ pressed, hovered }: any) => [
                                styles.option,
                                hovered && { backgroundColor: colors.backgroundHover },
                                pressed && { backgroundColor: colors.backgroundPressed },
                            ]}
                            onPress={() => handleSelect(opt)}
                        >
                            {({ pressed, hovered }: any) => (
                                <Text
                                    style={[
                                        styles.optionText,
                                        { color: pressed ? colors.textoPressed : hovered ? colors.textoHover : colors.texto },
                                    ]}
                                >
                                    {opt.label}
                                </Text>
                            )}
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

const stylesLocal = () => {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    return StyleSheet.create({
        dropdown: {
            position: "absolute",
            top: 40,
            left: 0,
            elevation: 10,
            marginTop: 5,
            paddingVertical: 10,
            backgroundColor: colors.backgroundBar,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 3,
            maxWidth: 300,
        },
        option: {
            paddingVertical: 10,
            paddingHorizontal: 15,
        },
        optionText: {
            fontSize: 15,
            color: colors.texto,
        },
    });
};
