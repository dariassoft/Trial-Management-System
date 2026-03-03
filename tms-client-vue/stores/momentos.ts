import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { ref } from 'vue'

export interface MomentoEvaluacion {
  id: number
  nombreMomento: string
  diasDespuesAplicacion?: number | null
  fechaEvaluacion?: string | null
  aplicacion?: {
    id: number
    nombreAplicacion: string
    ensayo?: {
      id: number
      nombreEnsayo: string
    }
  }
}

export interface MomentoProgreso {
  momentoId: number
  nombreMomento: string
  diasDespuesAplicacion: number
  fechaEvaluacion?: string | null
  totalParcelas: number
  parcelasMedidas: number
  parcelasPendientes: number
  porcentaje: number
  estado: 'pendiente' | 'en_progreso' | 'completado'
  idsParcelasMedidas: number[]
}

export const useMomentosStore = defineStore('momentos', () => {
  const api = useApi()

  // Estado
  const items = ref<MomentoEvaluacion[]>([])
  const current = ref<MomentoEvaluacion | null>(null)
  const progreso = ref<MomentoProgreso | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Obtener momentos por aplicación
  async function fetchByAplicacion(aplicacionId: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/momentos', { params: { aplicacionId } })
      const data = res && (res.data ?? res)
      items.value = Array.isArray(data) ? data : []
      return items.value
    } catch (err: any) {
      error.value = err.message || 'Error al cargar momentos'
      console.error('Error fetchByAplicacion:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener momento por ID
  async function fetchById(id: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/momentos/${id}`)
      const data = res && (res.data ?? res)
      current.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar momento'
      console.error('Error fetchById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener progreso de un momento
  async function fetchProgreso(momentoId: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/momentos/${momentoId}/progreso`)
      const data = res && (res.data ?? res)
      progreso.value = data
      return data as MomentoProgreso
    } catch (err: any) {
      error.value = err.message || 'Error al cargar progreso'
      console.error('Error fetchProgreso:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar momento
  async function update(id: number, dto: Partial<MomentoEvaluacion>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.patch(`/momentos/${id}`, dto)
      const data = res && (res.data ?? res)
      const idx = items.value.findIndex(item => item.id === id)
      if (idx !== -1) {
        items.value[idx] = data
      }
      if (current.value?.id === id) {
        current.value = data
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar momento'
      console.error('Error update:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    current,
    progreso,
    loading,
    error,
    fetchByAplicacion,
    fetchById,
    fetchProgreso,
    update,
  }
})
