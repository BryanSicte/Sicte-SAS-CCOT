import { useEffect, useState } from "react";
import { Platform, Dimensions } from "react-native";

export const useIsMobileWeb = () => {
    const [isMobile, setIsMobile] = useState(
        Platform.OS === "web" && Dimensions.get("window").width < 768
    );

    useEffect(() => {
        if (Platform.OS !== "web") return;

        const updateState = () => {
            const { width } = Dimensions.get("window");
            setIsMobile(width < 768);
        };

        const subscription = Dimensions.addEventListener("change", updateState);
        return () => subscription?.remove();
    }, []);

    return isMobile;
};
