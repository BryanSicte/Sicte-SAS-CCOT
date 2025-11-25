import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Platform, Dimensions, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navegacion/RootNavigator';
import { useGlobalStyles } from '../../estilos/GlobalStyles';
import CustomButton from '../../componentes/Button';
import { useThemeCustom } from '../../contexto/ThemeContext';
import { darkColors, lightColors } from '../../estilos/Colors';
import { getUbicacionUsuarios } from '../../servicios/Api';
import Toast from 'react-native-toast-message';
import { useNavigationParams } from '../../contexto/NavigationParamsContext';
import { useUserData } from '../../contexto/UserDataContext';
import { handleLogout } from '../../utilitarios/HandleLogout';
import { useUserMenu } from '../../contexto/UserMenuContext';
import { useIsMobileWeb } from '../../utilitarios/IsMobileWeb';
import Loader from '../../componentes/Loader';
import MapViewNative from '../../componentes/MapViewNative';
import LabeledDatePicker from '../../compuestos/Date';
import { Ionicons } from '@expo/vector-icons';
import LabeledInput from '../../compuestos/Input';
import LargeAreaChart from '../../charts/LargeAreaChart';
import { getCurrentCoords } from '../../utilitarios/BackgroundLocation';
import CustomTabs, { TabItem } from '../../componentes/Tabs';

type Props = NativeStackScreenProps<RootStackParamList, 'Recorridos'>;

function generarHorasEntreFechas(inicio, fin, intervaloMin = 60) {
    const fechas = [];
    const actual = new Date(inicio);

    while (actual <= fin) {
        fechas.push(new Date(actual));
        actual.setMinutes(actual.getMinutes() + intervaloMin);
    }

    return fechas;
}

function normalizarHora(d, intervalo = 60) {
    const minutos = d.getMinutes();
    const minutosNormalizados = minutos - (minutos % intervalo);

    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        minutosNormalizados,
        0,
        0
    ).getTime();
}

