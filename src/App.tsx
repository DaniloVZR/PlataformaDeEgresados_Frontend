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
import BuscarEgresadosPage from "./pages/BuscarEgresadosPage"
import { AdminRoute } from "./components/AdminRoute"
import { AdminPublicaciones } from "./pages/AdminPublicaciones"
import { AdminDashboard } from "./pages/AdminDashboard"
import { AdminUsuarios } from "./pages/AdminUsuarios"

function App() {

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/iniciar-sesion" element={<LoginPage />} />
      <Route path="/registrarse" element={<RegisterPage />} />
      <Route path="/recuperar-contraseña" element={<RecuperarPassword />} />
      <Route path="/confirmar-cuenta/:token" element={<ConfirmarCuenta />} />
      <Route path="/cambiar-contraseña/:token" element={<CambiarPassword />} />

      {/* Rutas privadas */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <PerfilPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/perfil/:id"
        element={
          <PrivateRoute>
            <PerfilPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/egresados"
        element={
          <PrivateRoute>
            <BuscarEgresadosPage />
          </PrivateRoute>
        }
      />

      {/* Rutas de administrador */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <AdminRoute>
            <AdminUsuarios />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/publicaciones"
        element={
          <AdminRoute>
            <AdminPublicaciones />
          </AdminRoute>
        }
      />

    </Routes>
  )
}

export default App