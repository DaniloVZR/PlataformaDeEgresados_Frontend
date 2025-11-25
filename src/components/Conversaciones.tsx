// src/components/Conversaciones.tsx
import { useEffect, memo } from "react";
import { useMensajeStore } from "../store/MensajeStore";
import { IconMessage, IconCircleFilled } from "@tabler/icons-react";
import "../styles/components/Conversaciones.css";

export const Conversaciones = memo(() => {
  const conversaciones = useMensajeStore(state => state.conversaciones);
  const conversacionActiva = useMensajeStore(state => state.conversacionActiva);
  const mensajesNoLeidos = useMensajeStore(state => state.mensajesNoLeidos);
  const usuariosConectados = useMensajeStore(state => state.usuariosConectados);
  const setConversacionActiva = useMensajeStore(state => state.setConversacionActiva);
  const cargarConversaciones = useMensajeStore(state => state.cargarConversaciones);
  const cargarContadorNoLeidos = useMensajeStore(state => state.cargarContadorNoLeidos);

  useEffect(() => {
    cargarConversaciones();
    cargarContadorNoLeidos();

    return () => {
      console.log('🔄 Conversaciones component unmounted');
    };
  }, []); // Solo una vez al montar

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHoras < 24) return `${diffHoras}h`;
    if (diffDias < 7) return `${diffDias}d`;
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const estaEnLinea = (usuarioId: string) => {
    return usuariosConectados.includes(usuarioId);
  };

  return (
    <div className="conversaciones-sidebar">
      <div className="sidebar-header">
        <h2>
          <IconMessage size={24} />
          Mensajes
        </h2>
        {mensajesNoLeidos > 0 && (
          <span className="badge-no-leidos">{mensajesNoLeidos}</span>
        )}
      </div>

      <div className="conversaciones-lista">
        {conversaciones.length === 0 ? (
          <div className="empty-conversaciones">
            <IconMessage size={48} opacity={0.3} />
            <p>No hay conversaciones</p>
          </div>
        ) : (
          conversaciones.map((conv) => (
            <ConversacionItem
              key={conv.usuario._id}
              conv={conv}
              isActive={conversacionActiva === conv.usuario._id}
              estaEnLinea={estaEnLinea(conv.usuario._id)}
              formatearFecha={formatearFecha}
              onClick={() => setConversacionActiva(conv.usuario._id, conv.usuario)}
            />
          ))
        )}
      </div>
    </div>
  );
});

Conversaciones.displayName = 'Conversaciones';

// Componente memo para cada conversación individual
const ConversacionItem = memo(({ conv, isActive, estaEnLinea, formatearFecha, onClick }: any) => {
  return (
    <div
      className={`conversacion-item ${isActive ? "activa" : ""}`}
      onClick={onClick}
    >
      <div className="conversacion-avatar-container">
        <img
          src={
            conv.usuario.fotoPerfil ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              conv.usuario.nombre + " " + conv.usuario.apellido
            )}&background=7a3e9d&color=fff`
          }
          alt={conv.usuario.nombre}
          className="conversacion-avatar"
        />
        {estaEnLinea && (
          <IconCircleFilled size={12} className="status-online" />
        )}
      </div>

      <div className="conversacion-info">
        <div className="conversacion-header">
          <span className="conversacion-nombre">
            {conv.usuario.nombre} {conv.usuario.apellido}
          </span>
          <span className="conversacion-fecha">
            {formatearFecha(conv.ultimoMensaje.createdAt)}
          </span>
        </div>
        <div className="conversacion-preview">
          <p className={conv.mensajesNoLeidos > 0 ? "no-leido" : ""}>
            {conv.ultimoMensaje.esMio && "Tú: "}
            {conv.ultimoMensaje.contenido.length > 40
              ? conv.ultimoMensaje.contenido.substring(0, 40) + "..."
              : conv.ultimoMensaje.contenido}
          </p>
          {conv.mensajesNoLeidos > 0 && (
            <span className="badge-contador">{conv.mensajesNoLeidos}</span>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si cambian estas props
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.estaEnLinea === nextProps.estaEnLinea &&
    prevProps.conv.mensajesNoLeidos === nextProps.conv.mensajesNoLeidos &&
    prevProps.conv.ultimoMensaje.contenido === nextProps.conv.ultimoMensaje.contenido &&
    prevProps.conv.ultimoMensaje.createdAt === nextProps.conv.ultimoMensaje.createdAt
  );
});

ConversacionItem.displayName = 'ConversacionItem';