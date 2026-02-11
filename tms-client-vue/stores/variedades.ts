import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { extractArrayFromResponse, extractTotalFromResponse, extractErrorMessage } from '~/utils/apiHelpers'

export interface CultivoVariedad {
  id?: number
  nombre: string
  descripcion?: string | null
  caracteristicas?: string | null
  esta_activo?: boolean
  cultivo_id: number
  cultivo?: { id: number; nombre: string } | null
  createdAt?: string
  updatedAt?: string
}

export const useVariedadesStore = defineStore('variedades', () => {
  const api = useApi()
  const variedades = ref<CultivoVariedad[]>([])
  const currentVariedad = ref<CultivoVariedad | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const filtros = ref({
    sort: 'nombre',
    order: 'ASC' as 'ASC' | 'DESC',
    q: '',
    cultivoId: undefined as number | undefined,
  })

  const fetchVariedades = async (params: any = {}) => {
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
      if (filtros.value.cultivoId) {
        queryParams.append('cultivoId', String(filtros.value.cultivoId))
      }

      const response = await api.get(`/catalogos/cultivo-variedades?${queryParams}`)

      variedades.value = extractArrayFromResponse(response)
      total.value = extractTotalFromResponse(response, variedades.value.length)
      currentPage.value = pageValue

      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar variedades')
      console.error('Error en fetchVariedades:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchVariedadById = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get(`/catalogos/cultivo-variedades/${id}`)
      currentVariedad.value = response
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar la variedad')
      console.error('Error en fetchVariedadById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createVariedad = async (data: CultivoVariedad) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/catalogos/cultivo-variedades`, data)
      variedades.value.unshift(response)
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al crear variedad')
      console.error('Error en createVariedad:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateVariedad = async (id: number, data: Partial<CultivoVariedad>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/catalogos/cultivo-variedades/${id}`, data)
      const index = variedades.value.findIndex(v => v.id === id)
      if (index !== -1) {
        variedades.value[index] = response
      }
      if (currentVariedad.value?.id === id) {
        currentVariedad.value = response
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al actualizar variedad')
      console.error('Error en updateVariedad:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteVariedad = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/catalogos/cultivo-variedades/${id}`)
      variedades.value = variedades.value.filter(v => v.id !== id)
      if (currentVariedad.value?.id === id) {
        currentVariedad.value = null
      }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al eliminar variedad')
      console.error('Error en deleteVariedad:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  return {
    variedades,
    currentVariedad,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    filtros,
    fetchVariedades,
    fetchVariedadById,
    createVariedad,
    updateVariedad,
    deleteVariedad,
    setCurrentPage,
  }
})

