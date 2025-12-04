import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navegacion/RootNavigator';
import { useGlobalStyles } from '../../estilos/GlobalStyles';
import CustomButton from '../../componentes/ui/Button';
import { useThemeCustom } from '../../contexto/ThemeContext';
import { darkColors, lightColors } from '../../estilos/Colors';
import { getUsuarios } from '../../servicios/Api';
import Toast from 'react-native-toast-message';
import { exportToExcel } from '../../utilitarios/ExportToExcel';
import { useNavigationParams } from '../../contexto/NavigationParamsContext';
import { useUserData } from '../../contexto/UserDataContext';
import { handleLogout } from '../../utilitarios/HandleLogout';
import { useUserMenu } from '../../contexto/UserMenuContext';
import { useIsMobileWeb } from '../../utilitarios/IsMobileWeb';
import Loader from '../../componentes/Loader';
import Storage from "../../utilitarios/Storage";
import Card from '../../componentes/ui/Card';
import CustomInput from '../../componentes/ui/Input';
import LabeledInput from '../../compuestos/Input';
import CustomTable from '../../componentes/ui/Table';

type Props = NativeStackScreenProps<RootStackParamList, 'ControlUsuarios'>;

export default function ControlUsuarios({ navigation }: Props) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const { setParams } = useNavigationParams();
    const { getUser, logout } = useUserData();
    const { setMenuVisibleUser } = useUserMenu();
    const isMobileWeb = useIsMobileWeb();
    const [loading, setLoading] = useState(true);
    const { logoutHandler } = handleLogout();
    const [usuarios, setUsuarios] = useState([]);
    const headers = ["Cedula", "Nombre", "Correo", "Rol", "Telefono"];
    const [usuariosTabla, setUsuariosTabla] = useState<any[]>([]);

    const loadData = async () => {
        try {
            const response = await getUsuarios();
            await Storage.setItem("dataUsers", response);
            setUsuarios(response.data)
            const tablaFormateada = response.data.map((item: any) => [
                item.cedula,
                item.nombre,
                item.correo,
                item.rol,
                item.telefono,
            ]);
            const tablaOrdenada = [...tablaFormateada].sort((a, b) => {
                const fechaA = new Date(a[0]);
                const fechaB = new Date(b[0]);
                return fechaB.getTime() - fechaA.getTime();
            });
            setUsuariosTabla(tablaOrdenada);
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

    const handleDownloadXLSXRegistros = () => {
        if (usuarios.length === 0) return;
        const headers = Object.keys(usuarios[0]);
        const rows = usuarios.map((obj: any) => headers.map((key) => obj[key] ?? null));
        exportToExcel("Parque automotor registros", rows, headers);
    };

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
                    <View style={{
                        marginTop: isMobileWeb ? 10 : 20,
                        marginHorizontal: isMobileWeb ? 10 : 20,
                        marginBottom: 10,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "stretch",
                        gap: 10
                    }}>
                        <CustomButton
                            label="Descargar"
                            variant="secondary"
                            onPress={handleDownloadXLSXRegistros}
                            style={{ height: 45 }}
                        />
                        <CustomButton
                            label="Nuevo"
                            variant="primary"
                            onPress={() => {
                                setParams("RegistrarParqueAutomotor", { label: "Parque Automotor" });
                                navigation.navigate("RegistrarParqueAutomotor")
                            }}
                            style={{ height: 45 }}
                        />
                    </View>
                    <View style={{
                        marginTop: 10,
                        marginHorizontal: isMobileWeb ? 10 : 20,
                        marginBottom: isMobileWeb ? 10 : 20,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                    }}>
                        <CustomTable headers={headers} data={usuariosTabla} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View >
    );
}
