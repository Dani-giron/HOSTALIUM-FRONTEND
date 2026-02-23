/**
 * Utilidades para formatear fechas en formato UTC
 * Todas las funciones trabajan con UTC para evitar problemas de zona horaria
 */

/**
 * Extrae fecha (YYYY-MM-DD) y hora (HH:MM) de un objeto Date o string ISO
 * @param {Date|string} fechaISO - Fecha en formato ISO o Date object
 * @returns {{fecha: string, hora: string}} - Objeto con fecha y hora separadas
 */
export function extraerFechaHora(fechaISO) {
  const fecha = new Date(fechaISO);
  const fechaStr = fecha.getUTCFullYear() + '-' + 
    String(fecha.getUTCMonth() + 1).padStart(2, '0') + '-' + 
    String(fecha.getUTCDate()).padStart(2, '0');
  const horaStr = String(fecha.getUTCHours()).padStart(2, '0') + ':' + 
    String(fecha.getUTCMinutes()).padStart(2, '0');
  
  return { fecha: fechaStr, hora: horaStr };
}

/**
 * Formatea una fecha ISO a formato legible corto (DD/MM/YYYY HH:MM)
 * @param {Date|string} fechaISO - Fecha en formato ISO o Date object
 * @returns {string} - Fecha formateada
 */
export function formatearFechaCorta(fechaISO) {
  if (!fechaISO) return '—';
  
  // Si ya es un string vacío, devolver '—'
  if (typeof fechaISO === 'string' && fechaISO.trim() === '') return '—';
  
  // Intentar parsear la fecha
  let fecha;
  if (fechaISO instanceof Date) {
    fecha = fechaISO;
  } else if (typeof fechaISO === 'string') {
    // Si es un string ISO, crear Date directamente
    fecha = new Date(fechaISO);
  } else {
    // Si es otro tipo, intentar convertir a string primero
    fecha = new Date(String(fechaISO));
  }
  
  // Validar que la fecha es válida
  if (isNaN(fecha.getTime())) {
    console.warn('formatearFechaCorta: Fecha inválida:', fechaISO);
    return '—';
  }
  
  const year = fecha.getUTCFullYear();
  const month = String(fecha.getUTCMonth() + 1).padStart(2, '0');
  const day = String(fecha.getUTCDate()).padStart(2, '0');
  const hours = String(fecha.getUTCHours()).padStart(2, '0');
  const minutes = String(fecha.getUTCMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Formatea una fecha ISO a formato legible largo con día de la semana
 * @param {Date|string} fechaISO - Fecha en formato ISO o Date object
 * @returns {string} - Fecha formateada (ej: "lunes, 15 de enero de 2024, 22:00")
 */
export function formatearFechaLarga(fechaISO) {
  if (!fechaISO) return '—';
  
  let fechaStr = null;
  
  // Si tenemos fecha y hora separadas, combinarlas
  if (typeof fechaISO === 'object' && !(fechaISO instanceof Date)) {
    // Si es un objeto con fecha y hora separadas (formato del formulario)
    if (fechaISO.fecha && fechaISO.hora && !fechaISO.fecha.includes('T')) {
      fechaStr = `${fechaISO.fecha}T${fechaISO.hora}:00Z`;
    }
    // Si es un objeto con fecha como string ISO (objeto de reserva del backend)
    else if (fechaISO.fecha && typeof fechaISO.fecha === 'string') {
      fechaStr = fechaISO.fecha;
    }
    // Si es un objeto Date
    else if (fechaISO instanceof Date) {
      fechaStr = fechaISO.toISOString();
    } else {
      return '—';
    }
  } else if (typeof fechaISO === 'string') {
    fechaStr = fechaISO;
    // Si no termina en Z y tiene T, agregar Z para forzar UTC
    if (fechaStr.includes('T') && !fechaStr.endsWith('Z') && !fechaStr.match(/[+-]\d{2}:?\d{2}$/)) {
      fechaStr = fechaStr.replace(/\+[\d]{2}:?[\d]{2}$/, '') + 'Z';
    }
  } else if (fechaISO instanceof Date) {
    fechaStr = fechaISO.toISOString();
  } else {
    return '—';
  }
  
  if (!fechaStr) return '—';
  
  // Extraer componentes del string ISO
  const isoMatch = fechaStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):?(\d{2})?/);
  
  if (!isoMatch) return '—';
  
  const year = parseInt(isoMatch[1], 10);
  const month = parseInt(isoMatch[2], 10) - 1; // Los meses van de 0-11
  const day = parseInt(isoMatch[3], 10);
  const hours = parseInt(isoMatch[4], 10);
  const minutes = parseInt(isoMatch[5] || '0', 10);
  
  // Nombres de días y meses en español
  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  // Calcular el día de la semana usando UTC
  const fechaUTC = new Date(Date.UTC(year, month, day));
  const diaSemana = diasSemana[fechaUTC.getUTCDay()];
  const mesNombre = meses[month];
  const horasStr = String(hours).padStart(2, '0');
  const minutosStr = String(minutes).padStart(2, '0');
  
  return `${diaSemana}, ${String(day).padStart(2, '0')} de ${mesNombre} de ${year}, ${horasStr}:${minutosStr}`;
}

/**
 * Formatea una fecha ISO a formato localizado (es-ES)
 * @param {Date|string} fechaISO - Fecha en formato ISO o Date object
 * @returns {string} - Fecha formateada según locale
 */
export function formatearFechaLocalizada(fechaISO) {
  if (!fechaISO) return '—';
  
  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) return '—';
  
  return new Date(
    Date.UTC(
      fecha.getUTCFullYear(),
      fecha.getUTCMonth(),
      fecha.getUTCDate(),
      fecha.getUTCHours(),
      fecha.getUTCMinutes()
    )
  ).toLocaleString("es-ES", {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });
}

/**
 * Crea una fecha UTC a partir de fecha (YYYY-MM-DD) y hora (HH:MM) separadas
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} hora - Hora en formato HH:MM
 * @returns {Date} - Objeto Date en UTC
 */
export function crearFechaUTC(fecha, hora) {
  const [year, month, day] = fecha.split('-').map(Number);
  const [h, m] = hora.split(':').map(Number);
  
  return new Date(Date.UTC(year, month - 1, day, h || 0, m || 0, 0));
}

/**
 * Convierte fecha y hora separadas a string ISO
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} hora - Hora en formato HH:MM
 * @returns {string} - String ISO en UTC
 */
export function fechaHoraAISO(fecha, hora) {
  return crearFechaUTC(fecha, hora).toISOString();
}

/**
 * Formatea solo la hora (HH:MM) de una fecha ISO usando UTC
 * Esta función debe usarse siempre para mostrar horas de reservas para evitar problemas de zona horaria
 * @param {Date|string} fechaISO - Fecha en formato ISO o Date object
 * @returns {string} - Hora formateada en formato HH:MM (UTC)
 */
export function formatearHora(fechaISO) {
  if (!fechaISO) return '—';
  
  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) return '—';
  
  // Usar UTC para evitar conversión de zona horaria
  const horas = String(fecha.getUTCHours()).padStart(2, '0');
  const minutos = String(fecha.getUTCMinutes()).padStart(2, '0');
  
  return `${horas}:${minutos}`;
}
