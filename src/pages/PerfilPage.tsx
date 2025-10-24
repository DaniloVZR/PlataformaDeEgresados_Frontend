import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Perfil.css";
import { obtenerPerfil, actualizarEgresado, actualizarFoto } from "../services/perfil";
import LogoPascual from "../Assets/LogoPascual.jpg";

const PerfilEgresado: React.FC = () => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    programaAcademico: "",
    yearGraduacion: "",
    redesSociales: "",
  });

  // Cargar perfil automáticamente
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await obtenerPerfil();
        if (data.success) {
          setPerfil(data.egresado);
          setFormData({
            descripcion: data.egresado.descripcion || "",
            programaAcademico: data.egresado.programaAcademico || "",
            yearGraduacion: data.egresado.yearGraduacion || "",
            redesSociales: data.egresado.redesSociales?.linkedin || "",
          });
          // Establecer la foto actual como preview
          if (data.egresado.fotoPerfil) {
            setPreviewFoto(data.egresado.fotoPerfil);
          }
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };
    cargarPerfil();
  }, []);

  // Manejar navegación al inicio
  const handleInicio = () => {
    navigate("/");
  };

  // Manejar navegación a Mi Perfil
  const handleMiPerfil = () => {
    navigate("/perfil");
  };

  // Manejar cierre de sesión
  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Manejar cambio de foto con preview inmediato
  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const archivo = e.target.files[0];

    // Crear preview inmediato
    const urlPreview = URL.createObjectURL(archivo);
    setPreviewFoto(urlPreview);

    const form = new FormData();
    form.append("FotoPerfil", archivo);

    try {
      const data = await actualizarFoto(form);
      if (data.success) {
        alert("Foto actualizada correctamente");
        setPerfil((prev: any) => ({ ...prev, fotoPerfil: data.fotoPerfil }));
        setPreviewFoto(data.fotoPerfil);
      }
    } catch (error) {
      console.error("Error al actualizar la foto:", error);
      alert("Error al actualizar la foto");
      // Revertir al estado anterior si falla
      setPreviewFoto(perfil.fotoPerfil || null);
    }
  };

  // Manejar edición
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar cambios
  const handleActualizar = async () => {
    try {
      const data = await actualizarEgresado(formData);
      if (data.success) {
        alert("Información actualizada correctamente");
        setPerfil(data.egresado);
        setEditando(false);
      }
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      alert("Error al actualizar la información");
    }
  };

  if (!perfil) return <p className="cargando">Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      {/* HEADER */}
      <header className="perfil-header">
        <div className="header-logo">
          <img src={LogoPascual} alt="Logo Pascual Bravo" className="logo" />
          <h1>Plataforma de Egresados</h1>
        </div>
        <nav>
          <button onClick={handleInicio}>Inicio</button>
          <button onClick={handleMiPerfil}>Mi Perfil</button>
          <button onClick={handleCerrarSesion}>Cerrar Sesión</button>
        </nav>
      </header>

      {/* MENSAJE DE BIENVENIDA */}
      <div className="perfil-bienvenida">
        <h2>👋 Bienvenido, <span>{perfil.nombre} {perfil.apellido}</span></h2>
        <p>Nos alegra verte de nuevo en la plataforma.</p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="perfil-content">
        {/* Foto del perfil */}
        <div className="foto-section">
          <img
            src={previewFoto || perfil.fotoPerfil || "/default-avatar.png"}
            alt="Foto de perfil"
            className="foto-perfil"
          />
          <label htmlFor="file-upload" className="custom-file-upload">
            Seleccionar archivo
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFotoChange}
          />
        </div>

        {/* Info del perfil */}
        <div className="info-section">
          <h2>{perfil.nombre} {perfil.apellido}</h2>
          <p><strong>Correo:</strong> {perfil.email}</p>
          <p><strong>Programa:</strong> {perfil.programaAcademico}</p>
          <p><strong>Año de Graduación:</strong> {perfil.yearGraduacion}</p>

          {/* Mostrar descripción si existe */}
          {perfil.descripcion && !editando && (
            <div className="descripcion-section">
              <p><strong>Descripción:</strong></p>
              <p className="descripcion-texto">{perfil.descripcion}</p>
            </div>
          )}

          {editando ? (
            <div className="form-editar">
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
                rows={4}
              />
              <input
                type="text"
                name="programaAcademico"
                value={formData.programaAcademico}
                onChange={handleChange}
                placeholder="Programa académico"
              />
              <input
                type="text"
                name="yearGraduacion"
                value={formData.yearGraduacion}
                onChange={handleChange}
                placeholder="Año de graduación"
              />
              <input
                type="text"
                name="redesSociales"
                value={formData.redesSociales}
                onChange={handleChange}
                placeholder="LinkedIn u otra red social"
              />
              <div className="botones-edicion">
                <button onClick={handleActualizar} className="btn-guardar">Actualizar info</button>
                <button onClick={() => setEditando(false)} className="btn-cancelar">Cancelar</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditando(true)} className="btn-editar">Editar perfil</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilEgresado;

