import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Modal, Image, Pressable } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';

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
    const [modalVisible, setModalVisible] = useState(false);
    const [datosModal, setDatosModal] = useState<any>(null);
    const [forceDesktopMode, setForceDesktopMode] = useState(false);
    const isMobile = !forceDesktopMode && isMobileWeb;
    const { logoutHandler } = handleLogout();

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

    const [activeTab, setActiveTab] = useState<"registros" | "reportes" | "config">(
        "registros"
    );

    const handleDownloadXLSX = () => {
        if (data.data.length === 0) return;
        const headers = Object.keys(data.data[0]);
        const rows = data.data.map((obj: any) => headers.map((key) => obj[key] ?? null));
        exportToExcel("Inventarios", rows, headers);
    };

    const cargarFormularioInventario = async (item: any, modo: "Editar" | "Leer") => {

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

        const usuarios = Object.values(
            registrosRelacionados.reduce((acc, r) => {
                acc[r.cedulaUsuario] = {
                    cedula: r.cedulaUsuario,
                    nombre: r.nombreusuario
                };
                return acc;
            }, {})
        ).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));

        const materiales = registrosRelacionados.map((r) => ({
            codigo: r.codigo,
            descripcion: r.descripcion,
            cantidad: r.cantidad,
            unidadMedida: r.unidadMedida,
        }));

        const datosEditar = {
            fecha: base.fecha,
            ...(modo === "Editar" ? { cedulaUsuario: base.cedulaUsuario } : {}),
            ...(modo === "Editar" ? { nombreusuario: base.nombreusuario } : {}),
            ...(modo === "Leer" ? { usuarios: usuarios } : {}),
            inventario: base.inventario,
            cedulaTecnico: base.cedulaTecnico,
            nombreTecnico: base.nombreTecnico,
            firmaEquipos: base.firmaEquipos || null,
            firmaMateriales: base.firmaMateriales || null,
            firmaTecnico: base.firmaTecnico || null,
            materiales: materiales,
        };

        await Storage.setItem("formInventarioAccion", modo);

        const cargarFirma = async (firmaKey: string | null, nombre: string) => {
            if (!firmaKey) return null;
            try {
                const response = await getInventariosImagen(firmaKey);
                if (response?.success && response.data?.base64) return response.data.base64;
                Toast.show({ type: "info", text1: "Sin resultados", text2: `No se encontró la firma asociada a ${nombre}.`, position: "top" });
                return null;
            } catch (error) {
                Toast.show({ type: "info", text1: "Sin resultados", text2: `No se encontró la firma asociada a ${nombre}.`, position: "top" });
                return null;
            }
        };

        datosEditar.firmaEquipos = await cargarFirma(datosEditar.firmaEquipos, "equipos");
        datosEditar.firmaMateriales = await cargarFirma(datosEditar.firmaMateriales, "materiales");
        datosEditar.firmaTecnico = await cargarFirma(datosEditar.firmaTecnico, "técnico");

        await Storage.setItem("formInventario", datosEditar);

        return datosEditar;
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
                                    onLeer={async (item) => {
                                        setLoading(true);
                                        try {
                                            const datosLeer = await cargarFormularioInventario(item, "Leer");
                                            const firmasFaltantes = [];
                                            if (!datosLeer.firmaTecnico) firmasFaltantes.push("técnico");
                                            if (!datosLeer.firmaMateriales) firmasFaltantes.push("materiales");
                                            if (!datosLeer.firmaEquipos) firmasFaltantes.push("equipos");
                                            if (firmasFaltantes.length > 0) {
                                                Toast.show({ type: "info", text1: "Vista no disponible", text2: `No se puede abrir la vista porque faltan las firmas de: ${firmasFaltantes.join(", ")}.`, position: "top" });
                                                return
                                            }

                                            setDatosModal(datosLeer)
                                            setModalVisible(true);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    onEditar={async (item) => {
                                        setLoading(true);
                                        try {
                                            const datosEditar = await cargarFormularioInventario(item, "Editar");
                                            if (!datosEditar) return;

                                            setParams("RegistrarInventarios", { label: "Inventarios" });
                                            navigation.navigate("RegistrarInventarios");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                />
                            </View>

                            <Modal
                                visible={modalVisible}
                                animationType="fade"
                                transparent={true}
                                onRequestClose={() => setModalVisible(false)}
                            >
                                <Pressable
                                    onPress={() => setModalVisible(false)}
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                    }}
                                >
                                    <Pressable
                                        onPress={(e) => e.stopPropagation()}
                                        style={{
                                            width: isMobile ? "95%" : "80%",
                                            maxHeight: isMobile ? "95%" : "90%",
                                            backgroundColor: "#fff",
                                            borderRadius: 10,
                                            padding: isMobile ? 10 : 20,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", alignSelf: "flex-end", marginBottom: 10, }}>
                                            <View
                                                style={{

                                                }}
                                            >
                                                <CustomButton
                                                    label="Generar PDF"
                                                    onPress={async () => {
                                                        if (Platform.OS === "web") {
                                                            try {
                                                                const html2canvas = (await import("html2canvas")).default;
                                                                const { default: JsPDF } = await import("jspdf/dist/jspdf.es.min.js");

                                                                setForceDesktopMode(true);

                                                                await new Promise((resolve) => setTimeout(resolve, 200));
                                                                const element = document.getElementById("modalLeerInventario");
                                                                if (!element) return;

                                                                setForceDesktopMode(false);

                                                                const captureWidthPx = 1000;
                                                                const captureScale = 3;

                                                                const clone = element.cloneNode(true) as HTMLElement;

                                                                const wrapper = document.createElement("div");
                                                                wrapper.setAttribute("id", "modal-capture-wrapper");
                                                                wrapper.style.position = "absolute";
                                                                wrapper.style.left = "-99999px";
                                                                wrapper.style.top = "0";
                                                                wrapper.style.width = `${captureWidthPx}px`;
                                                                wrapper.style.overflow = "visible";
                                                                wrapper.style.zIndex = "99999";
                                                                wrapper.appendChild(clone);
                                                                document.body.appendChild(wrapper);

                                                                try {
                                                                    clone.style.width = `${captureWidthPx}px`;
                                                                    clone.style.height = "auto";
                                                                    clone.style.overflow = "visible";

                                                                    const imgs = Array.from(clone.getElementsByTagName("img")) as HTMLImageElement[];
                                                                    imgs.forEach((img) => {
                                                                        if (!img.src.startsWith("data:") && !img.crossOrigin) {
                                                                            try {
                                                                                img.crossOrigin = "anonymous";
                                                                            } catch (e) {
                                                                            }
                                                                        }
                                                                    });

                                                                    await Promise.all(
                                                                        imgs.map(
                                                                            (img) =>
                                                                                new Promise<void>((resolve) => {
                                                                                    if (img.complete && img.naturalWidth !== 0) resolve();
                                                                                    else {
                                                                                        img.onload = () => resolve();
                                                                                        img.onerror = () => resolve();
                                                                                    }
                                                                                })
                                                                        )
                                                                    );

                                                                    const canvas = await html2canvas(clone, {
                                                                        scale: captureScale,
                                                                        useCORS: true,
                                                                        allowTaint: true,
                                                                        backgroundColor: "#ffffff",
                                                                        logging: false,
                                                                    });

                                                                    const imgData = canvas.toDataURL("image/png");

                                                                    const pdf = new JsPDF({
                                                                        orientation: "portrait",
                                                                        unit: "mm",
                                                                        format: "letter",
                                                                    });

                                                                    const pdfWidth = pdf.internal.pageSize.getWidth();
                                                                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                                                                    let heightLeft = pdfHeight;
                                                                    let position = 0;

                                                                    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
                                                                    heightLeft -= pdf.internal.pageSize.getHeight();

                                                                    while (heightLeft > 0) {
                                                                        position = heightLeft - pdfHeight;
                                                                        pdf.addPage();
                                                                        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
                                                                        heightLeft -= pdf.internal.pageSize.getHeight();
                                                                    }

                                                                    pdf.save(`Inventario_${datosModal?.inventario}_${datosModal?.cedulaTecnico}.pdf`);

                                                                    Toast.show({
                                                                        type: "success",
                                                                        text1: "PDF generado correctamente",
                                                                        text2: "Incluye logo y firmas.",
                                                                        position: "top",
                                                                    });
                                                                } catch (err) {
                                                                    console.error("Error generando PDF desde clon:", err);
                                                                    Toast.show({ type: "error", text1: "Error", text2: "No se pudo generar el PDF." });
                                                                } finally {
                                                                    const existing = document.getElementById("modal-capture-wrapper");
                                                                    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
                                                                }
                                                            } catch (err) {
                                                                console.error("Error generando PDF web:", err);
                                                            }
                                                        } else {
                                                            try {
                                                                const { printToFileAsync } = await import("expo-print");
                                                                const { shareAsync } = await import("expo-sharing");

                                                                const html = `
                                                                    <h1>Inventario</h1>
                                                                    <p>Fecha: ${datosModal?.fecha}</p>
                                                                    <p>Técnico: ${datosModal?.nombreTecnico} (${datosModal?.cedulaTecnico})</p>
                                                                    <p>Inventario: ${datosModal?.inventario}</p>
                                                                    <h2>Materiales</h2>
                                                                    <ul>
                                                                        ${datosModal?.materiales.map(
                                                                            m => `<li>${m.codigo} - ${m.descripcion} - ${m.cantidad} ${m.unidadMedida}</li>`
                                                                        ).join("")}
                                                                    </ul>
                                                                `;

                                                                const file = await printToFileAsync({ html });
                                                                await shareAsync(file.uri);

                                                                Toast.show({ type: "success", text1: "PDF generado y listo para compartir" });
                                                            } catch (err) {
                                                                console.error("Error generando PDF móvil:", err);
                                                                Toast.show({ type: "error", text1: "Error", text2: "No se pudo generar el PDF." });
                                                            }
                                                        }
                                                    }}
                                                />
                                            </View>
                                            <Pressable
                                                onPress={() => setModalVisible(false)}
                                                style={{
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: 30,
                                                    marginLeft: 60,
                                                }}
                                            >
                                                <Ionicons name="close" size={22} color="#333" />
                                            </Pressable>
                                        </View>

                                        <View style={{ height: 1, backgroundColor: "#000" }}></View>

                                        <ScrollView
                                            style={{ paddingHorizontal: isMobile ? 10 : 40, paddingVertical: isMobile ? 10 : 30 }}
                                            {...(Platform.OS === "web" ? { id: "modalLeerInventario" } : {})}
                                        >
                                            <View style={{ alignItems: "flex-start" }}>
                                                <Image
                                                    source={{ uri: "https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297342/Logo_Original_homvl9.png" }}
                                                    style={{ width: 200, height: 100, resizeMode: "contain" }}
                                                />
                                            </View>
                                            <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
                                                {datosModal?.inventario}
                                            </Text>
                                            <View style={{ marginBottom: 5, flexDirection: isMobile ? "column" : "row" }}>
                                                <Text style={{ fontWeight: "bold" }}>Fecha: </Text>
                                                <Text>{datosModal?.fecha}</Text>
                                            </View>
                                            <View style={{ marginBottom: 5, flexDirection: isMobile ? "column" : "row" }}>
                                                <Text style={{ fontWeight: "bold" }}>Operador de inventario materiales: </Text>
                                                <Text>{datosModal?.usuarios?.map(u => u.nombre).join(isMobile ? '\n' : ', ')}</Text>
                                            </View>
                                            <View style={{ marginBottom: 5, flexDirection: isMobile ? "column" : "row" }}>
                                                <Text style={{ fontWeight: "bold" }}>Cédula técnico: </Text>
                                                <Text>{datosModal?.cedulaTecnico}</Text>
                                            </View>
                                            <View style={{ marginBottom: 5, flexDirection: isMobile ? "column" : "row" }}>
                                                <Text style={{ fontWeight: "bold" }}>Nombre técnico: </Text>
                                                <Text>{datosModal?.nombreTecnico?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}</Text>
                                            </View>

                                            <Text style={{ marginTop: 20, fontWeight: "bold" }}>Materiales:</Text>
                                            <View style={{ marginVertical: 20, marginHorizontal: isMobile ? 0 : 20 }}>
                                                <View style={{ flexDirection: "row", marginTop: 5, borderBottomWidth: 1, borderBottomColor: "#000", paddingBottom: 5 }}>
                                                    <Text style={{ flex: 1, fontWeight: "bold" }}>Código</Text>
                                                    <Text style={{ flex: 2, fontWeight: "bold" }}>Descripción</Text>
                                                    <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>Cantidad</Text>
                                                    <Text style={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>U.M.</Text>
                                                </View>
                                                {datosModal?.materiales?.map((m, i) => (
                                                    <View
                                                        key={i}
                                                        style={{
                                                            flexDirection: "row",
                                                            paddingVertical: 5,
                                                            borderBottomWidth: 0.5,
                                                            borderBottomColor: "#ccc",
                                                        }}
                                                    >
                                                        <Text style={{ flex: 1 }}>{m.codigo}</Text>
                                                        <Text style={{ flex: 2 }}>{m.descripcion}</Text>
                                                        <Text style={{ flex: 1, textAlign: "center" }}>{m.cantidad}</Text>
                                                        <Text style={{ flex: 1, textAlign: "center" }}>{m.unidadMedida}</Text>
                                                    </View>
                                                ))}
                                            </View>

                                            <Text style={{ marginTop: 10, fontWeight: "bold" }}>Firmas:</Text>
                                            <View style={{ flexDirection: isMobile ? "column" : "row" }}>
                                                {datosModal?.firmaMateriales && (
                                                    <View style={{ flexDirection: "column", marginHorizontal: 20, marginVertical: 20 }}>
                                                        <Image source={{ uri: datosModal.firmaMateriales }} style={{ width: 200, height: 100 }} />
                                                        <View style={{ height: 1, backgroundColor: "#000" }}></View>
                                                        <Text>Operador de inventario materiales</Text>
                                                        <Text>
                                                            {datosModal?.usuarios
                                                                ?.map(u => `${u.nombre}\nCC: ${u.cedula}`)
                                                                .join('\n')}
                                                        </Text>
                                                    </View>
                                                )}
                                                {datosModal?.firmaTecnico && (
                                                    <View style={{ flexDirection: "column", marginHorizontal: 20, marginVertical: 20 }}>
                                                        <Image source={{ uri: datosModal.firmaTecnico }} style={{ width: 200, height: 100 }} />
                                                        <View style={{ height: 1, backgroundColor: "#000" }}></View>
                                                        <Text>Técnico</Text>
                                                        <Text>{datosModal?.nombreTecnico?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}</Text>
                                                        <Text>CC: {datosModal?.cedulaTecnico}</Text>
                                                    </View>
                                                )}
                                                {datosModal?.firmaEquipos && (
                                                    <View style={{ flexDirection: "column", marginHorizontal: 20, marginVertical: 20 }}>
                                                        <Image source={{ uri: datosModal.firmaEquipos }} style={{ width: 200, height: 100 }} />
                                                        <View style={{ height: 1, backgroundColor: "#000" }}></View>
                                                        <Text>Operador de inventario equipos</Text>
                                                        <Text>Segura Avila Duvan Yamid</Text>
                                                        <Text>CC: 1054780199</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </ScrollView>
                                    </Pressable>
                                </Pressable>
                            </Modal>
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
