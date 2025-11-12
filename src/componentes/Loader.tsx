import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import humanCharacters from "../assets/humanCharacters.json";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import { useIsMobileWeb } from "../utilitarios/IsMobileWeb";

let LottieView: any;

try {
    if (Platform.OS === "web") {
        const lottieModule = require("lottie-react");
        const LottieComp = lottieModule.default || lottieModule.Lottie || lottieModule;
        LottieView = (props: any) => (
            <LottieComp
                animationData={props.source}
                loop={props.loop}
                autoplay={props.autoPlay}
                style={props.style}
            />
        );
    } else {
        LottieView = require("lottie-react-native").default;
    }
} catch (error) {
    console.error("Error cargando Lottie:", error);
    LottieView = () => null;
}

interface LoaderProps {
    visible?: boolean;
    size?: number;
    color?: string;
    style?: object;
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({
    visible = true,
    size = "90%",
    color = "#007BFF",
    style = {},
    text = "... Cargando Datos ...",
}) => {
    const styles = stylesLocal();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const stylesGlobal = useGlobalStyles();

    if (!visible) return null;

    const animationSource = Platform.OS === "web" ? humanCharacters : require("../assets/humanCharacters.json");

    return (
        <View style={[stylesGlobal.container, styles.container, style]}>
            <View style={{ width: size, height: size }}>
                <LottieView
                    source={animationSource}
                    autoPlay
                    loop
                    style={{ width: "100%", height: "100%" }}
                />
            </View>
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
            paddingRight: isMobileWeb || Platform.OS !== "web" ? 0 : 20,
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
