# 🎓 Plataforma de Egresados - Frontend

Aplicación web responsive para la red social de egresados de la Institución Universitaria Pascual Bravo.

`<img src="assets/Foto Plataforma Egresados.png" alt="Landing Page"/>`

## 🚀 Características

- **Interfaz moderna** con React 19 y TypeScript
- **Gestión de estado** con Zustand
- **Mensajería en tiempo real** con Socket.IO Client
- **Infinite scroll** en feed de publicaciones
- **Responsive design** mobile-first
- **Búsqueda avanzada** de egresados con filtros
- **Panel de administración** para moderadores

## 🛠️ Tecnologías

- **React** (v19) - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **React Router** (v7) - Navegación SPA
- **Zustand** - State management
- **Socket.IO Client** - WebSockets
- **Axios** - HTTP client
- **Tabler Icons** - Iconografía
- **CSS Modules** - Estilos scoped

## 📦 Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# Iniciar servidor de desarrollo
npm run dev
```

## 🔐 Variables de Entorno

```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Estructura del Proyecto

```
frontend/
├── public/           # Archivos estáticos
├── src/
│   ├── components/   # Componentes reutilizables
│   ├── pages/        # Páginas/Vistas
│   ├── services/     # API calls
│   ├── store/        # Zustand stores
│   ├── styles/       # CSS globales y por componente
│   ├── config/       # Configuración (Socket.IO)
│   ├── types/        # Tipos TypeScript
│   ├── Assets/       # Imágenes, logos
│   ├── App.tsx       # Componente raíz
│   └── main.tsx      # Punto de entrada
├── index.html        # HTML base
├── vite.config.ts    # Configuración Vite
└── tsconfig.json     # Configuración TypeScript
```

## 🎨 Componentes Principales

### Autenticación

- `LoginPage` - Inicio de sesión
- `RegisterPage` - Registro de usuario
- `ConfirmarCuenta` - Validación de email
- `RecuperarPassword` - Recuperación de contraseña

### Core

- `Home` - Feed principal de publicaciones
- `PerfilPage` - Perfil de usuario (propio y público)
- `BuscarEgresadosPage` - Buscador con filtros
- `MensajesPage` - Sistema de chat

### Componentes Reutilizables

- `PublicacionCard` - Tarjeta de publicación
- `ModalCrearPublicacion` - Modal para crear posts
- `ComentariosSection` - Sección de comentarios
- `Conversaciones` - Lista de chats
- `VentanaChat` - Ventana de mensajería

### Admin

- `AdminDashboard` - Panel de métricas
- `AdminUsuarios` - Gestión de usuarios
- `AdminPublicaciones` - Moderación de contenido

## 🔗 Rutas

```
Públicas:
  /                    # Landing page
  /iniciar-sesion      # Login
  /registrarse         # Registro
  /recuperar-contraseña # Recuperar password
  /confirmar-cuenta/:token
  /cambiar-contraseña/:token

Privadas (requieren auth):
  /home                # Feed principal
  /perfil              # Mi perfil
  /perfil/:id          # Perfil público
  /egresados           # Buscar egresados
  /mensajes            # Sistema de chat

Admin (requiere rol):
  /admin               # Dashboard
  /admin/usuarios      # Gestión de usuarios
  /admin/publicaciones # Moderación de contenido
```

## 🔄 Gestión de Estado (Zustand)

### `UsuarioStore`

```typescript
{
  usuario: TUsuario | null,
  token: string | null,
  isAuthenticated: boolean,
  iniciarSesion: (correo, password) => Promise<boolean>,
  cerrarSesion: () => void,
  registrarse: (nombre, correo, password) => Promise<void>
}
```

### `EgresadoStore`

```typescript
{
  egresado: Egresado | null,
  loading: boolean,
  cargarPerfil: () => Promise<void>,
  actualizarPerfilLocal: (egresado) => void
}
```

### `PublicacionStore`

```typescript
{
  publicaciones: Publicacion[],
  page: number,
  hasMore: boolean,
  cargarPublicaciones: (reset?) => Promise<void>,
  darLike: (publicacionId) => Promise<void>,
  agregarPublicacion: (publicacion) => void
}
```

### `MensajeStore`

```typescript
{
  conversaciones: Conversacion[],
  mensajesActuales: Mensaje[],
  conversacionActiva: string | null,
  mensajesNoLeidos: number,
  enviarMensaje: (receptorId, contenido) => Promise<void>,
  inicializarSocket: () => void
}
```

## 🔌 Socket.IO Client

### Conexión

```typescript
// src/config/socket.ts
export const inicializarSocket = (token: string) => {
  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true
  });
};
```

### Eventos Escuchados

```typescript
socket.on('mensaje:nuevo', ({ mensaje }) => { /* ... */ });
socket.on('usuario:en-linea', ({ egresadoId }) => { /* ... */ });
socket.on('mensaje:escribiendo', ({ emisorId }) => { /* ... */ });
```

### Eventos Emitidos

```typescript
socket.emit('mensaje:escribiendo', { receptorId });
socket.emit('mensaje:dejo-escribir', { receptorId });
```

## Estilos

* CSS Puro
* Mobile-first approach
* Variables CSS para temas consistentes
* Breakpoints: 480px, 640px, 768px, 1200px

```scss
:root {
  --morado: #7a3e9d;
  --morado-dark: #5b2d79;
  --blanco: #ffffff;
  --fondo: #f5f2f8;
}
```

## Seguridad

```typescript
<Route
  path="/home"
  element={
    <PrivateRoute>
      <Home />
    </PrivateRoute>
  }
/>
```

## Despliegue

```bash
#build 

npm run build

#El archivo vercel.json redirige todas las rutas a /

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```
