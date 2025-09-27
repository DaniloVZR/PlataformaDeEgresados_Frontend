import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { recuperarPassword, comprobarToken, nuevoPassword } from "../services/usuario";

type usuarioStore = {
  mensaje: string;
  loading: boolean;
  tokenValido: boolean;
  enviarInstrucciones: (correo: string) => Promise<void>;
  comprobarToken: (token: string) => Promise<string>;
  nuevoPassword: (token: string, password: string) => Promise<string>;
}

export const useUsuarioStore = create<usuarioStore>()(devtools((set) => ({

  tokenValido: undefined,
  mensaje: '',
  loading: false,

  // Envía instrucciones para recuperar la contraseña al correo proporcionado
  enviarInstrucciones: async (correo: string) => {
    set(() => (({
      loading: true,
    })))

    try {
      const mensaje = await recuperarPassword(correo);

      set(() => ({
        mensaje,
        loading: false,
      }))

      setTimeout(() => {
        set(() => ({
          mensaje: '',
        }))
      }, 5000);

    } catch (error) {
      console.error("Error al enviar instrucciones de recuperación:", error);
      throw error;
    }
  },

  comprobarToken: async (token: string) => {
    set(() => (({ loading: true })))

    try {
      const { valido } = await comprobarToken(token);
      console.log(valido);
      set(() => ({
        loading: false,
        tokenValido: valido
      }))

    } catch (error) {
      set(() => ({ loading: false }));
      throw error;
    }
  },

  nuevoPassword: async (token: string, password: string) => {
    set(() => (({ loading: true })))

    try {
      const mensaje = await nuevoPassword(token, password);

      set(() => ({
        mensaje,
        loading: false,
      }))
      setTimeout(() => {
        set(() => ({
          mensaje: '',
        }))
      }, 5000);

      return mensaje;
    } catch (error) {
      set(() => ({ loading: false }));
      throw error;
    }
  }
})));