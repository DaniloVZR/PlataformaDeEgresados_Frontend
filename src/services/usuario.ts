import axios from "axios";

export async function recuperarPassword(correo: string) {
  const url = `${import.meta.env.VITE_API_URL}/usuario/recuperar-password`;
  const { data } = await axios.post(url, { correo });
  return data.msg;
}

export async function comprobarToken(token: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/usuario/recuperar-password/${token}`;
    const { data } = await axios.get(url);
    console.log(data);
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
}

export async function nuevoPassword(token: string, password: string) {

  console.log(token);
  console.log(password);

  try {
    const url = `${import.meta.env.VITE_API_URL}/usuario/recuperar-password/${token}`;
    const { data } = await axios.post(url, { password });
    console.log(data);
    return data.msg;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
}