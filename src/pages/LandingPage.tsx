import { Link } from "react-router";
import "../Styles/pages/Landing.css";

export const LandingPage = () => {

  return (
    <div className="landing-container">
      {/* HEADER */}
      <header className="landing-header">
        <h1 className="logo">Red de Egresados</h1>
        <nav className="nav-buttons">
          <Link to="/iniciar-sesion">
            <button className="nav-button">
              Iniciar Sesión
            </button>
          </Link>
          <Link to="/registrarse">
            <button className="nav-button primary">Registrarse</button>
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Conecta con tu comunidad universitaria</h2>
          <p className="hero-subtitle">
            Bienvenido a la red social exclusiva para egresados de nuestra universidad.
            Comparte experiencias, encuentra oportunidades de trabajo y mantente en contacto
            con tus compañeros.
          </p>
          <button className="hero-button">Únete Ahora</button>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="about-section">
        <h3 className="section-title">Sobre Nosotros</h3>
        <p className="section-text">
          Nuestra plataforma fue creada con el objetivo de fortalecer la conexión entre
          los egresados de la universidad. Aquí podrás compartir tus logros, mantener el
          contacto con tu red profesional y acceder a recursos exclusivos para tu desarrollo.
        </p>
      </section>

      {/* BENEFICIOS */}
      <section className="benefits-section">
        <h3 className="section-title">Beneficios</h3>
        <div className="benefits-container">
          <div className="benefit-card">
            <h4 className="benefit-title">Conexiones</h4>
            <p className="benefit-text">
              Conecta con compañeros y colegas de tu misma universidad.
            </p>
          </div>
          <div className="benefit-card">
            <h4 className="benefit-title">Oportunidades</h4>
            <p className="benefit-text">
              Descubre ofertas laborales y colabora en proyectos profesionales.
            </p>
          </div>
          <div className="benefit-card">
            <h4 className="benefit-title">Eventos</h4>
            <p className="benefit-text">
              Participa en eventos, talleres y encuentros de egresados.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <p>© 2025 Red de Egresados - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

