const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
const API_URL = `${BASE.replace(/\/$/, '')}/api/mesas`;

const getToken = () => localStorage.getItem('token');

// Función auxiliar para manejar la respuesta del servidor
const handleResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn('La respuesta no es un JSON válido:', text);
    return { message: text };
  }
};

export const getTables = async () => {
  try {
    const token = getToken();
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const responseData = await handleResponse(response);
    
    if (!response.ok) {
      throw new Error(
        responseData?.message || 
        `Error ${response.status}: ${response.statusText}`
      );
    }
    
    // Si la respuesta tiene un array en data, lo devolvemos, si no, devolvemos el objeto completo
    return Array.isArray(responseData) ? responseData : 
           (responseData.data || []);
  } catch (error) {
    console.error('Error fetching tables:', {
      error,
      message: error.message
    });
    throw error;
  }
};

export const createTable = async (tableData) => {
  try {
    const token = getToken();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tableData)
    });

    const responseData = await handleResponse(response);

    if (!response.ok) {
      throw new Error(
        responseData?.message || 
        `Error ${response.status}: ${response.statusText}`
      );
    }

    // Si la respuesta tiene un campo 'data', lo usamos, de lo contrario usamos el objeto completo
    const result = responseData?.data || responseData;
    
    if (!result) {
      throw new Error('La respuesta del servidor está vacía');
    }

    // Asegurarnos de que el ID esté presente
    if (!result.id) {
      // Si no hay ID, intentamos extraerlo de la respuesta
      result.id = responseData.id || `temp-${Date.now()}`;
    }

    return result;
  } catch (error) {
    console.error('Error creating table:', {
      error,
      tableData,
      message: error.message
    });
    throw error;
  }
};

export const updateTable = async (id, tableData) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tableData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar la mesa');
    }

    const responseData = await response.json();
    
    // Si la respuesta tiene un campo 'data', lo usamos, de lo contrario usamos el objeto completo
    return responseData.data || responseData;
  } catch (error) {
    console.error('Error updating table:', error);
    throw error;
  }
};

export const deleteTable = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al eliminar la mesa');
    }

    return true;
  } catch (error) {
    console.error('Error deleting table:', error);
    throw error;
  }
};
