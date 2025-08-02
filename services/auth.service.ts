import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Se define la URL base para las llamadas de autenticación.
// Usamos axios directamente aquí para tener control total sobre los tokens temporales.
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/auth`;

// --- Interfaces para tipar las respuestas ---
interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
}

interface RegisterCredentialsResponse {
  success: boolean;
  error?: string;
  tempToken?: string;
}

interface VerifyOtpResponse {
  success: boolean;
  error?: string;
  resetToken?: string;
}

// --- Función de Login ---
const login = async (email, password): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data?.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
      return { success: true, token: response.data.token };
    }
    return { success: false, error: 'Respuesta inesperada del servidor.' };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error de conexión.';
    return { success: false, error: errorMessage };
  }
};

// --- Función de Registro (Paso 1) ---
const registerCredentials = async (email, password): Promise<RegisterCredentialsResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register/credentials`, { email, password });
    if (response.data?.tempToken) {
      return { success: true, tempToken: response.data.tempToken };
    }
    return { success: false, error: 'No se recibió un token temporal del servidor.' };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al registrar credenciales.';
    return { success: false, error: errorMessage };
  }
};

// --- Función de Registro (Paso 2) ---
const registerProfile = async (profileData, tempToken): Promise<AuthResponse> => {
  try {
    await axios.post(`${API_URL}/register/profile`, profileData, {
      headers: { Authorization: `Bearer ${tempToken}` },
    });
    return { success: true };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al registrar el perfil.';
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

export const AuthService = {
  login,
  registerCredentials,
  registerProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logout,
  verifyAccount,
};