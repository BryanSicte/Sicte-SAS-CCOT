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
import Loader from '../../componentes/Loader';
import { useParqueAutomotorData } from '../../contexto/ParqueAutomotorDataContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ParqueAutomotor'>;

const tabs: TabItem[] = [
    { key: "registros", label: "Registros" },
    { key: "vehiculos en campo", label: "Vehiculos en campo" },
    { key: "pendientes por reportar", label: "Pendientes por reportar" },
];

export default function ParqueAutomotor({ navigation }: Props) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const { setParams } = useNavigationParams();
    const headers = ["Fecha", "Sede", "Placa", "Estado", "Cedula", "Nombre"];
    const [dataTablaRegistros, setDataTablaRegistros] = useState<any[]>([]);
    const { getUser, logout } = useUserData();
    const { setMenuVisibleUser } = useUserMenu();
    const isMobileWeb = useIsMobileWeb();
    const [loading, setLoading] = useState(true);
    const { logoutHandler } = handleLogout();
    const { parqueAutomotor, setParqueAutomotor } = useParqueAutomotorData();

    const loadData = async () => {
        try {
            const response = await getParqueAutomotor();
            setParqueAutomotor(response);
            const tablaFormateada = response.data.map((item: any) => [
                item.fecha,
                item.sede,
                item.placa,
                item.estado,
                item.cedula,
                item.nombre,
            ]);
            const tablaOrdenada = [...tablaFormateada].sort((a, b) => {
                const fechaA = new Date(a[0]);
                const fechaB = new Date(b[0]);
                return fechaB.getTime() - fechaA.getTime();
            });
            setDataTablaRegistros(tablaOrdenada);
            Toast.show({ type: "success", text1: response.messages.message1, text2: response.messages.message2, position: "top" });
        } catch (error) {
            Toast.show({ type: "error", text1: error.data.messages.message1, text2: error.data.messages.message2, position: "top" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userTemp = await getUser();
                if (userTemp === null) {
                    await logoutHandler({
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

    const [activeTab, setActiveTab] = useState<"registros" | "vehiculos en campo" | "pendientes por reportar">(
        "registros"
    );

    const handleDownloadXLSXRegistros = () => {
        if (parqueAutomotor.data.length === 0) return;
        const headers = Object.keys(parqueAutomotor.data[0]);
        const rows = parqueAutomotor.data.map((obj: any) => headers.map((key) => obj[key] ?? null));
        exportToExcel("Parque automotor registros", rows, headers);
    };

    let datosEnCampo: any[] | null = null;
    let datosTablaEnCampo: any[] | null = null;
    const [dataEnCampo, setDataEnCampo] = useState<any[]>([]);
    const [dataTablaEnCampo, setDataTablaEnCampo] = useState<any[]>([]);

    function obtenerVehiculosEnCampoSoloUnaVez(data: any[]) {
        if (datosEnCampo && datosTablaEnCampo) {
            return { dataTemp: datosEnCampo, tablaTemp: datosTablaEnCampo };
        }

        const registros = Array.isArray(parqueAutomotor?.data) ? parqueAutomotor.data : [];

        const ultimaSalidaPorPlaca = Object.values(
            registros.reduce((acc, registro) => {
                const { placa, fecha } = registro;
                if (!acc[placa] || new Date(fecha) > new Date(acc[placa].fecha)) {
                    acc[placa] = registro;
                }
                return acc;
            }, {})
        ).filter((r: any) => r.estado === "Salida de vehiculo de la sede");

        datosEnCampo = ultimaSalidaPorPlaca;

        const tablaFormateada = ultimaSalidaPorPlaca.map((item: any) => [
            item.fecha,
            item.sede,
            item.placa,
            item.estado,
            item.cedula,
            item.nombre,
        ]);

        const tablaOrdenada = [...tablaFormateada].sort((a, b) => {
            const fechaA = new Date(a[0]);
            const fechaB = new Date(b[0]);
            return fechaB.getTime() - fechaA.getTime();
        });

        datosTablaEnCampo = tablaOrdenada;

        return { dataTemp: ultimaSalidaPorPlaca, tablaTemp: tablaOrdenada };
    }

    const handleDownloadXLSXEnCampo = () => {
        if (dataEnCampo.length === 0) return;
        const headers = Object.keys(dataEnCampo[0]);
        const rows = dataEnCampo.map((obj: any) => headers.map((key) => obj[key] ?? null));
        exportToExcel("Parque automotor en uso", rows, headers);
    };

    useEffect(() => {
        if (parqueAutomotor?.data) {
            const { dataTemp, tablaTemp } = obtenerVehiculosEnCampoSoloUnaVez(parqueAutomotor);
            setDataTablaEnCampo(tablaTemp);
            setDataEnCampo(dataTemp);
        }
    }, [parqueAutomotor]);

    if (loading) {
        return <Loader visible={loading} />;
    }

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
                            contentContainerStyle={{ paddingBottom: 60 }}
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
                                    onPress={handleDownloadXLSXRegistros}
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
                            <View style={{ marginHorizontal: isMobileWeb ? 10 : 20 }}>
                                <CustomTable headers={headers} data={dataTablaRegistros} />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </>
            )}

            {activeTab === "vehiculos en campo" && (
                <>
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
                                    onPress={handleDownloadXLSXEnCampo}
                                />
                            </View>
                            <View style={{ marginHorizontal: isMobileWeb ? 10 : 20 }}>
                                <CustomTable headers={headers} data={dataTablaEnCampo} />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </>
            )}

            {activeTab === "pendientes por reportar" && (
                <Text style={stylesGlobal.texto}>⚙️ Configuración del módulo</Text>
            )}
        </View>
    );
}