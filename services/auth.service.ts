import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import apiClient from './apiClient';

// Se define la URL base para las llamadas de autenticación.
// Usamos axios directamente aquí para tener control total sobre los tokens temporales.
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/auth`;

// --- Interfaces para tipar las respuestas ---
interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
}

interface VerifyOtpResponse {
  success: boolean;
  error?: string;
  resetToken?: string;
}

// --- Función de Login ---
const login = async (email, password): Promise<AuthResponse> => {
  try {
    // Llamamos a la API directamente con axios.
    const response = await axios.post(`${API_URL}/login`, { email, password });
    // Si la respuesta contiene un token, lo guardamos y devolvemos éxito.
    if (response.data?.token) {
      // Guardamos el token en SecureStore para uso posterior.
      await SecureStore.setItemAsync('userToken', response.data.token);
      return { success: true, token: response.data.token };
    }
    // Si la respuesta no tiene un token, es un error inesperado.
    return { success: false, error: 'Respuesta inesperada del servidor.' };
  } catch (error) {
    // Manejo de errores profesional: verificamos si es un error de Axios.
    // Si es un error de Axios, devolvemos el mensaje de error del servidor.
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error de conexión.';
    return { success: false, error: errorMessage };
  }
};

// --- Función de Registro Completo ---
const register = async (userData): Promise<AuthResponse> => {
    try {
        await axios.post(`${API_URL}/register`, userData);
        return { success: true };
    } catch (error) {
        const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al registrar la cuenta.';
        return { success: false, error: errorMessage };
    }
};

// --- Función para Solicitar Recuperación de Contraseña ---
const forgotPassword = async (email: string): Promise<AuthResponse> => {
  try {
    await axios.post(`${API_URL}/forgot-password`, { email });
    return { success: true };
  } catch (error) {
    // No devolvemos el error real por seguridad
    return { success: false, error: 'Ocurrió un error.' };
  }
};

// --- Función para Verificar el Código OTP ---
const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    if (response.data?.resetToken) {
      return { success: true, resetToken: response.data.resetToken };
    }
    return { success: false, error: 'Respuesta inesperada del servidor.' };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al verificar el código.';
    return { success: false, error: errorMessage };
  }
};

// --- Función para Resetear la Contraseña ---
const resetPassword = async (password: string, resetToken: string): Promise<AuthResponse> => {
  try {
    await axios.post(`${API_URL}/reset-password`, { password }, {
      headers: { Authorization: `Bearer ${resetToken}` },
    });
    return { success: true };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al cambiar la contraseña.';
    return { success: false, error: errorMessage };
  }
};

// --- Función de Logout ---
const logout = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('userToken');
  } catch (error) {
    console.error('Error durante el logout en el servicio:', error);
  }
};

// --- Función de Verificación de Cuenta ---
const verifyAccount = async (token: string): Promise<AuthResponse> => {
    try {
        await axios.post(`${API_URL}/verify-account`, { token });
        return { success: true };
    } catch (error) {
        const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error de conexión.';
        return { success: false, error: errorMessage };
    }
};

const refreshToken = async (): Promise<{ success: boolean; token?: string; error?: string }> => {
  try {
    // 1. Usamos apiClient porque esta acción REQUIERE que el usuario ya tenga una sesión activa.
    //    apiClient añade automáticamente el token de autorización a la cabecera.
    const response = await apiClient.post('/auth/refresh-token');

    if (response.data?.token) {
      return { success: true, token: response.data.token };
    }
    // Si la respuesta no tiene un token, es un error inesperado.
    return { success: false, error: 'Respuesta inválida del servidor al refrescar el token.' };

  } catch (error) {
    // 2. Implementamos el mismo manejo de errores profesional que en las otras funciones.
    const errorMessage = axios.isAxiosError(error) 
      ? error.response?.data?.message || 'No se pudo refrescar la sesión.'
      : 'Ocurrió un error inesperado.';
    return { success: false, error: errorMessage };
  }
};

export const AuthService = {
  login,
  register,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logout,
  verifyAccount,
  refreshToken,
};