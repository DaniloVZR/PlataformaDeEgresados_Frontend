import { Navigate } from "react-router"
import { useUsuarioStore } from "../store/UsuarioStore"
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
};

export const AdminRoute = ({ children }: Props) => {
  const { isAuthenticated, usuario } = useUsuarioStore();

  if (!isAuthenticated) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (usuario?.rol !== 'administrador') {
    return <Navigate to="/home" replace />;
  }

  return children;
}