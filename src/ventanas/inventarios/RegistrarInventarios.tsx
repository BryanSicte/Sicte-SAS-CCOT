import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../estilos/GlobalStyles";
import CustomButton from "../../componentes/Button";
import { Ionicons } from "@expo/vector-icons";
import { darkColors, lightColors } from "../../estilos/Colors";
import { useThemeCustom } from "../../contexto/ThemeContext";
import LabeledInput from "../../compuestos/Input";
import LabeledSelect from "../../compuestos/Select";
import LabeledDatePicker from "../../compuestos/Date";
import Toast from "react-native-toast-message";
import { getUsuariosCedulaNombre, getBodegaKgprodOperacionesCodigoDescripUnimed, setParqueAutomotor } from "../../servicios/Api";
import { usePlantaData } from "../../contexto/PlantaDataContext";
import { useUserData } from "../../contexto/UserDataContext";
import { useNavigationParams } from "../../contexto/NavigationParamsContext";
import { useUserMenu } from "../../contexto/UserMenuContext";
import { handleLogout } from "../../utilitarios/HandleLogout";
import CustomTable from "../../componentes/Table";
import { useIsMobileWeb } from "../../utilitarios/IsMobileWeb";
import CustomModal from "../../componentes/Modal";
import CustomInput from "../../componentes/Input";
import { useMaterialData } from "../../contexto/MaterialDataContext";

