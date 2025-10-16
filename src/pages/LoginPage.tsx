import { IconEye, IconEyeOff, IconMail } from '@tabler/icons-react';
import { IconLock } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { VolverLanding } from '../components/VolverLanding';
import { useEffect, useState } from 'react';
import { useUsuarioStore } from '../store/UsuarioStore';
import { Loader } from '../components/Loader';
import "../styles/pages/FormularioAutenticacion.css";

export const LoginPage = () => {

  const {
    iniciarSesion,
    loading,
    mensaje,
    isAuthenticated,
    limpiarMensaje
  } = useUsuarioStore();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    limpiarMensaje();
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    if (mensaje) {
      limpiarMensaje();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await iniciarSesion(formData.correo, formData.password);

    if (success) {
      navigate('/home');
    }
  }

  return (
    <div className="auth-background">
      <div className="auth-container">
        <VolverLanding ruta="/" texto="Volver" />
        <h2 className="form-title">Iniciar sesión</h2>

        {mensaje && (
          <p className={`${isAuthenticated ? 'success-message' : 'error-message'}`}>
            {mensaje}
          </p>
        )}

        {loading && (
          <div className="loader-container">
            <Loader />
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="email"
              name="correo"
              className="input-field"
              placeholder="Correo Institucional"
              value={formData.correo}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <IconMail size={30} color="#bfb3f2" stroke={1.5} />
          </div>

          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="input-field"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              style={{ paddingLeft: "3.5rem", paddingRight: "3rem" }}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
            <IconLock size={30} color="#bfb3f2" stroke={1.5} />
          </div>

          <Link to="/recuperar-contraseña" className="forgot-password-link">
            ¿Olvidó la contraseña?
          </Link>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="auth-text">
          ¿No tiene cuenta?{' '}
          <Link to="/registrarse">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};
