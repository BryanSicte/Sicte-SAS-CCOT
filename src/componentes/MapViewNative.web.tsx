import React, { memo, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap, } from 'react-leaflet';
import { View, StyleSheet } from "react-native";
import 'leaflet/dist/leaflet.css';
import CustomButton from "./Button";
import { Ionicons } from "@expo/vector-icons";
import { useThemeCustom } from "../contexto/ThemeContext";
import { darkColors, lightColors } from "../estilos/Colors";

function RecenterButton({ coords }) {
    const map = useMap();
    const { isDark } = useThemeCustom();
    const colors = isDark ? darkColors : lightColors;

    const recenter = () => {
        if (!coords.length) return;

        if (coords.length === 1) {
            map.setView([coords[0].latitude, coords[0].longitude], 15);
        } else {
            const bounds = coords.map(c => [c.latitude, c.longitude]);
            map.fitBounds(bounds, { padding: [5, 5], maxZoom: 16 });
        }
    };

    return (
        <CustomButton
            label=''
            onPress={recenter}
            style={{
                position: "absolute",
                bottom: 20,
                left: 20,
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

function MapViewNative({ coords }) {
    const defaultCenter = [4.648625, -74.247895];
    const center = useMemo(() =>
        coords.length ? [coords[0].latitude, coords[0].longitude] : defaultCenter,
        [coords]
    );

    return (
        <View style={styles.container}>
            <MapContainer
                center={center}
                zoom={13}
                preferCanvas={true}
                style={{ height: '100%', width: '100%' }}
            >
                <RecenterButton coords={coords} />

                <TileLayer
                    url={`https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=BSzhQkVNDYClk2ZL7Gjh`}
                    attribution="&copy; MapTiler & OpenStreetMap contributors"
                />
                {coords.map((c, i) => (
                    <CircleMarker
                        key={i}
                        center={[c.latitude, c.longitude]}
                        radius={5}
                        pathOptions={{
                            color: "#4C9AFF",
                            fillColor: "#4C9AFF",
                            fillOpacity: 0.9
                        }}
                    />
                ))}
                <Polyline
                    positions={coords.map(c => [c.latitude, c.longitude])}
                    pathOptions={{
                        color: "#0A66C2",
                        weight: 4,
                        opacity: 0.8
                    }}
                />
            </MapContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});

export default memo(MapViewNative);