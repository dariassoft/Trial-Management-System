import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { extractArrayFromResponse, extractTotalFromResponse, extractErrorMessage } from '~/utils/apiHelpers'

export interface Laboratorio {
  id?: number
  nombre: string
  descripcion?: string | null
  direccion?: string | null
  telefono?: string | null
  email?: string | null
  contacto?: string | null
  esta_activo?: boolean
  createdAt?: string
  updatedAt?: string
}

export const useLaboratoriosStore = defineStore('laboratorios', () => {
  const api = useApi()
  const laboratorios = ref<Laboratorio[]>([])
  const currentLaboratorio = ref<Laboratorio | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const filtros = ref({
    sort: 'id',
    order: 'ASC' as 'ASC' | 'DESC',
    q: ''
  })

  const fetchLaboratorios = async (params: any = {}) => {
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

      const response = await api.get(`/laboratorios?${queryParams}`)

      laboratorios.value = extractArrayFromResponse(response)
      total.value = extractTotalFromResponse(response, laboratorios.value.length)
      currentPage.value = pageValue

      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar laboratorios')
      console.error('Error en fetchLaboratorios:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchLaboratorioById = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get(`/laboratorios/${id}`)
      currentLaboratorio.value = response
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar el laboratorio')
      console.error('Error en fetchLaboratorioById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createLaboratorio = async (data: Laboratorio) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/laboratorios`, data)
      laboratorios.value.unshift(response)
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al crear laboratorio')
      console.error('Error en createLaboratorio:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateLaboratorio = async (id: number, data: Partial<Laboratorio>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/laboratorios/${id}`, data)
      const index = laboratorios.value.findIndex(l => l.id === id)
      if (index !== -1) {
        laboratorios.value[index] = response
      }
      if (currentLaboratorio.value?.id === id) {
        currentLaboratorio.value = response
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al actualizar laboratorio')
      console.error('Error en updateLaboratorio:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteLaboratorio = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/laboratorios/${id}`)
      laboratorios.value = laboratorios.value.filter(l => l.id !== id)
      if (currentLaboratorio.value?.id === id) {
        currentLaboratorio.value = null
      }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al eliminar laboratorio')
      console.error('Error en deleteLaboratorio:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  return {
    laboratorios,
    currentLaboratorio,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    filtros,
    fetchLaboratorios,
    fetchLaboratorioById,
    createLaboratorio,
    updateLaboratorio,
    deleteLaboratorio,
    setCurrentPage,
  }
})

