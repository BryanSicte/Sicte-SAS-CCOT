// components/CustomModal.tsx
import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useIsMobileWeb } from "../utilitarios/IsMobileWeb";
import { useThemeCustom } from "../contexto/ThemeContext";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import { darkColors, lightColors } from "../estilos/Colors";

interface CustomModalProps {
    visible: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
    width?: string | number;
    height?: string | number;
}

const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    title,
    onClose,
    children,
    width = "85%",
    height = "auto",
}) => {
    const styles = stylesLocal();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.container, { width, height }]}>
                            {title && (
                                <View style={styles.header}>
                                    <Text style={styles.title}>{title}</Text>
                                    <TouchableOpacity onPress={onClose}>
                                        <Text style={styles.closeButton}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View style={styles.content}>{children}</View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylesLocal = () => {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const stylesGlobal = useGlobalStyles();
    const isMobileWeb = useIsMobileWeb();

    return StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
        },
        container: {
            backgroundColor: colors.backgroundBar,
            borderRadius: 12,
            padding: 20,
            elevation: 6,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            borderColor: colors.texto,
            marginBottom: 10,
            paddingBottom: 8,
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            color: colors.texto,
        },
        closeButton: {
            fontSize: 18,
            color: colors.texto,
        },
        content: {
            marginTop: 10,
        },
    });
};

export default CustomModal;
