// src/components/VentanaChat.tsx
import { useEffect, useRef, useState, memo } from "react";
import { useMensajeStore } from "../store/MensajeStore";
import { useEgresadoStore } from "../store/EgresadoStore";
import { IconSend, IconCircleFilled, IconArrowLeft } from "@tabler/icons-react";
import { getSocket } from "../config/socket";
import "../styles/components/VentanaChat.css";

export const VentanaChat = memo(() => {
  const mensajesActuales = useMensajeStore(state => state.mensajesActuales);
  const conversacionActiva = useMensajeStore(state => state.conversacionActiva);
  const usuarioActivo = useMensajeStore(state => state.usuarioActivo);
  const usuariosConectados = useMensajeStore(state => state.usuariosConectados);
  const usuarioEscribiendo = useMensajeStore(state => state.usuarioEscribiendo);
  const loadingMensajes = useMensajeStore(state => state.loadingMensajes);
  const enviarMensaje = useMensajeStore(state => state.enviarMensaje);
  const setConversacionActiva = useMensajeStore(state => state.setConversacionActiva);

  const { egresado } = useEgresadoStore();
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const escribiendoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevMensajesLengthRef = useRef(0);

  // Auto scroll cuando hay mensajes nuevos
  useEffect(() => {
    if (mensajesActuales.length > prevMensajesLengthRef.current) {
      scrollToBottom('smooth');
    }
    prevMensajesLengthRef.current = mensajesActuales.length;
  }, [mensajesActuales]);

  // Scroll inicial al cargar conversación
  useEffect(() => {
    if (conversacionActiva && !loadingMensajes && mensajesActuales.length > 0) {
      setTimeout(() => scrollToBottom('auto'), 100);
    }
  }, [conversacionActiva, loadingMensajes]);

  // Focus en input al abrir conversación
  useEffect(() => {
    if (conversacionActiva && !loadingMensajes) {
      inputRef.current?.focus();
    }
  }, [conversacionActiva, loadingMensajes]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMensaje(e.target.value);

    if (!conversacionActiva) return;

    const socket = getSocket();
    if (!socket) return;

    // Emitir que estoy escribiendo
    socket.emit("mensaje:escribiendo", { receptorId: conversacionActiva });

    // Cancelar timeout anterior
    if (escribiendoTimeoutRef.current) {
      clearTimeout(escribiendoTimeoutRef.current);
    }

    // Después de 2 segundos, emitir que dejé de escribir
    escribiendoTimeoutRef.current = setTimeout(() => {
      socket.emit("mensaje:dejo-escribir", { receptorId: conversacionActiva });
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensaje.trim() || !conversacionActiva || enviando) return;

    const mensajeTexto = mensaje.trim();
    setMensaje(""); // Limpiar input inmediatamente
    setEnviando(true);

    try {
      await enviarMensaje(conversacionActiva, mensajeTexto);

      // Emitir que dejé de escribir
      const socket = getSocket();
      if (socket) {
        socket.emit("mensaje:dejo-escribir", { receptorId: conversacionActiva });
      }

      // Limpiar timeout de escribiendo
      if (escribiendoTimeoutRef.current) {
        clearTimeout(escribiendoTimeoutRef.current);
        escribiendoTimeoutRef.current = null;
      }

    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Error al enviar el mensaje");
      setMensaje(mensajeTexto); // Restaurar mensaje en caso de error
    } finally {
      setEnviando(false);
      inputRef.current?.focus();
    }
  };

  const estaEnLinea = usuarioActivo && usuariosConectados.includes(usuarioActivo._id);
  const estaEscribiendo = conversacionActiva && usuarioEscribiendo[conversacionActiva];

  if (!conversacionActiva || !usuarioActivo) {
    return (
      <div className="ventana-chat-vacia">
        <IconSend size={64} opacity={0.2} />
        <p>Selecciona una conversación para comenzar</p>
      </div>
    );
  }

  return (
    <div className="ventana-chat">
      {/* Header */}
      <div className="chat-header">
        <button className="btn-volver-mobile" onClick={() => setConversacionActiva(null)}>
          <IconArrowLeft size={24} />
        </button>

        <div className="chat-header-info">
          <div className="avatar-container">
            <img
              src={
                usuarioActivo.fotoPerfil ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  usuarioActivo.nombre + " " + usuarioActivo.apellido
                )}&background=7a3e9d&color=fff`
              }
              alt={usuarioActivo.nombre}
              className="chat-avatar"
            />
            {estaEnLinea && <IconCircleFilled size={12} className="status-indicator" />}
          </div>
          <div>
            <h3>{usuarioActivo.nombre} {usuarioActivo.apellido}</h3>
            <p className="chat-status">
              {estaEscribiendo ? "Escribiendo..." : estaEnLinea ? "En línea" : "Desconectado"}
            </p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="chat-mensajes" ref={chatContainerRef}>
        {loadingMensajes ? (
          <div className="chat-loading">
            <div className="spinner"></div>
            <p>Cargando mensajes...</p>
          </div>
        ) : (
          <>
            {mensajesActuales.map((msg) => (
              <MensajeItem
                key={msg._id}
                mensaje={msg}
                esMio={msg.emisor._id === egresado?._id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Escribe un mensaje..."
          value={mensaje}
          onChange={handleInputChange}
          disabled={enviando || loadingMensajes}
          maxLength={1000}
        />
        <button type="submit" disabled={!mensaje.trim() || enviando || loadingMensajes}>
          <IconSend size={24} />
        </button>
      </form>
    </div>
  );
});

VentanaChat.displayName = 'VentanaChat';

// Componente memo para cada mensaje
const MensajeItem = memo(({ mensaje, esMio }: { mensaje: any, esMio: boolean }) => {
  const formatearHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`mensaje ${esMio ? "mio" : "otro"}`}>
      {!esMio && (
        <img
          src={
            mensaje.emisor.fotoPerfil ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              mensaje.emisor.nombre
            )}&background=7a3e9d&color=fff&size=32`
          }
          alt={mensaje.emisor.nombre}
          className="mensaje-avatar"
        />
      )}
      <div className="mensaje-contenido">
        <p>{mensaje.contenido}</p>
        <span className="mensaje-hora">{formatearHora(mensaje.createdAt)}</span>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si el mensaje cambia
  return prevProps.mensaje._id === nextProps.mensaje._id &&
    prevProps.mensaje.contenido === nextProps.mensaje.contenido &&
    prevProps.esMio === nextProps.esMio;
});

MensajeItem.displayName = 'MensajeItem';