import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
import { useUserData } from '../../contexto/UserDataContext';
import { handleLogout } from '../../utilitarios/HandleLogout';
import { useUserMenu } from '../../contexto/UserMenuContext';
import { useIsMobileWeb } from '../../utilitarios/IsMobileWeb';

type Props = NativeStackScreenProps<RootStackParamList, 'Inventarios'>;

const tabs: TabItem[] = [
    { key: "registros", label: "Registros" },
    // { key: "reportes", label: "Reportes" },
    // { key: "config", label: "Config" },
];

export default function Inventarios({ navigation }: Props) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const { setParams } = useNavigationParams();
    const headers = ["Fecha", "Usuario", "Sede", "Placa", "Estado", "Nombre"];
    const [data, setData] = useState<any[]>([]);
    const [dataTabla, setDataTabla] = useState<any[]>([]);
    const { getUser, logout } = useUserData();
    const { setMenuVisibleUser } = useUserMenu();
    const isMobileWeb = useIsMobileWeb();

    const loadData = async () => {
        try {
            const response = await getParqueAutomotor();
            setData(response);
            const tablaFormateada = response.data.map((item: any) => [
                item.fecha,
                item.usuario,
                item.sede,
                item.placa,
                item.estado,
                item.nombre,
            ]);
            const tablaOrdenada = [...tablaFormateada].sort((a, b) => {
                const fechaA = new Date(a[0]);
                const fechaB = new Date(b[0]);
                return fechaB.getTime() - fechaA.getTime();
            });
            setDataTabla(tablaOrdenada);
            Toast.show({ type: "success", text1: response.messages.message1, text2: response.messages.message2, position: "top" });
        } catch (error) {
            Toast.show({ type: "error", text1: error.data.messages.message1, text2: error.data.messages.message2, position: "top" });
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userTemp = await getUser();
                if (userTemp === null) {
                    await handleLogout({
                        navigation,
                        logout,
                        setMenuVisibleUser,
                    });
                }
            } catch (error) {
                console.log("Error obteniendo usuario:", error);
            }
        };
        loadUser();
        loadData();
    }, []);

    const [activeTab, setActiveTab] = useState<"registros" | "reportes" | "config">(
        "registros"
    );


    const handleDownloadXLSX = () => {
        if (data.length === 0) return;
        const headers = Object.keys(data[0]);
        const rows = data.map((obj: any) => headers.map((key) => obj[key] ?? null));
        exportToExcel("Inventarios", rows, headers);
    };

    return (
        <View style={stylesGlobal.container}>
            <CustomTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "registros" && (
                <>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                    >
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 30 }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={{
                                marginTop: isMobileWeb ? 10 : 20,
                                marginHorizontal: isMobileWeb ? 10 : 20,
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
                                        setParams("RegistrarInventarios", { label: "Inventarios" });
                                        navigation.navigate("RegistrarInventarios")
                                    }}
                                />
                            </View>

                            <View style={{ marginHorizontal: isMobileWeb ? 10 : 20 }}>
                                <CustomTable headers={headers} data={dataTabla} />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
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