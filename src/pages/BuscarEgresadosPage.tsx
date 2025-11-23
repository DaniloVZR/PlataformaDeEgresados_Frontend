import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconSearch, IconFilter, IconArrowLeft, IconUser, IconX } from "@tabler/icons-react";
import { buscarEgresados, obtenerProgramas, obtenerAnios, type Egresado } from "../services/egresado";
import "../styles/pages/BuscarEgresados.css";

const BuscarEgresadosPage: React.FC = () => {
  const navigate = useNavigate();

  const [egresados, setEgresados] = useState<Egresado[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [programaFiltro, setProgramaFiltro] = useState("");
  const [anioFiltro, setAnioFiltro] = useState("");
  const [programasDisponibles, setProgramasDisponibles] = useState<string[]>([]);
  const [aniosDisponibles, setAniosDisponibles] = useState<number[]>([]);

  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Cargar filtros disponibles
  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const [programasData, aniosData] = await Promise.all([
          obtenerProgramas(),
          obtenerAnios()
        ]);

        if (programasData.success) setProgramasDisponibles(programasData.programas);
        if (aniosData.success) setAniosDisponibles(aniosData.years);
      } catch (error) {
        console.error("Error al cargar filtros:", error);
      }
    };
    cargarFiltros();
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      buscar(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, programaFiltro, anioFiltro]);

  const buscar = async (reset = false) => {
    setLoading(true);

    try {
      const currentPage = reset ? 1 : page;
      const data = await buscarEgresados({
        q: searchQuery,
        programa: programaFiltro,
        yearGraduacion: anioFiltro ? parseInt(anioFiltro) : undefined,
        page: currentPage,
        limit: 12
      });

      if (data.success) {
        setEgresados(reset ? data.egresados : [...egresados, ...data.egresados]);
        setPage(currentPage + 1);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setSearchQuery("");
    setProgramaFiltro("");
    setAnioFiltro("");
  };

  const hayFiltrosActivos = searchQuery || programaFiltro || anioFiltro;

  return (
    <div className="buscar-page">
      {/* Header */}
      <header className="buscar-header">
        <div className="header-container">
          <button onClick={() => navigate(-1)} className="btn-back">
            <IconArrowLeft size={24} />
          </button>
          <h1>Buscar Egresados</h1>
        </div>
      </header>

      {/* Barra de búsqueda */}
      <div className="buscar-controls">
        <div className="search-bar">
          <IconSearch size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery("")}>
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
          {hayFiltrosActivos && <span className="filter-badge"></span>}
        </button>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Programa académico</label>
            <select
              value={programaFiltro}
              onChange={(e) => setProgramaFiltro(e.target.value)}
            >
              <option value="">Todos los programas</option>
              {programasDisponibles.map((prog) => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Año de graduación</label>
            <select
              value={anioFiltro}
              onChange={(e) => setAnioFiltro(e.target.value)}
            >
              <option value="">Todos los años</option>
              {aniosDisponibles.map((anio) => (
                <option key={anio} value={anio}>{anio}</option>
              ))}
            </select>
          </div>

          {hayFiltrosActivos && (
            <button className="btn-clear-filters" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Resultados */}
      <div className="buscar-results">
        <p className="results-count">
          {total} egresado{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
        </p>

        {egresados.length === 0 && !loading ? (
          <div className="empty-results">
            <IconUser size={48} />
            <h3>No se encontraron egresados</h3>
            <p>Intenta con otros términos de búsqueda o filtros</p>
          </div>
        ) : (
          <div className="egresados-grid">
            {egresados.map((egresado) => (
              <div
                key={egresado._id}
                className="egresado-card"
                onClick={() => navigate(`/perfil/${egresado._id}`)}
              >
                <img
                  src={egresado.fotoPerfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(egresado.nombre + " " + egresado.apellido)}&background=7a3e9d&color=fff`}
                  alt={egresado.nombre}
                  className="egresado-avatar"
                />
                <div className="egresado-info">
                  <h3>{egresado.nombre} {egresado.apellido}</h3>
                  <p className="egresado-programa">{egresado.programaAcademico}</p>
                  <p className="egresado-anio">Graduación: {egresado.yearGraduacion}</p>
                </div>
                {egresado.descripcion && (
                  <p className="egresado-descripcion">
                    {egresado.descripcion.length > 80
                      ? egresado.descripcion.substring(0, 80) + "..."
                      : egresado.descripcion}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cargar más */}
        {page <= totalPages && egresados.length > 0 && (
          <button
            className="btn-load-more"
            onClick={() => buscar()}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Ver más egresados"}
          </button>
        )}

        {loading && egresados.length === 0 && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Buscando egresados...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscarEgresadosPage;