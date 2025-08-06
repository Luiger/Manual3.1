import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
// ✅ 1. Importa los componentes necesarios para la UI
import { View, StyleSheet } from 'react-native'; 
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import apiClient from '../services/apiClient';
import { jwtDecode } from 'jwt-decode';
import CustomAlertModal from '../components/CustomAlertModal'; // Importa tu modal
import Colors from '../constants/Colors';

interface User {
  Nombre: string;
  Apellido: string;
  Email: string;
  Rol: string;
  Telefono?: string;
  Institucion?: string;
  Cargo?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isSessionLoading: boolean;
  isLoginLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ visible: false, title: '', message: '', onConfirm: () => {} });

  // 1. El useRef AHORA ESTÁ DENTRO del componente, como debe ser.
  const sessionTimer = useRef<NodeJS.Timeout | null>(null);

  // 2. La función logout se define primero y se envuelve en useCallback para estabilidad.
  const logout = useCallback(async () => {
    if (sessionTimer.current) {
      clearTimeout(sessionTimer.current);
    }
    await AuthService.logout();
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync('userToken');
  }, []);

  // 3. La función setupSessionTimer AHORA ESTÁ DENTRO y puede "ver" a logout.
  const setupSessionTimer = useCallback((jwtToken: string) => {
    if (sessionTimer.current) {
      clearTimeout(sessionTimer.current);
    }
    const decodedToken: { exp: number } = jwtDecode(jwtToken);
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    const timeoutDuration = expirationTime - currentTime;

    if (timeoutDuration > 0) {
      console.log(`Sesión configurada para expirar en ${Math.round(timeoutDuration / 60000)} minutos.`);
      sessionTimer.current = setTimeout(() => {
        setModalConfig({
            visible: true,
            title: 'Sesión Expirada',
            message: 'Tu sesión ha finalizado por seguridad. Por favor, inicia sesión de nuevo.',
            onConfirm: () => {
                setModalConfig(prev => ({ ...prev, visible: false }));
                logout();
            }
        });
      }, timeoutDuration);
    } else {
      logout();
    }
  }, [logout]); // Depende de la función logout

  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setupSessionTimer(storedToken);
          const response = await UserService.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          }
        }
      } catch (e) {
        console.error('Error al cargar datos de sesión:', e);
        await logout(); // Si hay error, cerramos sesión
      } finally {
        setIsSessionLoading(false);
      }
    }
    loadUserFromStorage();

    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, setupSessionTimer]);

  const login = async (email: string, password: string) => {
    setIsLoginLoading(true);
    try {
      const response = await AuthService.login(email, password);
      if (!response.success || !response.token) { throw new Error(response.error); }
      const newToken = response.token;
      setToken(newToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      const profileResponse = await UserService.getProfile();
      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data);
      }
      await SecureStore.setItemAsync('userToken', newToken);
      setupSessionTimer(newToken);
      return { success: true };
    } catch (error: any) {
      await logout();
      return { success: false, error: error.message };
    } finally {
      setIsLoginLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await UserService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (e) {
      console.error('Error al refrescar el perfil del usuario:', e);
    }
};

  return (
    <AuthContext.Provider value={{ user, token, isSessionLoading, isLoginLoading, login, logout, refreshUser }}>
      <>
        {children}

        {modalConfig.visible && <View style={styles.overlay} />}
        <CustomAlertModal
          visible={modalConfig.visible}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText="OK"
          onConfirm={modalConfig.onConfirm}
          onCancel={modalConfig.onConfirm} // OK cierra y desloguea
        />
      </>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 1000, // zIndex alto para que esté por encima de todo
    },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};