import { Routes, Route } from "react-router"
import { LandingPage } from "./pages/LandingPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { RecuperarPassword } from "./pages/RecuperarPassword"
import { CambiarPassword } from "./pages/CambiarPassword"
import { ConfirmarCuenta } from "./pages/ConfirmarCuenta"

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/iniciar-sesion" element={<LoginPage />} />
      <Route path="/registrarse" element={<RegisterPage />} />
      <Route path="/recuperar-contraseña" element={<RecuperarPassword />} />
      <Route path="/confirmar-cuenta/:token" element={<ConfirmarCuenta />} />
      <Route path="/cambiar-contraseña/:token" element={<CambiarPassword />} />
    </Routes>
  )
}

export default App

