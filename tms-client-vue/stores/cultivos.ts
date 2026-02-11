import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { extractArrayFromResponse, extractTotalFromResponse, extractErrorMessage } from '~/utils/apiHelpers'

export interface Cultivo {
  id?: number
  nombre: string
  descripcion?: string | null
  ciclo_vegetativo?: string | null
  esta_activo?: boolean
  createdAt?: string
  updatedAt?: string
}

export const useCultivosStore = defineStore('cultivos', () => {
  const api = useApi()
  const cultivos = ref<Cultivo[]>([])
  const currentCultivo = ref<Cultivo | null>(null)
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

  const fetchCultivos = async (params: any = {}) => {
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

      const response = await api.get(`/catalogos/cultivos?${queryParams}`)

      cultivos.value = extractArrayFromResponse(response)
      total.value = extractTotalFromResponse(response, cultivos.value.length)
      currentPage.value = pageValue

      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar cultivos')
      console.error('Error en fetchCultivos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCultivoById = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get(`/catalogos/cultivos/${id}`)
      currentCultivo.value = response
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar el cultivo')
      console.error('Error en fetchCultivoById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCultivo = async (data: Cultivo) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/catalogos/cultivos`, data)
      cultivos.value.unshift(response)
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al crear cultivo')
      console.error('Error en createCultivo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCultivo = async (id: number, data: Partial<Cultivo>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/catalogos/cultivos/${id}`, data)
      const index = cultivos.value.findIndex(c => c.id === id)
      if (index !== -1) {
        cultivos.value[index] = response
      }
      if (currentCultivo.value?.id === id) {
        currentCultivo.value = response
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al actualizar cultivo')
      console.error('Error en updateCultivo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCultivo = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/catalogos/cultivos/${id}`)
      cultivos.value = cultivos.value.filter(c => c.id !== id)
      if (currentCultivo.value?.id === id) {
        currentCultivo.value = null
      }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al eliminar cultivo')
      console.error('Error en deleteCultivo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  return {
    cultivos,
    currentCultivo,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    filtros,
    fetchCultivos,
    fetchCultivoById,
    createCultivo,
    updateCultivo,
    deleteCultivo,
    setCurrentPage,
  }
})

