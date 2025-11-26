import { Alert, Linking } from "react-native";
import Constants from "expo-constants";
import { getVersion } from '../servicios/Api';

async function checkForUpdate() {
    try {
        const response = await getVersion();
        const data = await response.json();

        const latestVersion = data.latestVersion;
        const apkUrl = data.apkUrl;

        const currentVersion = Constants.expoConfig.version;

        if (latestVersion !== currentVersion) {
            Alert.alert(
                "Actualización disponible",
                `Nueva versión disponible (${latestVersion}). Actualiza para continuar.`,
                [
                    {
                        text: "Actualizar",
                        onPress: () => Linking.openURL(apkUrl)
                    }
                ],
                { cancelable: false }
            );
        }
    } catch (error) {
        console.log("Error al verificar actualización:", error);
    }
}

export default checkForUpdate;
