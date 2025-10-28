import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../estilos/GlobalStyles";
import CustomButton from "../../componentes/Button";
import { Ionicons } from "@expo/vector-icons";
import { darkColors, lightColors } from "../../estilos/Colors";
import { useThemeCustom } from "../../contexto/ThemeContext";
import LabeledInput from "../../compuestos/Input";
import LabeledDatePicker from "../../compuestos/Date";
import Toast from "react-native-toast-message";
import { getUsuariosCedulaNombre, getBodegaKgprodOperacionesCodigoDescripUnimed, setInventarios } from "../../servicios/Api";
import { usePlantaData } from "../../contexto/PlantaDataContext";
import { useUserData } from "../../contexto/UserDataContext";
import { useNavigationParams } from "../../contexto/NavigationParamsContext";
import { useUserMenu } from "../../contexto/UserMenuContext";
import { handleLogout } from "../../utilitarios/HandleLogout";
import CustomTable from "../../componentes/Table";
import { useIsMobileWeb } from "../../utilitarios/IsMobileWeb";
import { useMaterialData } from "../../contexto/MaterialDataContext";
import Storage from "../../utilitarios/Storage";
import Loader from "../../componentes/Loader";
import FirmaUniversal from "../../compuestos/FirmaUniversal";
import { useMenu } from "../../contexto/MenuContext";

