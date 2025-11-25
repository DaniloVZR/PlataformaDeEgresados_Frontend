// src/pages/MensajesPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { useMensajeStore } from "../store/MensajeStore";
import { useUsuarioStore } from "../store/UsuarioStore";
import { Conversaciones } from "../components/Conversaciones";
import { VentanaChat } from "../components/VentanaChat";
import { inicializarSocket, conectarSocket, desconectarSocket } from "../config/socket";
import "../styles/pages/MensajesPage.css";

export const MensajesPage = () => {
  const navigate = useNavigate();
  const { token } = useUsuarioStore();
  const { inicializarSocket: inicializarSocketStore, limpiarSocket, conversacionActiva } = useMensajeStore();

  useEffect(() => {
    if (!token) return;

    // Inicializar socket
    inicializarSocket(token);
    conectarSocket();
    inicializarSocketStore();

    return () => {
      limpiarSocket();
      desconectarSocket();
    };
  }, [token]);

  return (
    <div className="mensajes-page">
      {/* Header */}
      <header className="mensajes-header">
        <button onClick={() => navigate("/home")} className="btn-back">
          <IconArrowLeft size={24} />
          <span>Volver al inicio</span>
        </button>
      </header>

      {/* Layout */}
      <div className="mensajes-layout">
        <div className={`sidebar-container ${conversacionActiva ? "ocultar-mobile" : ""}`}>
          <Conversaciones />
        </div>
        <div className={`chat-container ${!conversacionActiva ? "ocultar-mobile" : ""}`}>
          <VentanaChat />
        </div>
      </div>
    </div>
  );
};