import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconUsers,
  IconPhoto,
  IconUserCheck,
  IconHeart,
  IconTrendingUp,
  IconArrowLeft,
  IconSettings,
  IconShieldCheck
} from "@tabler/icons-react";
import { obtenerMetricas, obtenerEstadisticas } from "../services/admin";
import "../styles/pages/AdminDashboard.css";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [metricas, setMetricas] = useState<any>(null);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [metricasData, estadisticasData] = await Promise.all([
        obtenerMetricas(),
        obtenerEstadisticas()
      ]);

      if (metricasData.success) setMetricas(metricasData.metricas);
      if (estadisticasData.success) setEstadisticas(estadisticasData.estadisticas);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Cargando panel de administrador...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <button onClick={() => navigate("/home")} className="btn-back">
            <IconArrowLeft size={24} />
            <span>Volver al inicio</span>
          </button>
          <div className="admin-title">
            <IconShieldCheck size={32} color="#7a3e9d" />
            <h1>Panel de Administrador</h1>
          </div>
        </div>
      </header>

      {/* Métricas principales */}
      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon usuarios">
            <IconUsers size={32} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Total Usuarios</p>
            <h2 className="metric-value">{metricas?.usuarios?.total || 0}</h2>
            <p className="metric-sub">
              {metricas?.usuarios?.activos || 0} activos • {metricas?.usuarios?.baneados || 0} suspendidos
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon publicaciones">
            <IconPhoto size={32} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Total Publicaciones</p>
            <h2 className="metric-value">{metricas?.publicaciones?.total || 0}</h2>
            <p className="metric-sub">
              {metricas?.publicaciones?.nuevas7Dias || 0} esta semana
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon activos">
            <IconUserCheck size={32} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Nuevos Usuarios (30d)</p>
            <h2 className="metric-value">{metricas?.usuarios?.nuevos30Dias || 0}</h2>
            <p className="metric-sub">
              {metricas?.usuarios?.perfilesCompletos || 0} perfiles completos
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon likes">
            <IconHeart size={32} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Total Likes</p>
            <h2 className="metric-value">{metricas?.publicaciones?.totalLikes || 0}</h2>
            <p className="metric-sub">
              {metricas?.publicaciones?.nuevas30Dias || 0} publicaciones (30d)
            </p>
          </div>
        </div>
      </section>

      {/* Acciones rápidas */}
      <section className="quick-actions">
        <h2 className="section-title">
          <IconSettings size={24} />
          Acciones rápidas
        </h2>
        <div className="actions-grid">
          <button
            className="action-card"
            onClick={() => navigate("/admin/usuarios")}
          >
            <IconUsers size={28} />
            <h3>Gestionar Usuarios</h3>
            <p>Ver, editar roles y gestionar suspensiones</p>
          </button>

          <button
            className="action-card"
            onClick={() => navigate("/admin/publicaciones")}
          >
            <IconPhoto size={28} />
            <h3>Gestionar Publicaciones</h3>
            <p>Revisar y moderar contenido publicado</p>
          </button>
        </div>
      </section>

      {/* Top usuarios */}
      {estadisticas?.topPublicadores && (
        <section className="stats-section">
          <h2 className="section-title">
            <IconTrendingUp size={24} />
            Top Publicadores
          </h2>
          <div className="top-list">
            {estadisticas.topPublicadores.map((user: any, idx: number) => (
              <div key={user._id} className="top-item">
                <span className="top-rank">#{idx + 1}</span>
                <img
                  src={user.fotoPerfil || "/default-avatar.png"}
                  alt={user.nombre}
                  className="top-avatar"
                />
                <div className="top-info">
                  <p className="top-name">{user.nombre} {user.apellido}</p>
                  <p className="top-count">{user.count} publicaciones</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Distribución por programa */}
      {estadisticas?.distribucionProgramas && (
        <section className="stats-section">
          <h2 className="section-title">Distribución por Programa</h2>
          <div className="distribution-list">
            {estadisticas.distribucionProgramas.slice(0, 5).map((programa: any) => (
              <div key={programa._id} className="distribution-item">
                <p className="distribution-label">{programa._id}</p>
                <div className="distribution-bar">
                  <div
                    className="distribution-fill"
                    style={{
                      width: `${(programa.count / estadisticas.distribucionProgramas[0].count) * 100}%`
                    }}
                  ></div>
                </div>
                <p className="distribution-count">{programa.count}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};