export default function RegistrarInventarios({ navigation }) {
    const stylesGlobal = useGlobalStyles();
    const { isDark } = useThemeCustom();
    const { setParams } = useNavigationParams();
    const colors = isDark ? darkColors : lightColors;
    const [loading, setLoading] = useState(true);
    const { planta, setPlanta } = usePlantaData();
    const { material, setMaterial } = useMaterialData();
    const { user, logout, getUser } = useUserData();
    const { setMenuVisibleUser } = useUserMenu();
    const isMobileWeb = useIsMobileWeb();
    const headers = ["Codigo SAP", "Descripcion", "Cantidad", "U.M."];
    const styles = stylesLocal();
    const [loadingForm, setLoadingForm] = useState(true);
    const { open } = useMenu();

    const createEmptyFormData = (user) => ({
        fecha: new Date(),
        cedulaUsuario: user?.cedula || "Pendiente",
        nombreusuario: user?.nombre || "Pendiente",
        cedulaTecnico: "",
        nombreTecnico: "",
        inventario: "Inventario Fiscal 2025",
        materiales: [],
        firmaMateriales: null,
        firmaTecnico: null,
        firmaEquipos: null,
    });

    const createEmptyNuevoMaterial = () => ({
        codigo: "",
        descripcion: "",
        cantidad: "",
        unidadMedida: "",
    });

    const [formData, setFormData] = useState(createEmptyFormData(user));
    const [nuevoMaterial, setNuevoMaterial] = useState(createEmptyNuevoMaterial());

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
        const saveFormData = async () => {
            try {
                await Storage.setItem("formInventario", formData);
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
            const savedData = await Storage.getItem("formInventario");
            if (savedData === null) {
                setFormData(createEmptyFormData(user));
                setLoadingForm(false);
                return;
            }
            const parsed = typeof savedData === "string" ? JSON.parse(savedData) : savedData;
            const data = {
                fecha: new Date(parsed.fecha),
                cedulaUsuario: user?.cedula,
                nombreusuario: user?.nombre,
                cedulaTecnico: parsed.cedulaTecnico,
                nombreTecnico: parsed.nombreTecnico,
                inventario: parsed.inventario,
                materiales: parsed.materiales,
                firmaMateriales: parsed.firmaMateriales,
                firmaTecnico: parsed.firmaTecnico,
                firmaEquipos: parsed.firmaEquipos,
            };
            setFormData(data);
            setLoadingForm(false);
        };
        loadForm();
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
        if (!formData.fecha) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor cierre sesion y vuelva a ingresar.", position: "top" }); return; }
        if (!formData.cedulaUsuario) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor cierre sesion y vuelva a ingresar.", position: "top" }); return; }
        if (formData.cedulaUsuario === 'Pendiente') { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor cierre sesion y vuelva a ingresar.", position: "top" }); return; }
        if (!formData.nombreusuario) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor cierre sesion y vuelva a ingresar.", position: "top" }); return; }
        if (formData.nombreusuario === 'Pendiente') { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor cierre sesion y vuelva a ingresar.", position: "top" }); return; }
        if (!formData.cedulaTecnico) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la cedula del tecnico.", position: "top" }); return; }
        if (formData.cedulaTecnico === 'Usuario no encontrado') { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese una cedula correcta.", position: "top" }); return; }
        if (!formData.nombreTecnico) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese la cedula del tecnico.", position: "top" }); return; }
        if (formData.nombreTecnico === 'Usuario no encontrado') { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese una cedula correcta.", position: "top" }); return; }
        if (!formData.materiales || formData.materiales.length === 0) { Toast.show({ type: "info", text1: "Falta información", text2: "Debe agregar al menos un material antes de continuar.", position: "top" }); return; }
        if (!formData.firmaMateriales) { Toast.show({ type: "info", text1: "Falta firma", text2: "Por favor firme el conteo de materiales.", position: "top" }); return; }
        if (!formData.firmaTecnico) { Toast.show({ type: "info", text1: "Falta firma", text2: "Por favor firme el técnico responsable.", position: "top" }); return; }
        if (!formData.firmaEquipos) { Toast.show({ type: "info", text1: "Falta firma", text2: "Por favor firme el conteo de equipos.", position: "top" }); return; }

        try {
            setLoading(true);
            const dataEnviar = {
                ...formData,
                fecha: formatearFecha(formData.fecha),
            };
            const response = await setInventarios(dataEnviar);
            Toast.show({ type: "success", text1: response.messages.message1, text2: response.messages.message2, position: "top" });
            setTimeout(() => {
                setFormData(createEmptyFormData(user));
                navigation.replace("Inventarios");
            }, 2000);
        } catch (error) {
            Toast.show({ type: "error", text1: error.data.messages.message1, text2: error.data.messages.message2, position: "top" });
        } finally {
            setLoading(false);
        }
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

    if (loadingForm || loading) {
        return <Loader visible={loadingForm || loading} />;
    }

    return (
        <View style={[stylesGlobal.container]} >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30 }}
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
                        placeholder="Ingrese la cedula del usuario"
                        value={formData.cedulaUsuario}
                        icon="card-outline"
                        disabled
                    />
                    <LabeledInput
                        label="Nombre Usuario"
                        placeholder="Ingrese el nombre del usuario"
                        value={formData.nombreusuario}
                        icon="person-outline"
                        disabled
                    />
                    <LabeledInput
                        label="Cedula Tecnico"
                        placeholder="Ingrese la cedula del tecnico"
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
                        placeholder="Ingrese el nombre del tecnico"
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
                        <Text style={[stylesGlobal.texto, styles.label]}>Materiales:</Text>
                        <Text style={[stylesGlobal.texto, styles.label, { alignSelf: "flex-end" }]}>Agregar Material</Text>
                        <View style={{ position: "relative", zIndex: 4 }}>
                            <LabeledInput
                                label="Codigo SAP"
                                value={nuevoMaterial.codigo}
                                icon="pricetag-outline"
                                placeholder="Ingrese el codigo SAP"
                                onChangeText={(value) => {
                                    const materialItem = material.data.find((p) => p.codigo === value);
                                    setNuevoMaterial({ ...nuevoMaterial, codigo: value, descripcion: materialItem?.descrip ? materialItem.descrip : "Material no encontrado", unidadMedida: materialItem?.unimed ? materialItem.unimed : "Material no encontrado" });
                                }}
                                data={(material?.data ?? []).map((m) => m.codigo)}
                                onSelectItem={(value) => {
                                    const materialItem = material.data.find((p) => p.codigo === value);
                                    setNuevoMaterial({ ...nuevoMaterial, codigo: value, descripcion: materialItem?.descrip ? materialItem.descrip : "Material no encontrado", unidadMedida: materialItem?.unimed ? materialItem.unimed : "Material no encontrado" });
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
                                    const materialItem = material.data.find((p) => p.descrip === value);
                                    setNuevoMaterial({ ...nuevoMaterial, descripcion: value, codigo: materialItem?.codigo ? materialItem.codigo : "Material no encontrado", unidadMedida: materialItem?.unimed ? materialItem.unimed : "Material no encontrado" });
                                }}
                                data={(material?.data ?? []).map((m) => m.descrip)}
                                onSelectItem={(value) => {
                                    const materialItem = material.data.find((p) => p.descrip === value);
                                    setNuevoMaterial({ ...nuevoMaterial, descripcion: value, codigo: materialItem?.codigo ? materialItem.codigo : "Material no encontrado", unidadMedida: materialItem?.unimed ? materialItem.unimed : "Material no encontrado" });
                                }}
                            />
                        </View>
                        <View style={{ position: "relative", zIndex: 2 }}>
                            <LabeledInput
                                icon="calculator-outline"
                                label="Cantidad"
                                placeholder="Ingrese la cantidad"
                                value={nuevoMaterial.cantidad}
                                onChangeText={(text) => setNuevoMaterial({ ...nuevoMaterial, cantidad: text })}
                            />
                        </View>
                        <View style={{ position: "relative", zIndex: 1 }}>
                            <LabeledInput
                                icon="scale-outline"
                                label="Unidad de medida"
                                placeholder="Ingrese la unidad de medida"
                                value={nuevoMaterial.unidadMedida}
                                onChangeText={(text) => setNuevoMaterial({ ...nuevoMaterial, unidadMedida: text })}
                                disabled
                            />
                        </View>
                        <View style={{ alignSelf: "flex-start", marginTop: 5 }}>
                            <CustomButton label="Agregar" onPress={handleGuardar} />
                        </View>
                    </View>

                    <Text style={[stylesGlobal.texto, styles.label, { alignSelf: "flex-end", marginBottom: 10 }]}>Materiales Ingresados</Text>
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

                    <View style={{ flex: 1, paddingTop: 20 }}>
                        <Text style={[stylesGlobal.texto, styles.label, { marginBottom: 10 }]}>Firma del Conteo Materiales:</Text>

                        <FirmaUniversal firmaInicial={formData.firmaMateriales} onFirmaChange={(uri) => setFormData({ ...formData, firmaMateriales: uri })} />
                    </View>

                    <View style={{ flex: 1, paddingTop: 10 }}>
                        <Text style={[stylesGlobal.texto, styles.label, { marginBottom: 10 }]}>Firma del Tecnico:</Text>

                        <FirmaUniversal firmaInicial={formData.firmaTecnico} onFirmaChange={(uri) => setFormData({ ...formData, firmaTecnico: uri })} />
                    </View>

                    <View style={{ flex: 1, paddingTop: 10 }}>
                        <Text style={[stylesGlobal.texto, styles.label, { marginBottom: 10 }]}>Firma del Conteo Equipos:</Text>

                        <FirmaUniversal firmaInicial={formData.firmaEquipos} onFirmaChange={(uri) => setFormData({ ...formData, firmaEquipos: uri })} />
                    </View>

                    <View style={{ alignSelf: "center" }}>
                        <CustomButton label="Enviar" variant="secondary" onPress={() => handleForm()} loading={loading} disabled={loading} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View >
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
