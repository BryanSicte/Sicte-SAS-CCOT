import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";

type Props = {
    expiryDate: string;
    floating?: boolean;
};

const TokenCountdown = ({ expiryDate, floating = false }: Props) => {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    useEffect(() => {
        const target = new Date(expiryDate).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft("Expirado");
                clearInterval(interval);
                return;
            }

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(
                `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryDate]);

    const localDate = new Date(expiryDate).toLocaleString("es-CO", {
        timeZone: "America/Bogota",
        hour12: true,
    });

    const content = (
        <View style={[styles.box, { backgroundColor: colors.backgroundBar, shadowColor: colors.backgroundHover }]}>
            <Text style={[styles.title, { color: colors.texto }]}>Sesión expira:</Text>
            <Text
                style={[
                    styles.timer,
                    { color: timeLeft === "Expirado" ? "red" : colors.texto },
                ]}
            >
                {timeLeft}
            </Text>
        </View>
    );

    return floating ? <View style={styles.floating}>{content}</View> : content;
};

const styles = StyleSheet.create({
    floating: {
        position: "absolute",
        bottom: 15,
        right: 15,
        zIndex: 9999,
        elevation: 10,
    },
    box: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        alignItems: "center",
    },
    title: {
        fontSize: 12,
        color: "gray",
    },
    timer: {
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default TokenCountdown;
