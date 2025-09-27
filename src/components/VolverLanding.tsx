import { IconArrowLeft } from "@tabler/icons-react"
import { useNavigate } from "react-router"
import "../styles/components/VolverLanding.css"

type VolverLandingProps = {
  ruta: string;
  texto: string;
}

export const VolverLanding = ({ ruta, texto }: VolverLandingProps) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ruta);
  }

  return (
    <button className="btn" onClick={handleClick}>
      <IconArrowLeft size={20} color="#fff" stroke={1.5} />
      {texto}
    </button>
  )
}
