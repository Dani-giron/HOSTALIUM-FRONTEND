/**
 * Configuración base para llamadas API
 */
import { API_URL as VITE_API_URL } from '../config/api.js';

// Normalizar la URL (eliminar barra final si existe)
const BASE = VITE_API_URL ? VITE_API_URL.replace(/\/$/, '') : '';
export const API_BASE = BASE;

/**
 * Obtiene los headers de autenticación
 * @returns {Object} - Headers con token si existe
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Realiza una petición fetch con manejo de errores
 * @param {string} url - URL completa
 * @param {Object} options - Opciones de fetch
 * @returns {Promise<Object>} - Respuesta parseada
 */
export async function fetchAPI(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = 
      data?.errores?.[0]?.mensaje ||
      data?.error ||
      `Error del servidor: ${response.status}`;
    
    throw new Error(errorMessage);
  }

  return data;
}

