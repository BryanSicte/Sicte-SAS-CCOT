import React, { useRef } from "react";
import { View, StyleSheet, Button } from "react-native";
import SignatureScreen, { SignatureViewRef } from "react-native-signature-canvas";

interface Props {
    onOK: (signature: string) => void;
    onClear?: () => void;
    text?: string;
}

const SignaturePad: React.FC<Props> = ({ onOK, onClear, text = "Firme dentro del recuadro" }) => {
    const ref = useRef<SignatureViewRef>(null);

    return (
        <View style={styles.container}>
            <SignatureScreen
                ref={ref}
                onOK={onOK}
                onClear={onClear}
                descriptionText={text}
                webStyle={styleWeb}
                autoClear={false}
            />
            <View style={styles.buttons}>
                <Button title="Limpiar" onPress={() => ref.current?.clearSignature()} />
                <Button title="Guardar" onPress={() => ref.current?.readSignature()} />
            </View>
        </View>
    );
};

const styleWeb = `
  .m-signature-pad--footer {display: none; margin: 0px;}
  .m-signature-pad {box-shadow: none; border: 2px solid #007BFF; border-radius: 10px;}
`;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
});

export default SignaturePad;
