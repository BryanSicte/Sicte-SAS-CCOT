import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navegacion/RootNavigator';
import { useGlobalStyles } from '../estilos/GlobalStyles';
import CustomInput from '../componentes/Input';
import CustomButton from '../componentes/Button';
import { darkColors, lightColors } from '../estilos/Colors';
import { useThemeCustom } from '../contexto/ThemeContext';
import Toast from "react-native-toast-message";
import { login } from '../servicios/Api';
import { useUserData } from '../contexto/UserDataContext';
import { usePageUserData } from '../contexto/PageUserDataContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ route, navigation }: Props) {
    const stylesGlobal = useGlobalStyles();
    const styles = stylesLocal();
    const mensaje = route.params?.message
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const { user, setUser } = useUserData();
    const { setPages } = usePageUserData();
    const [loading, setLoading] = useState(false);

    const redireccion = () => {
        if (mensaje === "Parque Automotor") {
            navigation.replace("ParqueAutomotor", { label: "Parque Automotor" });
        } else {
            navigation.replace("Home");
        }
    }

    useEffect(() => {
        if (user) {
            redireccion();
        }
    }, [user, mensaje, navigation]);

    const handleLogin = async () => {
        if (!correo) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese su correo electrónico.", position: "top" }); return; }
        if (!password) { Toast.show({ type: "info", text1: "Falta información", text2: "Por favor ingrese su contraseña.", position: "top" }); return; }

        try {
            setLoading(true);
            const data = await login(correo, password);
            Toast.show({
                type: "success",
                text1: "¡Inicio de sesión exitoso!",
                text2: `Bienvenido, ${data.usuario.nombre}.`,
                position: "top",
            });
            await setUser(data.usuario);
            await setPages(data.page);
            redireccion();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.data.message || "Usuario o contraseña incorrectos",
                position: "top",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={stylesGlobal.container}>
                <View style={styles.containerLogin}>
                    <Text style={stylesGlobal.title}>Iniciar Sesion</Text>

                    <CustomInput
                        placeholder="Correo"
                        value={correo}
                        onChangeText={setCorreo}
                        style={styles.input}
                    />

                    <CustomInput
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.inputPassword}
                    />

                    <CustomButton
                        style={{ marginTop: 10 }}
                        label="Iniciar sesión"
                        variant="primary"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                    />

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Details")}
                    >
                        <Text style={styles.forgotPasswordText}>
                            ¿Olvidaste tu contraseña?
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Details")}
                    >
                        <Text style={styles.changePasswordText}>
                            Cambiar contraseña
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const stylesLocal = () => {
    const { isDark } = useThemeCustom();
    const stylesGlobal = useGlobalStyles();

    return StyleSheet.create({
        containerLogin: {
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            borderRadius: 5,
            borderColor: isDark ? darkColors.linea : lightColors.linea,
            borderWidth: 1,
            backgroundColor: isDark ? darkColors.backgroundBar : lightColors.backgroundBar,
            alignSelf: "center",
            marginTop: 100,
            marginBottom: 100,
        },
        input: {
            minWidth: 240,
        },
        inputPassword: {
            minWidth: 240,
        },
        forgotPasswordText: {
            color: "#0080ffff",
            marginTop: 25,
            textDecorationLine: "underline",
            fontSize: stylesGlobal.texto.fontSize - 1,
        },
        changePasswordText: {
            color: "#0080ffff",
            marginTop: 10,
            textDecorationLine: "underline",
            fontSize: stylesGlobal.texto.fontSize - 1,
        },
    });
};