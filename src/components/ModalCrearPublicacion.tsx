import React, { useState } from "react";
import { crearPublicacion, type PublicacionData } from "../services/publicacion";
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
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      setError("La descripción no puede estar vacía.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: PublicacionData = {
        descripcion: descripcion.trim(),
      };

      if (imagen) {
        data.imagen = imagen;
      }

      const response = await crearPublicacion(data);

      if (response.success) {
        // Limpiar formulario
        setDescripcion("");
        setImagen(null);

        // Resetear input de archivo
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        setLoading(false);
        onPublicacionCreada();
        onClose();
      } else {
        throw new Error(response.msg || "Error al crear la publicación");
      }
    } catch (err) {
      console.error("Error al publicar:", err);
      setError(err instanceof Error ? err.message : "No se pudo crear la publicación");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDescripcion("");
    setImagen(null);
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-fb" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="¿Qué estás pensando?"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={loading}
            required
          />

          <div className="upload-section">
            <label htmlFor="file-upload" className="upload-label">
              📷 Agregar foto
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageChange}
              disabled={loading}
              style={{ display: 'none' }}
            />
            <p className="file-name">
              {imagen ? imagen.name : "Ningún archivo seleccionado"}
            </p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-buttons">
            <button
              type="submit"
              className="btn-publicar"
              disabled={loading || !descripcion.trim()}
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