// src/components/VentanaChat.tsx
import { useEffect, useRef, useState } from "react";
import { useMensajeStore } from "../store/MensajeStore";
import { useEgresadoStore } from "../store/EgresadoStore";
import { IconSend, IconCircleFilled, IconArrowLeft } from "@tabler/icons-react";
import { getSocket } from "../config/socket";
import "../styles/components/VentanaChat.css";

export const VentanaChat = () => {
  const {
    mensajesActuales,
    conversacionActiva,
    usuarioActivo,
    usuariosConectados,
    usuarioEscribiendo,
    loadingMensajes,
    enviarMensaje,
    setConversacionActiva
  } = useMensajeStore();

  const { egresado } = useEgresadoStore();
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const escribiendoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [mensajesActuales]);

  useEffect(() => {
    if (conversacionActiva) {
      inputRef.current?.focus();
    }
  }, [conversacionActiva]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    setEnviando(true);
    try {
      await enviarMensaje(conversacionActiva, mensaje.trim());
      setMensaje("");

      // Emitir que dejé de escribir
      const socket = getSocket();
      if (socket) {
        socket.emit("mensaje:dejo-escribir", { receptorId: conversacionActiva });
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Error al enviar el mensaje");
    } finally {
      setEnviando(false);
    }
  };

  const formatearHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <div className="chat-mensajes">
        {loadingMensajes ? (
          <div className="chat-loading">
            <div className="spinner"></div>
            <p>Cargando mensajes...</p>
          </div>
        ) : (
          <>
            {mensajesActuales.map((msg) => {
              const esMio = msg.emisor._id === egresado?._id;
              return (
                <div key={msg._id} className={`mensaje ${esMio ? "mio" : "otro"}`}>
                  {!esMio && (
                    <img
                      src={
                        msg.emisor.fotoPerfil ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          msg.emisor.nombre
                        )}&background=7a3e9d&color=fff&size=32`
                      }
                      alt={msg.emisor.nombre}
                      className="mensaje-avatar"
                    />
                  )}
                  <div className="mensaje-contenido">
                    <p>{msg.contenido}</p>
                    <span className="mensaje-hora">{formatearHora(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
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
          disabled={enviando}
          maxLength={1000}
        />
        <button type="submit" disabled={!mensaje.trim() || enviando}>
          <IconSend size={24} />
        </button>
      </form>
    </div>
  );
};