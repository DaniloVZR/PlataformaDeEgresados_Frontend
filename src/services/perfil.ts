import { getToken } from "./usuario";

const API_URL = `${import.meta.env.VITE_API_URL}/egresado`;

export async function obtenerPerfil() {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return await res.json();
}

export async function actualizarEgresado(data: any) {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function actualizarFoto(formData: FormData) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No estás autenticado");
    }

    const res = await fetch(`${API_URL}/foto`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || "Error al actualizar la foto");
    }

    return data;
  } catch (error) {
    console.error("Error en actualizarFoto:", error);
    throw error;
  }
}