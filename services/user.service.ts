// services/user.service.ts
import apiClient from './apiClient'; // <-- IMPORTAMOS EL NUEVO CLIENTE
import axios from 'axios';

// Define una interfaz para los datos del perfil que vienen del backend
interface ProfileData {
  Nombre: string;
  Apellido: string;
  Telefono: string;
  Institucion: string;
  Cargo: string;
  Email: string;
  Rol: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    error?: string;
    data?: any;
}

// --- Obtener Perfil ---
const getProfile = async () => {
  try {
    // La cabecera de autenticación se añade automáticamente.
    const response = await apiClient.get('/user/profile');
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al obtener el perfil.';
    return { success: false, error: errorMessage };
  }
};

// --- Actualizar Perfil ---
const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al actualizar el perfil.';
    return { success: false, error: errorMessage };
  }
};

// --- Verificar Contraseña Actual ---
const verifyPassword = async (currentPassword) => {
  try {
    const response = await apiClient.post('/user/password/verify', { currentPassword });
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'La contraseña es incorrecta.';
    return { success: false, error: errorMessage };
  }
};

// --- Cambiar Contraseña ---
const changePassword = async (newPassword) => {
  try {
    const response = await apiClient.put('/user/password/change', { newPassword });
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al cambiar la contraseña.';
    return { success: false, error: errorMessage };
  }
};

// Función para obtener todos los usuarios (solo para admins)
const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/user/admin/users');
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al obtener todos los usuarios';
    return { success: false, error: errorMessage };
  }
};

// Función para actualizar el rol de un usuario (solo para admins)
const updateUserRole = async (email: string, newRole: string) => {
  try {
    const response = await apiClient.put('/user/admin/role', { email, newRole });
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al actualizar el rol de un usuario';
    return { success: false, error: errorMessage };
  }
};

export const UserService = {
  getProfile,
  updateProfile,
  verifyPassword,
  changePassword,
  getAllUsers,
  updateUserRole,
};