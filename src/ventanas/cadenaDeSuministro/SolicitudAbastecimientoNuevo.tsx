import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, ScrollView, Platform, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navegacion/RootNavigator";
import CadenaDeSuministro from "./CadenaDeSuministro";
import { useThemeCustom } from "../../contexto/ThemeContext";
import { darkColors, lightColors } from "../../estilos/Colors";
import CustomButton from "../../componentes/Button";
import CustomTable from "../../componentes/Table";
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

type Props = NativeStackScreenProps<RootStackParamList, "SolicitudAbastecimientoNuevo">;

export default function SolicitudAbastecimientoNuevo({ navigation }: Props) {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const isMobileWeb = useIsMobileWeb();
    const { setParams } = useNavigationParams();
    const headers = ["Fecha", "Usuario", "Sede", "Placa", "Estado", "Nombre"];
    const [data, setData] = useState<any[]>([]);
    const [dataTabla, setDataTabla] = useState<any[]>([]);
    const stylesGlobal = useGlobalStyles();
    const { planta, setPlanta } = usePlantaData();
    const [loading, setLoading] = useState(false);
    const { user, logout, getUser } = useUserData();

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
        codigo: "",
        descripcion: "",
        cantidad: "",
        unidadMedida: "",
        sede: "",
        segmento: "",
        tiempoAbastecimiento: new Date(),
        idOt: "",
        fechaEstCierre: new Date(),
        facturacionEsperada: "",
        grupo: "",
    });

    const [formData, setFormData] = useState(createEmptyFormData(user));

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
                            <View style={{ position: "relative", zIndex: 4 }}>
                                <LabeledInput
                                    label="Codigo SAP"
                                    value={formData.codigo}
                                    icon="pricetag-outline"
                                    placeholder="Ingrese el codigo sap"
                                    onChangeText={(value) => {
                                        const plantaItem = planta.data.find((p) => p.nit === value);
                                        setFormData({ ...formData, codigo: value, descripcion: plantaItem?.nombre ? plantaItem.nombre : "Material no encontrado" });
                                    }}
                                    data={(planta?.data ?? []).map((m) => m.nit)}
                                    onSelectItem={(value) => {
                                        const plantaItem = planta.data.find((p) => p.nit === value);
                                        setFormData({ ...formData, codigo: value, descripcion: plantaItem?.nombre ? plantaItem.nombre : "Material no encontrado" });
                                    }}
                                />
                            </View>
                            <View style={{ position: "relative", zIndex: 3 }}>
                                <LabeledInput
                                    label="Descripcion"
                                    value={formData.descripcion}
                                    icon="document-text-outline"
                                    placeholder="Ingrese la descripcion"
                                    onChangeText={(value) => {
                                        const plantaItem = planta.data.find((p) => p.nombre === value);
                                        setFormData({ ...formData, descripcion: value, codigo: plantaItem?.nit ? plantaItem.nit : "Material no encontrado" });
                                    }}
                                    data={(planta?.data ?? []).map((m) => m.nombre)}
                                    onSelectItem={(value) => {
                                        const plantaItem = planta.data.find((p) => p.nombre === value);
                                        setFormData({ ...formData, descripcion: value, codigo: plantaItem?.nit ? plantaItem.nit : "Material no encontrado" });
                                    }}
                                />
                            </View>
                            <LabeledInput
                                label="Cantidad"
                                placeholder="Ingrese la cantidad"
                                value={formData.cantidad}
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
                                        setFormData({ ...formData, cantidad: limpio });
                                    }
                                }}
                                icon="calculator-outline"
                            />
                            <LabeledInput
                                icon="scale-outline"
                                label="Unidad de medida"
                                placeholder="Ingrese la unidad de medida"
                                value={formData.unidadMedida}
                                onChangeText={(text) => setFormData({ ...formData, unidadMedida: text })}
                                disabled
                            />
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
                                            { label: "G04", value: "G04" },
                                        ]}
                                        placeholder="Selecciona un grupo"
                                    />
                                </>
                            )}
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