export default function Recorridos({ navigation }: Props) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const { setParams } = useNavigationParams();
    const { getUser, logout } = useUserData();
    const { setMenuVisibleUser } = useUserMenu();
    const isMobileWeb = useIsMobileWeb();
    const [loading, setLoading] = useState(true);
    const { logoutHandler } = handleLogout();
    const [ubicaciones, setUbicaciones] = useState<any[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);
    const intervaloMin = 10;
    const createEmptyFormData = () => {
        const hoy = new Date();
        const ayer = new Date(hoy);
        ayer.setDate(hoy.getDate() - 1);

        return {
            selectedDateInicio: ayer,
            selectedDateFinal: hoy,
            selectedCedula: "",
            selectedUser: "",
        };
    };
    const [filter, setFilter] = useState(createEmptyFormData());
    const [coordsActuales, setCoordsActuales] = useState<any[]>([]);

    const loadData = async () => {
        try {
            const response = await getUbicacionUsuarios();
            const coords = response.data.map((item: any) => {
                const fechaBogota = new Date(item.fechaToma);

                return {
                    fecha: fechaBogota,
                    cedula: item.cedulaUsuario,
                    nombre: item.nombreUsuario,
                    altitud: item.altitud,
                    precisionAltitud: item.precisionAltitud,
                    direccionGrados: item.direccionGrados,
                    latitude: parseFloat(item.latitud),
                    longitude: parseFloat(item.longitud),
                    precisionLatLon: item.precisionLatLon,
                    velocidad: item.velocidad,
                    origen: item.origen,
                };
            });

            setUbicaciones(coords);

            const uniqueUsers = Array.from(new Set(coords.map((u: any) => u.nombre))).sort();
            const item = coords.find((p) => p.nombre === uniqueUsers[0]);

            if (uniqueUsers.length > 0) {
                setFilter({ ...filter, selectedUser: uniqueUsers[0], selectedCedula: item?.cedula })
            }

            const coordsActualesTemp = await getCurrentCoords();
            setCoordsActuales([coordsActualesTemp]);

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

    const filteredCoords = ubicaciones.filter((u) => {
        if (!filter.selectedUser) return false;

        return (
            u.nombre === filter.selectedUser &&
            u.fecha >= filter.selectedDateInicio &&
            u.fecha <= filter.selectedDateFinal
        );
    });

    const horasRango = generarHorasEntreFechas(
        filter.selectedDateInicio,
        filter.selectedDateFinal,
        intervaloMin
    );

    const actividadMovimiento = {};
    horasRango.forEach(date => {
        actividadMovimiento[normalizarHora(date, intervaloMin)] = 0;
    });

    filteredCoords.forEach(p => {
        const ts = normalizarHora(new Date(p.fecha), intervaloMin);
        if (actividadMovimiento[ts] !== undefined) {
            if ((p.velocidad || 0) > 1) {
                actividadMovimiento[ts] += 1;
            }
        }
    });

    const actividadMovimientoPorHora = Object.entries(actividadMovimiento)
        .map(([ts, count]) => [Number(ts), count]);
    
    const actividadMuestreo = {};
    horasRango.forEach(date => {
        actividadMuestreo[normalizarHora(date, intervaloMin)] = 0;
    });

    filteredCoords.forEach(p => {
        const ts = normalizarHora(new Date(p.fecha), intervaloMin);

        if (actividadMuestreo[ts] !== undefined) {
            actividadMuestreo[ts] += 1;
        }
    });

    const actividadMuestreoPorHora = Object.entries(actividadMuestreo)
        .map(([ts, count]) => [Number(ts), count]);

    const coordsParaMapa =
        Array.isArray(filteredCoords) && filteredCoords.length
            ? filteredCoords
            : (coordsActuales ?? []);

    const tabs: TabItem[] = [
        { key: "movimiento", label: "Movimiento" },
        { key: "muestreo", label: "Muestreo" },
    ];

    const [activeTab, setActiveTab] = useState<"movimiento" | "muestreo">(
        "movimiento"
    );

    if (loading) {
        return <Loader visible={loading} />;
    }

    return (
        <View style={stylesGlobal.container}>

            <View style={{ flex: 1 }}>
                <MapViewNative coords={coordsParaMapa.length ? coordsParaMapa : []} />
            </View>

            <View
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    zIndex: 999,
                }}
            >
                <CustomButton
                    label=''
                    onPress={() => setShowFilters(true)}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                        elevation: 4,
                        padding: 10
                    }}
                >
                    {(state: any) => (
                        <Ionicons name="filter" size={24} color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : "#fff"} />
                    )}
                </CustomButton>
            </View>

            <View
                style={{
                    position: "absolute",
                    top: 140,
                    right: 20,
                    zIndex: 999,
                }}
            >
                <CustomButton
                    label=''
                    onPress={() => setShowStatistics(true)}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                        elevation: 4,
                        padding: 10
                    }}
                >
                    {(state: any) => (
                        <Ionicons name="stats-chart" size={24} color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : "#fff"} />
                    )}
                </CustomButton>
            </View>

            <Modal visible={showFilters} transparent animationType="fade">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={() => setShowFilters(false)}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableWithoutFeedback onPress={() => null}>
                                <View
                                    style={{
                                        backgroundColor: colors.backgroundContainer,
                                        borderRadius: 12,
                                        maxHeight: "95%",
                                        width: isMobileWeb || Platform.OS !== "web" ? "95%" : "85%",
                                    }}
                                >
                                    <ScrollView
                                        keyboardShouldPersistTaps="always"
                                        nestedScrollEnabled={true}
                                        contentContainerStyle={{
                                            backgroundColor: colors.backgroundContainer,
                                            paddingVertical: isMobileWeb || Platform.OS !== "web" ? 10 : 20,
                                            paddingHorizontal: isMobileWeb || Platform.OS !== "web" ? 10 : 20,
                                            borderRadius: 12,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.texto }}>
                                                Filtros
                                            </Text>

                                            <TouchableOpacity
                                                onPress={() => setShowFilters(false)}
                                                style={{
                                                    padding: 5,
                                                    borderRadius: 20
                                                }}
                                            >
                                                <Text style={{ fontSize: 22, color: colors.texto }}>✕</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View
                                            style={{
                                                width: "100%",
                                                height: 1,
                                                backgroundColor: colors.linea,
                                                marginBottom: 20
                                            }}
                                        />

                                        <LabeledDatePicker
                                            label="Fecha inicial"
                                            date={filter.selectedDateInicio}
                                            onChange={(value) => setFilter({ ...filter, selectedDateInicio: value })}
                                            mode="datetime"
                                        />

                                        <LabeledDatePicker
                                            label="Fecha final"
                                            date={filter.selectedDateFinal}
                                            onChange={(value) => setFilter({ ...filter, selectedDateFinal: value })}
                                            mode="datetime"
                                        />

                                        <View style={{ position: "relative", zIndex: 4 }}>
                                            <LabeledInput
                                                label="Cedula"
                                                value={filter.selectedCedula}
                                                icon="card-outline"
                                                placeholder="Ingrese la cedula del usuario"
                                                onChangeText={(value) => {
                                                    const item = ubicaciones.find((p) => p.cedula === value);
                                                    setFilter({ ...filter, selectedCedula: value, selectedUser: item?.nombre ? item.nombre : "Usuario no encontrado" });
                                                }}
                                                data={Array.from(new Set(ubicaciones.map(u => u.cedula))).sort()}
                                                onSelectItem={(value) => {
                                                    const item = ubicaciones.find((p) => p.cedula === value);
                                                    setFilter({ ...filter, selectedCedula: value, selectedUser: item?.nombre ? item.nombre : "Usuario no encontrado" });
                                                }}
                                            />
                                        </View>
                                        <View style={{ position: "relative", zIndex: 3 }}>
                                            <LabeledInput
                                                label="Usuario"
                                                value={filter.selectedUser}
                                                icon="person-outline"
                                                placeholder="Ingrese el nombre del usuario"
                                                onChangeText={(value) => {
                                                    const item = ubicaciones.find((p) => p.nombre === value);
                                                    setFilter({ ...filter, selectedUser: value, selectedCedula: item?.cedula ? item.cedula : "Usuario no encontrado" });
                                                }}
                                                data={Array.from(new Set(ubicaciones.map(u => u.nombre))).sort()}
                                                onSelectItem={(value) => {
                                                    const item = ubicaciones.find((p) => p.nombre === value);
                                                    setFilter({ ...filter, selectedUser: value, selectedCedula: item?.cedula ? item.cedula : "Usuario no encontrado" });
                                                }}
                                            />
                                        </View>

                                        <View style={{ marginTop: 10, width: 200, alignSelf: "center" }}>
                                            <CustomButton
                                                label='Aplicar filtros'
                                                onPress={() => setShowFilters(false)}
                                            />
                                        </View>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback >
                </KeyboardAvoidingView>
            </Modal >

            <Modal visible={showStatistics} transparent animationType="fade">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={() => setShowStatistics(false)}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(0,0,0,0.4)",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableWithoutFeedback onPress={() => null}>
                                <View
                                    style={{
                                        backgroundColor: colors.backgroundContainer,
                                        borderRadius: 12,
                                        maxHeight: "95%",
                                        width: isMobileWeb || Platform.OS !== "web" ? "95%" : "85%",
                                    }}
                                >
                                    <ScrollView
                                        keyboardShouldPersistTaps="always"
                                        nestedScrollEnabled={true}
                                        contentContainerStyle={{
                                            backgroundColor: colors.backgroundContainer,
                                            paddingVertical: isMobileWeb || Platform.OS !== "web" ? 10 : 20,
                                            paddingHorizontal: isMobileWeb || Platform.OS !== "web" ? 10 : 20,
                                            borderRadius: 12,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.texto }}>
                                                Estadisticas
                                            </Text>

                                            <TouchableOpacity
                                                onPress={() => setShowStatistics(false)}
                                                style={{
                                                    padding: 5,
                                                    borderRadius: 20
                                                }}
                                            >
                                                <Text style={{ fontSize: 22, color: colors.texto }}>✕</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View
                                            style={{
                                                width: "100%",
                                                height: 1,
                                                backgroundColor: colors.linea,
                                            }}
                                        />

                                        <CustomTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                                        {activeTab === "movimiento" && (
                                            <>
                                                <View style={{ height: Dimensions.get("window").height * 0.6, width: "100%" }}>
                                                    <LargeAreaChart
                                                        data={actividadMovimientoPorHora}
                                                        title={"Actividad por movimiento"}
                                                        nameSeries={"Actividad"}
                                                    />
                                                </View>
                                            </>
                                        )}

                                        {activeTab === "muestreo" && (
                                            <>
                                                <View style={{ height: Dimensions.get("window").height * 0.6, width: "100%" }}>
                                                    <LargeAreaChart
                                                        data={actividadMuestreoPorHora}
                                                        title={"Actividad por muestreo"}
                                                        nameSeries={"Actividad"}
                                                    />
                                                </View>
                                            </>
                                        )}

                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback >
                </KeyboardAvoidingView>
            </Modal >
        </View >
    );
}