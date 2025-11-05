import axios from "axios";

const BASE_API_URL = `${import.meta.env.VITE_API_URL}`;
const PUBLICACIONES_API_URL = `${BASE_API_URL}/publicaciones`;

export interface PublicacionData {
  titulo?: string;
  contenido: string;
  usuarioId?: string;
}

function getAuthData() {
  const stored = localStorage.getItem("usuario-storage");
  const token = localStorage.getItem("token");
  let usuarioId: string | undefined;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      usuarioId = parsed?.state?.usuario?.id || parsed?.state?.usuario?._id;
    } catch (e) {
      console.error("❌ Error al leer usuario del localStorage:", e);
    }
  }
  return { usuarioId, token: token || "" };
}

export function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No se encontró el token en localStorage.");
  }
  return token;
}

// --- Funciones de USUARIO ---

export async function iniciarSesion(correo: string, password: string) {
  try {
    const url = `${BASE_API_URL}/usuario/autenticar`;
    const { data } = await axios.post(url, { correo, password });

    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      if (data.usuario) {
        localStorage.setItem(
          "usuario-storage",
          JSON.stringify({ state: { usuario: data.usuario } })
        );
      }
      return { success: true, msg: data.msg, token: data.token, usuario: data.usuario };
    }
    return { success: false, msg: data.msg || "Error al iniciar sesión" };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, msg: error.response.data.msg || "Error al iniciar sesión" };
    }
    throw error;
  }
}

export async function cerrarSesion() {
  try {
    const url = `${BASE_API_URL}/usuario/logout`;
    localStorage.removeItem("token");
    localStorage.removeItem("usuario-storage");
    const { data } = await axios.post(url);
    return data;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

export async function registrarse(nombre: string, correo: string, password: string) {
  try {
    const url = `${BASE_API_URL}/usuario/registrar`;
    const { data } = await axios.post(url, { nombre, correo, password });
    return { success: true, data };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, msg: error.response.data.msg || 'Error al registrarse' };
    }
    throw error;
  }
}

export async function confimarUsuario(token: string) {
  try {
    const url = `${BASE_API_URL}/usuario/confirmar/${token}`;
    const { data } = await axios.get(url);
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return { success: false, msg: 'Error al verificar el token', valido: false };
  }
}

export async function recuperarPassword(correo: string) {
  try {
    const url = `${BASE_API_URL}/usuario/recuperar-password`;
    const { data } = await axios.post(url, { correo });
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, msg: error.response.data.msg };
    }
    return { success: false, msg: 'Error de conexión' };
  }
}

export async function comprobarToken(token: string) {
  try {
    const url = `${BASE_API_URL}/usuario/recuperar-password/${token}`;
    const { data } = await axios.get(url);
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return { success: false, msg: 'Error al verificar el token', valido: false };
  }
}

export async function nuevoPassword(token: string, password: string) {
  try {
    const url = `${BASE_API_URL}/usuario/recuperar-password/${token}`;
    const { data } = await axios.post(url, { password });
    return { success: true, msg: data.msg };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, msg: error.response.data.msg || 'Error al actualizar contraseña' };
    }
    throw error;
  }
}

// --- Funciones de PUBLICACIONES ---

export const crearPublicacion = async (data: PublicacionData) => {
  const { usuarioId, token } = getAuthData();

  if (!usuarioId) {
    throw new Error("No se encontró el ID del usuario autenticado.");
  }

  // Mapeo a los campos esperados por el modelo de Mongoose: autor y descripcion
  const payload = {
    autor: usuarioId,
    descripcion: data.contenido,
    // La imagen se manejaría aquí si la estuvieras pasando en 'data'
  };

  try {
    const response = await axios.post(PUBLICACIONES_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      console.error(`🚨 Error HTTP al crear publicación (Status ${status}):`, data);

      if (status === 404) {
          throw new Error("Ruta de publicación no encontrada (404). ¡Revisa el server.js del backend!");
      }
      if (status === 401 || status === 403) {
          throw new Error("No autorizado. Token inválido o expirado.");
      }
      
      throw new Error(`Error al crear publicación. Código ${status}: ${data?.msg || JSON.stringify(data)}`);
      
    }
    throw error;
  }
};

export const obtenerPublicaciones = async () => {
  try {
    const response = await axios.get(PUBLICACIONES_API_URL);
    return response.data;
  } catch (error: any) {
    console.error("🚨 Error al obtener publicaciones:", error);
    throw error;
  }
};