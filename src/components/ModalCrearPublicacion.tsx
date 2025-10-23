// src/components/ModalCrearPublicacion.tsx

import React, { useState } from "react";
// Importamos la función de servicio y la interfaz necesarias
import { crearPublicacion, type PublicacionData } from "../services/publicacion";
import { useUsuarioStore } from "../store/UsuarioStore"; // Para obtener el usuarioId

// ------------------------------------------
// 1. Tipos de Props
// ------------------------------------------
interface ModalCrearPublicacionProps {
  isOpen: boolean;
  onClose: () => void;
  onPublicacionCreada: () => void; // Para notificar a Home que recargue el feed
}

const ModalCrearPublicacion: React.FC<ModalCrearPublicacionProps> = ({
  isOpen,
  onClose,
  onPublicacionCreada,
}) => {
  // ------------------------------------------
  // 2. Estados locales
  // ------------------------------------------
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------
  // 3. Obtención de datos del Store (Usuario ID)
  // ------------------------------------------
  const { usuario } = useUsuarioStore();
  const usuarioId = usuario?.id; // Asume que el usuario tiene una propiedad 'id'

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  // ------------------------------------------
  // 4. Función de Manejo de Envío (Comunicación con el Backend)
  // ------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!usuarioId) {
      setError("❌ Error de autenticación: ID de usuario no encontrado.");
      return;
    }

    if (!titulo.trim() || !contenido.trim()) {
      setError("El título y el contenido no pueden estar vacíos.");
      return;
    }

    setLoading(true);
    setError(null); // Limpiamos errores anteriores

    try {
      // Preparamos los datos para el servicio
      const data: PublicacionData = {
        titulo: titulo,
        contenido: contenido,
        usuarioId: usuarioId, 
      };

      // LLAMADA AL SERVICIO DEL BACKEND
      await crearPublicacion(data);

      // Si tiene éxito:
      setTitulo(""); // Limpiamos los campos del formulario
      setContenido("");
      setLoading(false);
      onPublicacionCreada(); // Notificamos al componente padre
    } catch (err) {
      console.error("Error al publicar:", err);
      // Asume que el servicio lanza un Error con el mensaje adecuado
      setError("🚨 Error al crear la publicación. Verifica tu conexión o inténtalo de nuevo.");
      setLoading(false);
    }
  };

  // ------------------------------------------
  // 5. Función para cerrar y limpiar el estado
  // ------------------------------------------
  const handleClose = () => {
      setTitulo("");
      setContenido("");
      setError(null);
      setLoading(false);
      onClose(); // Llama a la función del padre para cerrar
  }
  
  // ------------------------------------------
  // 6. Renderizado del Modal (usando las clases CSS proporcionadas)
  // ------------------------------------------
  return (
    // Cierra el modal al hacer clic en el overlay
    <div className="modal-overlay" onClick={handleClose}> 
      {/* Evita que el clic en el modal cierre el modal */}
      <div className="modal-container" onClick={(e) => e.stopPropagation()}> 
        <h2>Crear Nueva Publicación</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Input para el Título */}
          <input
            type="text"
            placeholder="Título de la publicación"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={loading}
            style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '15px',
                // Estilo para armonizar con el textarea
                outline: 'none',
                background: '#f8f9fa',
            }}
            required
          />

          {/* Textarea para el Contenido (Usa el CSS global para 'textarea') */}
          <textarea
            placeholder="Escribe el contenido de tu publicación aquí..."
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            disabled={loading}
            required
          />
          
          <div className="upload-section">
            {/* Si bien el backend actual no maneja archivos, el HTML/CSS está listo */}
            <label htmlFor="file-upload" className="upload-label">
                Subir Imagen (Opcional)
            </label>
            <input id="file-upload" type="file" disabled={loading} />
            <p className="file-name">No hay archivo seleccionado.</p>
          </div>

          {/* Muestra un mensaje de error si existe */}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

          {/* Botones de acción */}
          <div className="modal-buttons">
            <button
              type="submit"
              className="btn-publicar"
              disabled={loading || !titulo.trim() || !contenido.trim()}
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
            <button
              type="button"
              className="btn-cancelar"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearPublicacion;