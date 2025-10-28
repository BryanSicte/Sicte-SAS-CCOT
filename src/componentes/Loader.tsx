import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Text, Animated, Easing } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import humanCharacters from "../assets/humanCharacters.json";

interface LoaderProps {
    visible?: boolean;
    size?: number;
    color?: string;
    style?: object;
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({
    visible = true,
    size = 80,
    color = "#007BFF",
    style = {},
    text = "... Cargando Datos ...",
}) => {
    const styles = stylesLocal();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    if (!visible) return null;

    return (
        <View style={[styles.container, style]}>
            <LottieView
                source={humanCharacters}
                autoPlay
                loop
                style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            />
            <Text style={[styles.texto]}>{text}</Text>
        </View>
    );
};

const stylesLocal = () => {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    return StyleSheet.create({
        container: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "10%",
            marginTop: 20,
            width: "80%",
            height: "80%",
            backgroundColor: colors.backgroundContainer,
        },
        texto: {
            marginTop: 10,
            fontSize: 16,
            color: colors.texto,
        },
    });
};

export default Loader;
