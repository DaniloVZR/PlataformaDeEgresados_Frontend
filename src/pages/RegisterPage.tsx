// src/pages/RegisterPage.tsx
import { IconMail, IconLock, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/FormularioAutenticacion.css";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }
  }
  return (
    <div className="auth-background">

      <div className="auth-container">
        <h2 className="form-title">Crear Cuenta</h2>

        {error && <p className="error-message">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="text"
              name="nombreCompleto"
              className="input-field"
              placeholder="Nombre Completo"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
            />
            <IconUser size={30} color="#000" stroke={1.5} />
          </div>

          <div className="input-wrapper">
            <input
              type="email"
              name="correo"
              className="input-field"
              placeholder="Correo Institucional"
              value={formData.correo}
              onChange={handleChange}
              required
            />
            <IconMail size={30} color="#000" stroke={1.5} />
          </div>

          <div className="input-wrapper">
            <input
              required
              type="password"
              name="contraseña"
              className="input-field"
              placeholder="Contraseña"
              value={formData.contraseña}
              onChange={handleChange}
            />
            <IconLock size={30} color="#000" stroke={1.5} />
          </div>

          <div className="input-wrapper">
            <input
              required
              type="password"
              name="confirmarContraseña"
              className="input-field"
              placeholder="Confirmar Contraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
            />
            <IconLock size={30} color="#000" stroke={1.5} />
          </div>


          <button type="submit" className="auth-button">
            Registrarse
          </button>
        </form>

        <p className="auth-text">
          ¿Ya tienes una cuenta?{' '}
          <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
            Iniciar Sesion
          </a>
        </p>
      </div>
    </div>
  );
};

