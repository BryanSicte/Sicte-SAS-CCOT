import React from "react";
import RNPickerSelect, { Item } from "react-native-picker-select";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import { Platform, View } from "react-native";

interface Props {
    value: string | null;
    onValueChange: (value: string | null) => void;
    items: Item[];
    placeholder?: string;
    disabled?: boolean;
}

export default function CustomSelect({
    value,
    onValueChange,
    items,
    placeholder,
    disabled
}: Props) {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    if (Platform.OS === "web") {
        return (
            <View style={{ flex: 1 }}>
                <select
                    value={value ?? ""}
                    onChange={(e) => onValueChange(e.target.value)}
                    style={{
                        width: "100%",
                        height: 31,
                        borderRadius: 5,
                        padding: 5,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: colors.linea,
                        borderStyle: "solid",
                        color: colors.texto,
                        backgroundColor: colors.backgroundContainer,
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.6 : 1,
                    }}
                    disabled={disabled}
                >
                    <option value="">{placeholder ?? "Selecciona una opción"}</option>
                    {items.map((item, idx) => (
                        <option key={idx} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <RNPickerSelect
                onValueChange={disabled ? () => {} : onValueChange}
                placeholder={{ label: placeholder ?? "Selecciona una opción", value: null }}
                items={items}
                value={value}
                style={{
                    inputAndroid: {
                        color: colors.texto,
                        height: "100%",
                        textAlignVertical: "center",
                    },
                    inputIOS: {
                        color: colors.texto,
                        height: "100%",
                        textAlignVertical: "center",
                    },
                    viewContainer: {
                        flex: 1,
                        borderRadius: 5,
                        opacity: disabled ? 0.6 : 1,
                    },
                }}
            />
        </View>
    );
}
