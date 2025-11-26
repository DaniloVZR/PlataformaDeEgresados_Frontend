import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// Notificaciones simples con React Hot Toast
export const notify = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};

export const alerts = {
  // Confirmación simple
  confirm: async (options: {
    title: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Confirmar',
      cancelButtonText: options.cancelButtonText || 'Cancelar',
      confirmButtonColor: '#7a3e9d',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    });
    return result.isConfirmed;
  },

  // Confirmación de eliminación
  confirmDelete: async (itemName: string = 'este elemento') => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará ${itemName} permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    });
    return result.isConfirmed;
  },

  // Prompt para texto
  prompt: async (options: {
    title: string;
    text?: string;
    placeholder?: string;
    inputType?: 'text' | 'textarea';
  }) => {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      input: options.inputType === 'textarea' ? 'textarea' : 'text',
      inputPlaceholder: options.placeholder,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#7a3e9d',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      inputValidator: (value: any) => {
        if (!value && options.inputType !== 'textarea') {
          return 'Este campo es requerido';
        }
        return null;
      },
    });

    return result.isConfirmed ? result.value : null;
  },

  // Alerta de información
  info: (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#7a3e9d',
    });
  },

  // Alerta de éxito
  success: (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#10b981',
      timer: 2000,
      timerProgressBar: true,
    });
  },

  // Alerta de error
  error: (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#dc2626',
    });
  },
};