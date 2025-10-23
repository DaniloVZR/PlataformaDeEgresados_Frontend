import React, { useState } from "react";
import { crearPublicacion, type PublicacionData } from "../services/publicacion";
import { useUsuarioStore } from "../store/UsuarioStore";
import "../styles/components/Modal.css";

interface ModalCrearPublicacionProps {
  isOpen: boolean;
  onClose: () => void;
  onPublicacionCreada: () => void;
}

const ModalCrearPublicacion: React.FC<ModalCrearPublicacionProps> = ({
  isOpen,
  onClose,
  onPublicacionCreada,
}) => {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { usuario } = useUsuarioStore();
  const usuarioId = usuario?.id;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId) {
      setError("Error de autenticación: ID de usuario no encontrado.");
      return;
    }
    if (!contenido.trim()) {
      setError("El contenido no puede estar vacío.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: PublicacionData = {
        titulo: titulo || "Publicación",
        contenido,
        usuarioId,
      };

      await crearPublicacion(data);
      setTitulo("");
      setContenido("");
      setLoading(false);
      onPublicacionCreada();
      onClose();
    } catch (err) {
      console.error("Error al publicar:", err);
      setError("🚨 No se pudo crear la publicación...");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitulo("");
    setContenido("");
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-fb" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="¿Qué estás pensando?"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            disabled={loading}
            required
          />

          <div className="upload-section">
            <label htmlFor="file-upload" className="upload-label">
              📷 Agregar foto
            </label>
            <input id="file-upload" type="file" disabled={loading} />
            <p className="file-name">Ningún archivo seleccionado</p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-buttons">
            <button
              type="submit"
              className="btn-publicar"
              disabled={loading || !contenido.trim()}
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearPublicacion;
