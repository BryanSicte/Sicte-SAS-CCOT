import { StyleSheet, Platform } from 'react-native';
import { lightColors, darkColors } from './Colors';
import { useThemeCustom } from '../contexto/ThemeContext';
import { useMenu } from '../contexto/MenuContext';

export const useGlobalStyles = () => {
    const { isDark } = useThemeCustom();
    const { open } = useMenu();

    return StyleSheet.create({
        container: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            height: "100%",
            padding: 0,
            paddingLeft: Platform.OS === "web" ? (open ? 250 : 60) : 0,
            backgroundColor: isDark ? darkColors.backgroundContainer : lightColors.backgroundContainer,
        },
        title: {
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: 10,
            color: isDark ? darkColors.texto : lightColors.texto,
        },
        subTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: isDark ? darkColors.texto : lightColors.texto,
        },
        texto: {
            fontSize: 16,
            color: isDark ? darkColors.texto : lightColors.texto,
        },
        subTexto: {
            fontSize: 14,
            color: isDark ? darkColors.subTexto : lightColors.subTexto,
        },
    });
};