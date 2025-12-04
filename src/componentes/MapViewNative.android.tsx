import React, { useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps';
import CustomButton from "./ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";

export default function MapViewNative({ coords }) {
    const mapRef = useRef(null);

    const defaultCenter = { latitude: 4.648625, longitude: -74.247895, latitudeDelta: 0.05, longitudeDelta: 0.05 };

    const initialRegion =
        coords && coords.length > 0
            ? {
                latitude: coords[0].latitude,
                longitude: coords[0].longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }
            : defaultCenter;

    function RecenterButton({ coords }) {
        const { isDark } = useThemeCustom();
        const colors = isDark ? darkColors : lightColors;

        const recenter = () => {
            if (!coords || coords.length === 0 || !mapRef.current) return;

            if (coords.length === 1) {
                mapRef.current.animateToRegion(
                    {
                        latitude: coords[0].latitude,
                        longitude: coords[0].longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    },
                    500
                );
            } else {
                mapRef.current.fitToCoordinates(
                    coords.map(c => ({
                        latitude: c.latitude,
                        longitude: c.longitude,
                    })),
                    {
                        edgePadding: { top: 150, right: 50, bottom: 150, left: 50 },
                        animated: true,
                    }
                );
            }
        };

        return (
            <CustomButton
                label=''
                onPress={recenter}
                style={{
                    position: "absolute",
                    top: 80,
                    right: 20,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 50,
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999
                }}
            >
                {(state: any) => (
                    <Ionicons name="locate" size={24} color={state.pressed ? colors.iconoPressed : state.hovered ? colors.iconoHover : "#fff"} />
                )}
            </CustomButton>
        );
    }

    return (
        <View style={styles.container}>
            <MapView ref={mapRef} style={{ flex: 1, height: Dimensions.get("window").height }} initialRegion={initialRegion}>
                {coords && coords.length > 0 && (
                    <>
                        <Polyline
                            coordinates={coords.map(c => ({ latitude: c.latitude, longitude: c.longitude }))}
                            strokeColor="#0A66C2"
                            strokeWidth={4}
                        />
                        {coords.map((c, i) => (
                            <Marker
                                key={i}
                                coordinate={{ latitude: c.latitude, longitude: c.longitude }}
                            />
                        ))}
                    </>
                )}
            </MapView>

            <RecenterButton coords={coords} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});
