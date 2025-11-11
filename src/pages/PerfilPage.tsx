import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Perfil.css";
import { obtenerPerfil, actualizarEgresado, actualizarFoto } from "../services/perfil";
import { useUsuarioStore } from "../store/UsuarioStore";
import LogoPascual from "../Assets/LogoPascual.jpg";

const PerfilEgresado: React.FC = () => {
  const navigate = useNavigate();
  const { cerrarSesion } = useUsuarioStore();

  const [perfil, setPerfil] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);

  const [formData, setFormData] = useState({
    descripcion: "",
    programaAcademico: "",
    yearGraduacion: "",
    linkedin: "",
    github: "",
    twitter: "",
    instagram: "",
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
            linkedin: data.egresado.redesSociales?.linkedin || "",
            github: data.egresado.redesSociales?.github || "",
            twitter: data.egresado.redesSociales?.twitter || "",
            instagram: data.egresado.redesSociales?.instagram || "",
          });
          if (data.egresado.fotoPerfil) {
            setPreviewFoto(data.egresado.fotoPerfil);
          }
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        mostrarMensaje('error', 'Error al cargar el perfil');
      }
    };
    cargarPerfil();
  }, []);

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleInicio = () => {
    navigate("/home");
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/iniciar-sesion");
  };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const archivo = e.target.files[0];

    // Validar tamaño (5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      mostrarMensaje('error', 'La imagen no debe superar 5MB');
      return;
    }

    // Validar tipo
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(archivo.type)) {
      mostrarMensaje('error', 'Solo se permiten imágenes JPG, JPEG o PNG');
      return;
    }

    // Crear preview inmediato
    const urlPreview = URL.createObjectURL(archivo);
    setPreviewFoto(urlPreview);
    setSubiendoFoto(true);

    const form = new FormData();
    form.append("fotoPerfil", archivo); // Nombre correcto

    try {
      const data = await actualizarFoto(form);
      if (data.success) {
        mostrarMensaje('success', 'Foto actualizada correctamente');
        setPerfil((prev: any) => ({ ...prev, fotoPerfil: data.fotoPerfil }));
        setPreviewFoto(data.fotoPerfil);
      } else {
        throw new Error(data.msg || 'Error al actualizar la foto');
      }
    } catch (error) {
      console.error("Error al actualizar la foto:", error);
      mostrarMensaje('error', 'Error al actualizar la foto');
      setPreviewFoto(perfil?.fotoPerfil || null);
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActualizar = async () => {
    try {
      // Construir objeto de redes sociales
      const redesSociales = {
        linkedin: formData.linkedin,
        github: formData.github,
        twitter: formData.twitter,
        instagram: formData.instagram,
      };

      const dataToSend = {
        descripcion: formData.descripcion,
        programaAcademico: formData.programaAcademico,
        yearGraduacion: formData.yearGraduacion,
        redesSociales,
      };

      const data = await actualizarEgresado(dataToSend);

      if (data.success) {
        mostrarMensaje('success', 'Perfil actualizado exitosamente');
        setPerfil(data.egresado);
        setEditando(false);
      } else {
        throw new Error(data.msg || 'Error al actualizar');
      }
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      mostrarMensaje('error', 'Error al actualizar el perfil');
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
          <button onClick={handleCerrarSesion}>Cerrar Sesión</button>
        </nav>
      </header>

      {/* MENSAJE DE BIENVENIDA */}
      <div className="perfil-bienvenida">
        <h2>👋 Bienvenido, <span>{perfil.nombre} {perfil.apellido}</span></h2>
        <p>Nos alegra verte de nuevo en la plataforma.</p>
      </div>

      {/* MENSAJE DE FEEDBACK */}
      {mensaje && (
        <div className={`mensaje-feedback ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="perfil-content">
        {/* Foto del perfil */}
        <div className="foto-section">
          <img
            src={previewFoto || perfil.fotoPerfil || "/default-avatar.png"}
            alt="Foto de perfil"
            className="foto-perfil"
          />
          {subiendoFoto && <p className="subiendo-texto">Subiendo...</p>}
          <label htmlFor="file-upload" className="custom-file-upload">
            {subiendoFoto ? "Subiendo..." : "Cambiar foto"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFotoChange}
            disabled={subiendoFoto}
          />
        </div>

        {/* Info del perfil */}
        <div className="info-section">
          <h2>{perfil.nombre} {perfil.apellido}</h2>
          <p><strong>Correo:</strong> {perfil.email}</p>
          <p><strong>Programa:</strong> {perfil.programaAcademico || "No especificado"}</p>
          <p><strong>Año de Graduación:</strong> {perfil.yearGraduacion || "No especificado"}</p>

          {perfil.descripcion && !editando && (
            <div className="descripcion-section">
              <p><strong>Descripción:</strong></p>
              <p className="descripcion-texto">{perfil.descripcion}</p>
            </div>
          )}

          {/* Redes sociales */}
          {!editando && (perfil.redesSociales?.linkedin || perfil.redesSociales?.github ||
            perfil.redesSociales?.twitter || perfil.redesSociales?.instagram) && (
              <div className="redes-section">
                <p><strong>Redes Sociales:</strong></p>
                <ul className="redes-lista">
                  {perfil.redesSociales.linkedin && (
                    <li>LinkedIn: <a href={perfil.redesSociales.linkedin} target="_blank" rel="noopener noreferrer">Ver perfil</a></li>
                  )}
                  {perfil.redesSociales.github && (
                    <li>GitHub: <a href={perfil.redesSociales.github} target="_blank" rel="noopener noreferrer">Ver perfil</a></li>
                  )}
                  {perfil.redesSociales.twitter && (
                    <li>Twitter: <a href={perfil.redesSociales.twitter} target="_blank" rel="noopener noreferrer">Ver perfil</a></li>
                  )}
                  {perfil.redesSociales.instagram && (
                    <li>Instagram: <a href={perfil.redesSociales.instagram} target="_blank" rel="noopener noreferrer">Ver perfil</a></li>
                  )}
                </ul>
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
                type="number"
                name="yearGraduacion"
                value={formData.yearGraduacion}
                onChange={handleChange}
                placeholder="Año de graduación"
              />

              <p><strong>Redes Sociales:</strong></p>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn (URL completa)"
              />
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="GitHub (URL completa)"
              />
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="Twitter (URL completa)"
              />
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="Instagram (URL completa)"
              />

              <div className="botones-edicion">
                <button onClick={handleActualizar} className="btn-guardar">Guardar cambios</button>
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