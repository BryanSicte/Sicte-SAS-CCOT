import React, { useEffect, useState } from "react";
import { Platform, Pressable, View, Image, Text, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StackNavigationOptions } from "@react-navigation/stack";
import Storage from "../utilitarios/Storage";
import { useUserMenu } from "../contexto/UserMenuContext";
import { useNavigationParams } from "../contexto/NavigationParamsContext";
import { HeaderTitle } from "./HeaderTitle";
import Toast from "react-native-toast-message";
import { getCcot } from "../servicios/Api";

type HeaderOptionsParams = {
    toggleMenu: () => void;
    toggleTheme: () => void;
    isDark: boolean;
    colors: any;
    navigation: any;
    showLogo?: boolean;
    canGoBack?: boolean;
    isMobileWeb?: boolean;
};

function UserHeaderButton({ navigation, colors }: any) {
    const [dataUser, setDataUser] = useState<any>(null);
    const { setMenuVisibleUser } = useUserMenu();
    const { setParams } = useNavigationParams();

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
                        setParams("Login", { label: "Iniciar Sesion" });
                        navigation.navigate("Login");
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

function HeaderLogo({
    isDark,
    isMobileWeb,
}: {
    isDark: boolean;
    isMobileWeb: boolean;
}) {
    const [imagenes, setImagenes] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await getCcot();

                const parsedImages = Array.isArray(response?.archivos)
                    ? response.archivos
                        .map((img: any) => img?.url)
                        .filter(Boolean)
                    : [];

                setImagenes(parsedImages);
            } catch (error: any) {
                const msg1 = "Error al cargar imagenes";
                const msg2 = error?.data?.messages?.message2 || "Las imagenes no estan disponibles.";
                Toast.show({ type: "info", text1: msg1, text2: msg2, position: "top" });
                setImagenes([]);
            }
        };

        loadData();
    }, []);

    const uri =
        Platform.OS === "web" && !isMobileWeb
            ? isDark
                ? imagenes.find((url: string) => url.includes("1OQS5GOfKu4bedFrHEbZhltuCcObOHFN4"))
                : imagenes.find((url: string) => url.includes("1opFjvV_HkKsgqQdJB0lhbgxgafqRxx5w"))
            : null;

    return (
        <Image
            source={{ uri }}
            style={{
                width: Platform.OS === "web" ? 150 : 0,
                height: 40,
                marginLeft: 20,
            }}
            resizeMode="contain"
        />
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
        isMobileWeb = false,
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
                    <HeaderLogo isDark={isDark} isMobileWeb={isMobileWeb} />
                )}
            </View>
        ),

        headerTitleAlign: (isMobileWeb || Platform.OS !== "web") && title !== "CCOT" ? "left" : "center",
        headerTitle: () => (
            <HeaderTitle
                title={title}
                showLogo={showLogo}
                isMobileWeb={isMobileWeb}
                colors={colors}
            />
        ),

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
