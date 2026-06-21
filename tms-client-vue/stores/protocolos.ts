import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { ref } from 'vue'
import type { TratamientoProductoItem, TratamientoItem } from './tratamientos'

export type ProtocoloItem = {
  id: number
  nombre: string
  descripcion?: string | null
  tratamientos?: TratamientoItem[]
}

export const useProtocolosStore = defineStore('protocolos', () => {
  const api = useApi()

  // Estado
  const items = ref<ProtocoloItem[]>([])
  const current = ref<ProtocoloItem | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const paginacion = ref({ page: 1, limit: 10, total: 0, pageCount: 0 })
  const filtros = ref({ q: '', sort: 'nombre', order: 'ASC' })

  // Protocolos
  async function fetchProtocolos(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      const query = {
        page: params.page ?? paginacion.value.page,
        limit: params.limit ?? paginacion.value.limit,
        sort: params.sort ?? filtros.value.sort,
        order: params.order ?? filtros.value.order,
        q: params.q ?? filtros.value.q,
      }
      const res = await api.get('/protocolos', { params: query })
      
      if (res && res.data && res.meta) {
        items.value = res.data
        paginacion.value.total = res.meta.total
        paginacion.value.pageCount = res.meta.pageCount
        paginacion.value.page = res.meta.page
      } else if (Array.isArray(res)) {
        items.value = res
      } else if (res && Array.isArray(res.data)) {
        items.value = res.data
      }
      return res
    } catch (err: any) {
      error.value = err.message || 'Error al cargar protocolos'
      console.error('Error fetchProtocolos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProtocoloById(id: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/protocolos/${id}`)
      const data = res && (res.data ?? res)
      current.value = data
      
      // Keep the protocol inside the items list updated too
      if (data && data.id) {
        const idx = items.value.findIndex(p => p.id === data.id)
        if (idx >= 0) {
          items.value[idx] = data
        }
      }
      
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar protocolo'
      console.error('Error fetchProtocoloById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createProtocolo(payload: Partial<ProtocoloItem>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/protocolos', payload)
      const data = res && (res.data ?? res)
      if (data?.id) {
        items.value.push(data)
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al crear protocolo'
      console.error('Error createProtocolo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProtocolo(id: number, payload: Partial<ProtocoloItem>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.patch(`/protocolos/${id}`, payload)
      const data = res && (res.data ?? res)
      const idx = items.value.findIndex(p => p.id === id)
      if (idx >= 0) {
        items.value[idx] = data
      }
      if (current.value?.id === id) {
        current.value = data
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar protocolo'
      console.error('Error updateProtocolo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProtocolo(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/protocolos/${id}`)
      items.value = items.value.filter(p => p.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
      return { deleted: true }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar protocolo'
      console.error('Error deleteProtocolo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFiltro(key: string, value: any) {
    (filtros.value as any)[key] = value
  }

  function resetPaginacion() {
    paginacion.value.page = 1
  }

  function clearCurrent() {
    current.value = null
  }

  return {
    items,
    current,
    loading,
    error,
    paginacion,
    filtros,
    fetchProtocolos,
    fetchProtocoloById,
    createProtocolo,
    updateProtocolo,
    deleteProtocolo,
    setFiltro,
    resetPaginacion,
    clearCurrent,
  }
})

