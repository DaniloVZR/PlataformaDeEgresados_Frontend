import HeaderPerfil from "../components/HeaderPerfil";
import PerfilEgresado from "../components/Perfil";

export default function PerfilPage() {
  return (
    <div className="perfil-page-container">
      <HeaderPerfil />
      <main className="perfil-main">
        <PerfilEgresado />
      </main>
    </div>
  );
}


