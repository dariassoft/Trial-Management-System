import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { ref } from 'vue'
import type { MomentoEvaluacion } from './momentos'

export interface Aplicacion {
  id: number
  nombreAplicacion: string
  fechaHora?: string | null
  estadioCultivo?: string | null
  tempC?: number | null
  humedadPct?: number | null
  vientoKmh?: number | null
  equipoInfo?: string | null
  picoInfo?: string | null
  presionBar?: number | null
  ensayo?: {
    id: number
    nombreEnsayo: string
    codigoLabor?: string
  }
  momentos?: MomentoEvaluacion[]
}


export interface CreateAplicacionDto {
  ensayoId: number
  nombreAplicacion?: string
  fechaHora?: string
  estadioCultivo?: string
  tempC?: number
  humedadPct?: number
  vientoKmh?: number
  equipoInfo?: string
  picoInfo?: string
  presionBar?: number
}

export const useAplicacionesStore = defineStore('aplicaciones', () => {
  const api = useApi()

  // Estado
  const items = ref<Aplicacion[]>([])
  const current = ref<Aplicacion | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Obtener aplicaciones por ensayo
  async function fetchByEnsayo(ensayoId: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/aplicaciones', { params: { ensayoId } })
      const data = res && (res.data ?? res)
      items.value = Array.isArray(data) ? data : []
      return items.value
    } catch (err: any) {
      error.value = err.message || 'Error al cargar aplicaciones'
      console.error('Error fetchByEnsayo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener una aplicación por ID
  async function fetchById(id: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/aplicaciones/${id}`)
      const data = res && (res.data ?? res)
      current.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar aplicación'
      console.error('Error fetchById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Crear aplicación (genera momentos automáticamente)
  async function create(dto: CreateAplicacionDto) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/aplicaciones', dto)
      const data = res && (res.data ?? res)
      if (data?.id) {
        items.value.push(data)
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al crear aplicación'
      console.error('Error create:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar aplicación
  async function update(id: number, dto: Partial<CreateAplicacionDto>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.patch(`/aplicaciones/${id}`, dto)
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
      error.value = err.message || 'Error al actualizar aplicación'
      console.error('Error update:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar aplicación
  async function remove(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/aplicaciones/${id}`)
      items.value = items.value.filter(item => item.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar aplicación'
      console.error('Error remove:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    current,
    loading,
    error,
    fetchByEnsayo,
    fetchById,
    create,
    update,
    remove,
  }
})
