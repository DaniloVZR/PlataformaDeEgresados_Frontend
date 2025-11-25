import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconEdit, IconCamera, IconBrandLinkedin, IconBrandGithub, IconBrandTwitter, IconBrandInstagram, IconArrowLeft, IconHeart, IconPhoto, IconLogout, IconMenu2, IconX } from "@tabler/icons-react";
import { obtenerPerfil, actualizarEgresado, actualizarFoto } from "../services/perfil";
import { obtenerPerfilPublico, obtenerPublicacionesEgresado, obtenerPublicacionesLikeadas } from "../services/egresado";
import { useUsuarioStore } from "../store/UsuarioStore";
import { useEgresadoStore } from "../store/EgresadoStore";
import { PublicacionCard } from "../components/PublicacionCard";
import { IconMessage } from "@tabler/icons-react";
import { useMensajeStore } from "../store/MensajeStore";
import type { Publicacion } from "../store/PublicacionStore";
import "../styles/pages/Profile.css";

type Tab = "publicaciones" | "likes";

const PerfilPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { cerrarSesion } = useUsuarioStore();
  const { setConversacionActiva } = useMensajeStore();
  const { egresado: miPerfil, cargarPerfil: cargarMiPerfil } = useEgresadoStore();

  const [perfil, setPerfil] = useState<any>(null);
  const [esMiPerfil, setEsMiPerfil] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("publicaciones");
  const [editando, setEditando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);

  // Publicaciones
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [likesPublicaciones, setLikesPublicaciones] = useState<Publicacion[]>([]);
  const [loadingPubs, setLoadingPubs] = useState(false);
  const [pagePubs, setPagePubs] = useState(1);
  const [hasMorePubs, setHasMorePubs] = useState(true);
  const [pageLikes, setPageLikes] = useState(1);
  const [hasMoreLikes, setHasMoreLikes] = useState(true);

  const [formData, setFormData] = useState({
    nombre: "", apellido: "", descripcion: "", programaAcademico: "", yearGraduacion: "",
    linkedin: "", github: "", twitter: "", instagram: "",
  });

  // Determinar si es mi perfil o de otro usuario
  useEffect(() => {
    const esPropio: any = !id || (miPerfil && id === miPerfil._id);
    setEsMiPerfil(esPropio);

    if (esPropio) {
      cargarPerfilPropio();
    } else {
      cargarPerfilAjeno(id!);
    }
  }, [id, miPerfil?._id]);

  // Cargar publicaciones cuando cambia el perfil o el tab
  useEffect(() => {
    if (perfil?._id) {
      if (activeTab === "publicaciones") {
        cargarPublicacionesPerfil(true);
      } else if (activeTab === "likes" && esMiPerfil) {
        cargarPublicacionesLikes(true);
      }
    }
  }, [perfil?._id, activeTab]);

  const cargarPerfilPropio = async () => {
    try {
      const data = await obtenerPerfil();
      if (data.success) {
        setPerfil(data.egresado);
        actualizarFormData(data.egresado);
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      mostrarMensaje("error", "Error al cargar el perfil");
    }
  };

  const cargarPerfilAjeno = async (egresadoId: string) => {
    try {
      const data = await obtenerPerfilPublico(egresadoId);
      if (data.success) {
        setPerfil(data.egresado);
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      mostrarMensaje("error", "No se pudo cargar el perfil");
    }
  };

  const actualizarFormData = (egresado: any) => {
    setFormData({
      nombre: egresado.nombre || "",
      apellido: egresado.apellido || "",
      descripcion: egresado.descripcion || "",
      programaAcademico: egresado.programaAcademico || "",
      yearGraduacion: egresado.yearGraduacion || "",
      linkedin: egresado.redesSociales?.linkedin || "",
      github: egresado.redesSociales?.github || "",
      twitter: egresado.redesSociales?.twitter || "",
      instagram: egresado.redesSociales?.instagram || "",
    });
  };

  const cargarPublicacionesPerfil = async (reset = false) => {
    if (loadingPubs || (!reset && !hasMorePubs)) return;
    setLoadingPubs(true);

    try {
      const currentPage = reset ? 1 : pagePubs;
      const data = await obtenerPublicacionesEgresado(perfil._id, currentPage, 5);

      if (data.success) {
        setPublicaciones(reset ? data.publicaciones : [...publicaciones, ...data.publicaciones]);
        setPagePubs(currentPage + 1);
        setHasMorePubs(currentPage < data.totalPages);
      }
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    } finally {
      setLoadingPubs(false);
    }
  };

  const cargarPublicacionesLikes = async (reset = false) => {
    if (loadingPubs || (!reset && !hasMoreLikes)) return;
    setLoadingPubs(true);

    try {
      const currentPage = reset ? 1 : pageLikes;
      const data = await obtenerPublicacionesLikeadas(currentPage, 5);

      if (data.success) {
        setLikesPublicaciones(reset ? data.publicaciones : [...likesPublicaciones, ...data.publicaciones]);
        setPageLikes(currentPage + 1);
        setHasMoreLikes(currentPage < data.totalPages);
      }
    } catch (error) {
      console.error("Error al cargar likes:", error);
    } finally {
      setLoadingPubs(false);
    }
  };

  const mostrarMensaje = (tipo: "success" | "error", texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const archivo = e.target.files[0];

    if (archivo.size > 5 * 1024 * 1024) {
      mostrarMensaje("error", "La imagen no debe superar 5MB");
      return;
    }

    setSubiendoFoto(true);
    const form = new FormData();
    form.append("fotoPerfil", archivo);

    try {
      const data = await actualizarFoto(form);
      if (data.success) {
        mostrarMensaje("success", "Foto actualizada");
        setPerfil((prev: any) => ({ ...prev, fotoPerfil: data.fotoPerfil }));
        cargarMiPerfil();
      }
    } catch (error) {
      mostrarMensaje("error", "Error al actualizar la foto");
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGuardar = async () => {
    try {
      const data = await actualizarEgresado({
        nombre: formData.nombre, apellido: formData.apellido, descripcion: formData.descripcion,
        programaAcademico: formData.programaAcademico, yearGraduacion: formData.yearGraduacion,
        redesSociales: { linkedin: formData.linkedin, github: formData.github, twitter: formData.twitter, instagram: formData.instagram },
      });

      if (data.success) {
        mostrarMensaje("success", "Perfil actualizado");
        setPerfil(data.egresado);
        setEditando(false);
        cargarMiPerfil();
      }
    } catch (error) {
      mostrarMensaje("error", "Error al actualizar");
    }
  };

  const avatarUrl = perfil?.fotoPerfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(perfil?.nombre || "U")}&background=7a3e9d&color=fff&size=200`;

  if (!perfil) {
    return (
      <div className="perfil-loading">
        <div className="spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      {/* Navbar */}
      <nav className="perfil-navbar">
        <div className="navbar-container">
          <button onClick={() => navigate("/home")} className="navbar-back">
            <IconArrowLeft size={24} />
            <span>Inicio</span>
          </button>

          <div className="navbar-desktop-actions">
            {esMiPerfil && (
              <button onClick={() => navigate("/egresados")} className="navbar-btn-outline">
                Buscar Egresados
              </button>
            )}
            <button onClick={() => { cerrarSesion(); navigate("/iniciar-sesion"); }} className="navbar-btn-danger">
              <IconLogout size={20} /> Salir
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="navbar-mobile-toggle">
            {mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="navbar-mobile-menu">
            {esMiPerfil && (
              <button onClick={() => { navigate("/egresados"); setMobileMenuOpen(false); }}>
                Buscar Egresados
              </button>
            )}
            <button onClick={() => { cerrarSesion(); navigate("/iniciar-sesion"); }}>
              Cerrar sesión
            </button>
          </div>
        )}
      </nav>

      {/* Mensaje feedback */}
      {mensaje && <div className={`perfil-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}

      {/* Header del perfil */}
      <header className="perfil-header-card">
        <div className="perfil-cover"></div>

        <div className="perfil-avatar-section">
          <div className="avatar-container">
            <img src={avatarUrl} alt={perfil.nombre} className="perfil-avatar" />
            {esMiPerfil && (
              <label className="avatar-edit-btn">
                <IconCamera size={20} />
                <input type="file" accept="image/*" onChange={handleFotoChange} disabled={subiendoFoto} hidden />
              </label>
            )}
            {subiendoFoto && <div className="avatar-loading"><div className="mini-spinner"></div></div>}
          </div>

          <div className="perfil-info-principal">
            <h1>{perfil.nombre} {perfil.apellido}</h1>
            <p className="perfil-programa">{perfil.programaAcademico || "Sin programa"}</p>
            <p className="perfil-año">Graduación: {perfil.yearGraduacion || "No especificado"}</p>
          </div>

          {esMiPerfil && !editando && (
            <button className="btn-editar-perfil" onClick={() => setEditando(true)}>
              <IconEdit size={18} /> Editar perfil
            </button>
          )}

          {!esMiPerfil && (
            <button
              className="btn-enviar-mensaje"
              onClick={() => {
                setConversacionActiva(perfil._id, {
                  _id: perfil._id,
                  nombre: perfil.nombre,
                  apellido: perfil.apellido,
                  fotoPerfil: perfil.fotoPerfil,
                  programaAcademico: perfil.programaAcademico
                });
                navigate('/mensajes');
              }}
            >
              <IconMessage size={18} />
              Enviar mensaje
            </button>
          )}
        </div>

        {/* Descripción y redes */}
        {!editando ? (
          <div className="perfil-detalles">
            {perfil.descripcion && <p className="perfil-descripcion">{perfil.descripcion}</p>}

            <div className="perfil-redes">
              {perfil.redesSociales?.linkedin && (
                <a href={perfil.redesSociales.linkedin} target="_blank" rel="noopener noreferrer">
                  <IconBrandLinkedin size={24} />
                </a>
              )}
              {perfil.redesSociales?.github && (
                <a href={perfil.redesSociales.github} target="_blank" rel="noopener noreferrer">
                  <IconBrandGithub size={24} />
                </a>
              )}
              {perfil.redesSociales?.twitter && (
                <a href={perfil.redesSociales.twitter} target="_blank" rel="noopener noreferrer">
                  <IconBrandTwitter size={24} />
                </a>
              )}
              {perfil.redesSociales?.instagram && (
                <a href={perfil.redesSociales.instagram} target="_blank" rel="noopener noreferrer">
                  <IconBrandInstagram size={24} />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="perfil-form-editar">
            <div className="form-row">
              <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
              <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" />
            </div>
            <input name="programaAcademico" value={formData.programaAcademico} onChange={handleChange} placeholder="Programa académico" />
            <input name="yearGraduacion" type="number" value={formData.yearGraduacion} onChange={handleChange} placeholder="Año de graduación" />
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Cuéntanos sobre ti..." rows={3} />

            <p className="form-section-title">Redes sociales</p>
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
            <input name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" />
            <input name="twitter" value={formData.twitter} onChange={handleChange} placeholder="Twitter URL" />
            <input name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Instagram URL" />

            <div className="form-buttons">
              <button className="btn-guardar" onClick={handleGuardar}>Guardar cambios</button>
              <button className="btn-cancelar" onClick={() => { setEditando(false); actualizarFormData(perfil); }}>Cancelar</button>
            </div>
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="perfil-tabs">
        <button className={`tab ${activeTab === "publicaciones" ? "active" : ""}`} onClick={() => setActiveTab("publicaciones")}>
          <IconPhoto size={20} /> Publicaciones
        </button>
        {esMiPerfil && (
          <button className={`tab ${activeTab === "likes" ? "active" : ""}`} onClick={() => setActiveTab("likes")}>
            <IconHeart size={20} /> Me gusta
          </button>
        )}
      </div>

      {/* Contenido de tabs */}
      <main className="perfil-content">
        {activeTab === "publicaciones" && (
          <div className="publicaciones-grid">
            {publicaciones.length === 0 && !loadingPubs ? (
              <div className="empty-state">
                <IconPhoto size={48} />
                <p>{esMiPerfil ? "Aún no has publicado nada" : "Este usuario no tiene publicaciones"}</p>
              </div>
            ) : (
              publicaciones.map((pub) => <PublicacionCard key={pub._id} publicacion={pub} />)
            )}
            {hasMorePubs && !loadingPubs && (
              <button className="btn-cargar-mas" onClick={() => cargarPublicacionesPerfil()}>Ver más</button>
            )}
          </div>
        )}

        {activeTab === "likes" && esMiPerfil && (
          <div className="publicaciones-grid">
            {likesPublicaciones.length === 0 && !loadingPubs ? (
              <div className="empty-state">
                <IconHeart size={48} />
                <p>No has dado like a ninguna publicación</p>
              </div>
            ) : (
              likesPublicaciones.map((pub) => <PublicacionCard key={pub._id} publicacion={pub} />)
            )}
            {hasMoreLikes && !loadingPubs && (
              <button className="btn-cargar-mas" onClick={() => cargarPublicacionesLikes()}>Ver más</button>
            )}
          </div>
        )}

        {loadingPubs && (
          <div className="loading-pubs">
            <div className="spinner"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PerfilPage;