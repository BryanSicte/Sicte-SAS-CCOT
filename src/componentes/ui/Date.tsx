import React, { useState } from "react";
import { Platform, View, Text, Pressable } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { useThemeCustom } from "../../contexto/ThemeContext";
import { darkColors, lightColors } from "../../estilos/Colors";
import { useGlobalStyles } from "../../estilos/GlobalStyles";

interface Props {
    date: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    mode?: "date" | "time" | "datetime";
    showSeconds?: boolean;
    disabled?: boolean;
}

export default function CustomDatePicker({
    date,
    onChange,
    placeholder,
    mode = "date",
    showSeconds = false,
    disabled,
}: Props) {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const stylesGlobal = useGlobalStyles();

    const handleConfirm = (selectedDate: Date) => {
        setPickerVisible(false);
        onChange(selectedDate);
    };

    if (Platform.OS === "web") {
        let inputType = "date";
        if (mode === "time") inputType = "time";
        if (mode === "datetime") inputType = "datetime-local";

        const formatForInput = (d: Date | null) => {
            if (!d) return "";
            if (mode === "date") {
                return d.getFullYear() + "-" +
                    String(d.getMonth() + 1).padStart(2, "0") + "-" +
                    String(d.getDate()).padStart(2, "0");
            }
            if (mode === "time") {
                return d.toTimeString().slice(0, showSeconds ? 8 : 5);
            }
            if (mode === "datetime") {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");
                const hh = String(d.getHours()).padStart(2, "0");
                const mi = String(d.getMinutes()).padStart(2, "0");
                const ss = String(d.getSeconds()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}T${hh}:${mi}${showSeconds ? ":" + ss : ""}`;
            }
            return "";
        };

        const parseLocalDateTime = (value: string): Date | null => {
            if (!value) return null;
            if (mode === "date") return new Date(value + "T00:00");
            if (mode === "time") return new Date(`1970-01-01T${value}`);
            if (mode === "datetime") {
                const [datePart, timePart] = value.split("T");
                const [year, month, day] = datePart.split("-").map(Number);
                const [hour, minute, second] = timePart.split(":").map(Number);
                return new Date(year, month - 1, day, hour, minute, second || 0);
            }
            return null;
        };

        return (
            <View style={{ flex: 1, position: "relative" }}>
                <input
                    type={inputType}
                    disabled={disabled}
                    style={{
                        flex: 1,
                        minHeight: 19,
                        padding: 5,
                        paddingRight: 10,
                        paddingLeft: 10,
                        borderWidth: 1,
                        borderColor: colors.linea,
                        borderRadius: 5,
                        backgroundColor: colors.backgroundContainer,
                        color: colors.texto,
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.6 : 1,
                    }}
                    value={formatForInput(date)}
                    onChange={(e) => onChange(parseLocalDateTime(e.target.value))}
                />
            </View>
        );
    }

    return (
        <>
            <Pressable
                disabled={disabled}
                onPress={() => setPickerVisible(true)}
                style={{ flexDirection: "row", alignItems: "center", opacity: disabled ? 0.6 : 1 }}
            >
                <Text
                    style={[
                        stylesGlobal.texto,
                        {
                            flex: 1,
                            marginLeft: 8,
                            color: date ? colors.texto : colors.icono,
                        },
                    ]}
                >
                    {date
                        ? mode === "time"
                            ? date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: showSeconds ? "2-digit" : undefined,
                            })
                            : mode === "datetime"
                                ? date.toLocaleString()
                                : date.toLocaleDateString()
                        : placeholder ||
                        (mode === "datetime"
                            ? "Selecciona fecha y hora"
                            : mode === "time"
                                ? "Selecciona la hora"
                                : "Selecciona la fecha")}
                </Text>
            </Pressable>

            <DateTimePickerModal
                isVisible={isPickerVisible}
                mode={mode}
                onConfirm={handleConfirm}
                onCancel={() => setPickerVisible(false)}
            />
        </>
    );
}
