import React, { useEffect, useRef } from "react";
import { View, Dimensions, Image, Animated, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Carousel from "react-native-reanimated-carousel";
import { RootStackParamList } from "../navegacion/RootNavigator";
import { useGlobalStyles } from "../estilos/GlobalStyles";
import { useMenu } from "../contexto/MenuContext";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const { width, height } = Dimensions.get("window");

const images = [
    'https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297344/Principal_uionbk.jpg',
    'https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297345/Telec_2_wmowse.jpg',
    'https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297342/Obr_Civ_1_cjopsi.jpg',
    'https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297342/Electr_1_u8w2hw.jpg',
    'https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297344/Telec_1_tow9ku.jpg',
    'https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297343/Obr_Civ_2_cpxs6n.jpg',
    'https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297344/Electr_2_wok2fp.jpg',
    'https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297345/Telec_3_qdnbuw.jpg',
    'https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297343/Electr_3_xdizwr.jpg',
    'https://res.cloudinary.com/dcozwbcpi/image/upload/v1753297347/Telec_4_pkfnpo.jpg'
];

export default function Inicio({ }: Props) {
    const { open } = useMenu();
    const stylesGlobal = useGlobalStyles();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-30)).current;
    const lineWidth = useRef(new Animated.Value(0)).current;

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
    }, []);

    const animatedLineWidth = lineWidth.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * 0.6],
    });

    return (
        <View style={{ ...stylesGlobal.container }}>
            <Carousel
                width={width}
                height={height}
                autoPlay={true}
                data={images}
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
                    top: height * 0.25,
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