// src/store/EgresadoStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { obtenerPerfil } from "../services/perfil";

interface RedesSociales {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
}

interface Egresado {
  _id: string;
  usuario: string;
  nombre: string;
  apellido: string;
  email: string;
  descripcion: string;
  programaAcademico: string;
  yearGraduacion: number;
  redesSociales: RedesSociales;
  fotoPerfil: string;
  completadoPerfil: boolean;
  actualizadoEn: string;
  createdAt: string;
  updatedAt: string;
}

interface EgresadoState {
  egresado: Egresado | null;
  loading: boolean;
  error: string | null;
  cargarPerfil: () => Promise<void>;
  actualizarPerfilLocal: (egresado: Egresado) => void;
  actualizarFotoLocal: (fotoPerfil: string) => void;
  limpiarPerfil: () => void;
}

export const useEgresadoStore = create<EgresadoState>()(
  devtools(
    persist(
      (set) => ({
        egresado: null,
        loading: false,
        error: null,

        cargarPerfil: async () => {
          set({ loading: true, error: null });

          try {
            const data = await obtenerPerfil();

            if (data.success) {
              set({
                egresado: data.egresado,
                loading: false,
                error: null,
              });
            } else {
              set({
                error: data.msg || "Error al cargar perfil",
                loading: false,
              });
            }
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Error de conexión",
              loading: false,
            });
          }
        },

        actualizarPerfilLocal: (egresado: Egresado) => {
          set({ egresado });
        },

        actualizarFotoLocal: (fotoPerfil: string) => {
          set((state) => ({
            egresado: state.egresado
              ? { ...state.egresado, fotoPerfil }
              : null,
          }));
        },

        limpiarPerfil: () => {
          set({
            egresado: null,
            loading: false,
            error: null,
          });
        },
      }),
      {
        name: "egresado-storage",
        partialize: (state) => ({
          egresado: state.egresado,
        }),
      }
    )
  )
);