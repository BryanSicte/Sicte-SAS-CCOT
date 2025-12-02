import { useState } from "react";
import { Platform, Linking } from "react-native";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { getVersion } from "../servicios/Api";
import UpdateModal from "../componentes/UpdateModal";

export default function useCheckForUpdate() {
    const [visible, setVisible] = useState(false);
    const [currentVersion, setCurrentVersion] = useState("");
    const [latestVersion, setLatestVersion] = useState("");
    const [apkUrl, setApkUrl] = useState("");

    async function checkForUpdate() {
        try {
            const data = await getVersion();
            const backendVersion = data.latestVersion;
            const url = data.apkUrl;

            const extra = Constants.expoConfig?.extra ?? {};

            const currentVersionTemp =
                extra.appVersion ??
                Constants.expoConfig?.version ??
                Application.nativeApplicationVersion ??
                "0.0.0";

            if (backendVersion.trim() !== currentVersionTemp.trim()) {
                setCurrentVersion(currentVersionTemp);
                setLatestVersion(backendVersion);
                setApkUrl(url);
                setVisible(true);
            }
        } catch (error) {
            console.log("Error al verificar actualización:", error);
        }
    }

    function handleUpdate() {
        if (Platform.OS === "web") {
            window.location.reload(true);
        } else {
            Linking.openURL(apkUrl);
        }
    }

    const ModalComponent = (
        <UpdateModal
            visible={visible}
            currentVersion={currentVersion}
            latestVersion={latestVersion}
            onUpdate={handleUpdate}
        />
    );

    return { checkForUpdate, ModalComponent };
}
