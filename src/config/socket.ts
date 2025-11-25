import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const inicializarSocket = (token: string) => {
  if (socket?.connected) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  const socketUrl = import.meta.env.VITE_API_URL.replace('/api', '');

  socket = io(socketUrl, {
    auth: {
      token: token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    autoConnect: true
  });

  socket.on('connect', () => {
    console.log('Socket conectado:', socket?.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Error de conexión:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket desconectado:', reason);
    if (reason === 'io server disconnect') {
      socket?.connect();
    }
  });

  socket.on('error', (error) => {
    console.error('Error del socket:', error);
  });

  return socket;
};

export const conectarSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const desconectarSocket = () => {
  if (socket?.connected) {
    socket.removeAllListeners(); // Limpiar todos los listeners
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;