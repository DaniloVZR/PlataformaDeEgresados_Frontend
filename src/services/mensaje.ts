import { getToken } from "./usuario";

const API_URL = `${import.meta.env.VITE_API_URL}/mensaje`;

export interface Mensaje {
  _id: string;
  emisor: {
    _id: string;
    nombre: string;
    apellido: string;
    fotoPerfil: string;
  };
  receptor: {
    _id: string;
    nombre: string;
    apellido: string;
    fotoPerfil: string;
  };
  contenido: string;
  leido: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversacion {
  usuario: {
    _id: string;
    nombre: string;
    apellido: string;
    fotoPerfil: string;
    programaAcademico: string;
  };
  ultimoMensaje: {
    contenido: string;
    createdAt: string;
    esMio: boolean;
  };
  mensajesNoLeidos: number;
}

export const enviarMensaje = async (receptorId: string, contenido: string) => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ receptorId, contenido }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || "Error al enviar mensaje");
  }

  return await response.json();
};

export const obtenerConversaciones = async () => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/conversaciones`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener conversaciones");
  return await response.json();
};

export const obtenerConversacion = async (usuarioId: string, page = 1, limit = 30) => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/${usuarioId}?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener conversación");
  return await response.json();
};

export const marcarComoLeido = async (usuarioId: string) => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/${usuarioId}/leido`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al marcar como leído");
  return await response.json();
};

export const obtenerMensajesNoLeidos = async () => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/no-leidos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener contador");
  return await response.json();
};