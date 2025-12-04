import React, { useEffect, useRef, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { createNavigationContainerRef } from "@react-navigation/native";
import { View, Text, Pressable, Platform, Animated, StyleSheet, ScrollView, AppState } from 'react-native';
import { useThemeCustom } from '../contexto/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { lightColors, darkColors } from '../estilos/Colors';
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMenu } from "../contexto/MenuContext";
import { useGlobalStyles } from '../estilos/GlobalStyles';
import { getHeaderOptions } from './NavigationOptions';
import { menuConfig } from './MenuConfig';
import { useUserMenu } from "../contexto/UserMenuContext";
import { useUserData } from '../contexto/UserDataContext';
import { usePageUserData } from '../contexto/PageUserDataContext';
import { useNavigationParams } from '../contexto/NavigationParamsContext';
import { handleLogout } from '../utilitarios/HandleLogout';
import { useIsMobileWeb } from '../utilitarios/IsMobileWeb';
import Toast from "react-native-toast-message";
import Login from '../ventanas/Login';
import Inicio from '../ventanas/Inicio';
import PowerBIEmbed from '../ventanas/PowerBIEmbed';
import ParqueAutomotor from '../ventanas/parqueAutomotor/ParqueAutomotor';
import RegistrarParqueAutomotor from '../ventanas/parqueAutomotor/RegistrarParqueAutomotor';
import CadenaDeSuministro from '../ventanas/cadenaDeSuministro/CadenaDeSuministro';
import ResumenAbastecimiento from '../ventanas/cadenaDeSuministro/ResumenAbastecimiento';
import SolicitudAbastecimiento from '../ventanas/cadenaDeSuministro/SolicitudAbastecimiento';
import SolicitudAbastecimientoNuevo from '../ventanas/cadenaDeSuministro/SolicitudAbastecimientoNuevo';
import LogisticaAbastecimiento from '../ventanas/cadenaDeSuministro/LogisticaAbastecimiento';
import ComprasAbastecimiento from '../ventanas/cadenaDeSuministro/ComprasAbastecimiento';
import AprobacionesAbastecimiento from '../ventanas/cadenaDeSuministro/AprobacionesAbastecimiento';
import TesoreriaAbastecimiento from '../ventanas/cadenaDeSuministro/TesoreriaAbastecimiento';
import DetailsScreen from '../ventanas/DetailsScreen';
import Inventarios from '../ventanas/inventarios/Inventarios';
import RegistrarInventarios from '../ventanas/inventarios/RegistrarInventarios';
import ControlUsuarios from '../ventanas/controlUsuarios/ControlUsuarios';
import Recorridos from '../ventanas/recorridos/Recorridos';
import { startBackgroundLocation } from '../utilitarios/BackgroundLocation';
import Constants from "expo-constants";

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name as never, params as never);
    }
}

export function resetToHome() {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [{ name: "Home" as never }],
        });
    } else {
        console.warn("navigationRef aún no está listo para resetear");
    }
}

export type RootStackParamList = {
    Home: undefined;
    Login: { message: string };
    ParqueAutomotor: { message?: string, label?: string };
    RegistrarParqueAutomotor: { message?: string, label?: string };
    CadenaDeSuministro: { message?: string, label?: string };
    ResumenAbastecimiento: { message?: string, label?: string };
    SolicitudAbastecimientoNuevo: { message?: string, label?: string };
    SolicitudAbastecimiento: { message?: string, label?: string };
    LogisticaAbastecimiento: { message?: string, label?: string };
    ComprasAbastecimiento: { message?: string, label?: string };
    AprobacionesAbastecimiento: { message?: string, label?: string };
    TesoreriaAbastecimiento: { message?: string, label?: string };
    Inventarios: { message?: string, label?: string };
    RegistrarInventarios: { message?: string, label?: string };
    ControlUsuarios: { message?: string, label?: string };
    Recorridos: { message?: string, label?: string };
    Details: { message: string };
};

const Stack = createStackNavigator();

