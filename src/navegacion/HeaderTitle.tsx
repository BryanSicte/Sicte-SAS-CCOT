import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Platform, Dimensions } from "react-native";

export const HeaderTitle = ({ title, showLogo, isMobileWeb, colors }: any) => {
    const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
    const [displayTitle, setDisplayTitle] = useState(title);

    useEffect(() => {
        const subscription = Dimensions.addEventListener("change", ({ window }) => {
            setScreenWidth(window.width);
        });

        return () => subscription?.remove?.();
    }, []);

    useEffect(() => {
        if (!title || !screenWidth) return;

        const screenWidthTemp = screenWidth - (showLogo ? 215 : 45) - 96;
        const fontSize = isMobileWeb || Platform.OS !== "web" ? 25 : 35;
        const avgCharWidthFactor = 0.6;
        const textWidthTemp = title.length * fontSize * avgCharWidthFactor;

        let maxChars: number;
        if (textWidthTemp > screenWidthTemp) {
            maxChars = Math.floor(screenWidthTemp / (isMobileWeb || Platform.OS !== "web" ? 12 : 20)) - 4;
        } else {
            maxChars = title.length;
        }

        const newDisplay = title.length > maxChars ? title.slice(0, maxChars) + "..." : title;
        setDisplayTitle(newDisplay);
    }, [screenWidth, showLogo, title]);

    return (
        <View
            style={{
                flex: 1,
                alignItems: Platform.OS === "web" ? "center" : "flex-start",
                justifyContent: "center",
                overflow: "hidden",
                paddingLeft: isMobileWeb || Platform.OS !== "web" ? 0 : 20,
            }}
        >
            <Text
                style={{
                    fontSize: isMobileWeb || Platform.OS !== "web" ? 25 : 35,
                    fontWeight: "bold",
                    color: colors.texto,
                    fontFamily: "TiltWarp",
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {displayTitle}
            </Text>
        </View>
    );
};
