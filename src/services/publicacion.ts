import { getToken } from "./usuario";

const API_URL = `${import.meta.env.VITE_API_URL}/publicacion`;

export interface PublicacionData {
  descripcion: string;
  imagen?: File;
}

export const crearPublicacion = async (data: PublicacionData) => {
  try {
    const formData = new FormData();
    formData.append("descripcion", data.descripcion);

    if (data.imagen) {
      formData.append("imagen", data.imagen);
    }

    const token = getToken();
    if (!token) {
      throw new Error("No estás autenticado");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Error al crear la publicación");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en crearPublicacion:", error);
    throw error;
  }
};

export const obtenerPublicaciones = async (page = 1, limit = 10) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No estás autenticado");
    }

    const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener publicaciones");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en obtenerPublicaciones:", error);
    throw error;
  }
};

export const toggleLike = async (publicacionId: string) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No estás autenticado");
    }

    const response = await fetch(`${API_URL}/${publicacionId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al procesar el like");
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Error en toggleLike:", error);
    throw error;
  }
};

export const eliminarPublicacion = async (publicacionId: string) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No estás autenticado");
    }

    const response = await fetch(`${API_URL}/${publicacionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar publicación");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en eliminarPublicacion:", error);
    throw error;
  }
};