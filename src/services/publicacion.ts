// src/services/publicacion.ts

const API_URL = "http://localhost:4000/api/publicaciones"; 

export interface PublicacionData {
  titulo: string;
  usuarioId?: string;
  contenido: string;
   
}

export const crearPublicacion = async (data: PublicacionData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Si usas autenticación por token, agrégalo aquí:
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al crear la publicación");
    }

    return await response.json();
  } catch (error) {
    console.error(" Error en crearPublicacion:", error);
    throw error;
  }
};

export const obtenerPublicaciones = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener publicaciones");
    return await response.json();
  } catch (error) {
    console.error(" Error en obtener publicaciones:", error);
    throw error;
  }
};
