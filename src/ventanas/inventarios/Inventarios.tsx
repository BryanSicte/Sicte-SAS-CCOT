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
import { getInventarios, getInventariosImagen } from '../../servicios/Api';
import Toast from 'react-native-toast-message';
import { exportToExcel } from '../../utilitarios/ExportToExcel';
import { useNavigationParams } from '../../contexto/NavigationParamsContext';
import { useUserData } from '../../contexto/UserDataContext';
import { handleLogout } from '../../utilitarios/HandleLogout';
import { useUserMenu } from '../../contexto/UserMenuContext';
import { useIsMobileWeb } from '../../utilitarios/IsMobileWeb';
import Storage from "../../utilitarios/Storage";
import Loader from '../../componentes/Loader';

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
    const headers = ["Fecha", "Inventario", "Usuario", "Cedula Tecnico", "Nombre Tecnico"];
    const [data, setData] = useState<any[]>([]);
    const [dataTabla, setDataTabla] = useState<any[]>([]);
    const { getUser, logout } = useUserData();
    const { setMenuVisibleUser } = useUserMenu();
    const isMobileWeb = useIsMobileWeb();
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const response = await getInventarios();
            setData(response);
            const unicos = response.data.filter((item, index, self) =>
                index === self.findIndex(
                    (t) => t.inventario === item.inventario && t.cedulaTecnico === item.cedulaTecnico
                )
            );
            const tablaFormateada = unicos.map((item: any) => [
                item.fecha,
                item.inventario,
                item.nombreusuario,
                item.cedulaTecnico,
                item.nombreTecnico,
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
        } finally {
            setLoading(false);
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
        if (data.data.length === 0) return;
        const headers = Object.keys(data.data[0]);
        const rows = data.data.map((obj: any) => headers.map((key) => obj[key] ?? null));
        exportToExcel("Inventarios", rows, headers);
    };

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
                                    onPress={async () => {
                                        await Storage.setItem("formInventarioAccion", "Nuevo");
                                        await Storage.removeItem("formInventario");
                                        setParams("RegistrarInventarios", { label: "Inventarios" });
                                        navigation.navigate("RegistrarInventarios")
                                    }}
                                />
                            </View>

                            <View style={{ marginHorizontal: isMobileWeb ? 10 : 20 }}>
                                <CustomTable headers={headers} data={dataTabla} leer={true} editar={true}
                                    onEditar={async (item) => {
                                        setLoading(true);
                                        try {
                                            const fechaSeleccionada = item[0];
                                            const cedulaSeleccionada = item[3];
                                            const inventarioSeleccionado = item[1];

                                            const registrosRelacionados = data.data.filter(
                                                (d) =>
                                                    d.cedulaTecnico === cedulaSeleccionada &&
                                                    d.inventario === inventarioSeleccionado &&
                                                    d.fecha === fechaSeleccionada
                                            );

                                            if (registrosRelacionados.length === 0) {
                                                Toast.show({ type: "info", text1: "Sin resultados", text2: "No se encontraron registros asociados al formulario seleccionado.", position: "top" });
                                                return;
                                            }

                                            const base = registrosRelacionados[0];

                                            const materiales = registrosRelacionados.map((r) => ({
                                                codigo: r.codigo,
                                                descripcion: r.descripcion,
                                                cantidad: r.cantidad,
                                                unidadMedida: r.unidadMedida,
                                            }));

                                            const datosEditar = {
                                                fecha: base.fecha,
                                                cedulaUsuario: base.cedulaUsuario,
                                                nombreusuario: base.nombreusuario,
                                                inventario: base.inventario,
                                                cedulaTecnico: base.cedulaTecnico,
                                                nombreTecnico: base.nombreTecnico,
                                                firmaEquipos: base.firmaEquipos || null,
                                                firmaMateriales: base.firmaMateriales || null,
                                                firmaTecnico: base.firmaTecnico || null,
                                                materiales: materiales,
                                            };

                                            await Storage.setItem("formInventarioAccion", "Editar");

                                            // const responseEquipos = await getInventariosImagen(datosEditar.firmaEquipos);
                                            // if (responseEquipos?.success && responseEquipos.data?.base64) {
                                            //     datosEditar.firmaEquipos = responseEquipos.data.base64;
                                            // } else {
                                            //     Toast.show({ type: "info", text1: "Sin resultados", text2: "No se encontró la firma asociada a equipos.", position: "top" });
                                            // }

                                            const responseMateriales = await getInventariosImagen(datosEditar.firmaMateriales);
                                            if (responseMateriales?.success && responseMateriales.data?.base64) {
                                                datosEditar.firmaMateriales = responseMateriales.data.base64;
                                            } else {
                                                Toast.show({ type: "info", text1: "Sin resultados", text2: "No se encontró la firma asociada a materiales.", position: "top" });
                                            }

                                            const responseTecnico = await getInventariosImagen(datosEditar.firmaTecnico);
                                            if (responseTecnico?.success && responseTecnico.data?.base64) {
                                                datosEditar.firmaTecnico = responseTecnico.data.base64;
                                            } else {
                                                Toast.show({ type: "info", text1: "Sin resultados", text2: "No se encontró la firma asociada al técnico.", position: "top" });
                                            }

                                            await Storage.setItem("formInventario", datosEditar);
                                            setParams("RegistrarInventarios", { label: "Inventarios" });
                                            navigation.navigate("RegistrarInventarios")
                                        } catch (error) {
                                            Toast.show({
                                                type: "error", text1: "Ocurrió un error inesperado", text2: "Por favor, inténtalo nuevamente.", position: "top"
                                            });
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                />
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