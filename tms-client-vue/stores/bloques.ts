import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { ref } from 'vue'

export type BloqueItem = {
  id: number
  ensayoId: number
  nombreBloque: string
  ensayo?: {
    id: number
    nombreEnsayo: string
  }
  parcelas?: any[]
}

export const useBloquesStore = defineStore('bloques', () => {
  const api = useApi()

  // Estado
  const items = ref<BloqueItem[]>([])
  const current = ref<BloqueItem | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filtros y paginación
  const paginacion = ref({ page: 1, limit: 10, total: 0, pageCount: 0 })
  const filtros = ref({ q: '', sort: 'id', order: 'ASC', ensayoId: null as number | null })

  // CRUD - Bloques
  async function fetchBloques(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      // Usar ensayoId de params si viene, sino del filtro
      const ensayoIdToUse = params.ensayoId ?? filtros.value.ensayoId

      const query: Record<string, any> = {
        page: params.page ?? paginacion.value.page,
        limit: params.limit ?? paginacion.value.limit,
        sort: params.sort ?? filtros.value.sort,
        order: params.order ?? filtros.value.order,
      }

      // Pasar ensayoId como query parameter
      if (ensayoIdToUse) {
        query.ensayoId = ensayoIdToUse
      }

      console.log('🔍 Fetching bloques con params:', query)
      const res = await api.get('/bloques', { params: query })
      const data = res && (res.data ?? res)

      if (Array.isArray(data)) {
        items.value = data
        console.log('✅ Bloques cargados:', data.length)
      } else if (data?.data) {
        items.value = data.data
        console.log('✅ Bloques cargados:', data.data.length)
        if (data.meta) {
          paginacion.value.total = data.meta.total
          paginacion.value.pageCount = data.meta.pageCount
          paginacion.value.page = data.meta.page
        }
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar bloques'
      console.error('❌ Error fetchBloques:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchBloqueById(id: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/bloques/${id}`)
      const data = res && (res.data ?? res)
      current.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar bloque'
      console.error('Error fetchBloqueById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBloque(payload: Partial<BloqueItem>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/bloques', payload)
      const data = res && (res.data ?? res)
      if (data?.id) {
        items.value.push(data)
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al crear bloque'
      console.error('Error createBloque:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBloque(id: number, payload: Partial<BloqueItem>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.patch(`/bloques/${id}`, payload)
      const data = res && (res.data ?? res)
      const idx = items.value.findIndex(b => b.id === id)
      if (idx >= 0) {
        items.value[idx] = data
      }
      if (current.value?.id === id) {
        current.value = data
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar bloque'
      console.error('Error updateBloque:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBloque(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/bloques/${id}`)
      items.value = items.value.filter(b => b.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
      return { deleted: true }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar bloque'
      console.error('Error deleteBloque:', err)
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
    fetchBloques,
    fetchBloqueById,
    createBloque,
    updateBloque,
    deleteBloque,
    setFiltro,
    resetPaginacion,
    clearCurrent,
  }
})

