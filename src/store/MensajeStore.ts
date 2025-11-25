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

  // Acciones
  cargarConversaciones: () => Promise<void>;
  cargarConversacion: (usuarioId: string) => Promise<void>;
  enviarMensaje: (receptorId: string, contenido: string) => Promise<void>;
  setConversacionActiva: (usuarioId: string | null, usuario?: any) => void;
  cargarContadorNoLeidos: () => Promise<void>;
  marcarComoLeido: (usuarioId: string) => Promise<void>;

  // Socket events
  inicializarSocket: () => void;
  limpiarSocket: () => void;
  agregarMensajeRecibido: (mensaje: Mensaje) => void;
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
      try {
        const data = await obtenerConversaciones();
        if (data.success) {
          set({ conversaciones: data.conversaciones });
        }
      } catch (error) {
        console.error("Error al cargar conversaciones:", error);
      }
    },

    cargarConversacion: async (usuarioId: string) => {
      set({ loadingMensajes: true });
      try {
        const data = await obtenerConversacion(usuarioId);
        if (data.success) {
          set({ mensajesActuales: data.mensajes, loadingMensajes: false });
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
          // El mensaje se agregará vía socket
          await get().cargarConversaciones();
        }
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
        throw error;
      }
    },

    setConversacionActiva: (usuarioId: string | null, usuario?: any) => {
      set({
        conversacionActiva: usuarioId,
        usuarioActivo: usuario || null
      });

      if (usuarioId) {
        get().cargarConversacion(usuarioId);
        get().marcarComoLeido(usuarioId);
      } else {
        set({ mensajesActuales: [] });
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
        await get().cargarConversaciones();
        await get().cargarContadorNoLeidos();
      } catch (error) {
        console.error("Error al marcar como leído:", error);
      }
    },

    // ==================== SOCKET HANDLERS ====================

    inicializarSocket: () => {
      const socket = getSocket();
      if (!socket) return;

      // Nuevo mensaje recibido
      socket.on('mensaje:nuevo', ({ mensaje }: { mensaje: Mensaje }) => {
        const { conversacionActiva, mensajesActuales } = get();

        // Si es la conversación activa, agregar mensaje
        if (conversacionActiva === mensaje.emisor._id) {
          set({ mensajesActuales: [...mensajesActuales, mensaje] });
          get().marcarComoLeido(mensaje.emisor._id);
        } else {
          // Actualizar contador de no leídos
          get().cargarContadorNoLeidos();
        }

        // Actualizar lista de conversaciones
        get().cargarConversaciones();
      });

      // Mensaje enviado confirmado
      socket.on('mensaje:enviado', ({ mensaje }: { mensaje: Mensaje }) => {
        const { conversacionActiva, mensajesActuales } = get();

        if (conversacionActiva === mensaje.receptor._id) {
          // Verificar que no esté duplicado
          const existe = mensajesActuales.find(m => m._id === mensaje._id);
          if (!existe) {
            set({ mensajesActuales: [...mensajesActuales, mensaje] });
          }
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
          get().cargarConversacion(receptorId);
        }
      });

      // Usuario conectado/desconectado
      socket.on('usuario:en-linea', ({ egresadoId }: { egresadoId: string }) => {
        set(state => ({
          usuariosConectados: [...state.usuariosConectados, egresadoId]
        }));
      });

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

      socket.off('mensaje:nuevo');
      socket.off('mensaje:enviado');
      socket.off('mensaje:escribiendo');
      socket.off('mensaje:dejo-escribir');
      socket.off('mensajes:leidos');
      socket.off('usuario:en-linea');
      socket.off('usuario:desconectado');
      socket.off('usuarios:conectados');
    },

    agregarMensajeRecibido: (mensaje: Mensaje) => {
      const { conversacionActiva, mensajesActuales } = get();
      if (conversacionActiva === mensaje.emisor._id) {
        set({ mensajesActuales: [...mensajesActuales, mensaje] });
      }
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