// src/config/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const inicializarSocket = (token: string) => {
  console.log(token);
  if (socket?.connected) {
    console.log('✅ Socket ya conectado');
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  console.log('🔌 Inicializando socket con token...');

  // IMPORTANTE: Remover '/api' de la URL
  const socketUrl = import.meta.env.VITE_API_URL.replace('/api', '');
  console.log('📡 URL del socket:', socketUrl);

  socket = io(socketUrl, {
    auth: {
      token: token // Asegurarse de enviar el token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    autoConnect: true // Conectar automáticamente
  });

  socket.on('connect', () => {
    console.log('✅ Socket conectado exitosamente:', socket?.id);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Error de conexión del socket:', error.message);
    console.error('Detalles:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket desconectado:', reason);
    if (reason === 'io server disconnect') {
      // El servidor forzó la desconexión, reconectar manualmente
      socket?.connect();
    }
  });

  socket.on('error', (error) => {
    console.error('❌ Error del socket:', error);
  });

  return socket;
};

export const conectarSocket = () => {
  if (socket && !socket.connected) {
    console.log('🔌 Reconectando socket...');
    socket.connect();
  } else if (!socket) {
    console.error('❌ Socket no inicializado. Llama a inicializarSocket primero.');
  }
};

export const desconectarSocket = () => {
  if (socket?.connected) {
    console.log('❌ Desconectando socket...');
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;