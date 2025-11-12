import { useNavigate } from "react-router-dom";
import { useUsuarioStore } from "../store/UsuarioStore";
import { useEgresadoStore } from "../store/EgresadoStore";
import { usePublicacionStore } from "../store/PublicacionStore";
import { PublicacionCard } from "../components/PublicacionCard";
import "../styles/pages/Home.css";
import { useEffect, useState, useRef } from "react";
import ModalCrearPublicacion from "../components/ModalCrearPublicacion";
import { IconPlus, IconLogout, IconUser, IconHome, IconMenu2, IconX } from "@tabler/icons-react";

export const Home = () => {
  const { cerrarSesion, usuario } = useUsuarioStore();
  const { egresado, cargarPerfil } = useEgresadoStore();
  const { publicaciones, loading, error, hasMore, cargarPublicaciones } = usePublicacionStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cargarPerfil();
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

  const avatarUrl = egresado?.fotoPerfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nombre || "U")}&background=7a3e9d&color=fff`;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f2f8' }}>
      {/* NAVBAR GLOBAL */}
      <nav className="global-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <IconHome size={28} />
            <span className="navbar-logo-text">Red de Egresados</span>
          </div>

          {/* Desktop Menu */}
          <div className="navbar-desktop-menu">
            <div className="navbar-user-info">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="navbar-avatar"
              />
              <div>
                <p className="navbar-user-name">{usuario?.nombre}</p>
                <p className="navbar-user-email">{usuario?.correo}</p>
              </div>
            </div>

            <button onClick={handleEdit} className="navbar-btn navbar-btn-outline">
              <IconUser size={20} />
              Perfil
            </button>

            <button onClick={handleLogout} className="navbar-btn navbar-btn-danger">
              <IconLogout size={20} />
              Salir
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="navbar-mobile-toggle"
          >
            {mobileMenuOpen ? <IconX size={28} /> : <IconMenu2 size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-menu">
            <div className="navbar-mobile-user">
              <img src={avatarUrl} alt="Avatar" className="navbar-mobile-avatar" />
              <div>
                <p className="navbar-mobile-user-name">{usuario?.nombre}</p>
                <p className="navbar-mobile-user-email">{usuario?.correo}</p>
              </div>
            </div>

            <button
              onClick={() => {
                handleEdit();
                setMobileMenuOpen(false);
              }}
              className="navbar-mobile-btn navbar-mobile-btn-outline"
            >
              <IconUser size={22} />
              Ver mi perfil
            </button>

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="navbar-mobile-btn navbar-mobile-btn-danger"
            >
              <IconLogout size={22} />
              Cerrar sesión
            </button>
          </div>
        )}
      </nav>

      {/* CONTENIDO PRINCIPAL */}
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
            src={avatarUrl}
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

      {/* MODAL */}
      <ModalCrearPublicacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPublicacionCreada={handlePublicacionCreada}
      />
    </div>
  );
};