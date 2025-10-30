import Toast from "react-native-toast-message";
import { CommonActions } from "@react-navigation/native";
import Storage from "../utilitarios/Storage";
import { navigationRef, resetToHome } from "../navegacion/RootNavigator";

export const handleLogout = async ({
    logout,
    setMenuVisibleUser,
}: {
    logout: () => Promise<void>;
    setMenuVisibleUser?: (val: boolean) => void;
}) => {

    try {
        await Storage.removeItem("dataUser");
        await Storage.removeItem("dataPageUser");
        await Storage.removeItem("dataTokenUser");
        await Storage.removeItem("formInventarioAccion");
        await Storage.removeItem("formInventario");
        const result = await logout();
        setMenuVisibleUser?.(false);

        Toast.show({
            type: "info",
            text1: result.messages.message1,
            text2: result.messages.message2,
            position: "top",
        });

        if (navigationRef.isReady()) {
            navigationRef.reset({
                index: 0,
                routes: [{ name: "Home" as never }],
            });
        } else {
            console.warn("Navigation not ready, retrying logout navigation...");
            setTimeout(() => {
                if (navigationRef.isReady()) {
                    navigationRef.reset({
                        index: 0,
                        routes: [{ name: "Home" as never }],
                    });
                }
            }, 500);
        }
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
