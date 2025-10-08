import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navegacion/RootNavigator';
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

    const ensureLatestVersion = useCallback(async () => {
        try {
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
                ParqueAutomotor: 'parqueAutomotor',
                RegistrarParqueAutomotor: 'parqueAutomotor/registrar',
                PowerBIEmbed: 'powerbi/:reportName',
            },
        },
    };

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <NavigationParamsProvider>
                    <NavigationContainer linking={linking}>
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
            </ThemeProvider>
        </SafeAreaProvider>
    );
}