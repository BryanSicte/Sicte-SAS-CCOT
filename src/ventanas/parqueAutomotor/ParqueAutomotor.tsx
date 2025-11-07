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
import { getParqueAutomotor, getParqueAutomotorBase } from '../../servicios/Api';
import Toast from 'react-native-toast-message';
import { exportToExcel } from '../../utilitarios/ExportToExcel';
import { useNavigationParams } from '../../contexto/NavigationParamsContext';
import { useUserData } from '../../contexto/UserDataContext';
import { handleLogout } from '../../utilitarios/HandleLogout';
import { useUserMenu } from '../../contexto/UserMenuContext';
import { useIsMobileWeb } from '../../utilitarios/IsMobileWeb';
import Loader from '../../componentes/Loader';
import { useParqueAutomotorData } from '../../contexto/ParqueAutomotorDataContext';
import { useParqueAutomotorBaseData } from '../../contexto/ParqueAutomotorBaseDataContext';

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
    const { parqueAutomotorBase, setParqueAutomotorBase } = useParqueAutomotorBaseData();

    const loadData = async () => {
        try {
            const responseBase = await getParqueAutomotorBase(parqueAutomotorBase);
            setParqueAutomotorBase(responseBase);
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

    const headersPendientesReportar = ["Placa", "Tiempo Sin Reportar", "Ultima Fecha", "Dias", "Horas", "Minutos", "Estado"];
    let datosPendientesReportar: any[] | null = null;
    let datosTablaPendientesReportar: any[] | null = null;
    const [dataPendientesReportar, setDataPendientesReportar] = useState<any[]>([]);
    const [dataTablaPendientesReportar, setDataTablaPendientesReportar] = useState<any[]>([]);

    function obtenerPlacasPendientesReportar() {
        if (!parqueAutomotorBase?.data || !parqueAutomotor?.data) {
            return { dataTemp: [], tablaTemp: [] };
        }

        if (datosPendientesReportar && datosTablaPendientesReportar) {
            return { dataTemp: datosPendientesReportar, tablaTemp: datosTablaPendientesReportar };
        }

        const baseData = parqueAutomotorBase.data;
        const registros = parqueAutomotor.data;
        const ahora = new Date();

        const placasPendientes = baseData
            .map((itemBase: any) => {
                const placaBase = itemBase.CENTRO?.toUpperCase?.();

                const registrosPlaca = registros.filter(
                    (itemParque: any) => itemParque.placa?.toUpperCase?.() === placaBase
                );

                if (registrosPlaca.length === 0) {
                    return {
                        placa: placaBase,
                        ultimaFecha: null,
                        tiempoSinReporte: "Nunca reportado",
                        dias: null,
                        horas: null,
                        minutos: null,
                        estado: "Nunca reportado",
                    };
                }

                const ultimaFecha = new Date(
                    Math.max(...registrosPlaca.map((r: any) => new Date(r.fecha).getTime()))
                );

                const diffMs = ahora.getTime() - ultimaFecha.getTime();
                const diffMin = Math.floor(diffMs / (1000 * 60));
                const dias = Math.floor(diffMin / (60 * 24));
                const horas = Math.floor((diffMin % (60 * 24)) / 60);
                const minutos = diffMin % 60;

                const tiempoSinReporte = `${dias}d ${horas}h ${minutos}m`;
                const diffHoras = diffMs / (1000 * 60 * 60);

                return {
                    placa: placaBase,
                    ultimaFecha: ultimaFecha.toLocaleString(),
                    tiempoSinReporte,
                    dias,
                    horas,
                    minutos,
                    estado: diffHoras > 24 ? "Pendiente de reporte" : "Reciente",
                };
            })

        const placasFiltradas = placasPendientes.filter(
            (item) => item.estado === "Pendiente de reporte" || item.estado === "Nunca reportado"
        );

        placasFiltradas.sort((a, b) => {
            if (a.ultimaFecha === null) return -1;
            if (b.ultimaFecha === null) return 1;
            return new Date(a.ultimaFecha).getTime() - new Date(b.ultimaFecha).getTime();
        });

        datosPendientesReportar = placasFiltradas;

        const tablaFormateada = placasFiltradas.map((item: any) => [
            item.placa,
            item.tiempoSinReporte,
            item.ultimaFecha,
            item.dias,
            item.horas,
            item.minutos,
            item.estado,
        ]);

        datosTablaPendientesReportar = tablaFormateada;

        return { dataTemp: placasFiltradas, tablaTemp: tablaFormateada };
    }

    const handleDownloadXLSXPendientesReportar = () => {
        if (dataPendientesReportar.length === 0) return;
        const headers = Object.keys(dataPendientesReportar[0]);
        const rows = dataPendientesReportar.map((obj: any) => headers.map((key) => obj[key] ?? null));
        exportToExcel("Parque automotor pendientes", rows, headers);
    };

    let datosEnCampo: any[] | null = null;
    let datosTablaEnCampo: any[] | null = null;
    const [dataEnCampo, setDataEnCampo] = useState<any[]>([]);
    const [dataTablaEnCampo, setDataTablaEnCampo] = useState<any[]>([]);

    function obtenerVehiculosEnCampoSoloUnaVez(data: any[]) {
        if (!parqueAutomotorBase?.data || !parqueAutomotor?.data) {
            return { dataTemp: [], tablaTemp: [] };
        }

        if (datosEnCampo && datosTablaEnCampo) {
            return { dataTemp: datosEnCampo, tablaTemp: datosTablaEnCampo };
        }

        const registros = Array.isArray(parqueAutomotor?.data) ? parqueAutomotor.data : [];
        const baseData = Array.isArray(parqueAutomotorBase.data) ? parqueAutomotorBase.data : [];

        const placasBase = baseData
            .map((item: any) => item.CENTRO?.toUpperCase?.())
            .filter(Boolean);

        const ultimaSalidaPorPlaca = Object.values(
            registros.reduce((acc, registro) => {
                const { placa, fecha } = registro;
                if (!acc[placa] || new Date(fecha) > new Date(acc[placa].fecha)) {
                    acc[placa] = registro;
                }
                return acc;
            }, {})
        ).filter((r: any) => r.estado === "Salida de vehiculo de la sede");

        const ultimaSalidaFiltrada = ultimaSalidaPorPlaca.filter((r: any) =>
            placasBase.includes(r.placa?.toUpperCase?.())
        );

        datosEnCampo = ultimaSalidaFiltrada;

        const tablaFormateada = ultimaSalidaFiltrada.map((item: any) => [
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

        return { dataTemp: ultimaSalidaFiltrada, tablaTemp: tablaOrdenada };
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
        if (parqueAutomotorBase?.data) {
            const { dataTemp, tablaTemp } = obtenerPlacasPendientesReportar();
            setDataPendientesReportar(dataTemp);
            setDataTablaPendientesReportar(tablaTemp);
        }
    }, [parqueAutomotor, parqueAutomotorBase]);

    if (loading) {
        return <Loader visible={loading} />;
    }

    return (
        <View style={stylesGlobal.container}>
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
                    <CustomTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    {activeTab === "registros" && (
                        <>
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
                        </>
                    )}

                    {activeTab === "vehiculos en campo" && (
                        <>
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
                        </>
                    )}

                    {activeTab === "pendientes por reportar" && (
                        <>
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
                                    onPress={handleDownloadXLSXPendientesReportar}
                                />
                            </View>
                            <View style={{ marginHorizontal: isMobileWeb ? 10 : 20 }}>
                                <CustomTable headers={headersPendientesReportar} data={dataTablaPendientesReportar} />
                            </View>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}