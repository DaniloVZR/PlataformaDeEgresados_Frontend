import { IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { VolverLanding } from "../components/VolverLanding";
import { useUsuarioStore } from "../store/UsuarioStore";
import { Loader } from "../components/Loader";
import { useParams } from "react-router";
import "../styles/pages/FormularioAutenticacion.css";

export const CambiarPassword = () => {

  const { comprobarToken, mensaje, loading, tokenValido, nuevoPassword } = useUsuarioStore();
  const params = useParams();

  const [formData, setFormData] = useState({
    contraseña: '',
    confirmarContraseña: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contraseña || !formData.confirmarContraseña) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (formData.contraseña.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.contraseña.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)) {
      setError('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial');
      return;
    }

    try {
      await nuevoPassword(params.token!, formData.contraseña);
      setPasswordChanged(true);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
    }
  }

  useEffect(() => {
    comprobarToken(params.token!)
  }, [params.token]);

  // Si el cambio fue exitoso, mostrar mensaje de éxito
  if (passwordChanged) {
    return (
      <div className="auth-background">
        <div className="auth-container">
          <h2 className="form-title">¡Contraseña cambiada exitosamente!</h2>
          <p className="success-message">
            Tu contraseña ha sido actualizada correctamente.
            Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
          <div className="button-container">
            <VolverLanding
              ruta="/iniciar-sesion"
              texto="Ir a Iniciar Sesión"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-background">
      {
        tokenValido ?
          (
            <div className="auth-container">
              <VolverLanding
                ruta="/iniciar-sesion"
                texto="Volver"
              />
              <h2 className="form-title">Cambia tu contraseña</h2>

              {error && <p className="error-message">{error}</p>}
              {loading &&
                <div className="loader-container">
                  <Loader />
                </div>
              }
              {mensaje && <p className="success-message">{mensaje}</p>}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-wrapper">
                  <IconLock size={20} color="#bfb3f2" stroke={1.5} className="input-icon" />
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
                </div>

                <div className="input-wrapper">
                  <IconLock size={20} color="#bfb3f2" stroke={1.5} className="input-icon" />
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
                </div>

                <button type="submit" className="auth-button">
                  Cambiar Contraseña
                </button>
              </form>
            </div>
          ) : (
            <div className="auth-container">
              <VolverLanding
                ruta="/iniciar-sesion"
                texto="Volver"
              />
              <h2 className="form-title">Vínculo inexistente</h2>
            </div>
          )
      }
    </div >
  )
}