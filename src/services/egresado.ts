import { getToken } from "./usuario";

const API_URL = `${import.meta.env.VITE_API_URL}/egresado`;

export interface Egresado {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  descripcion: string;
  programaAcademico: string;
  yearGraduacion: number;
  redesSociales: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
  fotoPerfil: string;
  completadoPerfil: boolean;
}

export interface BusquedaParams {
  q?: string;
  programa?: string;
  yearGraduacion?: number;
  page?: number;
  limit?: number;
}

// Buscar egresados
export const buscarEgresados = async (params: BusquedaParams = {}) => {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const searchParams = new URLSearchParams();

  if (params.q) searchParams.append("q", params.q);
  if (params.programa) searchParams.append("programa", params.programa);
  if (params.yearGraduacion) searchParams.append("yearGraduacion", String(params.yearGraduacion));
  if (params.page) searchParams.append("page", String(params.page));
  if (params.limit) searchParams.append("limit", String(params.limit));

  const response = await fetch(`${API_URL}/buscar?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al buscar egresados");
  }

  return await response.json();
};

// Obtener perfil público de un egresado
export const obtenerPerfilPublico = async (id: string) => {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || "Error al obtener el perfil");
  }

  return await response.json();
};

// Obtener programas académicos para filtros
export const obtenerProgramas = async () => {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const response = await fetch(`${API_URL}/programas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener programas");
  }

  return await response.json();
};

// Obtener años de graduación para filtros
export const obtenerAnios = async () => {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const response = await fetch(`${API_URL}/years`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener años");
  }

  console.log(response);

  return await response.json();
};

// Obtener publicaciones de un egresado específico
export const obtenerPublicacionesEgresado = async (egresadoId: string, page = 1, limit = 10) => {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/publicacion/egresado/${egresadoId}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener publicaciones");
  }

  return await response.json();
};

// Obtener publicaciones likeadas por el usuario actual
export const obtenerPublicacionesLikeadas = async (page = 1, limit = 10) => {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/publicacion/likeados?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener publicaciones likeadas");
  }

  return await response.json();
};