import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useMenu } from "../contexto/MenuContext";

export default function PowerBIEmbed({ route }: any) {
    const { url } = route.params;
    const { open } = useMenu();

    if (Platform.OS === "web") {
        return (
            <View
                style={[
                    styles.container,
                    { marginLeft: open ? 250 : 60 }
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
