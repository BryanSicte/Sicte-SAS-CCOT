import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function MapViewNative({ coords }) {

    const defaultCenter = { latitude: 4.648625, longitude: -74.247895, latitudeDelta: 0.05, longitudeDelta: 0.05 };

    return (
        <View style={styles.container}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={
                    coords && coords.length > 0
                        ? {
                            latitude: coords[0].latitude,
                            longitude: coords[0].longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05
                        }
                        : defaultCenter
                }
            >
                {coords && coords.length > 0 && (
                    <>
                        <Polyline
                            coordinates={coords.map(c => ({ latitude: c.latitude, longitude: c.longitude }))}
                            strokeColor="#FF0000"
                            strokeWidth={2}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});
