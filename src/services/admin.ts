import { getToken } from "./usuario";

const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

// ==================== MÉTRICAS ====================

export const obtenerMetricas = async () => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/metricas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener métricas");
  return await response.json();
};

export const obtenerEstadisticas = async () => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/estadisticas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener estadísticas");
  return await response.json();
};

// ==================== USUARIOS ====================

export interface FiltrosUsuarios {
  page?: number;
  limit?: number;
  rol?: string;
  activo?: string;
  buscar?: string;
}

export const listarUsuarios = async (filtros: FiltrosUsuarios = {}) => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const params = new URLSearchParams();
  if (filtros.page) params.append("page", String(filtros.page));
  if (filtros.limit) params.append("limit", String(filtros.limit));
  if (filtros.rol) params.append("rol", filtros.rol);
  if (filtros.activo) params.append("activo", filtros.activo);
  if (filtros.buscar) params.append("buscar", filtros.buscar);

  const response = await fetch(`${API_URL}/usuarios?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al listar usuarios");
  return await response.json();
};

export const obtenerDetalleUsuario = async (id: string) => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener detalle");
  return await response.json();
};

export const cambiarRolUsuario = async (id: string, rol: string) => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/usuarios/${id}/rol`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rol }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || "Error al cambiar rol");
  }
  return await response.json();
};

export const toggleBanUsuario = async (id: string, razon?: string) => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/usuarios/${id}/ban`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ razon }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || "Error al cambiar estado");
  }
  return await response.json();
};

// ==================== PUBLICACIONES ====================

export interface FiltrosPublicaciones {
  page?: number;
  limit?: number;
  buscar?: string;
}

export const listarPublicacionesAdmin = async (filtros: FiltrosPublicaciones = {}) => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const params = new URLSearchParams();
  if (filtros.page) params.append("page", String(filtros.page));
  if (filtros.limit) params.append("limit", String(filtros.limit));
  if (filtros.buscar) params.append("buscar", filtros.buscar);

  const response = await fetch(`${API_URL}/publicaciones?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al listar publicaciones");
  return await response.json();
};

export const eliminarPublicacionAdmin = async (id: string, razon?: string) => {
  const token = getToken();
  if (!token) throw new Error("No autorizado");

  const response = await fetch(`${API_URL}/publicaciones/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ razon }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || "Error al eliminar publicación");
  }
  return await response.json();
};