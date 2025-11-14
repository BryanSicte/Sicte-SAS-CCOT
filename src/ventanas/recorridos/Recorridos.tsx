import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navegacion/RootNavigator';
import { useGlobalStyles } from '../../estilos/GlobalStyles';
import CustomButton from '../../componentes/Button';
import CustomTable from '../../componentes/Table';
import CustomTabs, { TabItem } from '../../componentes/Tabs';
import { useThemeCustom } from '../../contexto/ThemeContext';
import { darkColors, lightColors } from '../../estilos/Colors';
import { getParqueAutomotor, getParqueAutomotorBase, getUbicacionUsuarios } from '../../servicios/Api';
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
import MapView from '../../compuestos/MapView';
import { Picker } from '@react-native-picker/picker';
import LabeledSelect from '../../compuestos/Select';
import LabeledDatePicker from '../../compuestos/Date';

type Props = NativeStackScreenProps<RootStackParamList, 'Recorridos'>;

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
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [users, setUsers] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const loadData = async () => {
        try {
            const response = await getUbicacionUsuarios();
            const coords = response.data.map((item: any) => {
                const fechaUTC = new Date(item.fechaToma);
                const fechaBogota = new Date(fechaUTC.getTime() - 5 * 60 * 60 * 1000);
                const fechaStr = fechaBogota.toISOString().split("T")[0];

                return {
                    latitude: parseFloat(item.latitud),
                    longitude: parseFloat(item.longitud),
                    nombre: item.nombreUsuario,
                    fecha: fechaStr,
                };
            });
            setUbicaciones(coords);

            const uniqueUsers = Array.from(new Set(coords.map((u: any) => u.nombre)));
            setUsers(uniqueUsers);

            if (uniqueUsers.length > 0) {
                setSelectedUser(uniqueUsers[0]);
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
        if (!selectedUser) return false;
        if (!selectedDate) return u.nombre === selectedUser;

        const uDateStr = new Date(u.fecha).toISOString().split("T")[0];
        const selectedDateStr = selectedDate.toISOString().split("T")[0];
        return u.nombre === selectedUser && uDateStr === selectedDateStr;
    });

    if (loading) {
        return <Loader visible={loading} />;
    }

    return (
        <View style={stylesGlobal.container}>
            <KeyboardAvoidingView
                style={{ flex: 1, height: Platform.OS === "web" ? "100%" : Dimensions.get("window").height }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 60, height: Platform.OS === "web" ? "100%" : Dimensions.get("window").height }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={{
                            marginVertical: 10,
                            marginHorizontal: 10,
                            height: 80,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <LabeledDatePicker
                                label="Fecha"
                                date={selectedDate}
                                onChange={(value) => setSelectedDate(value)}
                                mode="date"
                                disabled={false}
                            />
                        </View>

                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <LabeledSelect
                                label="Usuario"
                                value={selectedUser}
                                onValueChange={(value) => setSelectedUser(value)}
                                icon="person-outline"
                                items={users.map((u) => ({ label: u, value: u }))}
                                placeholder="Selecciona un usuario"
                            />
                        </View>
                    </View>

                    <View style={{ height: Platform.OS === "web" ? "Calc(100% - 40px)" : Dimensions.get("window").height }}>
                        <MapView coords={filteredCoords.length ? filteredCoords : []} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}