import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { ref } from 'vue'

export type ParcelaItem = {
  id: number
  ensayoId: number
  bloqueId: number
  tratamientoId: number
  nombreParcela?: string | null
  posXGrid?: number | null
  posYGrid?: number | null
  ensayo?: {
    id: number
    nombreEnsayo: string
    codigoLabor?: string
  }
  bloque?: {
    id: number
    nombreBloque: string
  }
  tratamiento?: {
    id: number
    nombreTratamiento: string
  }
}

export const useParcelasStore = defineStore('parcelas', () => {
  const api = useApi()

  // Estado
  const items = ref<ParcelaItem[]>([])
  const current = ref<ParcelaItem | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filtros y paginación
  const paginacion = ref({ page: 1, limit: 10, total: 0, pageCount: 0 })
  const filtros = ref({
    q: '',
    sort: 'id',
    order: 'ASC',
    ensayoId: null as number | null,
    bloqueId: null as number | null,
  })

  // CRUD - Parcelas
  async function fetchParcelas(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      console.log('📦 fetchParcelas - params recibidos:', params)

      const query = {
        page: params.page ?? paginacion.value.page,
        limit: params.limit ?? paginacion.value.limit,
        sort: params.sort ?? filtros.value.sort,
        order: params.order ?? filtros.value.order,
        // IMPORTANTE: Usar los params directos, no filtros.value
        ...(params.ensayoId && { ensayoId: params.ensayoId }),
        ...(params.bloqueId && { bloqueId: params.bloqueId }),
      }
      console.log('🔍 Query enviada al API:', query)

      const res = await api.get('/parcelas', { params: query })
      const data = res && (res.data ?? res)

      if (Array.isArray(data)) {
        items.value = data
        console.log('✅ Parcelas cargadas:', data.length)
      } else if (data?.data) {
        items.value = data.data
        if (data.meta) {
          paginacion.value.total = data.meta.total
          paginacion.value.pageCount = data.meta.pageCount
          paginacion.value.page = data.meta.page
        }
        console.log('✅ Parcelas cargadas:', data.data.length)
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar parcelas'
      console.error('❌ Error fetchParcelas:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchParcelaById(id: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/parcelas/${id}`)
      const data = res && (res.data ?? res)
      current.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar parcela'
      console.error('Error fetchParcelaById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createParcela(payload: Partial<ParcelaItem>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/parcelas', payload)
      const data = res && (res.data ?? res)
      if (data?.id) {
        items.value.push(data)
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al crear parcela'
      console.error('Error createParcela:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateParcela(id: number, payload: Partial<ParcelaItem>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.patch(`/parcelas/${id}`, payload)
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
      error.value = err.message || 'Error al actualizar parcela'
      console.error('Error updateParcela:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteParcela(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/parcelas/${id}`)
      items.value = items.value.filter(p => p.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
      return { deleted: true }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar parcela'
      console.error('Error deleteParcela:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filtros
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
    // Estado
    items,
    current,
    loading,
    error,
    paginacion,
    filtros,

    // Métodos
    fetchParcelas,
    fetchParcelaById,
    createParcela,
    updateParcela,
    deleteParcela,
    setFiltro,
    resetPaginacion,
    clearCurrent,
  }
})

