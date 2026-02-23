import { API_BASE, fetchAPI } from './api.js';

/**
 * Obtiene la configuración del restaurante
 * @returns {Promise<Object>} - Configuración del restaurante
 */
export async function getConfig() {
  return fetchAPI(`${API_BASE}/api/config`);
}

/**
 * Actualiza la configuración del restaurante
 * @param {Object} data - Datos de configuración a actualizar
 * @returns {Promise<Object>} - Configuración actualizada
 */
export async function updateConfig(data) {
  return fetchAPI(`${API_BASE}/api/config`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
