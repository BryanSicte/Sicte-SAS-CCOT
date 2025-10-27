import React, { useRef, useState } from "react";
import { Platform, View, Text, Button } from "react-native";
import SignaturePad from "../componentes/SignaturePad";
import ReactSignatureCanvas from "react-signature-canvas";
import CustomButton from "../componentes/Button";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";

export default function FirmaUniversal({ onFirmaChange }: { onFirmaChange?: (uri: string) => void }) {
    const [firma, setFirma] = useState<string | null>(null);
    const [hayTrazo, setHayTrazo] = useState(false);
    const sigRef = useRef<any>(null);
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    const handleSave = () => {
        const uri = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
        setFirma(uri);
        if (onFirmaChange) onFirmaChange(uri);
        setHayTrazo(false);
    };

    const handleClear = () => {
        sigRef.current.clear();
        setFirma(null);
        setHayTrazo(false);
        if (onFirmaChange) onFirmaChange(null);
    };

    if (Platform.OS === "web") {
        return (
            <View style={{ alignItems: "center" }}>
                <ReactSignatureCanvas
                    key={isDark ? "dark" : "light"}
                    ref={sigRef}
                    penColor={isDark ? "white" : "black"}
                    backgroundColor={colors.backgroundContainer}
                    canvasProps={{ width: 400, height: 200, className: "sigCanvas" }}
                    onEnd={() => setHayTrazo(true)}
                />
                <View style={{ marginTop: 10, flexDirection: "row", gap: 10 }}>
                    <CustomButton label="Limpiar" variant="gris" onPress={handleClear} />
                    <CustomButton label="Guardar" onPress={handleSave} disabled={!hayTrazo}/>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <SignaturePad
                onOK={(sig) => {
                    setFirma(sig);
                    if (onFirmaChange) onFirmaChange(sig);
                }}
            />
        </View>
    );
}