export default function RootNavigator() {
    const { isDark, toggleTheme } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const headerHeight = Platform.OS === "web" ? 64 : 64 + insets.top;
    const { open, toggleMenu } = useMenu();
    const stylesGlobal = useGlobalStyles();
    const isMobileWeb = useIsMobileWeb();
    const menuWidth = Platform.OS === "web" && !isMobileWeb ? (open ? 250 : 60) : (open ? 250 : 0);
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const { user, logout, getUser } = useUserData();
    const { pages } = usePageUserData();
    const { menuVisibleUser, setMenuVisibleUser } = useUserMenu();
    const { logoutHandler } = handleLogout();
    const { params, setParams } = useNavigationParams();

    const cerrarSesion = async () => {
        await logoutHandler({
            logout,
            setMenuVisibleUser,
        });
    };

    const showAccessDeniedToast = () => {
        if (open && Platform.OS !== "web") {
            toggleMenu();
        }
        Toast.show({
            type: "info",
            text1: "Acceso restringido",
            text2: "No tienes permisos para entrar aquí 🚫",
            position: "top",
        });
    };

    const canAccess = (rol, value) => {
        if (rol === "admin") return true;
        return value === "1";
    };

    function initLocation(user) {
        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active") {
                startBackgroundLocation(user);
                subscription.remove();
            }
        });
    }

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userTemp = await getUser();
                if (userTemp === null) {
                    logout();
                }
                initLocation(userTemp);
            } catch (error) {
                console.log("Error obteniendo usuario:", error);
            }
        };

        loadUser();
    }, []);

    const aplicativosConfig = [
        { key: "aplicativosCadenaDeSuministro", icon: "link-outline", label: "Cadena de Suministro", route: "Login", params: { message: "Cadena de Suministro" } },
        { key: "aplicativosCapacidades", icon: "extension-puzzle-outline", label: "Capacidades", route: "Settings" },
        { key: "aplicativosCarnetizacion", icon: "card-outline", label: "Carnetización", route: "Settings" },
        { key: "aplicativosChatbot", icon: "chatbubble-ellipses-outline", label: "ChatBot", route: "Settings" },
        { key: "aplicativosEncuentas", icon: "clipboard-outline", label: "Encuestas", route: "Settings" },
        { key: "aplicativosSolicitudDeMaterial", icon: "archive-outline", label: "Gestión de Materiales", route: "Settings" },
        { key: "aplicativosGestionOts", icon: "file-tray-full-outline", label: "Gestión de OTs", route: "Settings" },
        { key: "aplicativosInventarios", icon: "document-text-outline", label: "Inventarios", route: "Login", params: { message: "Inventarios" } },
        { key: "aplicativosParqueAutomotor", icon: "car-outline", label: "Parque Automotor", route: "Login", params: { message: "Parque Automotor" } },
        { key: "aplicativosReporteMaterialFerretero", icon: "construct-outline", label: "Reporte Material Ferretero", route: "Settings" },
        { key: "aplicativosSupervision", icon: "eye-outline", label: "Supervisión", route: "Settings" },
    ];

    const hasAccess = aplicativosConfig.some(item =>
        canAccess(user?.rol, pages?.[item.key])
    );

    const findReport = (nameBD) => {
        for (const section of menuConfig) {
            if (section.items) {
                const found = section.items.find(item => item.nameBD === nameBD);
                if (found) return found;
            }
        }
        return null;
    };

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.backgroundBar,
                        borderBottomWidth: 1,
                        borderBottomColor: isDark ? darkColors.linea : lightColors.linea,
                    },
                    headerTintColor: colors.texto,
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={Inicio}
                    options={() => {
                        return {
                            ...getHeaderOptions("CCOT", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                            title: "Sicte CCOT",
                        };
                    }}
                />

                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={() => {
                        const data = params["Login"];
                        return {
                            ...getHeaderOptions(data?.label ?? "CCOT", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                            title: data?.label ?? "CCOT",
                        };
                    }}
                />

                <Stack.Screen
                    name="PowerBIEmbed"
                    component={PowerBIEmbed}
                    options={({ route }) => {
                        const { reportName } = route.params || {};
                        const report = findReport(reportName);

                        return {
                            ...getHeaderOptions(report?.label ?? "CCOT", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                            title: report?.label ?? "CCOT",
                        };
                    }}
                />

                <Stack.Screen
                    name="ParqueAutomotor"
                    component={ParqueAutomotor}
                    options={() => {
                        return {
                            ...getHeaderOptions("Parque Automotor", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="RegistrarParqueAutomotor"
                    component={RegistrarParqueAutomotor}
                    options={() => {
                        return {
                            ...getHeaderOptions("Parque Automotor", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="CadenaDeSuministro"
                    component={CadenaDeSuministro}
                    options={() => {
                        return {
                            ...getHeaderOptions("Cadena de Suministro", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="ResumenAbastecimiento"
                    component={ResumenAbastecimiento}
                    options={() => {
                        return {
                            ...getHeaderOptions("Cadena de Suministro", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="SolicitudAbastecimiento"
                    component={SolicitudAbastecimiento}
                    options={() => {
                        return {
                            ...getHeaderOptions("Cadena de Suministro", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="SolicitudAbastecimientoNuevo"
                    component={SolicitudAbastecimientoNuevo}
                    options={() => {
                        return {
                            ...getHeaderOptions("Cadena de Suministro", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="LogisticaAbastecimiento"
                    component={LogisticaAbastecimiento}
                    options={() => {
                        return {
                            ...getHeaderOptions("Cadena de Suministro", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="ComprasAbastecimiento"
                    component={ComprasAbastecimiento}
                    options={() => {
                        return {
                            ...getHeaderOptions("Cadena de Suministro", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="AprobacionesAbastecimiento"
                    component={AprobacionesAbastecimiento}
                    options={() => {
                        return {
                            ...getHeaderOptions("Cadena de Suministro", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="TesoreriaAbastecimiento"
                    component={TesoreriaAbastecimiento}
                    options={() => {
                        return {
                            ...getHeaderOptions("Cadena de Suministro", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="Inventarios"
                    component={Inventarios}
                    options={() => {
                        return {
                            ...getHeaderOptions("Inventarios", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="RegistrarInventarios"
                    component={RegistrarInventarios}
                    options={() => {
                        return {
                            ...getHeaderOptions("Inventarios", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="ControlUsuarios"
                    component={ControlUsuarios}
                    options={() => {
                        return {
                            ...getHeaderOptions("Control de Usuarios", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="Recorridos"
                    component={Recorridos}
                    options={() => {
                        return {
                            ...getHeaderOptions("Recorridos", {
                                toggleMenu,
                                toggleTheme,
                                isDark,
                                colors,
                                navigation,
                                showLogo: !isMobileWeb && Platform.OS === "web",
                                isMobileWeb: isMobileWeb,
                            }),
                        };
                    }}
                />

                <Stack.Screen
                    name="Settings"
                    component={DetailsScreen}
                    options={({ route }) => {
                        const params = route.params as { label?: string };
                        return getHeaderOptions(params?.label ?? "CCOT", {
                            toggleMenu,
                            toggleTheme,
                            isDark,
                            colors,
                            navigation,
                            showLogo: !isMobileWeb && Platform.OS === "web",
                            isMobileWeb: isMobileWeb,
                        });
                    }}
                />
            </Stack.Navigator>

            {open && (isMobileWeb || Platform.OS !== "web") && (
                <Pressable
                    onPress={() => {
                        setMenuVisibleUser(false);
                        toggleMenu();
                    }}
                    style={{
                        position: "absolute",
                        top: headerHeight,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: 998,
                    }}
                />
            )}

            <Animated.View
                style={[
                    styles.menu,
                    {
                        top: headerHeight,
                        width: menuWidth,
                        backgroundColor: colors.backgroundBar,
                        borderRightWidth: !open && isMobileWeb ? 0 : 1,
                        borderRightColor: colors.linea,
                    },
                ]}
            >
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                >
                    <MenuItem icon="home-outline" label="Inicio" route="Home" showLabel={open || Platform.OS !== "web"} open={open} toggleMenu={toggleMenu} />
                    {hasAccess && (
                        <>
                            {open && (
                                <Text style={[stylesGlobal.subTexto, { marginLeft: 10, marginBottom: 3, marginTop: 5 }]}>
                                    Aplicativos
                                </Text>
                            )}

                            {aplicativosConfig.map(({ key, icon, label, route, params }) => {
                                return (
                                    canAccess(user?.rol, pages?.[key]) && (
                                        <MenuItem
                                            key={key}
                                            icon={icon}
                                            label={label}
                                            route={route}
                                            params={params}
                                            showLabel={open || Platform.OS !== "web"}
                                            open={open}
                                            toggleMenu={toggleMenu}
                                            disabled={pages?.[key] !== "1"}
                                            onDisabledPress={showAccessDeniedToast}
                                        />
                                    )
                                );
                            })}
                        </>
                    )}
                    {menuConfig.map((menu, index) => {
                        if (menu.subtitle) {
                            const nextBlocks = [];
                            for (let i = index + 1; i < menuConfig.length; i++) {
                                if (menuConfig[i].subtitle) break;
                                if (menuConfig[i].items) nextBlocks.push(...menuConfig[i].items);
                            }

                            const hasAccess = nextBlocks.some(item =>
                                canAccess(user?.rol, pages?.[item.nameBD])
                            );

                            if (!hasAccess) return null;

                            return (
                                open && (
                                    <Text
                                        key={`subtitle-${index}`}
                                        style={[
                                            stylesGlobal.subTexto,
                                            { marginLeft: 10, marginBottom: 3, marginTop: 5 }
                                        ]}
                                    >
                                        {menu.subtitle}
                                    </Text>
                                )
                            );
                        }

                        return (
                            <SubMenu
                                key={index}
                                icon={menu.icon}
                                label={menu.label}
                                expanded={activeMenu === index}
                                open={open}
                                onToggle={() => setActiveMenu(activeMenu === index ? null : index)}
                                toggleMenu={toggleMenu}
                                items={menu.items}
                                pages={pages}
                                user={user}
                                showAccessDeniedToast={showAccessDeniedToast}
                                canAccess={canAccess}
                            />
                        );
                    })}
                </ScrollView>
            </Animated.View>

            {menuVisibleUser && user && (
                <Pressable
                    onPress={() => {
                        setMenuVisibleUser(false);
                        if (open && Platform.OS !== "web") {
                            toggleMenu();
                        }
                    }}
                    style={{
                        position: "absolute",
                        top: headerHeight,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: 998,
                    }}
                />
            )}

            {menuVisibleUser && user && (
                <View
                    style={{
                        position: "absolute",
                        top: headerHeight - 10,
                        right: 10,
                        backgroundColor: colors.backgroundBar,
                        borderRadius: 8,
                        borderColor: colors.linea,
                        borderWidth: 1,
                        padding: 10,
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        minWidth: 250,
                        zIndex: 999,
                    }}
                >
                    <View style={{ alignItems: "center" }}>
                        <View
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                paddingBottom: 2,
                                marginBottom: 10,
                                backgroundColor: colors.backgroundPressed,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: colors.textoPressed, fontWeight: "bold", fontSize: stylesGlobal.title.fontSize + 15 }}>
                                {user?.nombre?.charAt(0).toUpperCase()}
                            </Text>
                        </View>

                        <Text style={{ color: colors.texto, fontSize: stylesGlobal.texto.fontSize, fontWeight: "bold", marginBottom: 8, textAlign: "center" }}>
                            Hola, {user?.nombre?.split(" ")[0]}
                        </Text>
                    </View>

                    <View
                        style={{
                            borderBottomColor: colors.linea || "#ccc",
                            borderBottomWidth: 1,
                            marginVertical: 10,
                        }}
                    />

                    <Text style={{ color: colors.texto, fontSize: stylesGlobal.texto.fontSize - 2, marginBottom: 5, textAlign: "center" }}>
                        {user.correo}
                    </Text>
                    <Text style={{ color: colors.texto, fontSize: stylesGlobal.texto.fontSize - 2, marginBottom: 5, textAlign: "center" }}>
                        {user.nombre}
                    </Text>
                    <Text style={{ color: colors.texto, fontSize: stylesGlobal.texto.fontSize - 2, marginBottom: 5, textAlign: "center" }}>
                        CC: {user.cedula}
                    </Text>
                    <Text style={{ color: colors.texto, fontSize: stylesGlobal.texto.fontSize - 2, marginBottom: 5, textAlign: "center" }}>
                        Tel: {user.telefono}
                    </Text>
                    <Text style={{ color: colors.texto, fontSize: stylesGlobal.texto.fontSize - 2, marginBottom: 5, textAlign: "center" }}>
                        Rol: {user.rol}
                    </Text>
                    <Text style={{ color: colors.texto, fontSize: stylesGlobal.texto.fontSize - 4, marginBottom: 5, textAlign: "center" }}>
                        Versión {Constants.expoConfig.version}
                    </Text>

                    <View
                        style={{
                            borderBottomColor: colors.linea,
                            borderBottomWidth: 1,
                            marginVertical: 10,
                        }}
                    />

                    <Pressable
                        onPress={() => {
                            if (user.rol !== "admin") {
                                showAccessDeniedToast();
                                return;
                            }
                            setMenuVisibleUser(false);
                        }}
                        style={({ pressed, hovered }: any) => [
                            styles.item,
                            { paddingVertical: 6, opacity: user.rol !== "admin" ? 0.4 : 1 },
                            hovered && { backgroundColor: colors.backgroundHover },
                            pressed && { backgroundColor: colors.backgroundPressed },
                        ]}
                    >
                        {(state: any) => (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="server-outline" size={18} color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono} style={{ marginRight: 10, paddingLeft: 5 }} />
                                <Text style={{ color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : colors.texto, fontSize: stylesGlobal.texto.fontSize - 2 }}>
                                    Bases de Datos
                                </Text>
                            </View>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            if (user.rol !== "admin") {
                                showAccessDeniedToast();
                                return;
                            }
                            setMenuVisibleUser(false);
                            setParams("Control de Usuarios", { label: "Control de Usuarios" });
                            navigation.navigate("ControlUsuarios");
                        }}
                        style={({ pressed, hovered }: any) => [
                            styles.item,
                            { paddingVertical: 6, opacity: user.rol !== "admin" ? 0.4 : 1 },
                            hovered && { backgroundColor: colors.backgroundHover },
                            pressed && { backgroundColor: colors.backgroundPressed },
                        ]}
                    >
                        {(state: any) => (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="person-add-outline" size={18} color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono} style={{ marginRight: 10, paddingLeft: 5 }} />
                                <Text style={{ color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : colors.texto, fontSize: stylesGlobal.texto.fontSize - 2 }}>
                                    Control de usuarios
                                </Text>
                            </View>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            if (user.rol !== "admin") {
                                showAccessDeniedToast();
                                return;
                            }
                            setMenuVisibleUser(false);
                            setParams("Recorridos", { label: "Recorridos" });
                            navigation.navigate("Recorridos");
                        }}
                        style={({ pressed, hovered }: any) => [
                            styles.item,
                            { paddingVertical: 6, opacity: user.rol !== "admin" ? 0.4 : 1 },
                            hovered && { backgroundColor: colors.backgroundHover },
                            pressed && { backgroundColor: colors.backgroundPressed },
                        ]}
                    >
                        {(state: any) => (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="map-outline" size={18} color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono} style={{ marginRight: 10, paddingLeft: 5 }} />
                                <Text style={{ color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : colors.texto, fontSize: stylesGlobal.texto.fontSize - 2 }}>
                                    Recorridos
                                </Text>
                            </View>
                        )}
                    </Pressable>

                    <View
                        style={{
                            borderBottomColor: colors.linea,
                            borderBottomWidth: 1,
                            marginVertical: 10,
                        }}
                    />

                    <Pressable
                        onPress={cerrarSesion}
                        style={({ pressed, hovered }: any) => [
                            styles.item,
                            { paddingVertical: 6 },
                            hovered && { backgroundColor: colors.backgroundHover },
                            pressed && { backgroundColor: colors.backgroundPressed },
                        ]}
                    >
                        {(state: any) => (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="log-out-outline" size={18} color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : "red"} style={{ marginRight: 10, paddingLeft: 5 }} />
                                <Text style={{ color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : "red", fontSize: stylesGlobal.texto.fontSize - 2 }}>
                                    Cerrar sesión
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const MenuItem = ({
    icon,
    label,
    showLabel,
    open,
    route,
    params,
    toggleMenu,
    margin = 5,
    disabled = false,
    onDisabledPress,
}: {
    icon: any;
    label: string;
    showLabel: boolean;
    open: boolean;
    route: string;
    params?: any;
    toggleMenu: () => void;
    margin?: number;
    disabled?: boolean;
    onDisabledPress?: () => void;
}) => {
    const navigation = useNavigation<any>();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const { setParams } = useNavigationParams();
    const isMobileWeb = useIsMobileWeb();

    return (
        <Pressable
            onPress={() => {
                if (disabled) {
                    onDisabledPress?.();
                    return;
                }
                if (isMobileWeb || Platform.OS !== "web") {
                    toggleMenu();
                }

                setParams(route, { ...params, ...(label !== "Inicio" ? { label } : {}) });
                if (params?.nameBD) {
                    navigation.navigate(route, { reportName: params.nameBD });
                } else {
                    navigation.navigate(route);
                }
            }}
            style={({ pressed, hovered }: any) => [
                styles.item,
                { margin, marginLeft: open ? 10 : 5 },
                !open && { justifyContent: "center" },
                hovered && { backgroundColor: colors.backgroundHover },
                pressed && { backgroundColor: colors.backgroundPressed },
                disabled && { opacity: 0.4 }
            ]}
        >
            {(state: any) => (
                <>
                    <Ionicons name={icon} size={22} color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono} />
                    {showLabel && <Text style={{ marginLeft: 10, color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : colors.texto }}>{label}</Text>}
                </>
            )}
        </Pressable>
    );
};

const SubMenu = ({
    icon,
    label,
    open,
    items,
    expanded,
    toggleMenu,
    onToggle,
    pages,
    user,
    showAccessDeniedToast,
    canAccess
}: {
    icon: any;
    label: string;
    open: boolean;
    items: { label: string; route: string; nameBD: string; params: any }[];
    expanded: boolean;
    toggleMenu: () => void;
    onToggle: () => void;
    pages: any;
    user: any,
    showAccessDeniedToast: () => void;
    canAccess: () => void;
}) => {
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const heightAnim = useRef(new Animated.Value(0)).current;
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: expanded ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();

        Animated.timing(heightAnim, {
            toValue: expanded ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [expanded]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["180deg", "90deg"],
    });

    const animatedHeight = heightAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, contentHeight],
    });

    const hasAccess = items.some(subItem =>
        canAccess(user?.rol, pages?.[subItem.nameBD])
    );

    if (!hasAccess) return null;

    return (
        <View>
            <Pressable
                onPress={onToggle}
                style={({ pressed, hovered }: any) => [
                    styles.item,
                    { flexDirection: "row", alignItems: "center" },
                    { margin: 5, marginLeft: open ? 10 : 5 },
                    !open && { justifyContent: "center" },
                    hovered && { backgroundColor: colors.backgroundHover },
                    pressed && { backgroundColor: colors.backgroundPressed },
                ]}
            >
                {(state: any) => (
                    <>
                        <Ionicons name={icon} size={22} color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono} />
                        {open && <Text style={{ marginLeft: 10, color: state.pressed ? colors.textoPressed : state.hovered ? colors.textoHover : colors.texto }}>{label}</Text>}
                        {open && (
                            <Animated.View style={{ marginLeft: "auto", transform: [{ rotate }] }}>
                                <Ionicons
                                    name="chevron-forward-outline"
                                    size={18}
                                    color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono}
                                />
                            </Animated.View>
                        )}
                    </>
                )}
            </Pressable>

            {open && (
                <Animated.View style={{
                    overflow: "hidden",
                    height: animatedHeight,
                    marginLeft: 5,
                    marginTop: 0
                }}>
                    <View
                        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
                        onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
                    >
                        {items.map((subItem, index) =>
                            canAccess(user?.rol, pages?.[subItem.nameBD]) && (
                                <MenuItem
                                    key={index}
                                    icon="caret-forward-outline"
                                    label={subItem.label}
                                    route={subItem.route}
                                    showLabel={true}
                                    open={open}
                                    toggleMenu={toggleMenu}
                                    params={{ ...subItem.params, label: subItem.label, nameBD: subItem.nameBD }}
                                    margin={0}
                                    disabled={pages?.[subItem.nameBD] !== "1"}
                                    onDisabledPress={showAccessDeniedToast}
                                />
                            )
                        )}
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    menu: {
        position: "absolute",
        left: 0,
        bottom: 0,
        flexDirection: "column",
        paddingTop: 0,
        zIndex: 999,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 5,
        borderRadius: 5,
    },
});
