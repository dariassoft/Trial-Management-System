/**
 * Utilidades para manejar respuestas de API de manera consistente
 */

/**
 * Extrae un array de una respuesta API
 * Puede ser: array directo, { data: [...] }, o { data: { data: [...] } }
 */
export function extractArrayFromResponse(response: any): any[] {
  if (!response) return []

  if (Array.isArray(response)) {
    return response
  }

  if (typeof response === 'object') {
    // Intentar response.data
    if (Array.isArray(response.data)) {
      return response.data
    }

    // Intentar response.data.data (para respuestas anidadas)
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    }
  }

  return []
}

/**
 * Extrae el total de items de una respuesta API con metadatos
 */
export function extractTotalFromResponse(response: any, defaultCount?: number): number {
  if (!response) return defaultCount ?? 0

  // Si es un array, el total es su longitud
  if (Array.isArray(response)) {
    return response.length
  }

  // Si tiene meta.total
  if (response.meta?.total !== undefined) {
    return response.meta.total
  }

  // Si tiene data y es un array, contar elementos
  if (Array.isArray(response.data)) {
    return response.data.length
  }

  return defaultCount ?? 0
}

/**
 * Extrae mensaje de error de manera robusta
 */
export function extractErrorMessage(error: any, defaultMessage: string = 'Error desconocido'): string {
  if (!error) return defaultMessage

  // Mensaje del error
  if (typeof error === 'string') return error

  // error.data.message (nuxt $fetch)
  if (error.data?.message) return error.data.message

  // error.message
  if (error.message) return error.message

  // error.statusMessage
  if (error.statusMessage) return error.statusMessage

  // error.statusText
  if (error.statusText) return error.statusText

  // Códigos HTTP comunes
  if (error.status === 400) return 'Solicitud inválida'
  if (error.status === 401) return 'Usuario o contraseña incorrecta'
  if (error.status === 403) return 'Acceso denegado'
  if (error.status === 404) return 'Recurso no encontrado'
  if (error.status === 500) return 'Error del servidor. Por favor intenta más tarde'

  return defaultMessage
}


