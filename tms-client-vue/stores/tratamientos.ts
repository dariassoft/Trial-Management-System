import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { ref } from 'vue'

export type TratamientoProductoItem = {
  id: number
  producto: { id: number; nombre: string }
  dosis?: string | null
  unidadDosis: string
  estadio?: string | null
}

export type Tratamiento = {
  id: number
  numeroTrat: number
  descripcion?: string | null
  esTestigo: boolean
  protocoloId?: number
  protocolo?: { id: number; nombre: string }
  productos?: TratamientoProductoItem[]
}

export const useTratamientosStore = defineStore('tratamientos', () => {
  const api = useApi()

  // Estado
  const items = ref<Tratamiento[]>([])
  const current = ref<Tratamiento | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const paginacion = ref({ page: 1, limit: 10, total: 0, pageCount: 0 })
  const filtros = ref({
    q: '',
    protocoloId: null as number | null,
    esTestigo: null as boolean | null,
    sort: 'numeroTrat',
    order: 'ASC',
  })

  // Tratamientos
  async function fetchTratamientos(params: Record<string, any> = {}) {
    loading.value = true
    error.value = null
    try {
      const query: Record<string, any> = {
        page: params.page ?? paginacion.value.page,
        limit: params.limit ?? paginacion.value.limit,
        sort: params.sort ?? filtros.value.sort,
        order: params.order ?? filtros.value.order,
      }
      
      if (params.q !== undefined || filtros.value.q) {
        query.q = params.q ?? filtros.value.q
      }
      if (params.protocoloId !== undefined || filtros.value.protocoloId !== null) {
        query.protocoloId = params.protocoloId ?? filtros.value.protocoloId
      }
      if (params.esTestigo !== undefined || filtros.value.esTestigo !== null) {
        query.esTestigo = params.esTestigo ?? filtros.value.esTestigo
      }

      const res = await api.get('/tratamientos', { params: query })
      const data = res && (res.data ?? res)
      
      if (data?.data) {
        items.value = data.data
        if (data.meta) {
          paginacion.value.total = data.meta.total
          paginacion.value.pageCount = data.meta.pageCount
          paginacion.value.page = data.meta.page
        }
      } else if (Array.isArray(data)) {
        items.value = data
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar tratamientos'
      console.error('Error fetchTratamientos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTratamientoById(id: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/tratamientos/${id}`)
      const data = res && (res.data ?? res)
      current.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar tratamiento'
      console.error('Error fetchTratamientoById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createTratamiento(payload: Partial<Tratamiento>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/tratamientos', payload)
      const data = res && (res.data ?? res)
      if (data?.id) {
        items.value.push(data)
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al crear tratamiento'
      console.error('Error createTratamiento:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTratamiento(id: number, payload: Partial<Tratamiento>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.patch(`/tratamientos/${id}`, payload)
      const data = res && (res.data ?? res)
      const idx = items.value.findIndex(t => t.id === id)
      if (idx >= 0) {
        items.value[idx] = data
      }
      if (current.value?.id === id) {
        current.value = data
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar tratamiento'
      console.error('Error updateTratamiento:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTratamiento(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/tratamientos/${id}`)
      items.value = items.value.filter(t => t.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
      return { deleted: true }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar tratamiento'
      console.error('Error deleteTratamiento:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Tratamiento Producto
  async function createTratamientoProducto(payload: {
    tratamientoId: number
    productoId: number
    dosis?: string | null
    unidadDosis?: string
    estadio?: string | null
  }) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/tratamientos-producto', payload)
      const data = res && (res.data ?? res)
      
      // Actualizar el tratamiento actual si es el mismo
      if (current.value?.id === payload.tratamientoId && data?.id) {
        if (!current.value.productos) current.value.productos = []
        current.value.productos.push(data)
      }
      
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al agregar producto al tratamiento'
      console.error('Error createTratamientoProducto:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTratamientoProducto(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/tratamientos-producto/${id}`)

      // Actualizar el tratamiento actual
      if (current.value?.productos) {
        current.value.productos = current.value.productos.filter(p => p.id !== id)
      }
      
      return { deleted: true }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar producto del tratamiento'
      console.error('Error deleteTratamientoProducto:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTratamientoProducto(
    id: number,
    payload: { dosis?: string; unidadDosis?: string; estadio?: string },
  ) {
    loading.value = true
    error.value = null
    try {
      const res = await api.patch(`/tratamientos-producto/${id}`, payload)
      const data = res && (res.data ?? res)
      
      if (current.value?.productos) {
        const idx = current.value.productos.findIndex(p => p.id === id)
        if (idx >= 0) {
          current.value.productos[idx] = data
        }
      }
      
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar producto del tratamiento'
      console.error('Error updateTratamientoProducto:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helpers
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
    // Tratamientos
    fetchTratamientos,
    fetchTratamientoById,
    createTratamiento,
    updateTratamiento,
    deleteTratamiento,
    // Tratamiento Producto
    createTratamientoProducto,
    deleteTratamientoProducto,
    updateTratamientoProducto,
    // Helpers
    setFiltro,
    resetPaginacion,
    clearCurrent,
  }
})

