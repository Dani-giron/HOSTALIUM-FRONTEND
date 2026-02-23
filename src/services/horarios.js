import { API_BASE, fetchAPI } from './api.js';

/**
 * Obtiene todos los horarios del restaurante
 * @returns {Promise<Object>} - Lista de horarios
 */
export async function getHorarios() {
  return fetchAPI(`${API_BASE}/api/horarios`);
}

/**
 * Crea o reemplaza todos los horarios del restaurante
 * @param {Array} horarios - Array de horarios a crear
 * @returns {Promise<Object>} - Horarios creados
 */
export async function addHorario(horarios) {
  return fetchAPI(`${API_BASE}/api/horarios`, {
    method: 'POST',
    body: JSON.stringify(horarios),
  });
}

/**
 * Actualiza un horario específico
 * @param {number} id - ID del horario
 * @param {Object} data - Datos del horario
 * @returns {Promise<Object>} - Horario actualizado
 */
export async function updateHorario(id, data) {
  return fetchAPI(`${API_BASE}/api/horarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Elimina un horario específico
 * @param {number} id - ID del horario
 * @returns {Promise<Object>} - Respuesta de eliminación
 */
export async function deleteHorario(id) {
  return fetchAPI(`${API_BASE}/api/horarios/${id}`, {
    method: 'DELETE',
  });
}
