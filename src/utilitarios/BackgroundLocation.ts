import * as TaskManager from "expo-task-manager";
import * as ExpoLocation from "expo-location";
import { Platform } from "react-native";

const TASK_NAME = "BACKGROUND_LOCATION_TASK";

let webWatchId: number | null = null;

if (Platform.OS !== "web") {
    // Registrar la tarea (solo se hace una vez)
    TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
        if (error) {
            console.error("Error en tarea de ubicación:", error);
            return;
        }
        if (data) {
            const { locations } = data as any;
            const location = locations[0];
            if (location) {
                console.log("📍 Nueva ubicación:", location.coords);
                // Aquí podrías hacer un fetch a tu API para guardar la ubicación
            }
        }
    });
}

export async function startBackgroundLocation(userId: number) {
    try {
        if (Platform.OS === "web") {
            // 🌐 --- Versión Web ---
            if (!("geolocation" in navigator)) {
                console.warn("Geolocalización no soportada en este navegador.");
                return;
            }

            if (webWatchId) {
                console.log("🔄 Servicio de ubicación web ya activo");
                return;
            }

            webWatchId = navigator.geolocation.watchPosition(
                (position) => {
                    console.log("📍 Nueva ubicación (web):", position.coords);
                    // Enviar a tu API, si quieres
                    // fetch(`${API_URL}/ubicacion`, { method: "POST", body: JSON.stringify({...}) })
                },
                (error) => {
                    console.error("❌ Error obteniendo ubicación web:", error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 5000,
                }
            );

            console.log("✅ Servicio de ubicación web iniciado para usuario:", userId);
            return;
        }

        // 📱 --- Versión App (Android / iOS) ---
        // Pedir permisos
        const { status: foregroundStatus } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (foregroundStatus !== "granted") {
            console.warn("Permiso de ubicación denegado (foreground)");
            return;
        }

        const { status: backgroundStatus } = await ExpoLocation.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== "granted") {
            console.warn("Permiso de ubicación denegado (background)");
            return;
        }

        const hasStarted = await ExpoLocation.hasStartedLocationUpdatesAsync(TASK_NAME);
        if (!hasStarted) {
            await ExpoLocation.startLocationUpdatesAsync(TASK_NAME, {
                accuracy: ExpoLocation.Accuracy.High,
                distanceInterval: 10, // cada 10 metros
                deferredUpdatesInterval: 1000 * 60, // cada minuto
                showsBackgroundLocationIndicator: true,
                pausesUpdatesAutomatically: false,
                foregroundService: {
                    notificationTitle: "Sicte en segundo plano",
                    notificationBody: "La app está registrando tu ubicación de servicio.",
                },
            });

            console.log("✅ Servicio de ubicación iniciado para usuario:", userId);
        }
    } catch (error) {
        console.error("❌ Error iniciando ubicación:", error);
    }
}

export async function stopBackgroundLocation() {
    try {
        if (Platform.OS === "web") {
            if (webWatchId !== null) {
                navigator.geolocation.clearWatch(webWatchId);
                webWatchId = null;
                console.log("🛑 Servicio de ubicación web detenido");
            }
            return;
        }

        // 📱 Versión app
        const hasStarted = await ExpoLocation.hasStartedLocationUpdatesAsync(TASK_NAME);
        if (hasStarted) {
            await ExpoLocation.stopLocationUpdatesAsync(TASK_NAME);
            console.log("🛑 Servicio de ubicación detenido");
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