import MapView, { Marker, Polyline } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

export default function MapViewNative({ coords }) {
    const region = {
        latitude: coords[0].latitude,
        longitude: coords[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={region}>
                {coords.map((c, i) => (
                    <Marker key={i} coordinate={{ latitude: c.latitude, longitude: c.longitude }} />
                ))}
                <Polyline coordinates={coords} strokeColor="#FF0000" strokeWidth={3} />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});
