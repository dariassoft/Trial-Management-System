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
  variables?: VariableItem[]
  dias?: DiaEvaluacionItem[]
}

export interface VariableItem {
  id: number
  nombre_variable: string
  unidad_medida: string
  tipo_ensayo_id_fk?: number
  orden?: number | null
  requerido?: boolean
  unidadOverride?: string | null
  escala?: string | null
  rangoMin?: number | null
  rangoMax?: number | null
}

export interface DiaEvaluacionItem {
  id: number
  dia: number
  tipo_ensayo_id_fk?: number
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
    error.value = null
    try {
      const response = await api.get(`/catalogos/tipos-ensayo/${id}`)
      currentTipo.value = response

      // Cargar variables del tipo
      try {
        const variablesRes = await api.get(`/catalogos/tipos-ensayo/${id}/variables`)
        const variables = extractArrayFromResponse(variablesRes)
        if (currentTipo.value) {
          currentTipo.value.variables = variables
        }
      } catch (varErr) {
        console.warn('Error al cargar variables:', varErr)
      }

      // Cargar días de evaluación
      try {
        const diasRes = await api.get(`/catalogos/tipos-ensayo/${id}/dias`)
        const dias = extractArrayFromResponse(diasRes)
        if (currentTipo.value) {
          currentTipo.value.dias = dias
        }
      } catch (diaErr) {
        console.warn('Error al cargar días:', diaErr)
      }

      return currentTipo.value
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

  // Variables
  const addVariable = async (tipoEnsayoId: number, data: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/catalogos/tipos-ensayo/${tipoEnsayoId}/variables`, data)
      if (currentTipo.value?.id === tipoEnsayoId) {
        if (!currentTipo.value.variables) {
          currentTipo.value.variables = []
        }
        currentTipo.value.variables.push(response)
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al agregar variable')
      console.error('Error en addVariable:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateVariable = async (tipoEnsayoId: number, variableId: number, data: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/catalogos/tipos-ensayo/${tipoEnsayoId}/variables/${variableId}`, data)
      if (currentTipo.value?.variables) {
        const idx = currentTipo.value.variables.findIndex(v => v.id === variableId)
        if (idx >= 0) {
          currentTipo.value.variables[idx] = response
        }
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al actualizar variable')
      console.error('Error en updateVariable:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeVariable = async (tipoEnsayoId: number, variableId: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/catalogos/tipos-ensayo/${tipoEnsayoId}/variables/${variableId}`)
      if (currentTipo.value?.variables) {
        currentTipo.value.variables = currentTipo.value.variables.filter(v => v.id !== variableId)
      }
      return { deleted: true }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al eliminar variable')
      console.error('Error en removeVariable:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Días de evaluación
  const fetchDias = async (tipoEnsayoId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/catalogos/tipos-ensayo/${tipoEnsayoId}/dias`)
      const dias = extractArrayFromResponse(response)
      return dias
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar días de evaluación')
      console.error('Error en fetchDias:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setEvaluacion = async (tipoEnsayoId: number, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/catalogos/tipos-ensayo/${tipoEnsayoId}/evaluacion`, payload)
      if (currentTipo.value?.id === tipoEnsayoId) {
        currentTipo.value.evaluacionCsv = response.evaluacionCsv
        if (response.dias) {
          currentTipo.value.dias = response.dias
        }
      }
      const index = tiposEnsayo.value.findIndex(t => t.id === tipoEnsayoId)
      if (index >= 0) {
        tiposEnsayo.value[index].evaluacionCsv = response.evaluacionCsv
        if (response.dias) {
          tiposEnsayo.value[index].dias = response.dias
        }
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al establecer días de evaluación')
      console.error('Error en setEvaluacion:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  const setFiltro = (key: string, value: any) => {
    (filtros.value as any)[key] = value
  }

  const resetPaginacion = () => {
    currentPage.value = 1
  }

  const clearCurrent = () => {
    currentTipo.value = null
  }

  return {
    // State
    tiposEnsayo,
    currentTipo,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    filtros,
    // Tipos CRUD
    fetchTiposEnsayo,
    fetchTipoById,
    createTipo,
    updateTipo,
    deleteTipo,
    // Variables
    addVariable,
    updateVariable,
    removeVariable,
    // Días
    fetchDias,
    setEvaluacion,
    // Helpers
    setCurrentPage,
    setFiltro,
    resetPaginacion,
    clearCurrent,
  }
})

