import { useState, useEffect } from "react";
import { IconSend, IconTrash } from "@tabler/icons-react";
import { useUsuarioStore } from "../store/UsuarioStore";
import { useEgresadoStore } from "../store/EgresadoStore";
import {
  crearComentario,
  obtenerComentarios,
  eliminarComentario,
  type Comentario
} from "../services/comentario";
import "../styles/components/Comentarios.css";
import { alerts, notify } from "../utils/notificiations";

interface ComentariosSectionProps {
  publicacionId: string;
  onComentariosCountChange?: (count: number) => void;
}

export const ComentariosSection = ({ publicacionId, onComentariosCountChange }: ComentariosSectionProps) => {
  const { usuario } = useUsuarioStore();
  const { egresado } = useEgresadoStore();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    cargarComentarios(true);
  }, [publicacionId]);

  const cargarComentarios = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const currentPage = reset ? 1 : page;
      const data = await obtenerComentarios(publicacionId, currentPage, 5);

      if (data.success) {
        setComentarios(reset ? data.comentarios : [...comentarios, ...data.comentarios]);
        setPage(currentPage + 1);
        setHasMore(currentPage < data.totalPages);
        setTotal(data.total);
        onComentariosCountChange?.(data.total);
      }
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || enviando) return;

    setEnviando(true);
    try {
      const data = await crearComentario(publicacionId, nuevoComentario.trim());

      if (data.success) {
        setComentarios([data.comentario, ...comentarios]);
        setNuevoComentario("");
        setTotal(prev => prev + 1);
        onComentariosCountChange?.(total + 1);
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      alert("Error al enviar el comentario");
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (comentarioId: string) => {
    const confirmed = await alerts.confirmDelete('este comentario');
    if (!confirmed) return;

    const toastId = notify.loading('Eliminando comentario...');

    try {
      const data = await eliminarComentario(comentarioId);

      if (data.success) {
        setComentarios(comentarios.filter(c => c._id !== comentarioId));
        setTotal(prev => prev - 1);
        onComentariosCountChange?.(total - 1);
        notify.dismiss(toastId);
        notify.success('Comentario eliminado');
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      notify.dismiss(toastId);
      notify.error("Error al eliminar el comentario");
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
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHoras < 24) return `${diffHoras}h`;
    if (diffDias < 7) return `${diffDias}d`;
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const avatarUrl = egresado?.fotoPerfil ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nombre || "U")}&background=7a3e9d&color=fff`;

  return (
    <div className="comentarios-section">
      {/* Input para nuevo comentario */}
      <form onSubmit={handleEnviar} className="comentario-form">
        <img src={avatarUrl} alt="Tu avatar" className="comentario-avatar-small" />
        <input
          type="text"
          placeholder="Escribe un comentario..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          disabled={enviando}
          maxLength={500}
          className="comentario-input"
        />
        <button
          type="submit"
          disabled={!nuevoComentario.trim() || enviando}
          className="comentario-btn-enviar"
        >
          <IconSend size={20} />
        </button>
      </form>

      {/* Lista de comentarios */}
      <div className="comentarios-lista">
        {comentarios.map((comentario) => (
          <div key={comentario._id} className="comentario-item">
            <img
              src={comentario.autor?.fotoPerfil || "/default-avatar.png"}
              alt={comentario.autor?.nombre}
              className="comentario-avatar"
            />
            <div className="comentario-contenido">
              <div className="comentario-header">
                <span className="comentario-autor">
                  {comentario.autor?.nombre} {comentario.autor?.apellido}
                </span>
                <span className="comentario-fecha">
                  {formatearFecha(comentario.createdAt)}
                </span>
              </div>
              <p className="comentario-texto">{comentario.contenido}</p>
            </div>
            {egresado?._id === comentario.autor?._id && (
              <button
                onClick={() => handleEliminar(comentario._id)}
                className="comentario-btn-eliminar"
                title="Eliminar comentario"
              >
                <IconTrash size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Cargar más */}
      {hasMore && (
        <button
          onClick={() => cargarComentarios()}
          disabled={loading}
          className="comentarios-btn-mas"
        >
          {loading ? "Cargando..." : `Ver más comentarios (${total - comentarios.length})`}
        </button>
      )}

      {comentarios.length === 0 && !loading && (
        <p className="comentarios-vacio">Sé el primero en comentar</p>
      )}
    </div>
  );
};