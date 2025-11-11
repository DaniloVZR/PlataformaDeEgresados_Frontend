import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { obtenerPublicaciones, toggleLike, eliminarPublicacion } from "../services/publicacion";

export interface Publicacion {
  _id: string;
  autor: {
    _id: string;
    nombre: string;
    apellido: string;
    fotoPerfil: string;
    programaAcademico: string;
    yearGraduacion: number;
  };
  descripcion: string;
  imagen: string;
  likes: string[]; // Array de IDs de usuarios
  createdAt: string;
  updatedAt: string;
}

interface PublicacionState {
  publicaciones: Publicacion[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  hasMore: boolean;
  cargarPublicaciones: (reset?: boolean) => Promise<void>;
  darLike: (publicacionId: string) => Promise<void>;
  eliminarPublicacion: (publicacionId: string) => Promise<void>;
  agregarPublicacion: (publicacion: Publicacion) => void;
  resetState: () => void;
}

export const usePublicacionStore = create<PublicacionState>()(
  devtools(
    (set, get) => ({
      publicaciones: [],
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
      hasMore: true,

      cargarPublicaciones: async (reset = false) => {
        const state = get();

        if (state.loading) return;
        if (!reset && !state.hasMore) return;

        set({ loading: true, error: null });

        try {
          const currentPage = reset ? 1 : state.page;
          const data = await obtenerPublicaciones(currentPage, 10);

          if (data.success) {
            set({
              publicaciones: reset
                ? data.publicaciones
                : [...state.publicaciones, ...data.publicaciones],
              page: currentPage + 1,
              totalPages: data.totalPages,
              hasMore: currentPage < data.totalPages,
              loading: false,
            });
          } else {
            set({
              error: data.msg || "Error al cargar publicaciones",
              loading: false
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error de conexión",
            loading: false
          });
        }
      },

      darLike: async (publicacionId: string) => {
        try {
          const data = await toggleLike(publicacionId);

          if (data.success) {
            // Actualizar el estado localmente basado en la respuesta del backend
            set((state) => ({
              publicaciones: state.publicaciones.map((pub) =>
                pub._id === publicacionId
                  ? {
                    ...pub,
                    // El backend debe devolver el array actualizado de likes
                    likes: data.liked
                      ? [...pub.likes, data.userId || "temp-id"]
                      : pub.likes.filter(id => id !== (data.userId || "temp-id"))
                  }
                  : pub
              ),
            }));
          }
        } catch (error) {
          console.error("Error al dar like:", error);
          throw error;
        }
      },

      eliminarPublicacion: async (publicacionId: string) => {
        try {
          const data = await eliminarPublicacion(publicacionId);

          if (data.success) {
            set((state) => ({
              publicaciones: state.publicaciones.filter(
                (pub) => pub._id !== publicacionId
              ),
            }));
          }
        } catch (error) {
          console.error("Error al eliminar publicación:", error);
          throw error;
        }
      },

      agregarPublicacion: (publicacion: Publicacion) => {
        set((state) => ({
          publicaciones: [publicacion, ...state.publicaciones],
        }));
      },

      resetState: () => {
        set({
          publicaciones: [],
          loading: false,
          error: null,
          page: 1,
          totalPages: 1,
          hasMore: true,
        });
      },
    })
  )
);