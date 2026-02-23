/**
 * Servicio para operaciones relacionadas con el dashboard
 */
import { API_BASE, fetchAPI } from './api.js';

const API_URL = `${API_BASE}/api/dashboard`;

/**
 * Obtiene las métricas del dashboard
 * @returns {Promise<Object>} - Métricas del dashboard
 */
export async function obtenerMetricasDashboard() {
  const data = await fetchAPI(`${API_URL}/metrics`);
  return data?.data ?? data;
}
