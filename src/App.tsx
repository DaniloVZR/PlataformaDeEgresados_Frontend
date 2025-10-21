import { Routes, Route } from "react-router"
import { LandingPage } from "./pages/LandingPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { RecuperarPassword } from "./pages/RecuperarPassword"
import { CambiarPassword } from "./pages/CambiarPassword"
import { ConfirmarCuenta } from "./pages/ConfirmarCuenta"
import { Home } from "./pages/Home"
import PerfilPage from "./pages/PerfilPage";
import { PrivateRoute } from "./components/PrivateRoute"

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/iniciar-sesion" element={<LoginPage />} />
      <Route path="/registrarse" element={<RegisterPage />} />
      <Route path="/recuperar-contraseña" element={<RecuperarPassword />} />
      <Route path="/confirmar-cuenta/:token" element={<ConfirmarCuenta />} />
      <Route path="/cambiar-contraseña/:token" element={<CambiarPassword />} />
      <Route path="/confirmar-cuenta/:token" element={<ConfirmarCuenta />} />

      // Rutas privadas
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/editar-perfil"
        element={
          <PrivateRoute>
            <PerfilPage />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App

