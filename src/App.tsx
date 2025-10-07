import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navegacion/RootNavigator';
import { ThemeProvider, useThemeCustom } from './contexto/ThemeContext';
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { MenuProvider } from './contexto/MenuContext';
import { UserMenuProvider } from "./contexto/UserMenuContext";
import { GlobalDataProvider } from './contexto/GlobalDataProvider';
import { useFonts, TiltWarp_400Regular } from "@expo-google-fonts/tilt-warp";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { getToastConfig } from './ToastConfig';
import * as Updates from "expo-updates";

SplashScreen.preventAutoHideAsync();

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
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                }
            } catch (error) {
                console.log("Error checking for updates:", error);
            }
        };

        checkForUpdates();
    }, []);

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <NavigationContainer>
                    <MenuProvider>
                        <UserMenuProvider>
                            <GlobalDataProvider>
                                <RootNavigator />
                                <ThemedToast />
                            </GlobalDataProvider>
                        </UserMenuProvider>
                    </MenuProvider>
                </NavigationContainer>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}