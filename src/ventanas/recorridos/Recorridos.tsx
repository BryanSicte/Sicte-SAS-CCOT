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
    const [ubicaciones, setUbicaciones] = useState("");

    const loadData = async () => {
        try {
            const response = await getUbicacionUsuarios();
            setUbicaciones(response);
            console.log(response)
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

    if (loading) {
        return <Loader visible={loading} />;
    }

    const dummyCoords = [
        { latitude: 4.648625, longitude: -74.247895 },
        { latitude: 4.652, longitude: -74.243 },
        { latitude: 4.655, longitude: -74.240 },
        { latitude: 4.658, longitude: -74.238 },
    ];

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
                    <View style={{ height: "100vh"}}>
                        <MapView coords={dummyCoords} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}