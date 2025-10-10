import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useMenu } from "../contexto/MenuContext";
import { useRoute } from "@react-navigation/native";
import { menuConfig } from "../navegacion/MenuConfig";
import { useIsMobileWeb } from "../utilitarios/IsMobileWeb";
import Storage from "../utilitarios/Storage";
import Toast from "react-native-toast-message";

export default function PowerBIEmbed({ navigation }) {
    const { open } = useMenu();
    const route = useRoute();
    const { reportName } = route.params || {};
    const isMobileWeb = useIsMobileWeb();
    let autorizacion = "0";

    const loadData = async () => {
        let pages;
        const storedPages = await Storage.getItem("dataPageUser");
        if (!storedPages) return;
        pages = JSON.parse(storedPages);
        if (pages.hasOwnProperty(reportName)) {
            if (pages[reportName] === "1") {
                autorizacion = pages[reportName];
            } else {
                Toast.show({
                    type: "info",
                    text1: "Acceso restringido",
                    text2: "No tienes permisos para entrar aquí 🚫",
                    position: "top",
                });
                setTimeout(() => {
                    navigation.replace("Home");
                }, 2000);
            }
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const findReport = (nameBD) => {
        for (const section of menuConfig) {
            if (section.items) {
                const found = section.items.find(item => item.nameBD === nameBD);
                if (found) return found;
            }
        }
        return null;
    };

    const report = findReport(reportName);
    const url = report?.params?.url;

    if (!url) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <p style={{ color: "#555" }}>⚠️ Reporte no encontrado: {reportName}</p>
            </View>
        );
    }

    if (Platform.OS === "web") {
        return (
            <View
                style={[
                    styles.container,
                    { marginLeft: !isMobileWeb ? open ? 250 : 60 : open ? 250 : 0 }
                ]}
            >
                <iframe
                    src={url}
                    style={{ border: "none", width: "100%", height: "100%", display: "block" }}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: url }}
                style={{ flex: 1 }}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        overflow: "hidden",
    },
});