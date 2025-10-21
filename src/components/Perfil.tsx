import { useState, useEffect } from "react";
import { obtenerEgresado, actualizarEgresado, actualizarFoto } from "../services/perfil";

interface Egresado {
  nombre?: string;
  descripcion?: string;
  correo?: string;
  programa?: string;
  yearGraduacion?: number | string;
  fotoPerfil?: string;
}

export default function PerfilEgresado() {
  const [egresado, setEgresado] = useState<Egresado>({});
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<Egresado>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No hay token en localStorage");
      return;
    }
    obtenerEgresado().then(data => {
      setEgresado(data);
      setForm(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    const res = await actualizarEgresado(form);
    if (res.success) setEgresado(res.egresado);
    setEditando(false);
  };

  const handleFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("fotoPerfil", file);
    const res = await actualizarFoto(formData);
    if (res.success) setEgresado({ ...egresado, fotoPerfil: res.fotoPerfil });
  };

  return (
    <div className="perfil-container">
      <div className="perfil-foto">
        <img src={egresado.fotoPerfil || "/src/Assets/defaultAvatar.jpg"} alt="Foto perfil" className="perfil-imagen" />
        <input type="file" onChange={handleFoto} />
      </div>

      <h2>{egresado.nombre}</h2>

      {editando ? (
        <div className="perfil-edicion">
          <textarea name="descripcion" value={form.descripcion || ""} onChange={handleChange} />
          <input name="programa" value={form.programa || ""} onChange={handleChange} />
          <input name="yearGraduacion" value={form.yearGraduacion || ""} onChange={handleChange} />
          <button onClick={handleGuardar}>Guardar</button>
        </div>
      ) : (
        <div className="perfil-info">
          <p>{egresado.descripcion}</p>
          <p><strong>Correo:</strong> {egresado.correo}</p>
          <p><strong>Programa:</strong> {egresado.programa}</p>
          <p><strong>Año de graduación:</strong> {egresado.yearGraduacion}</p>
          <button onClick={() => setEditando(true)}>Editar perfil</button>
        </div>
      )}
    </div>
  );
}
console.log()
