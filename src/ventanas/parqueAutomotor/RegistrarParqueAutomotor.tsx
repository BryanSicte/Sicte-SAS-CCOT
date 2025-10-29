import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
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
import { useUserData } from "../../contexto/UserDataContext";
import { useNavigationParams } from "../../contexto/NavigationParamsContext";
import { useUserMenu } from "../../contexto/UserMenuContext";
import { handleLogout } from "../../utilitarios/HandleLogout";
import { useIsMobileWeb } from "../../utilitarios/IsMobileWeb";
import Loader from "../../componentes/Loader";

export default function RegistrarParqueAutomotor({ navigation }) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const { setParams } = useNavigationParams();
    const colors = isDark ? darkColors : lightColors;
    const [loading, setLoading] = useState(true);
    const { planta, setPlanta } = usePlantaData();
    const { user, logout, getUser } = useUserData();
    const { setMenuVisibleUser } = useUserMenu();
    const isMobileWeb = useIsMobileWeb();

    const createEmptyFormData = (user) => ({
        fecha: new Date(),
        cedulaUsuario: user?.cedula || "Pendiente",
        usuario: user?.nombre || "Pendiente",
        sede: "",
        placa: "",
        cedula: "",
        nombre: "",
        estado: "",
    });

    const [formData, setFormData] = useState(createEmptyFormData(user));

    const loadData = async () => {
        try {
            const data = await getUsuariosCedulaNombre()
            await setPlanta(data);
            Toast.show({ type: "success", text1: data.messages.message1, text2: data.messages.message2, position: "top" });
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


    useEffect(() => {
        if (user) {
            setFormData(createEmptyFormData(user));
        }
    }, [user]);

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
        if (formData.placa.length < 5 || formData.placa.length > 6) { Toast.show({ type: "info", text1: "Placa inválida", text2: "La placa debe tener entre 5 y 6 caracteres.", position: "top" }); return; }
        const placaPattern = /^[A-Z]{3}[0-9]{2}[A-Z0-9]{1}$/;
        if (!placaPattern.test(formData.placa)) { Toast.show({ type: "info", text1: "Placa inválida", text2: "La placa debe tener el formato ABC12D o ABC123.", position: "top" }); return; }
        if (!formData.cedula) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la cedula.", position: "top" }); return; }
        if (!formData.nombre) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la nombre.", position: "top" }); return; }
        if (formData.nombre === 'Usuario no encontrado') { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese una cedula correcta.", position: "top" }); return; }
        if (!formData.estado) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la estado.", position: "top" }); return; }

        try {
            setLoading(true);
            const dataEnviar = {
                ...formData,
                fecha: formatearFecha(formData.fecha),
            };
            const response = await setParqueAutomotor(dataEnviar);
            Toast.show({ type: "success", text1: response.messages.message1, text2: response.messages.message2, position: "top" });
            setTimeout(() => {
                setFormData(createEmptyFormData(user));
                navigation.replace("ParqueAutomotor", { label: "Parque Automotor" });
            }, 2000);
        } catch (error) {
            Toast.show({ type: "error", text1: error.data.messages.message1, text2: error.data.messages.message2, position: "top" });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader visible={loading} />;
    }

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
                        marginTop: isMobileWeb ? 10 : 20,
                        marginLeft: isMobileWeb ? 10 : 20,
                        marginBottom: isMobileWeb ? 5 : 10,
                    }}>
                        <Pressable
                            onPress={() => {
                                setParams("ParqueAutomotor", { label: "Parque Automotor" });
                                navigation.replace("ParqueAutomotor");
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
                                    <Text style={[stylesGlobal.subTitle, { textAlign: "center", marginLeft: 10, marginRight: 5, color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : colors.texto }]}>Registrar Vehiculo</Text>
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
                            label="Cedula Usuario"
                            placeholder="Ingrese la cedula"
                            value={formData.cedulaUsuario}
                            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                            icon="card-outline"
                            disabled
                        />
                        <LabeledInput
                            label="Nombre Usuario"
                            placeholder="Ingrese el nombre"
                            value={formData.usuario}
                            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                            icon="person-outline"
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
                                const persona = planta.data.find((p) => p.nit === value);
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