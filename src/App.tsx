import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from "react-native";
import RootNavigator, { navigationRef } from './navegacion/RootNavigator';
import { ThemeProvider, useThemeCustom } from './contexto/ThemeContext';
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { MenuProvider } from './contexto/MenuContext';
import { UserMenuProvider } from "./contexto/UserMenuContext";
import { GlobalDataProvider } from './contexto/GlobalDataProvider';
import { NavigationParamsProvider } from './contexto/NavigationParamsContext';
import { useFonts, TiltWarp_400Regular } from "@expo-google-fonts/tilt-warp";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { getToastConfig } from './ToastConfig';
import * as Updates from "expo-updates";
import { TokenUserProvider } from './contexto/TokenUserContext';
import { UserDataProvider } from './contexto/UserDataContext';
import { PageUserProvider } from './contexto/PageUserDataContext';
import checkForUpdate from './utilitarios/CheckForUpdate';

SplashScreen.preventAutoHideAsync().catch(() => { });

function ThemedToast() {
    const { isDark } = useThemeCustom();
    const toastConfig = getToastConfig(isDark);
    const insets = useSafeAreaInsets();
    return <Toast config={toastConfig} position="top" topOffset={insets.top + 70} />;
}

export default function App() {
    const [fontsLoaded] = useFonts({
        TiltWarp: TiltWarp_400Regular,
    });

    useEffect(() => {
        checkForUpdate();
        if (Platform.OS === "web") {
            const htmlEl = document.documentElement;
            htmlEl.setAttribute("translate", "no");
            document.querySelector("meta[name='google']") ||
                document.head.insertAdjacentHTML("beforeend", `<meta name="google" content="notranslate">`);
        }
    }, []);

    const ensureLatestVersion = useCallback(async () => {
        try {
            if (__DEV__ || !Updates.checkForUpdateAsync) {
                if (__DEV__) console.log("🚫 Saltando verificación de actualizaciones en modo desarrollo o Expo Go.");
                return;
            }

            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                if (__DEV__) console.log("🌀 Nueva actualización detectada, aplicando...");
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            } else {
                if (__DEV__) console.log("✅ App ya está en la última versión.");
            }
        } catch (error) {
            console.log("⚠️ Error verificando actualizaciones:", error);
        }
    }, []);

    useEffect(() => {
        if (fontsLoaded) {
            setTimeout(() => {
                SplashScreen.hideAsync().catch(() => { });
            }, 500);
        }
        const startApp = async () => {
            try {
                await ensureLatestVersion();

                await new Promise((resolve) => setTimeout(resolve, 300));

                if (fontsLoaded) {
                    await SplashScreen.hideAsync();
                }
            } catch (err) {
                console.log("Error inicializando la app:", err);
                await SplashScreen.hideAsync();
            }
        };

        startApp();
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const linking = {
        prefixes: ['https://sicte-sas-ccot.up.railway.app', 'exp://'],
        config: {
            screens: {
                Home: '',
                Login: 'login',
                PowerBIEmbed: 'powerbi/:reportName',
                ParqueAutomotor: 'parqueAutomotor',
                RegistrarParqueAutomotor: 'parqueAutomotor/registrar',
                CadenaDeSuministro: 'cadenaDeSuministro',
                ResumenAbastecimiento: 'cadenaDeSuministro/resumen',
                SolicitudAbastecimiento: 'cadenaDeSuministro/solicitudAbastecimiento',
                SolicitudAbastecimientoNuevo: 'cadenaDeSuministro/solicitudAbastecimiento/nuevo',
                LogisticaAbastecimiento: 'cadenaDeSuministro/logistica',
                ComprasAbastecimiento: 'cadenaDeSuministro/compras',
                AprobacionesAbastecimiento: 'cadenaDeSuministro/aprobaciones',
                TesoreriaAbastecimiento: 'cadenaDeSuministro/tesoreria',
                Inventarios: 'inventarios',
                RegistrarInventarios: 'inventarios/registrar',
                Recorridos: 'recorridos',
            },
        },
    };

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <TokenUserProvider>
                    <PageUserProvider>
                        <UserDataProvider>
                            <NavigationParamsProvider>
                                <NavigationContainer linking={linking} ref={navigationRef}>
                                    <MenuProvider>
                                        <UserMenuProvider>
                                            <GlobalDataProvider>
                                                <RootNavigator />
                                                <ThemedToast />
                                            </GlobalDataProvider>
                                        </UserMenuProvider>
                                    </MenuProvider>
                                </NavigationContainer>
                            </NavigationParamsProvider>
                        </UserDataProvider>
                    </PageUserProvider>
                </TokenUserProvider>
            </ThemeProvider>
        </SafeAreaProvider >
    );
}