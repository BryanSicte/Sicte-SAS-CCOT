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

type Props = NativeStackScreenProps<RootStackParamList, 'ParqueAutomotor'>;

const tabs: TabItem[] = [
    { key: "registros", label: "Registros" },
    // { key: "reportes", label: "Reportes" },
    // { key: "config", label: "Config" },
];

export default function ParqueAutomotor({ route, navigation }: Props) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    const headers = ["Fecha", "Sede", "Placa", "Estado", "Cedula", "Nombre"];
    const [data, setData] = useState<any[]>([]);

    const loadData = async () => {
        try {
            const response = await getParqueAutomotor();
            const tablaFormateada = response.map((item: any) => [
                item.fecha,
                item.sede,
                item.placa,
                item.estado,
                item.cedula,
                item.nombre,
            ]);
            setData(tablaFormateada);
            Toast.show({ type: "success", text1: "Información de planta recibida", text2: `Los datos fueron recibidos correctamente.`, position: "top" });
        } catch (error) {
            Toast.show({ type: "error", text1: "Error", text2: error.data.message || "Datos no recibidos", position: "top" });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const [activeTab, setActiveTab] = useState<"registros" | "reportes" | "config">(
        "registros"
    );

    return (
        <View style={stylesGlobal.container}>
            <CustomTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "registros" && (
                <>
                    <View style={{
                        marginTop: 20,
                        marginRight: 20,
                        marginBottom: 10,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignSelf: "stretch",
                    }}>
                        <CustomButton
                            label="Nuevo"
                            variant="primary"
                            onPress={() => navigation.navigate("RegistrarParqueAutomotor", { label: "Parque Automotor" })}
                        />
                    </View>

                    <CustomTable headers={headers} data={data} />
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