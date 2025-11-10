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
import { getParqueAutomotor, getUsuariosCedulaNombre, postParqueAutomotor } from "../../servicios/Api";
import { usePlantaData } from "../../contexto/PlantaDataContext";
import { useUserData } from "../../contexto/UserDataContext";
import { useNavigationParams } from "../../contexto/NavigationParamsContext";
import { useUserMenu } from "../../contexto/UserMenuContext";
import { handleLogout } from "../../utilitarios/HandleLogout";
import { useIsMobileWeb } from "../../utilitarios/IsMobileWeb";
import Loader from "../../componentes/Loader";
import { useParqueAutomotorData } from "../../contexto/ParqueAutomotorDataContext";
import LabeledTextArea from "../../compuestos/Textarea";
import { useParqueAutomotorBaseData } from "../../contexto/ParqueAutomotorBaseDataContext";

export default function RegistrarParqueAutomotor({ navigation }) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const { setParams } = useNavigationParams();
    const colors = isDark ? darkColors : lightColors;
    const [loading, setLoading] = useState(true);
    const { planta, setPlanta } = usePlantaData();
    const { user, logout, getUser } = useUserData();
    const { parqueAutomotor, setParqueAutomotor } = useParqueAutomotorData();
    const { parqueAutomotorBase } = useParqueAutomotorBaseData();
    const { setMenuVisibleUser } = useUserMenu();
    const isMobileWeb = useIsMobileWeb();
    const { logoutHandler } = handleLogout();

    const createEmptyFormData = (user) => ({
        fecha: new Date(),
        cedulaUsuario: user?.cedula || "Pendiente",
        usuario: user?.nombre || "Pendiente",
        sede: "",
        placa: "",
        cedula: "",
        nombre: "",
        estado: "",
        observaciones: "",
    });

    const [formData, setFormData] = useState(createEmptyFormData(user));

    const loadData = async () => {
        try {
            const response = await getParqueAutomotor();
            setParqueAutomotor(response);
            const dataPlanta = await getUsuariosCedulaNombre(planta)
            setPlanta(dataPlanta);
            Toast.show({ type: "success", text1: dataPlanta.messages.message1, text2: dataPlanta.messages.message2, position: "top" });
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

    let datosUltimoMovimientoPorPlaca: any[] | null = null;
    const [dataUltimoMovimientoPorPlaca, setDataUltimoMovimientoPorPlaca] = useState<any[]>([]);
    let datosUltimoMovimientoPorCedula: any[] | null = null;
    const [dataUltimoMovimientoPorCedula, setDataUltimoMovimientoPorCedula] = useState<any[]>([]);

    function obtenerVehiculosUltimoMovimientoSoloUnaVez(data: any[]) {
        if (datosUltimoMovimientoPorPlaca || datosUltimoMovimientoPorCedula) {
            return { dataPlacaTemp: datosUltimoMovimientoPorPlaca, dataCedulaTemp: datosUltimoMovimientoPorCedula };
        }

        const registros = Array.isArray(parqueAutomotor?.data) ? parqueAutomotor.data : [];

        const ultimoMovimientoPorPlaca = Object.values(
            registros.reduce((acc, registro) => {
                const { placa, fecha } = registro;
                if (!acc[placa] || new Date(fecha) > new Date(acc[placa].fecha)) {
                    acc[placa] = registro;
                }
                return acc;
            }, {})
        )

        const ultimoMovimientoPorCedula = Object.values(
            registros.reduce((acc, registro) => {
                const { cedula, fecha } = registro;
                if (!cedula) return acc;
                if (!acc[cedula] || new Date(fecha) > new Date(acc[cedula].fecha)) {
                    acc[cedula] = registro;
                }
                return acc;
            }, {})
        );

        return { dataPlacaTemp: ultimoMovimientoPorPlaca, dataCedulaTemp: ultimoMovimientoPorCedula };
    }

    useEffect(() => {
        if (parqueAutomotor?.data) {
            const { dataPlacaTemp, dataCedulaTemp } = obtenerVehiculosUltimoMovimientoSoloUnaVez(parqueAutomotor);
            setDataUltimoMovimientoPorPlaca(dataPlacaTemp);
            setDataUltimoMovimientoPorCedula(dataCedulaTemp);
        }
    }, [parqueAutomotor]);

    const validarUltimoMovimiento = (placa: string, cedula: string) => {
        if (!dataUltimoMovimientoPorPlaca || dataUltimoMovimientoPorPlaca.length === 0) return { vehiculo: null, usuario: null };
        if (!dataUltimoMovimientoPorCedula || dataUltimoMovimientoPorCedula.length === 0) return { vehiculo: null, usuario: null };

        const vehiculo = dataUltimoMovimientoPorPlaca.find(
            (item: any) => item.placa?.toUpperCase() === placa?.toUpperCase()
        );

        const usuario = dataUltimoMovimientoPorCedula.find(
            (item: any) => item.cedula?.toUpperCase() === cedula?.toUpperCase()
        );
        
        return { vehiculo: vehiculo || null, usuario: usuario || null };
    };

    const handleForm = async () => {
        if (!formData.sede) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la sede.", position: "top" }); return; }
        if (!formData.placa) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la placa.", position: "top" }); return; }
        if (formData.placa.length < 5 || formData.placa.length > 6) { Toast.show({ type: "info", text1: "Placa inválida", text2: "La placa debe tener entre 5 y 6 caracteres.", position: "top" }); return; }
        const placaPattern = /^[A-Z]{3}[0-9]{2}[A-Z0-9]{1}$/;
        if (!placaPattern.test(formData.placa)) { Toast.show({ type: "info", text1: "Placa inválida", text2: "La placa debe tener el formato ABC12D o ABC123.", position: "top" }); return; }
        if (!parqueAutomotorBase?.data || parqueAutomotorBase.data.length === 0) { Toast.show({ type: "error", text1: "Datos no disponibles", text2: "No se encontraron registros en la base de placas.", position: "top" }); return; }
        const placaExiste = parqueAutomotorBase.data.some((item: any) => item.CENTRO?.toUpperCase?.() === formData.placa?.toUpperCase?.());
        if (!placaExiste) { Toast.show({ type: "error", text1: "Placa no registrada", text2: `La placa ${formData.placa} no se encuentra en la base de la empresa.`, position: "top" }); return; }
        if (!formData.cedula) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la cedula.", position: "top" }); return; }
        if (formData.cedula === 'Usuario no encontrado') { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese un usuario correcto.", position: "top" }); return; }
        if (!formData.nombre) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la nombre.", position: "top" }); return; }
        if (formData.nombre === 'Usuario no encontrado') { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese un usuario correcto.", position: "top" }); return; }
        if (!formData.estado) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la estado.", position: "top" }); return; }
        if (formData.estado === "Salida de vehiculo de la sede") {
            const { vehiculo, usuario } = validarUltimoMovimiento(formData.placa, formData.cedula);
            if (vehiculo && vehiculo.estado?.toString() === "Salida de vehiculo de la sede") { Toast.show({ type: "error", text1: "Vehículo en campo", text2: `La placa ${vehiculo.placa} ya se encuentra en campo.`, position: "top" }); return; }
            if (usuario && usuario.estado?.toString() === "Salida de vehiculo de la sede") { Toast.show({ type: "error", text1: "Usuario en campo", text2: `La cédula ${usuario.cedula} ya tiene un vehículo en campo.`, position: "top" }); return; }
        }
        if (formData.estado === "Entrada de vehiculo a la sede") {
            const { vehiculo, usuario } = validarUltimoMovimiento(formData.placa, formData.cedula);
            if (vehiculo && vehiculo.estado?.toString() === "Salida de vehiculo de la sede" && vehiculo.cedula?.toString() !== formData.cedula?.toString()) { Toast.show({ type: "error", text1: "Coincidencia incorrecta", text2: `La placa ${formData.placa} esta asignada al usuario ${vehiculo.nombre}, no la cedula ingresada.`, position: "top" }); return; }
            if (usuario && usuario.estado?.toString() === "Salida de vehiculo de la sede" && usuario.placa?.toString() !== formData.placa?.toString()) { Toast.show({ type: "error", text1: "Coincidencia incorrecta", text2: `La cedula ${formData.cedula} tiene asignado el vehiculo ${usuario.placa}, no la placa ingresada.`, position: "top" }); return; }
            if (vehiculo && vehiculo.estado?.toString() === "No usado") { Toast.show({ type: "error", text1: "Registro inválido", text2: `No puede marcar como "Entrada de vehiculo a la sede" un vehiculo que su ultimo estado fue "No Usado", debe existir una salida a terreno o en taller.`, position: "top" }); return; }
        }
        if (formData.estado === "No usado") {
            const { vehiculo } = validarUltimoMovimiento(formData.placa, formData.cedula);
            if (vehiculo && vehiculo.estado?.toString() === "Salida de vehiculo de la sede") { Toast.show({ type: "error", text1: "Registro inválido", text2: `No puede marcar como "No usado" el vehículo ${vehiculo.placa} que tiene como ultimo estado una salida a ${vehiculo.nombre}, se debe tener la entrada del vehiculo.`, position: "top" }); return; }
        }

        try {
            setLoading(true);
            const dataEnviar = {
                ...formData,
                fecha: formatearFecha(formData.fecha),
            };
            const response = await postParqueAutomotor(dataEnviar);
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
                    contentContainerStyle={{ paddingBottom: 60 }}
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
                        <View style={{ position: "relative", zIndex: 5 }}>
                            <LabeledInput
                                label="Placa"
                                placeholder="Ingrese una placa"
                                value={formData.placa}
                                icon="car-outline"
                                autoCapitalize="characters"
                                onChangeText={(text) => {
                                    let value = text.toUpperCase();
                                    value = value.replace(/[^A-Z0-9]/g, "");
                                    if (value.length > 6) value = value.slice(0, 6);
                                    const pattern = /^([A-Z]{0,3})([0-9]{0,2})([A-Z0-9]{0,1})$/;
                                    if (pattern.test(value)) {
                                        setFormData({ ...formData, placa: value });
                                    }
                                }}
                                data={(parqueAutomotorBase?.data ?? []).map((m) => m.CENTRO)}
                                onSelectItem={(value) => {
                                    setFormData({ ...formData, placa: value });
                                }}
                            />
                        </View>
                        <View style={{ position: "relative", zIndex: 4 }}>
                            <LabeledInput
                                label="Cedula Conductor"
                                value={formData.cedula}
                                icon="card-outline"
                                placeholder="Ingrese la cedula del conductor"
                                onChangeText={(value) => {
                                    const plantaItem = planta.data.find((p) => p.nit === value);
                                    setFormData({ ...formData, cedula: value, nombre: plantaItem?.nombre ? plantaItem.nombre : "Usuario no encontrado" });
                                }}
                                data={(planta?.data ?? []).map((m) => m.nit)}
                                onSelectItem={(value) => {
                                    const plantaItem = planta.data.find((p) => p.nit === value);
                                    setFormData({ ...formData, cedula: value, nombre: plantaItem?.nombre ? plantaItem.nombre : "Usuario no encontrado" });
                                }}
                            />
                        </View>
                        <View style={{ position: "relative", zIndex: 3 }}>
                            <LabeledInput
                                label="Nombre Conductor"
                                value={formData.nombre}
                                icon="person-outline"
                                placeholder="Ingrese el nombre del conductor"
                                onChangeText={(value) => {
                                    const plantaItem = planta.data.find((p) => p.nombre === value);
                                    setFormData({ ...formData, nombre: value, cedula: plantaItem?.nit ? plantaItem.nit : "Usuario no encontrado" });
                                }}
                                data={(planta?.data ?? []).map((m) => m.nombre)}
                                onSelectItem={(value) => {
                                    const plantaItem = planta.data.find((p) => p.nombre === value);
                                    setFormData({ ...formData, nombre: value, cedula: plantaItem?.nit ? plantaItem.nit : "Usuario no encontrado" });
                                }}
                            />
                        </View>
                        <LabeledSelect
                            label="Estado"
                            value={formData.estado}
                            onValueChange={(value) => setFormData({ ...formData, estado: value })}
                            icon="radio-button-on-outline"
                            items={[
                                { label: "Entrada de vehiculo a la sede", value: "Entrada de vehiculo a la sede" },
                                { label: "Salida de vehiculo de la sede", value: "Salida de vehiculo de la sede" },
                                { label: "No usado", value: "No usado" },
                                { label: "En Taller", value: "En Taller" },
                            ]}
                            placeholder="Selecciona un estado"
                        />
                        <LabeledTextArea
                            label="Observaciones"
                            value={formData.observaciones}
                            icon="document-text-outline"
                            placeholder="Agrege una observacion si lo requiere"
                            onChangeText={(text) => {
                                setFormData({ ...formData, observaciones: text });
                            }}
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