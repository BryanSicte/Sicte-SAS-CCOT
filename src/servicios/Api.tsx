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

export const getInventarios = () =>
    request("/inventarios/registros", "GET");

export const getInventariosCedulasTecnico = () =>
    request("/inventarios/registrosCedulasTecnico", "GET");

export const getInventariosImagen = (data) =>
    request(`/inventarios/descargarImagen?filename=${encodeURIComponent(data)}`, "GET");

export default request;
