import React, { useEffect, useState } from "react";
import "../Styles/pages/Profile.css";
import defaultAvatar from "../Assets/defaultAvatar.jpg";
import { Link } from "react-router-dom";

export const ProfilePage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulación de carga de datos del usuario
    try {
      const data = {
        nombre: "Harold Quiroz",
        descripcion: "Amo los aviones",
        correo: "harold.quiroz@pascualbravo.edu.co",
        programa: "Aeronautica",
        añoGraduacion: 2022,
        redes: {
          linkedin: "https://linkedin.com/in/Harold-Quiroz",
          github: "https://github.com/HQuiroz",
        },
        foto: "",
      };
      setUserData(data);
    } catch (err) {
      setError("Error al cargar la información del perfil");
    }
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!userData) {
    return <div className="loading-message">Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={userData.foto || defaultAvatar}
          alt="Foto de perfil"
          className="profile-avatar"
        />
        <h2 className="profile-name">{userData.nombre}</h2>
        <p className="profile-description">{userData.descripcion}</p>

        <div className="profile-info">
          <p><strong>Correo institucional:</strong> {userData.correo}</p>
          <p><strong>Programa académico:</strong> {userData.programa}</p>
          <p><strong>Año de graduación:</strong> {userData.añoGraduacion}</p>
        </div>

        <div className="profile-socials">
          <a href={userData.redes.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={userData.redes.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>

        <Link to="/editar-perfil">
          <button className="edit-button">Editar Perfil</button>
        </Link>
      </div>
    </div>
  );
};

