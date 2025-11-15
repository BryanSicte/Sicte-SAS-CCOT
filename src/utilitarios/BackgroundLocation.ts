import * as TaskManager from "expo-task-manager";
import * as ExpoLocation from "expo-location";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postUbicacionUsuarios } from "../servicios/Api";

const TASK_NAME = "BACKGROUND_LOCATION_TASK";
let webWatchId: number | null = null;

if (Platform.OS !== "web") {
    TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
        if (error) {
            console.error("Error en tarea de ubicación:", error);
            Toast.show({ type: "error", text1: "Error en tarea de ubicación", text2: "Ocurrió un problema al ejecutar la tarea de ubicación.", position: "top" });
            return;
        }
        if (data) {
            const { locations } = data as any;
            const location = locations[0];
            if (location) {
                const userData = await AsyncStorage.getItem("dataUser");
                const user = userData ? JSON.parse(userData) : null;
                const fechaActual = new Date().toISOString();
                const payload = {
                    fechaToma: fechaActual,
                    cedulaUsuario: user.cedula,
                    nombreUsuario: user.nombre,
                    precisionLatLon: location.coords.accuracy,
                    altitud: location.coords.altitude,
                    precisionAltitud: location.coords.altitudeAccuracy,
                    direccionGrados: location.coords.heading,
                    latitud: location.coords.latitude,
                    longitud: location.coords.longitude,
                    velocidad: location.coords.speed,
                    origen: Platform.OS,
                };
                // console.log("📍 Nueva ubicación registrada:", payload);
                const response = await postUbicacionUsuarios(payload);
                // Aquí podrías hacer un fetch a tu API para guardar la ubicación
            }
        }
    });
}

let lastPosition: { lat: number; lon: number } | null = null;

function getDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (v) => (v * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function startBackgroundLocation(user: any) {
    try {
        if (Platform.OS === "web") {
            if (!("geolocation" in navigator)) {
                Toast.show({ type: "info", text1: "Geolocalización no disponible", text2: "Tu navegador no admite funciones de ubicación.", position: "top" });
                return;
            }

            if (webWatchId) {
                Toast.show({ type: "info", text1: "Servicio de ubicación activo", text2: "El proceso ya se encuentra en ejecución.", position: "top" });
                return;
            }

            webWatchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    if (lastPosition) {
                        const dist = getDistanceMeters(
                            lastPosition.lat,
                            lastPosition.lon,
                            lat,
                            lon
                        );

                        if (dist < 10) return;
                    }

                    lastPosition = { lat, lon };
                    const payload = {
                        fechaToma: new Date().toISOString(),
                        cedulaUsuario: user.cedula,
                        nombreUsuario: user.nombre,
                        precisionLatLon: position.coords.accuracy,
                        altitud: position.coords.altitude,
                        precisionAltitud: position.coords.altitudeAccuracy,
                        direccionGrados: position.coords.heading,
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude,
                        velocidad: position.coords.speed,
                        origen: Platform.OS,
                    };
                    // console.log("📍 Nueva ubicación (web):", payload);
                    const response = await postUbicacionUsuarios(payload);
                    // Enviar a tu API, si quieres
                    // fetch(`${API_URL}/ubicacion`, { method: "POST", body: JSON.stringify({...}) })
                },
                (error) => {
                    console.error("❌ Error obteniendo ubicación web:", error);
                    Toast.show({ type: "error", text1: "Error al iniciar ubicación", text2: "No fue posible activar el servicio de ubicación. Cierra sesion y intenta nuevamente.", position: "top" });
                },
                {
                    enableHighAccuracy: true,   // usa GPS
                    maximumAge: 0,          // no reutiliza datos viejos (milisegundos)
                    timeout: 30000,              // espera hasta 20 segundos antes de fallar (milisegundos)
                }
            );

            Toast.show({ type: "success", text1: "Ubicación activa", text2: "Se ha iniciado el servicio de ubicación correctamente.", position: "top" });
            return;
        }

        const { status: foregroundStatus } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (foregroundStatus !== "granted") {
            Toast.show({ type: "error", text1: "Permiso de ubicación denegado", text2: "Foreground permission no concedido por el usuario.", position: "top" });
            return;
        }

        const { status: backgroundStatus } = await ExpoLocation.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== "granted") {
            Toast.show({ type: "error", text1: "Permiso de ubicación denegado", text2: "Background permission no concedido por el usuario.", position: "top" });
            return;
        }

        const hasStarted = await ExpoLocation.hasStartedLocationUpdatesAsync(TASK_NAME);
        if (!hasStarted) {
            await ExpoLocation.startLocationUpdatesAsync(TASK_NAME, {
                accuracy: ExpoLocation.Accuracy.Highest,
                timeInterval: 0,
                distanceInterval: 10,
                deferredUpdatesInterval: 0,
                deferredUpdatesDistance: 0,
                showsBackgroundLocationIndicator: true,
                pausesUpdatesAutomatically: false,
                foregroundService: {
                    notificationTitle: "Sicte en segundo plano",
                    notificationBody: "La app está registrando tu ubicación de servicio.",
                },
            });

            Toast.show({ type: "success", text1: "Ubicación activa", text2: "Se ha iniciado el servicio de ubicación correctamente.", position: "top" });
        }
    } catch (error) {
        console.error("❌ Error iniciando ubicación:", error);
        Toast.show({ type: "error", text1: "Error al iniciar ubicación", text2: "No fue posible activar el servicio de ubicación. Cierra sesion y intenta nuevamente.", position: "top" });
    }
}

export async function stopBackgroundLocation() {
    try {
        if (Platform.OS === "web") {
            if (webWatchId !== null) {
                navigator.geolocation.clearWatch(webWatchId);
                webWatchId = null;
                Toast.show({ type: "info", text1: "Servicio de ubicación detenido", text2: "El servicio de ubicación se ha desactivado correctamente.", position: "top" });
            }
            return;
        }

        const hasStarted = await ExpoLocation.hasStartedLocationUpdatesAsync(TASK_NAME);
        if (hasStarted) {
            await ExpoLocation.stopLocationUpdatesAsync(TASK_NAME);
            Toast.show({ type: "info", text1: "Servicio de ubicación detenido", text2: "El servicio de ubicación se ha desactivado correctamente.", position: "top" });
        }
    } catch (error) {
        console.error("❌ Error deteniendo ubicación:", error);

    }
}


/*

Campo	Significado	Ejemplo
latitude	Latitud (posición norte-sur en el mapa).	4.5652197 → está en Bogotá (aprox).
longitude	Longitud (posición este-oeste en el mapa).	-74.1004073 → corresponde a la ubicación en Colombia.
accuracy	Precisión en metros de la ubicación.	14.92 → margen de error de ±15 metros.
altitude	Altitud sobre el nivel del mar en metros.	2636.20 → Bogotá está a esa altura aprox.
altitudeAccuracy	Precisión de la altitud (en metros).	1.11 → muy buena precisión vertical.
heading	Dirección hacia donde se mueve el dispositivo en grados (0°=norte, 90°=este, etc.).	177.08 → hacia el sur.
speed	Velocidad en metros por segundo (m/s).	3.75 m/s ≈ 13.5 km/h, o sea probablemente caminando rápido o en bicicleta.

*/