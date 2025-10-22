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
  const res = await fetch(`${API_URL}/foto`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });
  return await res.json();
}
