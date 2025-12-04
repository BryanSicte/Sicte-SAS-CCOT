import React, { useEffect, useRef, useState } from "react";
import { View, Text, KeyboardAvoidingView, ScrollView, Platform, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navegacion/RootNavigator";
import CadenaDeSuministro from "./CadenaDeSuministro";
import { useThemeCustom } from "../../contexto/ThemeContext";
import { darkColors, lightColors } from "../../estilos/Colors";
import CustomButton from "../../componentes/ui/Button";
import CustomTable from "../../componentes/ui/Table";
import { useIsMobileWeb } from "../../utilitarios/IsMobileWeb";
import { useNavigationParams } from "../../contexto/NavigationParamsContext";
import { exportToExcel } from "../../utilitarios/ExportToExcel";
import { Ionicons } from "@expo/vector-icons";
import LabeledDatePicker from "../../compuestos/Date";
import LabeledInput from "../../compuestos/Input";
import LabeledSelect from "../../compuestos/Select";
import { useGlobalStyles } from "../../estilos/GlobalStyles";
import { usePlantaData } from "../../contexto/PlantaDataContext";
import Loader from "../../componentes/Loader";
import { useUserData } from "../../contexto/UserDataContext";
import Toast from "react-native-toast-message";
import { handleLogout } from "../../utilitarios/HandleLogout";
import { useUserMenu } from "../../contexto/UserMenuContext";
import Storage from "../../utilitarios/Storage";

type Props = NativeStackScreenProps<RootStackParamList, "SolicitudAbastecimientoNuevo">;

export default function SolicitudAbastecimientoNuevo({ navigation }: Props) {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const isMobileWeb = useIsMobileWeb();
    const { setParams } = useNavigationParams();
    const headers = ["Codigo SAP", "Descripcion", "Cantidad", "U.M."];
    const [data, setData] = useState<any[]>([]);
    const [dataTabla, setDataTabla] = useState<any[]>([]);
    const stylesGlobal = useGlobalStyles();
    const { planta, setPlanta } = usePlantaData();
    const [loading, setLoading] = useState(false);
    const [loadingForm, setLoadingForm] = useState(true);
    const { user, logout, getUser } = useUserData();
    const styles = stylesLocal();
    const { logoutHandler } = handleLogout();
    const { setMenuVisibleUser } = useUserMenu();
    const initialFormDataRef = useRef(null);

    const handleDownloadXLSX = () => {
        if (data.data.length === 0) return;
        const headers = Object.keys(data.data[0]);
        const rows = data.data.map((obj: any) => headers.map((key) => obj[key] ?? null));
        exportToExcel("Parque Automotor", rows, headers);
    };

    const createEmptyFormData = (user) => ({
        fecha: new Date(),
        cedulaUsuario: user?.cedula || "Pendiente",
        usuario: user?.nombre || "Pendiente",
        consumo: "",
        solicitud: "",
        sede: "",
        segmento: "",
        tiempoAbastecimiento: new Date(),
        idOt: "",
        fechaEstCierre: new Date(),
        facturacionEsperada: "",
        grupo: "",
        materiales: [],
    });

    const createEmptyNuevoMaterial = () => ({
        codigo: "",
        descripcion: "",
        cantidad: "",
        unidadMedida: "",
    });

    const [formData, setFormData] = useState(createEmptyFormData(user));
    const [nuevoMaterial, setNuevoMaterial] = useState(createEmptyNuevoMaterial());

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
    }, []);

    useEffect(() => {
        const saveFormData = async () => {
            try {
                await Storage.setItem("formSolicitudAbastecimiento", formData);
            } catch (error) {
                console.error("Error guardando el formulario:", error);
            }
        };
        if (!loadingForm) {
            saveFormData();
        }
    }, [formData]);

    useEffect(() => {
        const loadForm = async () => {
            const savedData = await Storage.getItem("formSolicitudAbastecimiento");
            if (savedData === null) {
                setFormData(createEmptyFormData(user));
                initialFormDataRef.current = {};
                setLoadingForm(false);
                return;
            }
            const parsed = typeof savedData === "string" ? JSON.parse(savedData) : savedData;
            const data = {
                fecha: new Date(parsed.fecha),
                cedulaUsuario: user?.cedula || "Pendiente",
                usuario: user?.nombre || "Pendiente",
                consumo: parsed.consumo,
                solicitud: parsed.solicitud,
                sede: parsed.sede,
                segmento: parsed.segmento,
                tiempoAbastecimiento: new Date(parsed.tiempoAbastecimiento),
                idOt: parsed.idOt,
                fechaEstCierre: new Date(parsed.fechaEstCierre),
                facturacionEsperada: parsed.facturacionEsperada,
                grupo: parsed.grupo,
                materiales: parsed.materiales,
            };
            setFormData(data);
            initialFormDataRef.current = data;
            setLoadingForm(false);
        };
        loadForm();
    }, [user]);

    const handleForm = async () => {
        // if (!formData.sede) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la sede.", position: "top" }); return; }
        // if (!formData.placa) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la placa.", position: "top" }); return; }
        // if (formData.placa.length < 5 || formData.placa.length > 6) { Toast.show({ type: "info", text1: "Placa inválida", text2: "La placa debe tener entre 5 y 6 caracteres.", position: "top" }); return; }
        // const placaPattern = /^[A-Z]{3}[0-9]{2}[A-Z0-9]{1}$/;
        // if (!placaPattern.test(formData.placa)) { Toast.show({ type: "info", text1: "Placa inválida", text2: "La placa debe tener el formato ABC12D o ABC123.", position: "top" }); return; }
        // if (!formData.cedula) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la cedula.", position: "top" }); return; }
        // if (formData.cedula === 'Usuario no encontrado') { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese un usuario correcto.", position: "top" }); return; }
        // if (!formData.nombre) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la nombre.", position: "top" }); return; }
        // if (formData.nombre === 'Usuario no encontrado') { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese un usuario correcto.", position: "top" }); return; }
        // if (!formData.estado) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la estado.", position: "top" }); return; }

        // try {
        //     setLoading(true);
        //     const dataEnviar = {
        //         ...formData,
        //         fecha: formatearFecha(formData.fecha),
        //     };
        //     const response = await postParqueAutomotor(dataEnviar);
        //     Toast.show({ type: "success", text1: response.messages.message1, text2: response.messages.message2, position: "top" });
        //     setTimeout(() => {
        //         setFormData(createEmptyFormData(user));
        //         navigation.replace("ParqueAutomotor", { label: "Parque Automotor" });
        //     }, 2000);
        // } catch (error) {
        //     Toast.show({ type: "error", text1: error.data.messages.message1, text2: error.data.messages.message2, position: "top" });
        // } finally {
        //     setLoading(false);
        // }
    };

    const handleGuardar = () => {
        if (!nuevoMaterial.codigo) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese el codigo.", position: "top" }); return; }
        if (nuevoMaterial.codigo === 'Material no encontrado') { Toast.show({ type: "info", text1: "Falta información", text2: "Verifica la descripcion o el código del material e inténtalo nuevamente.", position: "top" }); return; }
        if (!nuevoMaterial.descripcion) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la descripcion.", position: "top" }); return; }
        if (nuevoMaterial.descripcion === 'Material no encontrado') { Toast.show({ type: "info", text1: "Falta información", text2: "Verifica la descripcion o el código del material e inténtalo nuevamente.", position: "top" }); return; }
        if (!nuevoMaterial.cantidad) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la cantidad.", position: "top" }); return; }
        const materialYaExiste = formData.materiales.some((m) => m.codigo?.toLowerCase() === nuevoMaterial.codigo?.toLowerCase());
        if (materialYaExiste) { Toast.show({ type: "info", text1: "Material duplicado", text2: "Este código de material ya fue ingresado.", position: "top" }); return; }

        setFormData((prevData) => ({
            ...prevData,
            materiales: [...prevData.materiales, nuevoMaterial],
        }));

        setNuevoMaterial(createEmptyNuevoMaterial());
    };

    if (loading) {
        return <Loader visible={loading} />;
    }

    return (
        <CadenaDeSuministro navigation={navigation} defaultPage="Solicitud de Abastecimiento">
            <View style={[stylesGlobal.container, { height: "100%", paddingHorizontal: 0 }]} >
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
                            marginTop: isMobileWeb ? 0 : 0,
                            marginLeft: isMobileWeb ? 10 : 20,
                            marginBottom: isMobileWeb ? 5 : 10,
                        }}>
                            <Pressable
                                onPress={() => {
                                    navigation.navigate("SolicitudAbastecimiento");
                                }}
                                style={({ pressed, hovered }: any) => [
                                    {
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        padding: 5,
                                        borderRadius: 5,
                                        alignSelf: "flex-start",
                                    },
                                    hovered && { backgroundColor: colors.backgroundHover },
                                    pressed && { backgroundColor: colors.backgroundPressed },
                                ]}
                            >
                                {(state: any) => (
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Ionicons name="arrow-back" size={30} color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono} style={{}} />
                                        <Text style={[stylesGlobal.subTitle, { textAlign: "center", marginLeft: 10, marginRight: 5, color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : colors.texto }]}>Registrar Solicitud</Text>
                                    </View>
                                )}
                            </Pressable>
                        </View>

                        <View style={{
                            borderRadius: 5,
                            marginVertical: isMobileWeb ? 5 : 10,
                            marginHorizontal: isMobileWeb ? 10 : 20,
                            alignSelf: "stretch",
                        }}>
                            <LabeledDatePicker
                                label="Fecha"
                                date={formData.fecha}
                                onChange={(value) => setFormData({ ...formData, fecha: value })}
                                mode="datetime"
                                showSeconds
                                disabled
                            />
                            <LabeledInput
                                label="Cedula usuario"
                                placeholder="Ingrese la cedula"
                                value={formData.cedulaUsuario}
                                onChangeText={(text) => setFormData({ ...formData, cedulaUsuario: text })}
                                icon="card-outline"
                                disabled
                            />
                            <LabeledInput
                                label="Nombre usuario"
                                placeholder="Ingrese el nombre"
                                value={formData.usuario}
                                onChangeText={(text) => setFormData({ ...formData, usuario: text })}
                                icon="person-outline"
                                disabled
                            />
                            <LabeledSelect
                                label="Método de consumo"
                                value={formData.consumo}
                                onValueChange={(value) => setFormData({ ...formData, consumo: value })}
                                icon="business-outline"
                                items={[
                                    { label: "Demanda", value: "Demanda" },
                                    { label: "Promedio", value: "Promedio" },
                                ]}
                                placeholder="Selecciona una sede"
                            />
                            {formData.consumo === "Demanda" && (
                                <LabeledSelect
                                    label="Tipo de solicitud"
                                    value={formData.solicitud}
                                    onValueChange={(value) => setFormData({ ...formData, solicitud: value })}
                                    icon="business-outline"
                                    items={[
                                        { label: "Materiales", value: "Materiales" },
                                        { label: "Servicios", value: "Servicios" },
                                    ]}
                                    placeholder="Selecciona una sede"
                                />
                            )}
                            <LabeledSelect
                                label="Sede"
                                value={formData.sede}
                                onValueChange={(value) => setFormData({ ...formData, sede: value })}
                                icon="business-outline"
                                items={[
                                    { label: "Armenia", value: "Armenia" },
                                    { label: "Bogota Enel", value: "Bogota Enel" },
                                    { label: "Bogota Ferias", value: "Bogota Ferias" },
                                    { label: "Bogota San Cipriano", value: "Bogota San Cipriano" },
                                    { label: "Manizales", value: "Manizales" },
                                    { label: "Pereira", value: "Pereira" },
                                    { label: "Zipaquira", value: "Zipaquira" },
                                ]}
                                placeholder="Selecciona una sede"
                            />
                            <LabeledSelect
                                label="Segmento"
                                value={formData.segmento}
                                onValueChange={(value) => setFormData({ ...formData, segmento: value })}
                                icon="briefcase-outline"
                                items={[
                                    { label: "Corporativo", value: "Corporativo" },
                                    { label: "Red Externa", value: "Red Externa" },
                                    { label: "Mantenimiento", value: "Mantenimiento" },
                                    { label: "Operaciones", value: "Operaciones" },
                                ]}
                                placeholder="Selecciona una sede"
                            />
                            {formData.consumo === "Demanda" && (
                                <>
                                    <LabeledDatePicker
                                        label="Tiempo abastecimiento"
                                        date={formData.tiempoAbastecimiento}
                                        onChange={(value) => setFormData({ ...formData, tiempoAbastecimiento: value })}
                                        mode="datetime"
                                        showSeconds
                                    />
                                    <LabeledInput
                                        label="ID / OT"
                                        value={formData.idOt}
                                        icon="clipboard-outline"
                                        placeholder="Ingrese el ID / OT"
                                        onChangeText={(value) => {
                                            setFormData({ ...formData, idOt: value });
                                        }}
                                    />
                                    <LabeledDatePicker
                                        label="Fecha estimada de cierre del proyecto"
                                        date={formData.fechaEstCierre}
                                        onChange={(value) => setFormData({ ...formData, fechaEstCierre: value })}
                                        mode="datetime"
                                        showSeconds
                                    />
                                    <LabeledInput
                                        label="Facturación esperada"
                                        placeholder="Ingrese la facturación esperada"
                                        value={`$ ${formData.facturacionEsperada}`}
                                        keyboardType="decimal-pad"
                                        onChangeText={(value) => {
                                            let limpio = value.replace(/[^0-9.]/g, "");
                                            const partes = limpio.split(".");

                                            if (partes.length > 2) return;
                                            if (limpio.startsWith(".")) limpio = "0" + limpio;
                                            if (partes[1]?.length > 2) return;
                                            setFormData({ ...formData, facturacionEsperada: limpio });
                                        }}
                                        icon="trending-up-outline"
                                    />
                                    <LabeledSelect
                                        label="Grupo"
                                        value={formData.grupo}
                                        onValueChange={(value) => setFormData({ ...formData, grupo: value })}
                                        icon="folder-outline"
                                        items={[
                                            { label: "G01", value: "G01" },
                                            { label: "G02", value: "G02" },
                                            { label: "G03", value: "G03" },
                                            { label: "G06", value: "G06" },
                                            { label: "G08", value: "G08" },
                                            { label: "G09", value: "G09" },
                                        ]}
                                        placeholder="Selecciona un grupo"
                                    />
                                </>
                            )}
                            <Text style={[stylesGlobal.texto, styles.label]}>Materiales o servicios:</Text>
                            <Text style={[stylesGlobal.texto, styles.label, { alignSelf: "flex-end" }]}>Agregar material o servicio</Text>
                            <View style={{ position: "relative", zIndex: 4 }}>
                                <LabeledInput
                                    label="Codigo SAP"
                                    value={nuevoMaterial.codigo}
                                    icon="pricetag-outline"
                                    placeholder="Ingrese el codigo sap"
                                    onChangeText={(value) => {
                                        const plantaItem = planta.data.find((p) => p.nit === value);
                                        setNuevoMaterial({ ...nuevoMaterial, codigo: value, descripcion: plantaItem?.nombre ? plantaItem.nombre : "Material no encontrado" });
                                    }}
                                    data={(planta?.data ?? []).map((m) => m.nit)}
                                    onSelectItem={(value) => {
                                        const plantaItem = planta.data.find((p) => p.nit === value);
                                        setNuevoMaterial({ ...nuevoMaterial, codigo: value, descripcion: plantaItem?.nombre ? plantaItem.nombre : "Material no encontrado" });
                                    }}
                                />
                            </View>
                            <View style={{ position: "relative", zIndex: 3 }}>
                                <LabeledInput
                                    label="Descripcion"
                                    value={nuevoMaterial.descripcion}
                                    icon="document-text-outline"
                                    placeholder="Ingrese la descripcion"
                                    onChangeText={(value) => {
                                        const plantaItem = planta.data.find((p) => p.nombre === value);
                                        setNuevoMaterial({ ...nuevoMaterial, descripcion: value, codigo: plantaItem?.nit ? plantaItem.nit : "Material no encontrado" });
                                    }}
                                    data={(planta?.data ?? []).map((m) => m.nombre)}
                                    onSelectItem={(value) => {
                                        const plantaItem = planta.data.find((p) => p.nombre === value);
                                        setNuevoMaterial({ ...nuevoMaterial, descripcion: value, codigo: plantaItem?.nit ? plantaItem.nit : "Material no encontrado" });
                                    }}
                                />
                            </View>
                            <LabeledInput
                                label="Cantidad"
                                placeholder="Ingrese la cantidad"
                                value={nuevoMaterial.cantidad}
                                keyboardType="decimal-pad"
                                onChangeText={(value) => {
                                    const soloNumeros = value.replace(/[^0-9.]/g, "");
                                    const partes = soloNumeros.split(".");
                                    if (partes.length > 2) return;
                                    let limpio = soloNumeros;
                                    if (limpio.startsWith(".")) {
                                        limpio = "0" + limpio;
                                    }
                                    if (/^\d+(\.\d*)?$/.test(limpio) || limpio === "") {
                                        setNuevoMaterial({ ...nuevoMaterial, cantidad: limpio });
                                    }
                                }}
                                icon="calculator-outline"
                            />
                            <LabeledInput
                                icon="scale-outline"
                                label="Unidad de medida"
                                placeholder="Ingrese la unidad de medida"
                                value={nuevoMaterial.unidadMedida}
                                onChangeText={(text) => setNuevoMaterial({ ...nuevoMaterial, unidadMedida: text })}
                                disabled
                            />
                            <View style={{ alignSelf: "flex-start", marginTop: 5 }}>
                                <CustomButton label="Agregar" onPress={handleGuardar} />
                            </View>
                            <Text style={[stylesGlobal.texto, styles.label, { alignSelf: "flex-end", marginBottom: 10 }]}>Materiales o servicios ingresados</Text>
                            <CustomTable
                                headers={headers}
                                data={formData.materiales.map((m) => [m.codigo, m.descripcion, m.cantidad, m.unidadMedida])}
                                eliminar={true}
                                onEliminar={(item) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        materiales: prev.materiales.filter((m) => m.codigo !== item[0]),
                                    }));
                                }}
                            />
                        </View>

                        <View style={{ alignSelf: "center" }}>
                            <CustomButton label="Enviar" variant="secondary" onPress={() => handleForm()} loading={loading} disabled={loading} />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </CadenaDeSuministro>
    );
}

const stylesLocal = () => {

    return StyleSheet.create({
        label: {
            fontWeight: "500",
            marginBottom: 5,
        },
    });
};
