import { useNavigate } from "react-router-dom";
import "../styles/pages/Perfil.css";

export default function HeaderPerfil() {
  const navigate = useNavigate();

  return (
    <header className="perfil-header">
      <div className="perfil-header-content">
        <img
          src="/src/Assets/LogoPascual.jpg"
          alt="Logo"
          className="perfil-logo"
        />
        <nav className="perfil-nav">
          <button className="perfil-nav-btn" onClick={() => navigate("/home")}>
            Inicio
          </button>
          <button
            className="perfil-nav-btn logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}
