// services/apiClient.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 1. Obtenemos la URL base de la API desde las variables de entorno.
const baseURL = process.env.EXPO_PUBLIC_API_URL;

// 2. Creamos una instancia de Axios con la configuración base.
const apiClient = axios.create({
  baseURL: `${baseURL}/api`, // Apuntamos directamente a la base de la API
});

// 3. Usamos un "interceptor" para modificar todas las peticiones antes de que se envíen.
// Esto nos permite añadir el token de autenticación de forma automática.
apiClient.interceptors.request.use(
  async (config) => {
    // Obtenemos el token guardado en el dispositivo.
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      // Si el token existe, lo añadimos a la cabecera 'Authorization'.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Devolvemos la configuración modificada.
  },
  (error) => {
    // Manejamos cualquier error que ocurra al configurar la petición.
    return Promise.reject(error);
  }
);

export default apiClient;