import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import { useGlobalStyles } from "../../estilos/GlobalStyles";
import CustomButton from "../../componentes/Button";
import { Ionicons } from "@expo/vector-icons";
import { darkColors, lightColors } from "../../estilos/Colors";
import { useThemeCustom } from "../../contexto/ThemeContext";
import LabeledInput from "../../compuestos/Input";
import LabeledSelect from "../../compuestos/Select";
import LabeledDatePicker from "../../compuestos/Date";
import Toast from "react-native-toast-message";
import { getUsuariosCedulaNombre, setParqueAutomotor } from "../../servicios/Api";
import { usePlantaData } from "../../contexto/PlantaDataContext";

export default function RegistrarParqueAutomotor({ navigation }) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const [loading, setLoading] = useState(false);
    const { planta, setPlanta } = usePlantaData();
    const [formData, setFormData] = useState({
        fecha: new Date(),
        sede: "",
        placa: "",
        cedula: "",
        nombre: "",
        estado: "",
    });

    const loadData = async () => {
        try {
            const data = await getUsuariosCedulaNombre()
            Toast.show({ type: "success", text1: "Información de planta recibida", text2: `Los datos fueron recibidos correctamente.`, position: "top" });
            await setPlanta(data);
        } catch (error) {
            Toast.show({ type: "error", text1: "Error", text2: error.data.message || "Datos no recibidos", position: "top" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatearFecha = (fecha) => {
        if (!(fecha instanceof Date)) fecha = new Date(fecha);

        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        const horas = String(fecha.getHours()).padStart(2, "0");
        const minutos = String(fecha.getMinutes()).padStart(2, "0");
        const segundos = String(fecha.getSeconds()).padStart(2, "0");

        return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    };

    const handleForm = async () => {
        if (!formData.sede) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la sede.", position: "top" }); return; }
        if (!formData.placa) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la placa.", position: "top" }); return; }
        if (!formData.cedula) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la cedula.", position: "top" }); return; }
        if (!formData.nombre) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la nombre.", position: "top" }); return; }
        if (!formData.estado) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la estado.", position: "top" }); return; }

        try {
            setLoading(true);
            const dataEnviar = {
                ...formData,
                fecha: formatearFecha(formData.fecha),
            };
            const response = await setParqueAutomotor(dataEnviar);
            Toast.show({ type: "success", text1: "Registro exitoso", text2: "Los datos fueron enviados correctamente.", position: "top" });
            setFormData({
                fecha: new Date(),
                sede: "",
                placa: "",
                cedula: "",
                nombre: "",
                estado: "",
            });
            navigation.replace("ParqueAutomotor", { label: "Parque Automotor" });
        } catch (error) {
            Toast.show({ type: "error", text1: "Error al enviar", text2: "No se pudo registrar la información.", position: "top" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[stylesGlobal.container]} >
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
                        marginTop: 20,
                        marginLeft: 20,
                        marginBottom: 10,
                    }}>
                        <Pressable
                            onPress={() => navigation.goBack()}
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
                                    <Text style={[stylesGlobal.subTitle, { textAlign: "center", marginLeft: 10, marginRight: 5, color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : colors.texto }]}>Registrar Vehiculo</Text>
                                </View>
                            )}
                        </Pressable>
                    </View>

                    <View style={{
                        backgroundColor: colors.backgroundBar,
                        padding: 20,
                        borderRadius: 5,
                        marginVertical: 10,
                        marginHorizontal: 20,
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
                        <LabeledSelect
                            label="Sede"
                            value={formData.sede}
                            onValueChange={(value) => setFormData({ ...formData, sede: value })}
                            icon="business-outline"
                            items={[
                                { label: "Ferias", value: "Ferias" },
                                { label: "San Cipriano", value: "San Cipriano" },
                                { label: "Enel", value: "Enel" },
                            ]}
                            placeholder="Selecciona una sede"
                        />
                        <LabeledInput
                            label="Placa"
                            placeholder="Ingrese una placa"
                            value={formData.placa}
                            onChangeText={(text) => {
                                let value = text.toUpperCase();
                                value = value.replace(/[^A-Z0-9]/g, "");
                                if (value.length > 6) value = value.slice(0, 6);
                                const pattern = /^([A-Z]{0,3})([0-9]{0,2})([A-Z0-9]{0,1})$/;
                                if (pattern.test(value)) {
                                    setFormData({ ...formData, placa: value });
                                }
                            }}
                            icon="car-outline"
                            autoCapitalize="characters"
                        />
                        <LabeledInput
                            label="Cedula"
                            placeholder="Ingrese una cedula"
                            value={formData.cedula}
                            onChangeText={(text) => {
                                let value = text.replace(/[^0-9]/g, "");
                                const persona = planta.find((p) => p.nit === value);
                                setFormData({ ...formData, cedula: value, nombre: persona?.nombre ? persona.nombre : "Usuario no encontrado" });
                            }}
                            icon="card-outline"
                        />
                        <LabeledInput
                            label="Nombre"
                            placeholder="Ingrese el nombre"
                            value={formData.nombre}
                            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                            icon="person-outline"
                            disabled
                        />
                        <LabeledSelect
                            label="Estado"
                            value={formData.estado}
                            onValueChange={(value) => setFormData({ ...formData, estado: value })}
                            icon="radio-button-on-outline"
                            items={[
                                { label: "Entrada", value: "Entrada" },
                                { label: "Salida", value: "Salida" },
                                { label: "No usado", value: "No usado" },
                            ]}
                            placeholder="Selecciona un estado"
                        />
                    </View>

                    <View style={{ alignSelf: "center" }}>
                        <CustomButton label="Enviar" variant="secondary" onPress={() => handleForm()} loading={loading} disabled={loading} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View >
    );
}