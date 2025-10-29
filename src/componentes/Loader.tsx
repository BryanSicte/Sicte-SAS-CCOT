import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, StyleSheet, Text, Animated, Easing } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import humanCharacters from "../assets/humanCharacters.json";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import { useIsMobileWeb } from "../utilitarios/IsMobileWeb";

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
    const stylesGlobal = useGlobalStyles();

    if (!visible) return null;

    return (
        <View style={[stylesGlobal.container, styles.container, style]}>
            <LottieView
                source={humanCharacters}
                autoPlay
                loop
            />
            <View>
                <Text style={[styles.texto]}>{text}</Text>
            </View>
        </View>
    );
};

const stylesLocal = () => {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const isMobileWeb = useIsMobileWeb();

    return StyleSheet.create({
        container: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: isMobileWeb ? 0 : 20,
            paddingTop: 70,
            paddingBottom: 100,
        },
        texto: {
            marginTop: 15,
            fontSize: 16,
            color: colors.subTexto,
        },
    });
};

export default Loader;
