import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import apiClient from '../services/apiClient';
import { jwtDecode } from 'jwt-decode';

interface User {
  Nombre: string;
  Apellido: string;
  Email: string;
  Rol: string;
  Telefono?: string;
  Institucion?: string;
  Cargo?: string;
}

// Actualizamos la interfaz del contexto
interface AuthContextData {
  user: User | null;
  token: string | null;
  isSessionLoading: boolean; // Para la carga inicial de la app
  isLoginLoading: boolean;   // Para la acción del botón de login
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Renombramos el estado de carga y añadimos uno nuevo
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          // Decodificamos el token para leer el rol al inicio
          const decodedToken: { email: string; rol: string } = jwtDecode(storedToken);
          setToken(storedToken);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await UserService.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          }
        }
      } catch (e) {
        // Token inválido o expirado, lo limpiamos
        await SecureStore.deleteItemAsync('userToken');
        console.error('Error al cargar datos de sesión:', e);
      } finally {
        // Este 'loading' corresponde a la carga de la sesión
        setIsSessionLoading(false);
      }
    }
    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    // Este 'loading' es solo para la acción de login
    setIsLoginLoading(true);
    try {
      const response = await AuthService.login(email, password);
      if (!response.success || !response.token) {
        throw new Error(response.error || 'Credenciales inválidas.');
      }
      const newToken = response.token;
      // Decodificamos el nuevo token para obtener el rol inmediatamente
      const decodedToken: { email: string; rol: string } = jwtDecode(newToken);
      setToken(newToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      // Actualizamos el usuario con el perfil del servidor
      const profileResponse = await UserService.getProfile();
      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data);
      } else {
        // Creamos un usuario temporal si el perfil falla, pero con el rol del token
        setUser({ Email: decodedToken.email, Rol: decodedToken.rol, Nombre: '', Apellido: '' });
        console.warn('Login exitoso, pero no se pudo obtener el perfil.');
      }
      await SecureStore.setItemAsync('userToken', newToken);
      return { success: true };
    } catch (error: any) {
      await AuthService.logout();
      setUser(null);
      setToken(null);
      return { success: false, error: error.message };
    } finally {
      //  Detenemos el 'loading' de la acción de login
      setIsLoginLoading(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync('userToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, isSessionLoading, isLoginLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};