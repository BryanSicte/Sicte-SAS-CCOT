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
import { KeyboardAwareScrollView } from "../../mocks/KeyboardAwareScrollView";
import BottomSheet, { BottomSheetView } from "../../mocks/BottomSheet";

type Props = NativeStackScreenProps<RootStackParamList, 'Recorridos'>;

function generarHorasEntreFechas(inicio, fin) {
    const horas = [];
    const actual = new Date(inicio);

    while (actual <= fin) {
        horas.push(new Date(actual));
        actual.setHours(actual.getHours() + 1);
    }

    return horas;
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
    const [zoomRange, setZoomRange] = useState(null);

    const loadData = async () => {
        try {
            const response = await getUbicacionUsuarios();
            const coords = response.data.map((item: any) => {
                const fechaUTC = new Date(item.fechaToma);
                const fechaBogota = new Date(fechaUTC.getTime() - 5 * 60 * 60 * 1000);

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
        filter.selectedDateFinal
    );

    const actividad = {};
    horasRango.forEach(date => {
        actividad[date.getTime()] = 0;
    });

    filteredCoords.forEach(p => {
        const timestamp = new Date(
            p.fecha.getFullYear(),
            p.fecha.getMonth(),
            p.fecha.getDate(),
            p.fecha.getHours(),
            0, 0, 0
        ).getTime();

        const velocidad = p.velocidad || 0;

        if (actividad.hasOwnProperty(timestamp)) {
            if (velocidad > 1) {
                actividad[timestamp] += 1;
            }
        }
    });

    const actividadPorHora = Object.keys(actividad).map(ts => [
        Number(ts),
        actividad[ts],
    ]);

    const coordsParaMapa = !zoomRange
        ? filteredCoords
        : filteredCoords.filter((p) => {
            const t = p.fecha.getTime();
            return t >= zoomRange.start && t <= zoomRange.end;
        });

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["20%", "80%"], []);

    if (loading) {
        return <Loader visible={loading} />;
    }

    return (
        <View style={stylesGlobal.container}>

            {/* <View style={{ height: Platform.OS === "web" ? "100%" : Dimensions.get("window").height, width: "100%" }}>
                <View style={{ height: Platform.OS === "web" ? "60%" : (Dimensions.get("window").height * 0.6) }}>
                    <MapViewNative coords={coordsParaMapa.length ? coordsParaMapa : []} />
                </View>
                <View style={{ height: Platform.OS === "web" ? "40%" : (Dimensions.get("window").height * 0.3) }}>
                    <LargeAreaChart 
                    data={actividadPorHora} 
                    title={"Actividad por movimiento"} 
                    nameSeries={"Actividad"} 
                    onZoomChange={(range) => {
                        setZoomRange(range);
                    }} 
                        />
                </View>
            </View> */}

            <View style={{ flex: 1 }}>
                <MapViewNative coords={coordsParaMapa.length ? coordsParaMapa : []} />

                <BottomSheet
                    ref={sheetRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                >
                    <BottomSheetView
                        style={{
                            flex: 1,
                            padding: 10,
                            height: Platform.OS === "web"
                                ? "80%"
                                : Dimensions.get("window").height * 0.65,
                        }}
                    >
                        <LargeAreaChart
                            data={actividadPorHora}
                            title={"Actividad por movimiento"}
                            nameSeries={"Actividad"}
                            onZoomChange={(range) => {
                                setZoomRange(range);
                            }}
                        />
                    </BottomSheetView>
                </BottomSheet>
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

            <Modal visible={showFilters} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowFilters(false)}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <TouchableWithoutFeedback onPress={() => null}>
                            <KeyboardAwareScrollView
                                enableOnAndroid
                                extraScrollHeight={50}
                                contentContainerStyle={{
                                    backgroundColor: colors.backgroundContainer,
                                    paddingVertical: 20,
                                    paddingHorizontal: 20,
                                    borderRadius: 12,
                                    marginTop: 100,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBottom: 10
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
                            </KeyboardAwareScrollView>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback >
            </Modal >
        </View >
    );
}