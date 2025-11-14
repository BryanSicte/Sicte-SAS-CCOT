import { MapContainer, TileLayer, Marker, Polyline, } from 'react-leaflet';
import { View, StyleSheet } from "react-native";
import 'leaflet/dist/leaflet.css';

export default function MapViewNative({ coords }) {
    const defaultCenter = [4.648625, -74.247895];
    const center = coords.length ? [coords[0].latitude, coords[0].longitude] : defaultCenter;

    return (
        <View style={styles.container}>
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {coords.map((c, i) => (
                    <Marker key={i} position={[c.latitude, c.longitude]} />
                ))}
                <Polyline positions={coords.map(c => [c.latitude, c.longitude])} color="red" />
            </MapContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});

