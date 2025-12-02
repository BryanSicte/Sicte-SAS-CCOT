import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, Image, Animated, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Carousel from "react-native-reanimated-carousel";
import { RootStackParamList } from "../navegacion/RootNavigator";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import { useMenu } from "../contexto/MenuContext";
import { useIsMobileWeb } from "../utilitarios/IsMobileWeb";
import Loader from "../componentes/Loader";
import Toast from "react-native-toast-message";
import { getInicio } from "../servicios/Api";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const { width, height } = Dimensions.get("window");

export default function Inicio({ }: Props) {
    const { open } = useMenu();
    const stylesGlobal = useGlobalStyles();
    const isMobileWeb = useIsMobileWeb();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-30)).current;
    const lineWidth = useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = useState(true);
    const [imagenes, setImagenes] = useState<string[]>([]);

    const loadData = async () => {
        try {
            const response = await getInicio();

            const parsedImages = Array.isArray(response?.archivos)
                ? response.archivos
                    .map((img: any) => img?.url)
                    .filter(Boolean)
                : [];

            setImagenes(parsedImages);
        } catch (error: any) {
            const msg1 = "Error al cargar imágenes";
            const msg2 = error?.data?.messages?.message2 || "Las imagenes no está disponible.";
            Toast.show({ type: "info", text1: msg1, text2: msg2, position: "top" });
            setImagenes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(lineWidth, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false,
            }),
        ]).start();
        loadData();
    }, []);

    const animatedLineWidth = lineWidth.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.6],
    });

    if (loading) {
        return <Loader visible={loading} />;
    }

    return (
        <View style={{ ...stylesGlobal.container }}>
            <Carousel
                width={width}
                height={height}
                autoPlay={true}
                data={imagenes}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={{ flex: 1, width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />
                )}
            />

            <View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.2)",
                }}
            />

            <View
                style={{
                    position: "absolute",
                    top: isMobileWeb ? height * 0.15 : height * 0.25,
                    alignSelf: "center",
                    alignItems: "center"
                }}
            >
                <Animated.Text
                    style={{
                        fontSize: 45,
                        fontWeight: "bold",
                        color: "#fff",
                        fontFamily: "TiltWarp",
                        textAlign: "center",
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    CENTRO DE CONTROL{"\n"}DE OPERACIONES TECNICAS
                </Animated.Text>

                <Animated.View
                    style={{
                        marginTop: 6,
                        height: 3,
                        backgroundColor: "#fff",
                        width: animatedLineWidth,
                        borderRadius: 5,
                    }}
                />
            </View>
        </View>
    );
}
