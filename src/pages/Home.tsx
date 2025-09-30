import { useNavigate } from "react-router"
import { useUsuarioStore } from "../store/UsuarioStore"

export const Home = () => {

  const { cerrarSesion, usuario } = useUsuarioStore();

  console.log(usuario);

  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/iniciar-sesion');
  }

  return (
    <div>
      <h1>Bienvenido a la página de inicio</h1>
      {usuario && <p>Usuario: {usuario.nombre}</p>}

      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  )
}
