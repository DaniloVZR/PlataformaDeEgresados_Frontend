import { IconMail } from "@tabler/icons-react";
import { useState } from "react";
import { VolverLanding } from "../components/VolverLanding";
import { useUsuarioStore } from "../store/UsuarioStore";
import { Loader } from "../components/Loader";
import "../styles/pages/FormularioAutenticacion.css";

export const RecuperarPassword = () => {
  const { enviarInstrucciones, mensaje, loading } = useUsuarioStore();

  console.log(mensaje);
  const [formData, setFormData] = useState({
    correo: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.correo.endsWith('@pascualbravo.edu.co')) {
      setError('El correo debe terminar en @pascualbravo.edu.co');
      return;
    }

    enviarInstrucciones(formData.correo)
  }

  return (
    <div className="auth-background">

      <div className="auth-container">
        <VolverLanding
          ruta="/iniciar-sesion"
          texto="Volver"
        />
        <h2 className="form-title">Recuperar Contraseña</h2>

        {error && <p className="error-message">{error}</p>}
        {loading &&
          <div className="loader-container">
            <Loader />
          </div>
        }
        {mensaje && <p className="success-message">{mensaje}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <IconMail size={30} color="#bfb3f2" stroke={1.5} />
          </div>

          <button type="submit" className="auth-button">
            Enviar Instrucciones
          </button>
        </form>
      </div>
    </div>
  )
}
