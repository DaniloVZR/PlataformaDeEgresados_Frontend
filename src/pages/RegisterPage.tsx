// src/pages/RegisterPage.tsx
import { IconMail, IconLock, IconUser, IconEyeOff, IconEye } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/pages/FormularioAutenticacion.css";
import { VolverLanding } from '../components/VolverLanding';
import { useUsuarioStore } from '../store/UsuarioStore';
import { Loader } from '../components/Loader';

export const RegisterPage = () => {

  const { registrarse, mensaje, loading } = useUsuarioStore();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Array.from(Object.values(formData)).some(value => !value)) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!formData.correo.endsWith('@pascualbravo.edu.co')) {
      setError('El correo debe terminar en @pascualbravo.edu.co');
      return;
    }

    if (formData.contraseña.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!formData.contraseña.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)) {
      setError('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial');
      return;
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await registrarse(formData.nombreCompleto, formData.correo, formData.contraseña);
      setEnviado(true);
      console.log(mensaje);
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError('Error al registrarse. Por favor, inténtalo de nuevo.');
    }
  }

  return (
    enviado ? (
      <div className="auth-background">
        <div className="auth-container">
          <h2 className="form-title">Correo enviado!</h2>
          <p className="success-message">
            Revisa tu correo electrónico para activar tu cuenta.
          </p>
          <div className="button-container">
            <VolverLanding
              ruta="/iniciar-sesion"
              texto="Ir a Iniciar Sesión"
            />
          </div>
        </div>
      </div>
    ) : (
      <div className="auth-background" >
        <div className="auth-container">
          <VolverLanding
            ruta="/"
            texto="Volver"
          />
          <h2 className="form-title">Crear Cuenta</h2>

          {error && <p className="error-message">{error}</p>}

          {loading &&
            <div className="loader-container">
              <Loader />
            </div>
          }
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="text"
                name="nombreCompleto"
                className="input-field"
                placeholder="Nombre Completo"
                value={formData.nombreCompleto}
                onChange={handleChange}
              />
              <IconUser size={30} color="#bfb3f2" stroke={1.5} />
            </div>

            <div className="input-wrapper">
              <input
                type="email"
                name="correo"
                className="input-field"
                placeholder="Correo Institucional"
                value={formData.correo}
                onChange={handleChange}
              />
              <IconMail size={30} color="#bfb3f2" stroke={1.5} />
            </div>

            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="contraseña"
                className="input-field"
                placeholder="Contraseña"
                value={formData.contraseña}
                onChange={handleChange}
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

            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmarContraseña"
                className="input-field"
                placeholder="Confirmar Contraseña"
                value={formData.confirmarContraseña}
                onChange={handleChange}
                style={{ paddingLeft: "3.5rem", paddingRight: "3rem" }}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
              </button>
              <IconLock size={30} color="#bfb3f2" stroke={1.5} />
            </div>

            <button type="submit" className="auth-button">
              Registrarse
            </button>
          </form>

          <p className="auth-text">
            ¿Ya tienes una cuenta?{' '}
            <a onClick={() => navigate('/iniciar-sesion')} style={{ cursor: 'pointer' }}>
              Inicia Sesión
            </a>
          </p>
        </div>
      </div>
    )
  );
};

