/**
 * Servicio para todas las operaciones relacionadas con reservas
 */
import { API_BASE, fetchAPI } from './api.js';
import { fechaHoraAISO, extraerFechaHora } from '../utils/dateFormatter.js';

const API_URL = `${API_BASE}/api/reservas`;

/**
 * Obtiene todas las reservas con filtros opcionales
 * @param {Object} filtros - Filtros de búsqueda {nombre, fecha, estado}
 * @returns {Promise<Array>} - Lista de reservas
 */
export async function obtenerReservas(filtros = {}) {
  const query = new URLSearchParams();
  if (filtros.nombre) query.append('nombre', filtros.nombre);
  if (filtros.fecha) query.append('fecha', filtros.fecha);
  if (filtros.estado) query.append('estado', filtros.estado);

  const url = query.toString() ? `${API_URL}?${query}` : API_URL;
  
  const data = await fetchAPI(url);
  return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
}

/**
 * Crea una nueva reserva
 * @param {Object} reserva - Datos de la reserva
 * @returns {Promise<Object>} - Reserva creada o entrada de waitlist (con propiedad waitlist: true si es waitlist)
 */
export async function crearReserva(reserva) {
  // Convertir fecha y hora separadas a ISO si es necesario
  let fechaISO = reserva.fecha;
  if (reserva.fecha && reserva.hora && !reserva.fecha.includes('T')) {
    fechaISO = fechaHoraAISO(reserva.fecha, reserva.hora);
  }

  const payload = {
    ...reserva,
    fecha: fechaISO,
  };

  const data = await fetchAPI(API_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // Preservar propiedades especiales de la respuesta completa
  const result = data?.data ?? data;
  if (data?.waitlist === true) {
    result.waitlist = true;
  }
  if (data?.mesaSugerida) {
    result.mesaSugerida = data.mesaSugerida;
  }
  if (data?.modoManual === true) {
    result.modoManual = true;
  }

  return result;
}

/**
 * Actualiza una reserva existente
 * @param {number} id - ID de la reserva
 * @param {Object} reserva - Datos actualizados
 * @returns {Promise<Object>} - Reserva actualizada
 */
export async function actualizarReserva(id, reserva) {
  // Convertir fecha y hora separadas a ISO si es necesario
  let fechaISO = reserva.fecha;
  if (reserva.fecha && reserva.hora && !reserva.fecha.includes('T')) {
    fechaISO = fechaHoraAISO(reserva.fecha, reserva.hora);
  }

  const payload = {
    nombreCliente: reserva.nombreCliente,
    telefono: reserva.telefono,
    email: reserva.email,
    fecha: fechaISO,
    hora: reserva.hora, // Mantener hora por compatibilidad
    numPersonas: reserva.numPersonas,
    notas: reserva.notas,
    mesaId: reserva.mesaId !== undefined ? reserva.mesaId : undefined, // Incluir mesaId si está presente
  };

  const data = await fetchAPI(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return data?.data ?? data;
}

/**
 * Cambia el estado de una reserva
 * @param {number} id - ID de la reserva
 * @param {string} estado - Nuevo estado
 * @returns {Promise<Object>} - Reserva actualizada
 */
export async function cambiarEstadoReserva(id, estado) {
  const data = await fetchAPI(`${API_URL}/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  });

  return data?.data ?? data;
}

/**
 * Elimina una reserva
 * @param {number} id - ID de la reserva
 * @returns {Promise<void>}
 */
export async function eliminarReserva(id) {
  await fetchAPI(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Obtiene una reserva por ID
 * @param {number} id - ID de la reserva
 * @returns {Promise<Object>} - Reserva encontrada
 */
export async function obtenerReservaPorId(id) {
  const data = await fetchAPI(`${API_URL}/${id}`);
  return data?.data ?? data;
}

/**
 * Asigna una mesa a una reserva
 * @param {number} reservaId - ID de la reserva
 * @param {number} mesaId - ID de la mesa a asignar
 * @returns {Promise<Object>} - Reserva actualizada
 */
export async function asignarMesaAReserva(reservaId, mesaId) {
  // Primero obtener la reserva actual para preservar sus datos
  const reserva = await obtenerReservaPorId(reservaId);
  
  // Extraer fecha y hora si es necesario
  const { fecha, hora } = extraerFechaHora(reserva.fecha);
  
  // Actualizar solo el mesaId, preservando todos los demás datos
  return await actualizarReserva(reservaId, {
    nombreCliente: reserva.nombreCliente,
    telefono: reserva.telefono || '',
    email: reserva.email || '',
    fecha: fecha,
    hora: hora,
    numPersonas: reserva.numPersonas,
    notas: reserva.notas || '',
    mesaId: mesaId, // Asignar la mesa
  });
}