export default function RegistrarInventarios({ navigation }) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const { setParams } = useNavigationParams();
    const colors = isDark ? darkColors : lightColors;
    const [loading, setLoading] = useState(false);
    const { planta, setPlanta } = usePlantaData();
    const { material, setMaterial } = useMaterialData();
    const { user, logout, getUser } = useUserData();
    const { setMenuVisibleUser } = useUserMenu();
    const isMobileWeb = useIsMobileWeb();

    const createEmptyFormData = (user) => ({
        fecha: new Date(),
        cedulaUsuario: user?.cedula || "Pendiente",
        nombreusuario: user?.nombre || "Pendiente",
        cedulaTecnico: "",
        nombreTecnico: "",
        inventario: "Inventario Fiscal 2025",
        materiales: [],
    });

    const createEmptyNuevoMaterial = (material) => ({
        codigo: "",
        descripcion: "",
        cantidad: "",
        unidadMedida: "",
    });

    const [formData, setFormData] = useState(createEmptyFormData(user));
    const [nuevoMaterial, setNuevoMaterial] = useState(createEmptyNuevoMaterial(material));

    const loadData = async () => {
        try {
            const dataUsuarios = await getUsuariosCedulaNombre()
            await setPlanta(dataUsuarios);
            Toast.show({ type: "success", text1: dataUsuarios.messages.message1, text2: dataUsuarios.messages.message2, position: "top" });
            const dataMaterial = await getBodegaKgprodOperacionesCodigoDescripUnimed()
            await setMaterial(dataMaterial);
            Toast.show({ type: "success", text1: dataMaterial.messages.message1, text2: dataMaterial.messages.message2, position: "top" });
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
        // if (!formData.sede) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la sede.", position: "top" }); return; }
        // if (!formData.placa) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la placa.", position: "top" }); return; }
        // if (formData.placa.length < 5 || formData.placa.length > 6) { Toast.show({ type: "info", text1: "Placa inválida", text2: "La placa debe tener entre 5 y 6 caracteres.", position: "top" }); return; }
        // const placaPattern = /^[A-Z]{3}[0-9]{2}[A-Z0-9]{1}$/;
        // if (!placaPattern.test(formData.placa)) { Toast.show({ type: "info", text1: "Placa inválida", text2: "La placa debe tener el formato ABC12D o ABC123.", position: "top" }); return; }
        // if (!formData.cedula) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la cedula.", position: "top" }); return; }
        // if (!formData.nombre) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la nombre.", position: "top" }); return; }
        // if (formData.nombre === 'Usuario no encontrado') { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese una cedula correcta.", position: "top" }); return; }
        // if (!formData.estado) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la estado.", position: "top" }); return; }

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

    const headers = ["Codigo SAP", "Descripcion", "Cantidad", "U.M."];
    const [dataTabla, setDataTabla] = useState<any[]>([]);
    const styles = stylesLocal();
    const [modalVisible, setModalVisible] = useState(false);
    const [cantidad, setCantidad] = useState("");

    const handleGuardar = () => {
        console.log("Nuevo material:", nuevoMaterial, cantidad);
        setModalVisible(false);
        setNuevoMaterial(createEmptyNuevoMaterial(material));
        setCantidad("");
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
                        marginTop: isMobileWeb ? 10 : 20,
                        marginLeft: isMobileWeb ? 10 : 20,
                        marginBottom: isMobileWeb ? 5 : 10,
                    }}>
                        <Pressable
                            onPress={() => {
                                setParams("Inventarios", { label: "Inventarios" });
                                navigation.replace("Inventarios");
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
                                    <Text style={[stylesGlobal.subTitle, { textAlign: "center", marginLeft: 10, marginRight: 5, color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : colors.texto }]}>Registrar Inventario</Text>
                                </View>
                            )}
                        </Pressable>
                    </View>

                    <View style={{
                        backgroundColor: colors.backgroundBar,
                        paddingVertical: 20,
                        paddingHorizontal: isMobileWeb ? 10 : 20,
                        borderRadius: 5,
                        marginVertical: isMobileWeb ? 5 : 10,
                        marginHorizontal: isMobileWeb ? 0 : 20,
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
                            icon="card-outline"
                            disabled
                        />
                        <LabeledInput
                            label="Nombre Usuario"
                            placeholder="Ingrese el nombre"
                            value={formData.nombreusuario}
                            icon="person-outline"
                            disabled
                        />
                        <LabeledInput
                            label="Cedula Tecnico"
                            placeholder="Ingrese una cedula"
                            value={formData.cedulaTecnico}
                            onChangeText={(text) => {
                                let value = text.replace(/[^0-9]/g, "");
                                const persona = planta.data.find((p) => p.nit === value);
                                setFormData({ ...formData, cedulaTecnico: value, nombreTecnico: persona?.nombre ? persona.nombre : "Usuario no encontrado" });
                            }}
                            icon="card-outline"
                        />
                        <LabeledInput
                            label="Nombre Tecnico"
                            placeholder="Ingrese el nombre"
                            value={formData.nombreTecnico}
                            icon="person-outline"
                            disabled
                        />
                        <LabeledInput
                            label="Inventario"
                            value={formData.inventario}
                            icon="document-text-outline"
                            disabled
                        />
                        <View>
                            <Text style={[stylesGlobal.texto, styles.label]}>Material:</Text>
                            <View style={{ alignSelf: "flex-end", marginBottom: 10 }}>
                                <CustomButton label="Agregar" variant="primary" onPress={() => setModalVisible(true)} />
                            </View>
                            <CustomTable headers={headers} data={formData.materiales.map((m) => [m.codigo, m.descripcion, m.cantidad, m.unidadMedida])} />
                        </View>
                    </View>

                    <View style={{ alignSelf: "center" }}>
                        <CustomButton label="Enviar" variant="secondary" onPress={() => handleForm()} loading={loading} disabled={loading} />
                    </View>

                    <CustomModal
                        visible={modalVisible}
                        title="Agregar Material"
                        onClose={() => setModalVisible(false)}
                    >
                        <LabeledInput
                            label="Codigo SAP"
                            placeholder="Ingrese el codigo SAP"
                            value={nuevoMaterial.codigo}
                            onChangeText={(text) => setNuevoMaterial({ ...nuevoMaterial, codigo: text })}
                            icon="card-outline"
                            data={(material?.data ?? []).map((m) => m.codigo)}
                            onSelectItem={(item) => setNuevoMaterial({ ...nuevoMaterial, codigo: item })}
                        />
                        <LabeledInput
                            label="Descripcion`"
                            placeholder="Ingrese la descripcion"
                            value={nuevoMaterial.descripcion}
                            onChangeText={(text) => setNuevoMaterial({ ...nuevoMaterial, descripcion: text })}
                            icon="card-outline"
                        />
                        <LabeledInput
                            label="Cantidad"
                            placeholder="Ingrese la cantidad"
                            value={nuevoMaterial.cantidad}
                            onChangeText={(text) => setNuevoMaterial({ ...nuevoMaterial, cantidad: text })}
                            icon="card-outline"
                        />
                        <LabeledInput
                            label="Unidad de Medida"
                            placeholder="Ingrese la unidad de medida"
                            value={nuevoMaterial.unidadMedida}
                            onChangeText={(text) => setNuevoMaterial({ ...nuevoMaterial, unidadMedida: text })}
                            icon="card-outline"
                            disabled
                        />
                        <View style={{ alignSelf: "center" }}>
                            <CustomButton label="Agregar Material" onPress={handleGuardar} />
                        </View>
                    </CustomModal>

                </ScrollView>
            </KeyboardAvoidingView>
        </View >
    );
}

const stylesLocal = () => {

    return StyleSheet.create({
        label: {
            fontWeight: "500",
        },
    });
};
