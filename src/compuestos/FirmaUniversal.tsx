import React, { useRef, useState } from "react";
import { Platform, View, Text, Button } from "react-native";
import SignaturePad from "react-native-signature-canvas";
import ReactSignatureCanvas from "react-signature-canvas";

export default function FirmaUniversal({ onFirmaChange }: { onFirmaChange?: (uri: string) => void }) {
    const [firma, setFirma] = useState<string | null>(null);
    const sigRef = useRef<any>(null);

    const handleSave = () => {
        const uri = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
        setFirma(uri);
        if (onFirmaChange) onFirmaChange(uri);
    };

    if (Platform.OS === "web") {
        return (
            <View style={{ alignItems: "center", marginTop: 50 }}>
                <ReactSignatureCanvas
                    ref={sigRef}
                    penColor="blue"
                    backgroundColor="#f5f5f5"
                    canvasProps={{ width: 400, height: 200, className: "sigCanvas" }}
                />
                <Button title="Guardar" onPress={handleSave} />
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

