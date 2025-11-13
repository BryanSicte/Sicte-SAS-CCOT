import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapViewLeaflet({ coords }) {
    return (
        <MapContainer
            center={[coords[0].latitude, coords[0].longitude]}
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
    );
}
