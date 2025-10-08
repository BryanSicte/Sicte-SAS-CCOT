import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navegacion/RootNavigator';
import { useGlobalStyles } from '../../estilos/GlobalStyles';
import CustomButton from '../../componentes/Button';
import CustomTable from '../../componentes/Table';
import CustomTabs, { TabItem } from '../../componentes/Tabs';
import { useThemeCustom } from '../../contexto/ThemeContext';
import { darkColors, lightColors } from '../../estilos/Colors';
import { getParqueAutomotor } from '../../servicios/Api';
import Toast from 'react-native-toast-message';
import { exportToExcel } from '../../utilitarios/ExportToExcel';
import { useNavigationParams } from '../../contexto/NavigationParamsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ParqueAutomotor'>;

const tabs: TabItem[] = [
    { key: "registros", label: "Registros" },
    // { key: "reportes", label: "Reportes" },
    // { key: "config", label: "Config" },
];

export default function ParqueAutomotor({ navigation }: Props) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const { setParams } = useNavigationParams();
    const headers = ["Fecha", "Usuario", "Sede", "Placa", "Estado", "Nombre"];
    const [data, setData] = useState<any[]>([]);
    const [dataTabla, setDataTabla] = useState<any[]>([]);

    const loadData = async () => {
        try {
            const response = await getParqueAutomotor();
            setData(response);
            const tablaFormateada = response.map((item: any) => [
                item.fecha,
                item.usuario,
                item.sede,
                item.placa,
                item.estado,
                item.nombre,
            ]);
            setDataTabla(tablaFormateada);
            Toast.show({ type: "success", text1: "Información de planta recibida", text2: `Los datos fueron recibidos correctamente.`, position: "top" });
        } catch (error) {
            Toast.show({ type: "error", text1: "Error", text2: error.data.message || "Datos no recibidos", position: "top" });
        }
    };

    useEffect(() => {
        const currentPath = window.location.pathname;
        window.history.replaceState({}, '', currentPath);

        loadData();
    }, []);

    const [activeTab, setActiveTab] = useState<"registros" | "reportes" | "config">(
        "registros"
    );


    const handleDownloadXLSX = () => {
        if (data.length === 0) return;
        const headers = Object.keys(data[0]);
        const rows = data.map((obj: any) => headers.map((key) => obj[key] ?? null));
        exportToExcel("Parque Automotor", rows, headers);
    };

    return (
        <View style={stylesGlobal.container}>
            <CustomTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "registros" && (
                <>
                    <View style={{
                        marginTop: 20,
                        marginHorizontal: 20,
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
                                setParams("RegistrarParqueAutomotor", { label: "Parque Automotor" });
                                navigation.navigate("RegistrarParqueAutomotor")
                            }}
                        />
                    </View>

                    <CustomTable headers={headers} data={dataTabla} />
                </>
            )}

            {activeTab === "reportes" && (
                <Text style={stylesGlobal.texto}>⚙️ Reportes del módulo</Text>
            )}

            {activeTab === "config" && (
                <Text style={stylesGlobal.texto}>⚙️ Configuración del módulo</Text>
            )}
        </View>
    );
}