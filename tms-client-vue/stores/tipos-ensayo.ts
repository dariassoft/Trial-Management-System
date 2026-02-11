import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { extractArrayFromResponse, extractTotalFromResponse, extractErrorMessage } from '~/utils/apiHelpers'

export interface TipoEnsayo {
  id?: number
  nombre: string
  descripcion?: string | null
  evaluacionCsv?: string | null
  activo?: boolean
  createdAt?: string
  updatedAt?: string
}

export const useTiposEnsayoStore = defineStore('tiposEnsayo', () => {
  const api = useApi()
  const tiposEnsayo = ref<TipoEnsayo[]>([])
  const currentTipo = ref<TipoEnsayo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const filtros = ref({
    sort: 'nombre',
    order: 'ASC' as 'ASC' | 'DESC',
    q: '',
  })

  const fetchTiposEnsayo = async (params: any = {}) => {
    loading.value = true
    error.value = null
    try {
      const limitValue = params.limit || pageSize.value
      const pageValue = params.page || currentPage.value
      const queryParams = new URLSearchParams({
        limit: String(limitValue),
        page: String(pageValue),
        sort: filtros.value.sort,
        order: filtros.value.order,
        ...params,
      })

      if (filtros.value.q) {
        queryParams.append('q', filtros.value.q)
      }

      const response = await api.get(`/catalogos/tipos-ensayo?${queryParams}`)

      tiposEnsayo.value = extractArrayFromResponse(response)
      total.value = extractTotalFromResponse(response, tiposEnsayo.value.length)
      currentPage.value = pageValue

      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar tipos de ensayo')
      console.error('Error en fetchTiposEnsayo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTipoById = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get(`/catalogos/tipos-ensayo/${id}`)
      currentTipo.value = response
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar el tipo de ensayo')
      console.error('Error en fetchTipoById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTipo = async (data: TipoEnsayo) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/catalogos/tipos-ensayo`, data)
      tiposEnsayo.value.unshift(response)
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al crear tipo de ensayo')
      console.error('Error en createTipo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTipo = async (id: number, data: Partial<TipoEnsayo>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/catalogos/tipos-ensayo/${id}`, data)
      const index = tiposEnsayo.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tiposEnsayo.value[index] = response
      }
      if (currentTipo.value?.id === id) {
        currentTipo.value = response
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al actualizar tipo de ensayo')
      console.error('Error en updateTipo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTipo = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/catalogos/tipos-ensayo/${id}`)
      tiposEnsayo.value = tiposEnsayo.value.filter(t => t.id !== id)
      if (currentTipo.value?.id === id) {
        currentTipo.value = null
      }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al eliminar tipo de ensayo')
      console.error('Error en deleteTipo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  return {
    tiposEnsayo,
    currentTipo,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    filtros,
    fetchTiposEnsayo,
    fetchTipoById,
    createTipo,
    updateTipo,
    deleteTipo,
    setCurrentPage,
  }
})

