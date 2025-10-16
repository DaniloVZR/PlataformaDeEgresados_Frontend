import { Navigate } from "react-router"
import { useUsuarioStore } from "../store/UsuarioStore"
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
};

export const PrivateRoute = ({ children }: Props) => {

  const { isAuthenticated } = useUsuarioStore();

  if (!isAuthenticated) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  return children
}
