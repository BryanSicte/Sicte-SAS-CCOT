import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navegacion/RootNavigator";
import CadenaDeSuministro from "./CadenaDeSuministro";
import { useThemeCustom } from "../../contexto/ThemeContext";
import { darkColors, lightColors } from "../../estilos/Colors";
import CustomButton from "../../componentes/ui/Button";
import CustomTable from "../../componentes/ui/Table";
import { useIsMobileWeb } from "../../utilitarios/IsMobileWeb";
import { useNavigationParams } from "../../contexto/NavigationParamsContext";
import { exportToExcel } from "../../utilitarios/ExportToExcel";

type Props = NativeStackScreenProps<RootStackParamList, "SolicitudAbastecimiento">;

export default function SolicitudAbastecimiento({ navigation }: Props) {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const isMobileWeb = useIsMobileWeb();
    const { setParams } = useNavigationParams();
    const headers = ["Fecha", "Usuario", "Sede", "Placa", "Estado", "Nombre"];
    const [data, setData] = useState<any[]>([]);
    const [dataTabla, setDataTabla] = useState<any[]>([]);

    const handleDownloadXLSX = () => {
        if (data.data.length === 0) return;
        const headers = Object.keys(data.data[0]);
        const rows = data.data.map((obj: any) => headers.map((key) => obj[key] ?? null));
        exportToExcel("Parque Automotor", rows, headers);
    };

    return (
        <CadenaDeSuministro navigation={navigation} defaultPage="Solicitud de Abastecimiento">
            <View>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                >
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 60 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={{
                            marginBottom: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignSelf: "stretch",
                        }}>
                            <CustomButton
                                label="Descargar"
                                variant="secondary"
                                onPress={handleDownloadXLSX}
                            />
                            <CustomButton
                                label="Nuevo"
                                variant="primary"
                                onPress={() => {
                                    navigation.navigate("SolicitudAbastecimientoNuevo")
                                }}
                            />
                        </View>
                        <View>
                            <CustomTable headers={headers} data={dataTabla} />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </CadenaDeSuministro>
    );
}
