import { useState, useEffect } from "react";
import { obtenerEgresado, actualizarEgresado, actualizarFoto } from "../services/perfil";
import "../styles/perfil.css"; // Importamos los estilos coherentes con la landing

export default function PerfilEgresado() {
  const [egresado, setEgresado] = useState<any>({});
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    obtenerEgresado().then((data) => {
      setEgresado(data);
      setForm(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleGuardar() {
    const res = await actualizarEgresado(form);
    if (res.success) setEgresado(res.egresado);
    setEditando(false);
  }

  const handleFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("fotoPerfil", file);
    const res = await actualizarFoto(formData);
    if (res.success) setEgresado({ ...egresado, fotoPerfil: res.fotoPerfil });
  };

  return (
    <div className="perfil-page">
      <div className="perfil-card">
        <img
          src={egresado.fotoPerfil || "/src/Assets/defaultAvatar.jpg"}
          alt="Foto de perfil"
          className="perfil-foto"
        />
        <input type="file" onChange={handleFoto} className="perfil-input-foto" />

        <h2 className="perfil-nombre">{egresado.nombre || "Nombre del egresado"}</h2>

        {editando ? (
          <>
            <textarea
              name="descripcion"
              value={form.descripcion || ""}
              onChange={handleChange}
              className="perfil-input"
              placeholder="Descripción"
            />
            <input
              name="programa"
              value={form.programa || ""}
              onChange={handleChange}
              className="perfil-input"
              placeholder="Programa académico"
            />
            <input
              name="yearGraduacion"
              value={form.yearGraduacion || ""}
              onChange={handleChange}
              className="perfil-input"
              placeholder="Año de graduación"
            />
            <button onClick={handleGuardar} className="perfil-btn primary">
              Guardar cambios
            </button>
          </>
        ) : (
          <>
            <p className="perfil-descripcion">
              {egresado.descripcion || "Este egresado aún no ha agregado una descripción."}
            </p>
            <p><strong>Correo:</strong> {egresado.correo || "No registrado"}</p>
            <p><strong>Programa:</strong> {egresado.programa || "No registrado"}</p>
            <p><strong>Año de graduación:</strong> {egresado.yearGraduacion || "No registrado"}</p>
            <button onClick={() => setEditando(true)} className="perfil-btn">
              Editar perfil
            </button>
          </>
        )}
      </div>
    </div>
  );
}

