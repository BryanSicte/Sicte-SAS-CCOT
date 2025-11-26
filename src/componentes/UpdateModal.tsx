import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface UpdateModalProps {
    visible: boolean;
    currentVersion: string;
    latestVersion: string;
    onUpdate: () => void;
}

export default function UpdateModal({ visible, currentVersion, latestVersion, onUpdate }: UpdateModalProps) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>

                    <Text style={styles.title}>Nueva actualización</Text>

                    <View style={styles.versionBox}>
                        <Text style={styles.label}>Versión actual</Text>
                        <Text style={styles.value}>{currentVersion}</Text>
                    </View>

                    <View style={styles.versionBox}>
                        <Text style={styles.label}>Última versión</Text>
                        <Text style={styles.value}>{latestVersion}</Text>
                    </View>

                    <Text style={styles.description}>
                        Para continuar usando la aplicación, por favor actualiza a la versión más reciente.
                    </Text>

                    <TouchableOpacity style={styles.button} onPress={onUpdate}>
                        <Text style={styles.buttonText}>Actualizar ahora</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    card: {
        width: "80%",
        maxWidth: 420,
        backgroundColor: "#ffffff",
        borderRadius: 18,
        paddingVertical: 30,
        paddingHorizontal: 25,

        // sombras elegantes
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,

        // ligera animación visual
        transform: [{ scale: 1.02 }]
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 25,
    },
    versionBox: {
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: "#f2f2f7"
    },
    label: {
        fontSize: 14,
        color: "#555",
    },
    value: {
        fontSize: 17,
        fontWeight: "600",
        marginTop: 3
    },
    description: {
        fontSize: 15,
        textAlign: "center",
        color: "#444",
        marginVertical: 20,
        lineHeight: 20
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: "600",
    }
});
