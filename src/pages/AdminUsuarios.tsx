// src/pages/AdminUsuarios.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconSearch,
  IconFilter,
  IconShield,
  IconUser,
  IconBan,
  IconCircleCheck,
  IconX
} from "@tabler/icons-react";
import {
  listarUsuarios,
  cambiarRolUsuario,
  toggleBanUsuario,
  type FiltrosUsuarios
} from "../services/admin";
import "../styles/pages/AdminUsuarios.css";

export const AdminUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosUsuarios>({
    page: 1,
    limit: 10,
    buscar: ""
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [procesando, setProcesando] = useState<string | null>(null);

  useEffect(() => {
    cargarUsuarios();
  }, [filtros.page, filtros.rol, filtros.activo, filtros.buscar]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filtros.buscar !== searchQuery) {
        setFiltros((prev) => ({
          ...prev,
          buscar: searchQuery,
          page: 1 // Resetear a página 1 al buscar
        }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await listarUsuarios(filtros);
      if (data.success) {
        setUsuarios(data.usuarios);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarRol = async (userId: string, nuevoRol: string) => {
    if (!window.confirm(`¿Cambiar rol a ${nuevoRol}?`)) return;

    setProcesando(userId);
    try {
      const data = await cambiarRolUsuario(userId, nuevoRol);
      if (data.success) {
        alert(data.msg);
        cargarUsuarios();
      }
    } catch (error: any) {
      alert(error.message || "Error al cambiar rol");
    } finally {
      setProcesando(null);
    }
  };

  const handleToggleBan = async (userId: string, activo: boolean) => {
    const accion = activo ? "suspender" : "reactivar";
    const razon = activo
      ? prompt("Razón de la suspensión (opcional):")
      : undefined;

    if (activo && razon === null) return;

    setProcesando(userId);
    try {
      const data = await toggleBanUsuario(userId, razon || "Motivo no especificado");
      if (data.success) {
        alert(data.msg);
        cargarUsuarios();
      }
    } catch (error: any) {
      alert(error.message || `Error al ${accion} usuario`);
    } finally {
      setProcesando(null);
    }
  };

  const limpiarFiltros = () => {
    setSearchQuery("");
    setFiltros({ page: 1, limit: 10 });
  };

  return (
    <div className="admin-usuarios">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <button onClick={() => navigate("/admin")} className="navbar-back">
            <IconArrowLeft size={24} />
            <span>Dashboard</span>
          </button>
          <h1>Gestión de Usuarios</h1>
          <p className="header-subtitle">
            Administra roles, suspensiones y más
          </p>
        </div>
      </header>

      {/* Controles */}
      <div className="controles-section">
        <div className="search-bar">
          <IconSearch size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="clear-btn">
              <IconX size={18} />
            </button>
          )}
        </div>

        <button
          className={`btn-filters ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <IconFilter size={20} />
          Filtros
        </button>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Rol</label>
            <select
              value={filtros.rol || ""}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, rol: e.target.value, page: 1 }))
              }
            >
              <option value="">Todos</option>
              <option value="comun">Común</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Estado</label>
            <select
              value={filtros.activo || ""}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, activo: e.target.value, page: 1 }))
              }
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Suspendidos</option>
            </select>
          </div>

          <button className="btn-clear-filters" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Resultados */}
      <div className="resultados-section">
        <p className="resultados-count">
          {total} usuario{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
        </p>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="empty-state">
            <IconUser size={48} />
            <p>No se encontraron usuarios</p>
          </div>
        ) : (
          <>
            <div className="usuarios-table">
              <div className="table-header">
                <div className="col-usuario">Usuario</div>
                <div className="col-rol">Rol</div>
                <div className="col-estado">Estado</div>
                <div className="col-acciones">Acciones</div>
              </div>

              {usuarios.map((usuario) => (
                <div key={usuario._id} className="table-row">
                  <div className="col-usuario">
                    <div className="usuario-info">
                      <div className="usuario-avatar">
                        {usuario.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="usuario-nombre">{usuario.nombre}</p>
                        <p className="usuario-correo">{usuario.correo}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-rol">
                    <span
                      className={`badge-rol ${usuario.rol === "administrador" ? "admin" : "comun"
                        }`}
                    >
                      {usuario.rol === "administrador" ? (
                        <IconShield size={16} />
                      ) : (
                        <IconUser size={16} />
                      )}
                      {usuario.rol}
                    </span>
                  </div>

                  <div className="col-estado">
                    <span
                      className={`badge-estado ${usuario.activo ? "activo" : "suspendido"
                        }`}
                    >
                      {usuario.activo ? (
                        <>
                          <IconCircleCheck size={16} />
                          Activo
                        </>
                      ) : (
                        <>
                          <IconBan size={16} />
                          Suspendido
                        </>
                      )}
                    </span>
                  </div>

                  <div className="col-acciones">
                    <button
                      className="btn-accion cambiar-rol"
                      onClick={() =>
                        handleCambiarRol(
                          usuario._id,
                          usuario.rol === "comun" ? "administrador" : "comun"
                        )
                      }
                      disabled={procesando === usuario._id}
                    >
                      {usuario.rol === "comun"
                        ? "Hacer admin"
                        : "Quitar admin"}
                    </button>

                    <button
                      className={`btn-accion ${usuario.activo ? "suspender" : "reactivar"
                        }`}
                      onClick={() => handleToggleBan(usuario._id, usuario.activo)}
                      disabled={procesando === usuario._id}
                    >
                      {usuario.activo ? "Suspender" : "Reactivar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() =>
                    setFiltros((prev) => ({ ...prev, page: prev.page! - 1 }))
                  }
                  disabled={filtros.page === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {filtros.page} de {totalPages}
                </span>
                <button
                  onClick={() =>
                    setFiltros((prev) => ({ ...prev, page: prev.page! + 1 }))
                  }
                  disabled={filtros.page === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};