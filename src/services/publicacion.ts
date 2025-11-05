import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/publicaciones`;

export interface PublicacionData {
  titulo: string;
  usuarioId?: string;
  contenido: string;
}

// 🔍 Función auxiliar para obtener token y usuario
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

  console.log("🧩 Datos de autenticación:", { usuarioId, token });
  return { usuarioId, token };
}

// 🟦 Crear publicación
export const crearPublicacion = async (data: PublicacionData) => {
  const { usuarioId, token } = getAuthData();

  if (!usuarioId) {
    console.error("🚫 No se encontró el ID del usuario autenticado.");
    throw new Error("No se encontró el ID del usuario autenticado.");
  }

  const payload = { ...data, usuarioId };
  console.log("📤 Enviando publicación al backend:", payload);

  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      timeout: 10000, // máximo 10s para no quedarse colgado
    });

    console.log("✅ Publicación creada correctamente:", response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("🚨 Error HTTP al crear publicación:", {
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("⚠️ Error desconocido al crear publicación:", error);
    }
    throw error;
  }
};

// 🟩 Obtener publicaciones
export const obtenerPublicaciones = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    console.error("🚨 Error al obtener publicaciones:", error);
    throw error;
  }
};

