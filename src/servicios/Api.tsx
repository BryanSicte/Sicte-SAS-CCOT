import Constants from "expo-constants";
import Storage from "../utilitarios/Storage";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const request = async (endpoint, method = "GET", body = null, headers = {}) => {
    try {
        let token = null;

        if (!endpoint.includes("/usuarios/loginV2")) {
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

        throw {
            status: 0,
            message: error.data.message || "Error de red",
        };
    }
};

export const login = (correo, contrasena) =>
    request("/usuarios/loginV2", "POST", { correo, contrasena });

export const getUsuarios = () =>
    request("/usuarios", "GET");

export const getUsuariosCedulaNombre = () =>
    request("/usuarios/plantaEnLineaCedulaNombreV2", "GET");

export const setParqueAutomotor = (data) =>
    request("/parqueAutomotor/crearRegistro", "POST", data);

export const getParqueAutomotor = () =>
    request("/parqueAutomotor/registros", "GET");

export const getBodegaKgprodOperacionesCodigoDescripUnimed = () =>
    request("/bodega/registrosKgprodOperacionesCodigoDescripUnimed", "GET");

export const setInventarios = (data) =>
    request("/inventarios/crearRegistro", "POST", data);

export default request;
