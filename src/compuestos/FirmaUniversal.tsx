import React, { useEffect, useRef, useState } from "react";
import { Platform, View, Image } from "react-native";
import SignaturePad from "../componentes/ui/SignaturePad";
import ReactSignatureCanvas from "react-signature-canvas";
import CustomButton from "../componentes/ui/Button";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";
import { useIsMobileWeb } from "../utilitarios/IsMobileWeb";

export default function FirmaUniversal({
    onFirmaChange,
    firmaInicial,
    editable = true,
}: {
    onFirmaChange?: (uri: string) => void;
    firmaInicial?: string | null;
    editable?: boolean;
}) {
    const [firma, setFirma] = useState<string | null>(null);
    const [hayTrazo, setHayTrazo] = useState(false);
    const sigRef = useRef<any>(null);
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const isMobileWeb = useIsMobileWeb();
    const [recarga, setRecarga] = useState(true);

    const handleSave = () => {
        const uri = sigRef.current.getCanvas().toDataURL("image/png");
        setFirma(uri);
        if (onFirmaChange) onFirmaChange(uri);
        setHayTrazo(false);
    };

    const handleClear = () => {
        sigRef.current.clear();
        setFirma(null);
        setHayTrazo(false);
        onFirmaChange?.(null);
    };

    useEffect(() => {
        if (Platform.OS === "web" && firmaInicial && sigRef.current) {
            try {
                if (recarga === false) {
                    const canvas = sigRef.current.getCanvas();
                    const ctx = canvas.getContext("2d");
                    const image = new Image();
                    image.src = firmaInicial;
                    image.onload = () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    };
                } else {
                    sigRef.current.clear();
                    sigRef.current.fromDataURL(firmaInicial);
                    setRecarga(false);
                }
                setFirma(firmaInicial);
            } catch (error) {
                console.warn("Error cargando firma:", error);
            }
        }
    }, [firmaInicial]);

    if (Platform.OS === "web") {
        return (
            <View style={{ alignItems: "center" }}>
                <View
                    style={{
                        borderWidth: 2,
                        borderColor: colors.linea,
                        borderRadius: 10,
                        padding: 5,
                        backgroundColor: "#fff",
                    }}
                >
                    {editable ? (
                        <ReactSignatureCanvas
                            key={isDark ? "dark" : "light"}
                            ref={sigRef}
                            penColor={"black"}
                            backgroundColor="#fff"
                            canvasProps={{ width: isMobileWeb ? 300 : 400, height: 200, className: "sigCanvas", style: { width: "100%", height: "100%" } }}
                            onEnd={() => setHayTrazo(true)}
                        />
                    ) : (
                        <Image
                            source={{ uri: firmaInicial || firma }}
                            style={{
                                width: isMobileWeb ? 300 : 400,
                                height: 200,
                                resizeMode: "contain",
                                backgroundColor: "#fff",
                                borderRadius: 8,
                            }}
                        />
                    )}
                </View>
                {editable && (
                    <View style={{ marginTop: 10, flexDirection: "row", gap: 10 }}>
                        <CustomButton label="Limpiar" variant="gris" onPress={handleClear} />
                        <CustomButton label="Guardar" onPress={handleSave} disabled={!hayTrazo} />
                    </View>
                )}
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

