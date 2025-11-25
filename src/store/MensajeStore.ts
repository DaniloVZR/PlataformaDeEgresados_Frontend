// src/store/MensajeStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  enviarMensaje,
  obtenerConversacion,
  obtenerConversaciones,
  marcarComoLeido,
  obtenerMensajesNoLeidos,
  type Mensaje,
  type Conversacion
} from "../services/mensaje";
import { getSocket } from "../config/socket";

interface MensajeState {
  conversaciones: Conversacion[];
  mensajesActuales: Mensaje[];
  conversacionActiva: string | null;
  usuarioActivo: any | null;
  mensajesNoLeidos: number;
  usuariosConectados: string[];
  usuarioEscribiendo: { [key: string]: boolean };
  loading: boolean;
  loadingMensajes: boolean;

  cargarConversaciones: () => Promise<void>;
  cargarConversacion: (usuarioId: string) => Promise<void>;
  enviarMensaje: (receptorId: string, contenido: string) => Promise<void>;
  setConversacionActiva: (usuarioId: string | null, usuario?: any) => void;
  cargarContadorNoLeidos: () => Promise<void>;
  marcarComoLeido: (usuarioId: string) => Promise<void>;

  inicializarSocket: () => void;
  limpiarSocket: () => void;
  agregarMensajeLocal: (mensaje: Mensaje) => void;
  actualizarUsuariosConectados: (usuarios: string[]) => void;
  setUsuarioEscribiendo: (usuarioId: string, escribiendo: boolean) => void;
}

