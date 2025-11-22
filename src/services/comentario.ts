import { getToken } from "./usuario";

const API_URL = `${import.meta.env.VITE_API_URL}/comentario`;

export interface Comentario {
  _id: string;
  publicacion: string;
  autor: {
    _id: string;
    nombre: string;
    apellido: string;
    fotoPerfil: string;
  };
  contenido: string;
  createdAt: string;
  updatedAt: string;
}

export const crearComentario = async (publicacionId: string, contenido: string) => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/${publicacionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ publicacionId, contenido }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear el comentario");
  }

  return await response.json();
}

export const obtenerComentarios = async (publicacionId: string, page = 1, limit = 10) => {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const response = await fetch(`${API_URL}/${publicacionId}?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener comentarios");
  }

  return await response.json();
};

export const eliminarComentario = async (comentarioId: string) => {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const response = await fetch(`${API_URL}/${comentarioId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || "Error al eliminar comentario");
  }

  return await response.json();
};

export const contarComentarios = async (publicacionId: string) => {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const response = await fetch(`${API_URL}/${publicacionId}/count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al contar comentarios");
  }

  return await response.json();
};