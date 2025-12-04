import { usePlantaData } from "../contexto/PlantaDataContext";
import Toast from "react-native-toast-message";
import { navigationRef } from "../navegacion/RootNavigator";
import Storage from "../utilitarios/Storage";
import { usePageUserData } from "../contexto/PageUserDataContext";
import { useTokenUserData } from "../contexto/TokenUserContext";
import { useParqueAutomotorData } from "../contexto/ParqueAutomotorDataContext";
import { useParqueAutomotorBaseData } from "../contexto/ParqueAutomotorBaseDataContext";

export const handleLogout = () => {
    const { clearPages } = usePageUserData();
    const { clearTokenUser } = useTokenUserData();
    const { clearPlanta } = usePlantaData();
    const { clearParqueAutomotor } = useParqueAutomotorData();
    const { clearParqueAutomotorBase } = useParqueAutomotorBaseData();

    const logoutHandler = async ({
        logout,
        setMenuVisibleUser,
    }: {
        logout: () => Promise<void>;
        setMenuVisibleUser?: (val: boolean) => void;
    }) => {
        try {
            clearPages();
            clearTokenUser();
            clearPlanta();
            clearParqueAutomotor();
            clearParqueAutomotorBase();
            await Storage.removeItem("dataMaterial");
            await Storage.removeItem("formInventarioAccion");
            await Storage.removeItem("formInventario");
            await Storage.removeItem("formSolicitudAbastecimiento");
            await Storage.removeItem("dataUsers");
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

    return { logoutHandler };
};
