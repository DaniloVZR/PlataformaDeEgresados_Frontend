import { IconHeart, IconHeartFilled, IconTrash, IconDots, IconMessageCircle } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePublicacionStore, type Publicacion } from "../store/PublicacionStore";
import { useEgresadoStore } from "../store/EgresadoStore";
import { ComentariosSection } from "./ComentariosSection";
import { contarComentarios } from "../services/comentario";
import "../styles/components/PublicacionCard.css";

interface PublicacionCardProps {
  publicacion: Publicacion;
}

export const PublicacionCard = ({ publicacion }: PublicacionCardProps) => {
  const navigate = useNavigate();
  const { darLike, eliminarPublicacion } = usePublicacionStore();
  const { egresado } = useEgresadoStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showComentarios, setShowComentarios] = useState(false);
  const [comentariosCount, setComentariosCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [processingLike, setProcessingLike] = useState(false);
  const [showLikesPopup, setShowLikesPopup] = useState(false);

  const [likesLocal, setLikesLocal] = useState(publicacion.likes);

  useEffect(() => {
    setLikesLocal(publicacion.likes);
  }, [publicacion.likes]);

  // Verificar si el autor es el usuario actual
  const esAutor = egresado?._id === publicacion.autor?._id;
  const likesArray = Array.isArray(likesLocal) ? likesLocal : [];
  const egresadoId = egresado?._id;

  const hasLiked = likesArray.some(like => {
    if (typeof like === 'string') return like === egresadoId;
    return like?._id === egresadoId;
  });

  useEffect(() => {
    const cargarConteo = async () => {
      try {
        const data = await contarComentarios(publicacion._id);
        if (data.success) setComentariosCount(data.total);
      } catch (error) {
        console.error("Error al contar comentarios:", error);
      }
    };
    cargarConteo();
  }, [publicacion._id]);

  const handleLike = async () => {
    if (processingLike) return;
    setProcessingLike(true);
    try {
      await darLike(publicacion._id);
    } catch (error) {
      console.error("Error al dar like:", error);
    } finally {
      setProcessingLike(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) return;
    setDeleting(true);
    try {
      await eliminarPublicacion(publicacion._id);
    } catch (error) {
      alert("Error al eliminar la publicación");
      setDeleting(false);
    }
  };

  const handleAutorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Si es mi propia publicación, ir a mi perfil sin ID
    if (esAutor) {
      navigate("/perfil");
    } else {
      // Si es de otro usuario, ir a su perfil con ID
      navigate(`/perfil/${publicacion.autor._id}`);
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
        <div className="autor-info" onClick={handleAutorClick} style={{ cursor: 'pointer' }}>
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
            <button className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
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
            <img src={publicacion.imagen} alt="Imagen" className="publicacion-imagen" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="publicacion-footer">
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowLikesPopup(true)}
          onMouseLeave={() => setShowLikesPopup(false)}
        >
          <button
            className={`btn-like ${hasLiked ? "liked" : ""} ${processingLike ? "processing" : ""}`}
            onClick={handleLike}
            disabled={processingLike}
          >
            {hasLiked ? <IconHeartFilled size={24} /> : <IconHeart size={24} />}
            <span className="likes-count">{likesArray.length}</span>
          </button>

          {showLikesPopup && likesArray.length > 0 && (
            <div className="likes-popup">
              <p className="likes-popup-title">
                Les gusta a {likesArray.length} {likesArray.length === 1 ? 'persona' : 'personas'}
              </p>
              <div className="likes-popup-list">
                {likesArray.slice(0, 10).map((like, index) => {
                  if (typeof like === 'string') {
                    return (
                      <div key={like} className="likes-popup-user">
                        <p className="likes-popup-name">Usuario</p>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={like._id || index}
                      className="likes-popup-user"
                      onClick={() => navigate(`/perfil/${like._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={like.fotoPerfil || '/default-avatar.png'} alt={like.nombre || 'Usuario'} className="likes-popup-avatar" />
                      <p className="likes-popup-name">{like.nombre} {like.apellido}</p>
                    </div>
                  );
                })}
                {likesArray.length > 10 && (
                  <p className="likes-popup-more">y {likesArray.length - 10} más...</p>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          className={`btn-comentarios ${showComentarios ? "active" : ""}`}
          onClick={() => setShowComentarios(!showComentarios)}
        >
          <IconMessageCircle size={24} />
          <span>{comentariosCount}</span>
        </button>
      </div>

      {showComentarios && (
        <ComentariosSection
          publicacionId={publicacion._id}
          onComentariosCountChange={setComentariosCount}
        />
      )}
    </article>
  );
};