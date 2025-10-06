import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Platform, Pressable, View, Image, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StackNavigationOptions } from "@react-navigation/stack";
import Storage from "../utilitarios/Storage";
import { useUserMenu } from "../contexto/UserMenuContext";

type HeaderOptionsParams = {
    toggleMenu: () => void;
    toggleTheme: () => void;
    isDark: boolean;
    colors: any;
    navigation: any;
    showLogo?: boolean;
    canGoBack?: boolean;
};

function UserHeaderButton({ navigation, colors }: any) {
    const [dataUser, setDataUser] = useState<any>(null);
    const { setMenuVisibleUser } = useUserMenu();

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await Storage.getItem("dataUser");
            if (storedUser) {
                setDataUser(JSON.parse(storedUser));
            }
        };
        loadUser();
    }, []);

    const firstLetter = dataUser?.nombre?.charAt(0).toUpperCase();

    return (
        <View style={{ position: "relative" }}>
            <Pressable
                onPress={() => {
                    if (!dataUser) {
                        navigation.navigate("Login", { label: "Iniciar Sesion" });
                    } else {
                        setMenuVisibleUser((prev: boolean) => !prev);
                    }
                }}
                style={(state: any) => [
                    {
                        marginRight: Platform.OS === "web" ? 10 : 5,
                        borderRadius: 5,
                        padding: Platform.OS === "web" ? 5 : 5,
                    },
                    state.hovered && { backgroundColor: colors.backgroundHover },
                    state.pressed && { backgroundColor: colors.backgroundPressed },
                ]}
            >
                {(state: any) =>
                    !dataUser ? (
                        <Ionicons
                            name="person-outline"
                            size={24}
                            color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono}
                        />
                    ) : (
                        <View
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                paddingBottom: 2,
                                backgroundColor: colors.backgroundPressed,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: colors.textoPressed, fontWeight: "bold", fontSize: 20 }}>
                                {firstLetter}
                            </Text>
                        </View>
                    )
                }
            </Pressable>
        </View>
    );
}

export const getHeaderOptions = (
    title: string,
    {
        toggleMenu,
        toggleTheme,
        isDark,
        colors,
        navigation,
        showLogo = true,
        canGoBack = false,
    }: HeaderOptionsParams
): StackNavigationOptions => {
    return {
        headerLeft: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {canGoBack ? (
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={(state: any) => [
                            {
                                marginLeft: Platform.OS === "web" ? 10 : 5,
                                borderRadius: 5,
                                padding: Platform.OS === "web" ? 5 : 5,
                            },
                            state.hovered && { backgroundColor: colors.backgroundHover },
                            state.pressed && { backgroundColor: colors.backgroundPressed },
                        ]}
                    >
                        {(state: any) => (
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono}
                            />
                        )}
                    </Pressable>
                ) : (
                    <Pressable
                        onPress={toggleMenu}
                        style={(state: any) => [
                            {
                                marginLeft: Platform.OS === "web" ? 10 : 5,
                                borderRadius: 5,
                                padding: Platform.OS === "web" ? 5 : 5,
                            },
                            state.hovered && { backgroundColor: colors.backgroundHover },
                            state.pressed && { backgroundColor: colors.backgroundPressed },
                        ]}
                    >
                        {(state: any) => (
                            <Ionicons
                                name="menu"
                                size={24}
                                color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono}
                            />
                        )}
                    </Pressable>
                )}

                {showLogo && (
                    <Image
                        source={{
                            uri:
                                Platform.OS === "web"
                                    ? isDark
                                        ? "https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297343/Logo_Original_2_zelyfk.png"
                                        : "https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297342/Logo_Original_homvl9.png"
                                    : isDark
                                        ? "https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297343/Logo_Original_Mobile_Dark.png"
                                        : "https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297342/Logo_Original_Mobile_Light.png",
                        }}
                        style={{
                            width: Platform.OS === "web" ? 150 : 0,
                            height: 40,
                            marginLeft: 20,
                        }}
                        resizeMode="contain"
                    />
                )}
            </View>
        ),

        headerTitleAlign: Platform.OS !== "web" && title !== "CCOT" ? "left" : "center",
        headerTitle: () => {
            const maxLength = 14;
            const displayTitle = Platform.OS !== "web" && title.length > maxLength ? title.substring(0, maxLength) + "..." : title;

            return (
                <Text
                    style={{
                        fontSize: 35,
                        fontWeight: "bold",
                        color: colors.texto,
                        fontFamily: "TiltWarp",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {displayTitle}
                </Text>
            );
        },

        headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                    onPress={toggleTheme}
                    style={(state: any) => [
                        {
                            marginRight: Platform.OS === "web" ? 10 : 5,
                            borderRadius: 5,
                            padding: Platform.OS === "web" ? 5 : 5,
                        },
                        state.hovered && { backgroundColor: colors.backgroundHover },
                        state.pressed && { backgroundColor: colors.backgroundPressed },
                    ]}
                >
                    {(state: any) => (
                        <Ionicons
                            name={isDark ? "sunny-outline" : "moon-outline"}
                            size={24}
                            color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : colors.icono}
                        />
                    )}
                </Pressable>
                <UserHeaderButton navigation={navigation} colors={colors} />
            </View>
        ),
    };
};