export const useMensajeStore = create<MensajeState>()(
  devtools((set, get) => ({
    conversaciones: [],
    mensajesActuales: [],
    conversacionActiva: null,
    usuarioActivo: null,
    mensajesNoLeidos: 0,
    usuariosConectados: [],
    usuarioEscribiendo: {},
    loading: false,
    loadingMensajes: false,

    cargarConversaciones: async () => {
      const { loading } = get();
      if (loading) return; // Evitar llamadas simultáneas

      set({ loading: true });
      try {
        const data = await obtenerConversaciones();
        if (data.success) {
          set({ conversaciones: data.conversaciones });
        }
      } catch (error) {
        console.error("Error al cargar conversaciones:", error);
      } finally {
        set({ loading: false });
      }
    },

    cargarConversacion: async (usuarioId: string) => {
      set({ loadingMensajes: true });
      try {
        const data = await obtenerConversacion(usuarioId);
        if (data.success) {
          set({
            mensajesActuales: data.mensajes,
            loadingMensajes: false
          });
        }
      } catch (error) {
        console.error("Error al cargar conversación:", error);
        set({ loadingMensajes: false });
      }
    },

    enviarMensaje: async (receptorId: string, contenido: string) => {
      try {
        const data = await enviarMensaje(receptorId, contenido);
        if (data.success) {
          console.log('Mensaje enviado, esperando confirmación socket');
        }
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
        throw error;
      }
    },

    setConversacionActiva: (usuarioId: string | null, usuario?: any) => {
      set({
        conversacionActiva: usuarioId,
        usuarioActivo: usuario || null,
        mensajesActuales: [] // Limpiar mensajes anteriores
      });

      if (usuarioId) {
        get().cargarConversacion(usuarioId);
        get().marcarComoLeido(usuarioId);
      }
    },

    cargarContadorNoLeidos: async () => {
      try {
        const data = await obtenerMensajesNoLeidos();
        if (data.success) {
          set({ mensajesNoLeidos: data.count });
        }
      } catch (error) {
        console.error("Error al cargar contador:", error);
      }
    },

    marcarComoLeido: async (usuarioId: string) => {
      try {
        await marcarComoLeido(usuarioId);
        get().cargarContadorNoLeidos();
        // NO recargar conversaciones aquí, solo el contador
      } catch (error) {
        console.error("Error al marcar como leído:", error);
      }
    },

    // ==================== HELPERS ====================

    agregarMensajeLocal: (mensaje: Mensaje) => {
      const { mensajesActuales } = get();

      // Solo agregar si NO existe ya (evitar duplicados)
      const existe = mensajesActuales.find(m => m._id === mensaje._id);
      if (existe) {
        console.log('Mensaje duplicado ignorado:', mensaje._id);
        return;
      }

      console.log('Agregando mensaje local:', mensaje._id);
      set({ mensajesActuales: [...mensajesActuales, mensaje] });
    },

    // ==================== SOCKET HANDLERS ====================

    inicializarSocket: () => {
      const socket = getSocket();
      if (!socket) return;

      console.log('Configurando event listeners del socket...');

      // IMPORTANTE: Limpiar listeners anteriores
      socket.off('mensaje:nuevo');
      socket.off('mensaje:enviado');
      socket.off('mensaje:escribiendo');
      socket.off('mensaje:dejo-escribir');
      socket.off('mensajes:leidos');
      socket.off('usuario:en-linea');
      socket.off('usuario:desconectado');
      socket.off('usuarios:conectados');

      // Nuevo mensaje recibido
      socket.on('mensaje:nuevo', ({ mensaje }: { mensaje: Mensaje }) => {
        console.log('Mensaje nuevo recibido:', mensaje);
        const { conversacionActiva } = get();

        // Si es la conversación activa, agregar mensaje
        if (conversacionActiva === mensaje.emisor._id) {
          get().agregarMensajeLocal(mensaje);
          get().marcarComoLeido(mensaje.emisor._id);
        } else {
          // Solo actualizar contador, NO conversaciones
          get().cargarContadorNoLeidos();
        }

        // Actualizar lista de conversaciones SOLO UNA VEZ
        // Usar un debounce para evitar múltiples llamadas
        const updateConversaciones = () => {
          get().cargarConversaciones();
        };

        // Cancelar timeout anterior si existe
        if ((window as any).conversacionesTimeout) {
          clearTimeout((window as any).conversacionesTimeout);
        }

        // Esperar 500ms antes de actualizar
        (window as any).conversacionesTimeout = setTimeout(updateConversaciones, 500);
      });

      // Mensaje enviado confirmado
      socket.on('mensaje:enviado', ({ mensaje }: { mensaje: Mensaje }) => {
        const { conversacionActiva } = get();

        if (conversacionActiva === mensaje.receptor._id) {
          get().agregarMensajeLocal(mensaje);
        }
      });

      // Usuario escribiendo
      socket.on('mensaje:escribiendo', ({ emisorId }: { emisorId: string }) => {
        set(state => ({
          usuarioEscribiendo: { ...state.usuarioEscribiendo, [emisorId]: true }
        }));
      });

      // Usuario dejó de escribir
      socket.on('mensaje:dejo-escribir', ({ emisorId }: { emisorId: string }) => {
        set(state => ({
          usuarioEscribiendo: { ...state.usuarioEscribiendo, [emisorId]: false }
        }));
      });

      // Mensajes leídos
      socket.on('mensajes:leidos', ({ receptorId }: { receptorId: string }) => {
        const { conversacionActiva } = get();
        if (conversacionActiva === receptorId) {
          // Actualizar estado de leído en mensajes locales
          set(state => ({
            mensajesActuales: state.mensajesActuales.map(m =>
              m.receptor._id === receptorId ? { ...m, leido: true } : m
            )
          }));
        }
      });

      // Usuario conectado
      socket.on('usuario:en-linea', ({ egresadoId }: { egresadoId: string }) => {
        set(state => ({
          usuariosConectados: [...new Set([...state.usuariosConectados, egresadoId])]
        }));
      });

      // Usuario desconectado
      socket.on('usuario:desconectado', ({ egresadoId }: { egresadoId: string }) => {
        set(state => ({
          usuariosConectados: state.usuariosConectados.filter(id => id !== egresadoId)
        }));
      });

      // Lista inicial de usuarios conectados
      socket.on('usuarios:conectados', ({ usuariosConectados }: { usuariosConectados: string[] }) => {
        set({ usuariosConectados });
      });
    },

    limpiarSocket: () => {
      const socket = getSocket();
      if (!socket) return;

      // Limpiar timeout de conversaciones
      if ((window as any).conversacionesTimeout) {
        clearTimeout((window as any).conversacionesTimeout);
        (window as any).conversacionesTimeout = null;
      }

      socket.off('mensaje:nuevo');
      socket.off('mensaje:enviado');
      socket.off('mensaje:escribiendo');
      socket.off('mensaje:dejo-escribir');
      socket.off('mensajes:leidos');
      socket.off('usuario:en-linea');
      socket.off('usuario:desconectado');
      socket.off('usuarios:conectados');
    },

    actualizarUsuariosConectados: (usuarios: string[]) => {
      set({ usuariosConectados: usuarios });
    },

    setUsuarioEscribiendo: (usuarioId: string, escribiendo: boolean) => {
      set(state => ({
        usuarioEscribiendo: { ...state.usuarioEscribiendo, [usuarioId]: escribiendo }
      }));
    }
  }))
);