import { useParams } from "react-router";
import { VolverLanding } from "../components/VolverLanding"
import { useUsuarioStore } from "../store/UsuarioStore";
import { useEffect } from "react";

export const ConfirmarCuenta = () => {

  const { confimarUsuario, comprobarToken, confirmado, mensaje, tokenValido } = useUsuarioStore();

  const params = useParams();

  const handleSubmit = async () => {
    await confimarUsuario(params.token!)
  }

  useEffect(() => {
    comprobarToken(params.token!)
  }, [params.token]);

  if (tokenValido === null) {
    return (
      <div className="auth-background">
        <div className="auth-container">
          <h2 className="form-title">Verificando enlace...</h2>
        </div>
      </div>
    )
  }

  if (tokenValido === false) {
    return (
      <div className="auth-background">
        <div className="auth-container">
          <VolverLanding ruta="/iniciar-sesion" texto="Volver" />
          <h2 className="form-title">Token inválido o expirado</h2>
          <p className="error-message">
            El enlace de confirmación no es válido o ha expirado. Por favor, solicita un nuevo enlace.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-background">
      {!confirmado ? (
        <div className="auth-container">
          <VolverLanding ruta="/iniciar-sesion" texto="Volver" />
          <h2 className="form-title">Confirma tu cuenta</h2>
          <button onClick={handleSubmit} className="auth-button">
            Confirmar Cuenta
          </button>
        </div>
      ) : (
        <div className="auth-container">
          <VolverLanding ruta="/iniciar-sesion" texto="Volver" />
          <h2 className="form-title">{mensaje}</h2>
        </div>
      )}
    </div>
  )
}
