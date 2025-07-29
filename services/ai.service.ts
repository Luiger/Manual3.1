import apiClient from './apiClient';
import axios from 'axios';

interface BotResponse {
  success: boolean;
  reply?: string;
  error?: string;
}

/**
 * Envía un mensaje al backend para que lo procese Dialogflow CX.
 * @param {string} message - El mensaje del usuario.
 * @param {string} sessionId - El ID único de la conversación.
 * @returns {Promise<BotResponse>} - La respuesta del bot.
 */
const detectIntent = async (message: string, sessionId: string): Promise<BotResponse> => {
  try {
    const response = await apiClient.post('/ai/detectIntent', { message, sessionId });
    if (response.data && response.data.reply) {
      return { success: true, reply: response.data.reply };
    }
    return { success: false, error: 'Respuesta inesperada del servidor.' };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) 
      ? error.response?.data?.error || 'Error de conexión.'
      : 'Ocurrió un error inesperado.';
    return { success: false, error: errorMessage };
  }
};

export const AIService = {
  detectIntent,
};