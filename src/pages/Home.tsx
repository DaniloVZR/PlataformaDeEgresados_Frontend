import { useNavigate } from "react-router-dom";
import { useUsuarioStore } from "../store/UsuarioStore";
import defaultAvatar from "../Assets/defaultAvatar.jpg";
import "../styles/pages/Home.css";
import { useState } from "react";
import ModalCrearPublicacion from "../components/ModalCrearPublicacion";

export const Home = () => {
  const { cerrarSesion, usuario } = useUsuarioStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    cerrarSesion();
    navigate("/iniciar-sesion");
  };

  const handleEdit = () => {
    navigate("/perfil");
  };

  const handlePublicacionCreada = () => {
    // TODO: Recargar feed de publicaciones
    setIsModalOpen(false);
  };

  return (
    <main className="home-container">
      {/* COLUMNA IZQUIERDA */}
      <aside className="home-sidebar-left home-card">
        <div className="home-perfil">
          <img
            src={defaultAvatar}
            alt="Foto de perfil"
            className="home-profile-img"
          />
          <h2>{usuario?.nombre || "Usuario"}</h2>
        </div>

        <div className="home-profile-buttons">
          <button onClick={handleEdit} className="home-btn home-btn-outline">
            Editar perfil
          </button>
          <button onClick={handleLogout} className="home-btn home-btn-solid">
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* FEED CENTRAL */}
      <section className="home-feed home-card">
        <h3 className="home-feed-title">Publicaciones recientes</h3>

        <div className="home-feed-actions">
          <button
            className="home-btn home-btn-solid"
            onClick={() => setIsModalOpen(true)}
          >
            Crear publicación
          </button>
        </div>

        <div className="home-feed-empty">
          <p>
            No hay publicaciones aún. ¡Sé el primero en compartir algo!
          </p>
        </div>
      </section>

      {/* COLUMNA DERECHA */}
      <aside className="home-sidebar-right home-card">
        <h3>✨ Sugerencias</h3>
        <ul>
          <li>
            <a href="#">Conecta con amigos</a>
          </li>
          <li>
            <a href="#">Sigue la página de Proyectos 2025</a>
          </li>
          <li>
            <a href="#">Publica cosas interesantes que te sucedan</a>
          </li>
          <li>
            <a href="#">Buscar ofertas laborales</a>
          </li>
          <li>
            <a href="#">Mantén actualizado tu perfil</a>
          </li>
        </ul>
      </aside>

      {/* MODAL */}
      <ModalCrearPublicacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPublicacionCreada={handlePublicacionCreada}
      />
    </main>
  );
};