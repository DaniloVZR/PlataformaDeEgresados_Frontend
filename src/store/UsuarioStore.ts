import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { TUsuario } from "../types";
import { recuperarPassword, comprobarToken, nuevoPassword, iniciarSesion, registrarse, confimarUsuario } from "../services/usuario";

type usuarioStore = {
  usuario: TUsuario | null;
  mensaje: string;
  token: string | null;
  loading: boolean;
  tokenValido: boolean | null;
  data: any;
  isAuthenticated: boolean;
  confirmado: boolean | null;
  iniciarSesion: (correo: string, password: string) => Promise<boolean>;
  cerrarSesion: () => void;
  registrarse: (nombre: string, correo: string, password: string) => Promise<void>;
  confimarUsuario: (token: string) => Promise<void>;
  enviarInstrucciones: (correo: string) => Promise<void>;
  comprobarToken: (token: string) => Promise<void>;
  nuevoPassword: (token: string, password: string) => Promise<string>;
  limpiarMensaje: () => void;
}

export const useUsuarioStore = create<usuarioStore>()(
  devtools(
    persist(
      (set) => ({
        usuario: null,
        token: null,
        data: {},
        tokenValido: null,
        mensaje: '',
        loading: false,
        isAuthenticated: false,
        confirmado: null,

        iniciarSesion: async (correo: string, password: string) => {
          set(() => (({
            loading: true,
            mensaje: '',
          })))

          try {
            const data = await iniciarSesion(correo, password);

            if (data.success && data.token && data.usuario) {
              set(() => ({
                usuario: data.usuario,
                token: data.token,
                mensaje: data.msg || '',
                loading: false,
                isAuthenticated: true,
              }))
              return true;
            } else {
              set({
                mensaje: data.msg || 'Error al iniciar sesión',
                loading: false,
                isAuthenticated: false,
              });
              return false
            }
          } catch (error) {
            set({
              mensaje: 'Error de conexión',
              loading: false,
              isAuthenticated: false,
            });
            return false;
          }
        },

        cerrarSesion: () => {
          set({
            usuario: null,
            token: null,
            mensaje: '',
            loading: false,
            isAuthenticated: false,
            tokenValido: false,
          });
        },

        registrarse: async (nombre: string, correo: string, password: string) => {
          set(() => (({
            loading: true,
          })))

          try {
            const data = await registrarse(nombre, correo, password);
            set(() => ({
              loading: false,
              mensaje: data?.msg,
            }))
          } catch (error) {
            set(() => ({ loading: false }));
            throw error;
          }
        },

        confimarUsuario: async (token: string) => {
          set(() => (({ loading: true })))

          try {
            const { msg } = await confimarUsuario(token);
            set(() => ({
              loading: false,
              mensaje: msg,
              confirmado: true,
            }))

          } catch (error) {
            set(() => ({ loading: false }));
            throw error;
          }
        },

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
            }, 10000);

            return mensaje;
          } catch (error) {
            set(() => ({ loading: false }));
            throw error;
          }
        },

        limpiarMensaje: () => {
          set({ mensaje: '' })
        },
      }), {
      name: "usuario-storage",
      partialize: (state) => ({
        usuario: state.usuario,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    })));