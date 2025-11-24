import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconSearch,
  IconPhoto,
  IconTrash,
  IconHeart,
  IconX
} from "@tabler/icons-react";
import {
  listarPublicacionesAdmin,
  eliminarPublicacionAdmin,
  type FiltrosPublicaciones
} from "../services/admin";
import "../styles/pages/AdminPublicaciones.css";

export const AdminPublicaciones = () => {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosPublicaciones>({
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [eliminando, setEliminando] = useState<string | null>(null);

  useEffect(() => {
    cargarPublicaciones();
  }, [filtros.page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltros((prev) => ({ ...prev, buscar: searchQuery, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const cargarPublicaciones = async () => {
    setLoading(true);
    try {
      const data = await listarPublicacionesAdmin(filtros);
      if (data.success) {
        setPublicaciones(data.publicaciones);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (pubId: string) => {
    const razon = prompt(
      "Razón de la eliminación (opcional):\n\nEsta publicación será eliminada permanentemente."
    );

    if (razon === null) return;

    setEliminando(pubId);
    try {
      const data = await eliminarPublicacionAdmin(pubId, razon);
      if (data.success) {
        alert(data.msg);
        cargarPublicaciones();
      }
    } catch (error: any) {
      alert(error.message || "Error al eliminar publicación");
    } finally {
      setEliminando(null);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-publicaciones">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <button onClick={() => navigate("/admin")} className="btn-back">
            <IconArrowLeft size={24} />
            <span>Volver al dashboard</span>
          </button>
          <h1>Gestión de Publicaciones</h1>
          <p className="header-subtitle">
            Revisa y modera el contenido publicado
          </p>
        </div>
      </header>

      {/* Búsqueda */}
      <div className="controles-section">
        <div className="search-bar">
          <IconSearch size={20} />
          <input
            type="text"
            placeholder="Buscar en descripciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="clear-btn">
              <IconX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      <div className="resultados-section">
        <p className="resultados-count">
          {total} publicaci{total !== 1 ? "ones" : "ón"} encontrada{total !== 1 ? "s" : ""}
        </p>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando publicaciones...</p>
          </div>
        ) : publicaciones.length === 0 ? (
          <div className="empty-state">
            <IconPhoto size={48} />
            <p>No se encontraron publicaciones</p>
          </div>
        ) : (
          <>
            <div className="publicaciones-grid">
              {publicaciones.map((pub) => (
                <article key={pub._id} className="pub-card">
                  {/* Autor */}
                  <div className="pub-header">
                    <div className="autor-info">
                      <img
                        src={pub.autor?.fotoPerfil || "/default-avatar.png"}
                        alt={pub.autor?.nombre}
                        className="autor-avatar"
                      />
                      <div>
                        <p className="autor-nombre">
                          {pub.autor?.nombre} {pub.autor?.apellido}
                        </p>
                        <p className="autor-email">{pub.autor?.email}</p>
                        <p className="pub-fecha">{formatearFecha(pub.createdAt)}</p>
                      </div>
                    </div>

                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(pub._id)}
                      disabled={eliminando === pub._id}
                      title="Eliminar publicación"
                    >
                      <IconTrash size={20} />
                    </button>
                  </div>

                  {/* Contenido */}
                  <div className="pub-contenido">
                    <p className="pub-descripcion">{pub.descripcion}</p>
                    {pub.imagen && (
                      <div className="pub-imagen-container">
                        <img
                          src={pub.imagen}
                          alt="Imagen de publicación"
                          className="pub-imagen"
                        />
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="pub-stats">
                    <div className="stat-item">
                      <IconHeart size={18} />
                      <span>{pub.likes?.length || 0} likes</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() =>
                    setFiltros((prev) => ({ ...prev, page: prev.page! - 1 }))
                  }
                  disabled={filtros.page === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {filtros.page} de {totalPages}
                </span>
                <button
                  onClick={() =>
                    setFiltros((prev) => ({ ...prev, page: prev.page! + 1 }))
                  }
                  disabled={filtros.page === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};