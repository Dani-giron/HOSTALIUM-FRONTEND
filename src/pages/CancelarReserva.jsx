import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { XCircle, CheckCircle, Loader2, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { formatearFechaLarga, extraerFechaHora } from '../utils/dateFormatter';

const BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export default function CancelarReserva() {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState('inicial'); // 'inicial', 'cargando', 'exito', 'error'
  const [mensaje, setMensaje] = useState('');
  const [reserva, setReserva] = useState(null);
  const [error, setError] = useState(null);
  const procesadoRef = useRef(false);

  useEffect(() => {
    const id = searchParams.get('id');
    const token = searchParams.get('token');

    if (!id || !token) {
      setEstado('error');
      setError('Faltan parámetros requeridos. Por favor, verifica el enlace del email.');
      return;
    }

    // Solo procesar una vez
    if (procesadoRef.current) {
      return;
    }

    procesadoRef.current = true;
    // Llamar al endpoint del backend
    cancelarReserva(id, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const cancelarReserva = async (id, token) => {
    try {
      setEstado('cargando');
      
      console.log(`🔍 [FRONTEND] Cancelando reserva ID: ${id}, Token: ${token.substring(0, 8)}...`);
      
      const response = await fetch(`${BASE}/api/cancelar?id=${id}&token=${token}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log(`🔍 [FRONTEND] Respuesta recibida - Status: ${response.status}, OK: ${response.ok}`);

      const data = await response.json();
      console.log(`🔍 [FRONTEND] Datos recibidos:`, data);

      if (!response.ok) {
        console.error('❌ [FRONTEND] Error del servidor:', data);
        setEstado('error');
        const mensajeError = data.message || data.error || 'Error al cancelar la reserva';
        setError(mensajeError);
        return;
      }

      // Éxito
      console.log('✅ [FRONTEND] Reserva cancelada exitosamente');
      setEstado('exito');
      setMensaje(data.message || 'Reserva cancelada exitosamente');
      setReserva(data.data);
    } catch (err) {
      console.error('❌ [FRONTEND] Error al cancelar reserva:', err);
      setEstado('error');
      setError('Error de conexión. Por favor, intenta de nuevo.');
    }
  };

  // Formatear fecha usando UTC para evitar problemas de zona horaria
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    // Usar formatearFechaLarga que maneja UTC correctamente
    const fechaLarga = formatearFechaLarga(fecha);
    if (fechaLarga === '—') return 'N/A';
    // Extraer solo la parte de la fecha (antes de la última coma que contiene la hora)
    // formatearFechaLarga devuelve: "lunes, 10 de enero de 2026, 13:00"
    // Queremos: "lunes, 10 de enero de 2026"
    const lastCommaIndex = fechaLarga.lastIndexOf(', ');
    if (lastCommaIndex !== -1) {
      return fechaLarga.substring(0, lastCommaIndex);
    }
    return fechaLarga;
  };

  // Formatear hora usando UTC para evitar problemas de zona horaria
  const formatearHora = (fecha) => {
    if (!fecha) return 'N/A';
    // Extraer fecha y hora usando UTC
    const { hora } = extraerFechaHora(fecha);
    return hora || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Estado: Cargando */}
        {estado === 'cargando' && (
          <div className="bg-[#1e1b3d] rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-[#ef4444]/20">
            <div className="flex flex-col items-center justify-center space-y-6">
              <Loader2 className="w-16 h-16 text-[#ef4444] animate-spin" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Cancelando tu reserva...
              </h1>
              <p className="text-gray-400">
                Por favor, espera un momento
              </p>
            </div>
          </div>
        )}

        {/* Estado: Éxito */}
        {estado === 'exito' && (
          <div className="bg-[#1e1b3d] rounded-2xl shadow-2xl p-8 md:p-12 border border-[#ef4444]/20">
            <div className="flex flex-col items-center justify-center space-y-6 mb-8">
              <div className="w-20 h-20 bg-[#ef4444]/20 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-[#ef4444]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                Reserva Cancelada
              </h1>
              <p className="text-gray-400 text-center">
                {mensaje}
              </p>
            </div>

            {reserva && (
              <div className="bg-[#0f0f1a] rounded-xl p-6 space-y-4 border border-[#ef4444]/10">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ef4444]" />
                  Detalles de la reserva cancelada
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-[#ef4444]/10">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Cliente:
                    </span>
                    <span className="text-white font-medium">{reserva.nombreCliente}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-[#ef4444]/10">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha:
                    </span>
                    <span className="text-white font-medium">{formatearFecha(reserva.fecha)}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-[#ef4444]/10">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Hora:
                    </span>
                    <span className="text-white font-medium">{formatearHora(reserva.fecha)}</span>
                  </div>

                  {reserva.mesa && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Mesa:
                      </span>
                      <span className="text-white font-medium">{reserva.mesa.nombre}</span>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-[#ef4444]/10">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Estado:</span>
                      <span className="px-3 py-1 bg-[#ef4444]/20 text-[#ef4444] rounded-full text-sm font-medium">
                        {reserva.estado}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">
                Si necesitas hacer una nueva reserva, puedes contactarnos directamente.
              </p>
              <p className="text-gray-500 text-sm">
                Puedes cerrar esta ventana.
              </p>
            </div>
          </div>
        )}

        {/* Estado: Error */}
        {estado === 'error' && (
          <div className="bg-[#1e1b3d] rounded-2xl shadow-2xl p-8 md:p-12 border border-[#ef4444]/20">
            <div className="flex flex-col items-center justify-center space-y-6 mb-8">
              <div className="w-20 h-20 bg-[#ef4444]/20 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-[#ef4444]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                Error al cancelar la reserva
              </h1>
              <p className="text-gray-400 text-center max-w-md">
                {error || 'Ocurrió un error al procesar tu cancelación. Por favor, verifica el enlace o contacta con el restaurante.'}
              </p>
            </div>

            <div className="text-center space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#6366f1] text-white rounded-lg font-semibold hover:bg-[#7e47ff] transition-all duration-200"
              >
                Intentar de nuevo
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Si el problema persiste, contacta con el restaurante directamente.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

