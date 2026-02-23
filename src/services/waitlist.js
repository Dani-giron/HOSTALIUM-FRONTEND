/**
 * Servicio para todas las operaciones relacionadas con waitlist
 */
import { API_BASE, fetchAPI } from './api.js';

const API_URL = `${API_BASE}/api/waitlist`;

/**
 * Obtiene todas las entradas de waitlist
 * @returns {Promise<Array>} - Lista de entradas de waitlist
 */
export async function obtenerWaitlist() {
  const data = await fetchAPI(API_URL);
  return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
}

/**
 * Crea una nueva entrada en waitlist
 * @param {Object} waitlistEntry - Datos de la entrada
 * @returns {Promise<Object>} - Entrada creada
 */
export async function crearWaitlistEntry(waitlistEntry) {
  const data = await fetchAPI(API_URL, {
    method: 'POST',
    body: JSON.stringify(waitlistEntry),
  });

  return data?.data ?? data;
}

/**
 * Actualiza una entrada de waitlist
 * @param {number} id - ID de la entrada
 * @param {Object} waitlistEntry - Datos actualizados
 * @returns {Promise<Object>} - Entrada actualizada
 */
export async function actualizarWaitlistEntry(id, waitlistEntry) {
  const data = await fetchAPI(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(waitlistEntry),
  });

  return data?.data ?? data;
}
/**
 * Elimina una entrada de waitlist
 * @param {number} id - ID de la entrada
 * @returns {Promise<void>}
 */
export async function eliminarWaitlistEntry(id) {
  await fetchAPI(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
}


