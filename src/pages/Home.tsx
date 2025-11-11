import { useNavigate } from "react-router-dom";
import { useUsuarioStore } from "../store/UsuarioStore";
import { usePublicacionStore } from "../store/PublicacionStore";
import { PublicacionCard } from "../components/PublicacionCard";
import defaultAvatar from "../Assets/defaultAvatar.jpg";
import "../styles/pages/Home.css";
import { useEffect, useState, useRef } from "react";
import ModalCrearPublicacion from "../components/ModalCrearPublicacion";
import { IconPlus, IconLogout, IconUser } from "@tabler/icons-react";

export const Home = () => {
  const { cerrarSesion, usuario } = useUsuarioStore();
  const { publicaciones, loading, error, hasMore, cargarPublicaciones } = usePublicacionStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cargarPublicaciones(true);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          cargarPublicaciones();
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading]);

  const handleLogout = () => {
    cerrarSesion();
    navigate("/iniciar-sesion");
  };

  const handleEdit = () => {
    navigate("/perfil");
  };

  const handlePublicacionCreada = () => {
    cargarPublicaciones(true);
    setIsModalOpen(false);
  };

  return (
    <div className="home-wrapper">
      {/* SIDEBAR IZQUIERDO - Solo en desktop */}
      <aside className="home-sidebar-left">
        <div className="sidebar-card">
          <div className="perfil-preview">
            <img
              src={defaultAvatar}
              alt="Foto de perfil"
              className="perfil-avatar"
            />
            <h2 className="perfil-nombre">{usuario?.nombre || "Usuario"}</h2>
            <p className="perfil-correo">{usuario?.correo}</p>
          </div>

          <div className="perfil-actions">
            <button onClick={handleEdit} className="btn-action btn-outline">
              <IconUser size={20} />
              Ver perfil
            </button>
            <button onClick={handleLogout} className="btn-action btn-logout">
              <IconLogout size={20} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* FEED CENTRAL */}
      <main className="home-feed">
        {/* Header del feed */}
        <div className="feed-header">
          <h1 className="feed-title">Publicaciones</h1>
          <button
            className="btn-crear-mobile"
            onClick={() => setIsModalOpen(true)}
            aria-label="Crear publicación"
          >
            <IconPlus size={24} />
          </button>
        </div>

        {/* Botón crear (desktop) */}
        <div className="crear-publicacion-box">
          <img
            src={defaultAvatar}
            alt="Tu foto"
            className="crear-avatar"
          />
          <button
            className="crear-input"
            onClick={() => setIsModalOpen(true)}
          >
            ¿Qué estás pensando?
          </button>
        </div>

        {/* Lista de publicaciones */}
        {error && (
          <div className="error-box">
            <p>{error}</p>
            <button onClick={() => cargarPublicaciones(true)}>
              Reintentar
            </button>
          </div>
        )}

        {publicaciones.length === 0 && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No hay publicaciones aún</h3>
            <p>¡Sé el primero en compartir algo con la comunidad!</p>
            <button
              className="btn-crear-first"
              onClick={() => setIsModalOpen(true)}
            >
              Crear publicación
            </button>
          </div>
        )}

        <div className="publicaciones-lista">
          {publicaciones.map((publicacion) => (
            <PublicacionCard key={publicacion._id} publicacion={publicacion} />
          ))}
        </div>

        {/* Loading y scroll infinito */}
        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Cargando publicaciones...</p>
          </div>
        )}

        {hasMore && !loading && <div ref={observerTarget} className="scroll-trigger" />}

        {!hasMore && publicaciones.length > 0 && (
          <div className="end-message">
            <p>¡Has visto todas las publicaciones! 🎉</p>
          </div>
        )}
      </main>

      {/* SIDEBAR DERECHO - Solo en desktop */}
      <aside className="home-sidebar-right">
        <div className="sidebar-card">
          <h3 className="sidebar-title">✨ Sugerencias</h3>
          <ul className="sugerencias-lista">
            <li>
              <a href="#">Conecta con amigos</a>
            </li>
            <li>
              <a href="#">Explora grupos de tu programa</a>
            </li>
            <li>
              <a href="#">Comparte tus logros</a>
            </li>
            <li>
              <a href="#">Busca ofertas laborales</a>
            </li>
            <li>
              <a href="#">Actualiza tu perfil</a>
            </li>
          </ul>
        </div>

        <div className="sidebar-card">
          <h3 className="sidebar-title">📊 Estadísticas</h3>
          <div className="estadisticas">
            <div className="stat-item">
              <span className="stat-label">Publicaciones</span>
              <span className="stat-value">{publicaciones.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Miembros</span>
              <span className="stat-value">250+</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MODAL */}
      <ModalCrearPublicacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPublicacionCreada={handlePublicacionCreada}
      />
    </div>
  );
};