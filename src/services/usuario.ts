import axios from "axios";

export async function iniciarSesion(correo: string, password: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/usuario/autenticar`;
    const { data } = await axios.post(url, { correo, password });
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        msg: error.response.data.msg || 'Error al iniciar sesión',
      }
    }
    throw error;
  }
}

export async function cerrarSesion() {
  try {
    const url = `${import.meta.env.VITE_API_URL}/usuario/logout`;
    const { data } = await axios.post(url);
    return data;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

export async function registrarse(nombre: string, correo: string, password: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/usuario/registrar`;
    const { data } = await axios.post(url, { nombre, correo, password });
    console.log(data);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        msg: error.response.data.msg || 'Error al registrarse',
      }
    }
  }
}

export async function confimarUsuario(token: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/usuario/confirmar/${token}`;
    const { data } = await axios.get(url);
    console.log(data);
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      msg: 'Error al verificar el token',
      valido: false
    }
  }
}

export async function recuperarPassword(correo: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/usuario/recuperar-password`;
    const { data } = await axios.post(url, { correo });
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.msg;
    }
    return 'Error de conexión';
  }
}

export async function comprobarToken(token: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/usuario/recuperar-password/${token}`;
    const { data } = await axios.get(url);
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      msg: 'Error al verificar el token',
      valido: false
    }
  }
}

export async function nuevoPassword(token: string, password: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/usuario/recuperar-password/${token}`;
    const { data } = await axios.post(url, { password });
    return data.msg;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
}