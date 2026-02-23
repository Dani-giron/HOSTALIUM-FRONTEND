/**
 * Utilidades de validación reutilizables
 */

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export function validarEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida un teléfono (mínimo 6 caracteres)
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} - true si es válido
 */
export function validarTelefono(telefono) {
  if (!telefono) return false;
  return String(telefono).trim().length >= 6;
}

/**
 * Valida que al menos uno de teléfono o email esté presente y sea válido
 * @param {string} telefono - Teléfono a validar
 * @param {string} email - Email a validar
 * @returns {boolean} - true si al menos uno es válido
 */
export function validarContacto(telefono, email) {
  return validarTelefono(telefono) || validarEmail(email);
}

/**
 * Valida que una fecha no sea en el pasado
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} hora - Hora en formato HH:MM
 * @returns {boolean} - true si la fecha/hora es futura
 */
export function validarFechaFutura(fecha, hora) {
  if (!fecha || !hora) return false;
  
  const [h, m] = hora.split(':');
  const [year, month, day] = fecha.split('-');
  const fechaHoraUTC = new Date(Date.UTC(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(h || '00', 10),
    parseInt(m || '00', 10),
    0
  ));
  
  const ahora = new Date();
  return fechaHoraUTC > ahora;
}

