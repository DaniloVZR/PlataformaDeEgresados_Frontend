import { IconHeart, IconHeartFilled, IconTrash, IconDots } from "@tabler/icons-react";
import { useState } from "react";
import { usePublicacionStore, type Publicacion } from "../store/PublicacionStore";
import { useUsuarioStore } from "../store/UsuarioStore";
import "../styles/components/PublicacionCard.css";

interface PublicacionCardProps {
  publicacion: Publicacion;
}

export const PublicacionCard = ({ publicacion }: PublicacionCardProps) => {
  const { darLike, eliminarPublicacion } = usePublicacionStore();
  const { usuario } = useUsuarioStore();
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [processingLike, setProcessingLike] = useState(false);

  const esAutor = usuario?.id === publicacion.autor?._id;

  // Verificar si el usuario actual dio like
  const hasLiked = publicacion.likes.includes(usuario?.id || "");

  const handleLike = async () => {
    if (processingLike) return; // Evitar múltiples clicks

    setProcessingLike(true);
    try {
      await darLike(publicacion._id);
    } catch (error) {
      console.error("Error al dar like:", error);
    } finally {
      // Delay para evitar spam de clicks
      setTimeout(() => setProcessingLike(false), 500);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      return;
    }

    setDeleting(true);
    try {
      await eliminarPublicacion(publicacion._id);
    } catch (error) {
      alert("Error al eliminar la publicación");
      setDeleting(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHoras < 24) return `Hace ${diffHoras}h`;
    if (diffDias < 7) return `Hace ${diffDias}d`;

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== ahora.getFullYear() ? "numeric" : undefined,
    });
  };

  if (deleting) {
    return (
      <div className="publicacion-card deleting">
        <p>Eliminando publicación...</p>
      </div>
    );
  }

  return (
    <article className="publicacion-card">
      {/* Header */}
      <div className="publicacion-header">
        <div className="autor-info">
          <img
            src={publicacion.autor?.fotoPerfil || "/default-avatar.png"}
            alt={`${publicacion.autor?.nombre} ${publicacion.autor?.apellido}`}
            className="autor-avatar"
          />
          <div className="autor-detalles">
            <h3 className="autor-nombre">
              {publicacion.autor?.nombre} {publicacion.autor?.apellido}
            </h3>
            <p className="autor-meta">
              {publicacion.autor?.programaAcademico} • {publicacion.autor?.yearGraduacion}
            </p>
            <time className="publicacion-fecha">{formatearFecha(publicacion.createdAt)}</time>
          </div>
        </div>

        {esAutor && (
          <div className="publicacion-menu">
            <button
              className="menu-toggle"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Opciones"
            >
              <IconDots size={24} />
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={handleDelete} className="menu-item delete">
                  <IconTrash size={18} />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="publicacion-contenido">
        <p className="publicacion-descripcion">{publicacion.descripcion}</p>

        {publicacion.imagen && (
          <div className="publicacion-imagen-container">
            <img
              src={publicacion.imagen}
              alt="Imagen de la publicación"
              className="publicacion-imagen"
            />
          </div>
        )}
      </div>

      {/* Footer - Likes */}
      <div className="publicacion-footer">
        <button
          className={`btn-like ${hasLiked ? "liked" : ""} ${processingLike ? "processing" : ""}`}
          onClick={handleLike}
          disabled={processingLike}
          aria-label={hasLiked ? "Quitar me gusta" : "Me gusta"}
        >
          {hasLiked ? (
            <IconHeartFilled size={24} className="icon-heart" />
          ) : (
            <IconHeart size={24} className="icon-heart" />
          )}
          <span className="likes-count">
            {publicacion.likes.length}
          </span>
        </button>
      </div>
    </article>
  );
};