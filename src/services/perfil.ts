const API_URL = "http://localhost:5000/api/egresado";

function getToken() {
  return localStorage.getItem("token");
}

export async function obtenerEgresado() {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
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
console.log()