import Storage from "../utilitarios/Storage";
import { Platform } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_APP_ENV === "dev"
    ? process.env.EXPO_PUBLIC_API_URL_DEV
    : process.env.EXPO_PUBLIC_API_URL_PROD;

const API_URL =
    Platform.OS === "web" && process.env.EXPO_PUBLIC_APP_ENV === "dev"
        ? "http://localhost:8120/api"
        : apiUrl;

if (!API_URL) {
    console.warn("API_URL no esta definido. Revisa .env y expo.config.js");
} else {
    console.log(API_URL)
}

const request = async (endpoint, method = "GET", body = null, headers = {}) => {
    try {
        let token = null;

        if (!endpoint.includes("/usuarios/loginV2") || !endpoint.includes("/imagenes/inicio")) {
            const storedTokenUser = await Storage.getItem("dataTokenUser");
            if (storedTokenUser) {
                const parsed = JSON.parse(storedTokenUser);
                token = parsed.token;
            }
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
            body: body ? JSON.stringify(body) : null,
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                data,
            };
        }

        return data;

    } catch (error) {

        if (error.status) {
            throw error;
        }

        const message =
            error?.data?.message ||
            error?.message ||
            "Error de red o respuesta inválida del servidor.";

        throw {
            status: error?.status || 0,
            message,
        };
    }
};

export const getCcot = () =>
    request("/imagenes/ccot", "GET");

export const getInicio = () =>
    request("/imagenes/inicio", "GET");

export const login = (correo, contrasena) =>
    request("/usuarios/loginV2", "POST", { correo, contrasena });

export const getUsuarios = () =>
    request("/usuarios/usersV2", "GET");

export const getUbicacionUsuarios = () =>
    request("/usuarios/ubicacionUsuarios", "GET");

export const postUbicacionUsuarios = (data) =>
    request("/usuarios/ubicacionUsuarios", "POST", data);

export const getUsuariosCedulaNombre = async (planta) => {
    if (planta && planta.data && planta.data.length > 0) {
        return planta;
    }
    return await request("/usuarios/plantaEnLineaCedulaNombreV2", "GET");
}

export const postParqueAutomotor = (data) =>
    request("/parqueAutomotor/crearRegistro", "POST", data);

export const getParqueAutomotor = () =>
    request("/parqueAutomotor/registros", "GET");

export const getParqueAutomotorBase = async (parqueAutomotorBase) => {
    if (parqueAutomotorBase && parqueAutomotorBase.data && parqueAutomotorBase.data.length > 0) {
        return parqueAutomotorBase;
    }
    return await request("/parqueAutomotor/base", "GET");
}

export const getBodegaKgprodOperacionesCodigoDescripUnimed = () =>
    request("/bodega/registrosKgprodOperacionesCodigoDescripUnimed", "GET");

export const postInventarios = (data) =>
    request("/inventarios/crearRegistro", "POST", data);

export const putInventarios = (data) =>
    request("/inventarios/actualizarRegistros", "PUT", data);

export const getInventarios = () =>
    request("/inventarios/registros", "GET");

export const getInventariosCedulasTecnico = () =>
    request("/inventarios/registrosCedulasTecnico", "GET");

export const getInventariosImagen = (data) =>
    request(`/inventarios/descargarImagen?filename=${encodeURIComponent(data)}`, "GET");

export const getVersion = () =>
    request("/version", "GET");

export default request;
