import Toast from "react-native-toast-message";
import { CommonActions } from "@react-navigation/native";

export const handleLogout = async ({
    navigation,
    clearPages,
    logout,
    setMenuVisibleUser,
}: {
    navigation: any;
    clearPages: () => Promise<void>;
    logout: () => Promise<void>;
    setMenuVisibleUser?: (val: boolean) => void;
}) => {

    try {
        await clearPages();
        const result = await logout();
        setMenuVisibleUser?.(false);
        
        Toast.show({
            type: "info",
            text1: result.messages.message1,
            text2: result.messages.message2,
            position: "top",
        });

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    } catch (error) {
        console.error("Error en handleLogout:", error);
        Toast.show({
            type: "error",
            text1: "Error al cerrar sesión",
            text2: "Ocurrió un problema al cerrar sesión.",
            position: "top",
        });
    }
};
