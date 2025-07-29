// services/form.service.ts
import apiClient from './apiClient'; // <-- IMPORTAMOS EL NUEVO CLIENTE
import axios from 'axios';

interface FormSubmitResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface StatusCheckResponse {
  hasSubmitted: boolean;
}

const submitManualContrataciones = async (formData) => {
  try {
    // La autenticación es automática. ¡No más código de token aquí!
    const response = await apiClient.post('/manuales/submit', formData);
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al enviar el formulario.';
    return { success: false, error: errorMessage };
  }
};

const checkSubmissionStatus = async () => {
  try {
    const response = await apiClient.get('/manuales/status');
    return response.data;
  } catch (error) {
    console.error('Error checking submission status:', error);
    return { hasSubmitted: false };
  }
};

const submitManualExpress = async (formData) => {
  try {
    const response = await apiClient.post('/manuales/express/submit', formData);
    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error al enviar el formulario.';
    return { success: false, error: errorMessage };
  }
};

// ✅ Añade 'isRestrictionActive' a la interfaz
interface StatusCheckResponse {
  hasSubmitted: boolean;
  isRestrictionActive: boolean;
}

const checkExpressSubmissionStatus = async (): Promise<StatusCheckResponse> => {
  try {
    const response = await apiClient.get('/manuales/express/status');
    return response.data;
  } catch (error) {
    console.error('Error checking express submission status:', error);
    // Por seguridad, si falla la llamada, asumimos que la restricción está activa y no ha enviado.
    return { hasSubmitted: false, isRestrictionActive: true };
  }
};

export const FormService = {
  submitManualContrataciones,
  checkSubmissionStatus,
  submitManualExpress, 
  checkExpressSubmissionStatus, 
};