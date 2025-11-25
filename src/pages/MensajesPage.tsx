// src/pages/MensajesPage.tsx
import { useEffect, useRef } from "react";
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
  const socketInicializadoRef = useRef(false);

  // useEffect(() => {
  //   if (!socketInicializadoRef.current) {
  //     inicializarSocketStore();
  //     socketInicializadoRef.current = true;
  //   }
  // }, []);


  useEffect(() => {
    if (!token) {
      console.error('❌ No hay token disponible');
      navigate('/iniciar-sesion');
      return;
    }

    // Evitar inicialización múltiple
    if (socketInicializadoRef.current) {
      return;
    }

    // Inicializar socket
    inicializarSocket(token);
    conectarSocket();

    // Configurar listeners del store
    inicializarSocketStore();

    socketInicializadoRef.current = true;

    // Cleanup al desmontar
    return () => {
      limpiarSocket();
      desconectarSocket();
      socketInicializadoRef.current = false;
    };
  }, [token]); // Solo dependencia en token

  return (
    <div className="mensajes-page">
      {/* Header */}
      <header className="mensajes-header">
        <button onClick={() => navigate("/home")} className="navbar-back">
          <IconArrowLeft size={24} />
          <span>Inicio</span>
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