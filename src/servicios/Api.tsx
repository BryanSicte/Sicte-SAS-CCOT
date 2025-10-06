import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const request = async (endpoint, method = "GET", body = null, headers = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
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
    request("/usuarios/plantaEnLineaCedulaNombre", "GET");

export const setParqueAutomotor = (data) =>
    request("/parqueAutomotor/crearRegistro", "POST", data);

export const getParqueAutomotor = () =>
    request("/parqueAutomotor/registros", "GET");

export default request;
