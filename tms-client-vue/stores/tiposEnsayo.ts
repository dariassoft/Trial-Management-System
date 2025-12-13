import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { ref } from 'vue'

export type VariableItem = {
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

export type DiaEvaluacionItem = {
  id: number
  dia: number
  tipo_ensayo_id_fk?: number
}

export type TipoEnsayoItem = {
  id: number
  nombre: string
  evaluacionCsv?: string | null
  activo?: boolean
  variables?: VariableItem[]
  dias?: DiaEvaluacionItem[]
}

export const useTiposEnsayoStore = defineStore('tiposEnsayo', () => {
  const api = useApi()

  // Estado
  const items = ref<TipoEnsayoItem[]>([])
  const current = ref<TipoEnsayoItem | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const paginacion = ref({ page: 1, limit: 10, total: 0, pageCount: 0 })
  const filtros = ref({ q: '', sort: 'nombre', order: 'ASC' })

  // Tipos de Ensayo CRUD
  async function fetchTiposEnsayo(params: Record<string, any> = {}) {
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
      const res = await api.get('/catalogos/tipos-ensayo', { params: query })
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
      error.value = err.message || 'Error al cargar tipos de ensayo'
      console.error('Error fetchTiposEnsayo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTipoEnsayoById(id: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/catalogos/tipos-ensayo/${id}`)
      const data = res && (res.data ?? res)

      // Cargar también las variables del tipo de ensayo
      try {
        const varRes = await api.get(`/catalogos/tipos-ensayo/${id}/variables`)
        const variables = varRes && (varRes.data ?? varRes)
        if (Array.isArray(variables)) {
          data.variables = variables
        }
      } catch (varErr) {
        console.warn('Error al cargar variables del tipo de ensayo:', varErr)
        data.variables = []
      }

      current.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar tipo de ensayo'
      console.error('Error fetchTipoEnsayoById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createTipoEnsayo(payload: Partial<TipoEnsayoItem>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/catalogos/tipos-ensayo', payload)
      const data = res && (res.data ?? res)
      if (data?.id) {
        items.value.push(data)
      }
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al crear tipo de ensayo'
      console.error('Error createTipoEnsayo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTipoEnsayo(id: number, payload: Partial<TipoEnsayoItem>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.patch(`/catalogos/tipos-ensayo/${id}`, payload)
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
      error.value = err.message || 'Error al actualizar tipo de ensayo'
      console.error('Error updateTipoEnsayo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTipoEnsayo(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/catalogos/tipos-ensayo/${id}`)
      items.value = items.value.filter(p => p.id !== id)
      if (current.value?.id === id) {
        current.value = null
      }
      return { deleted: true }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar tipo de ensayo'
      console.error('Error deleteTipoEnsayo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Variables
  async function fetchVariables(tipoEnsayoId: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/catalogos/tipos-ensayo/${tipoEnsayoId}/variables`)
      const data = res && (res.data ?? res)
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar variables'
      console.error('Error fetchVariables:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addVariable(tipoEnsayoId: number, payload: any) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post(`/catalogos/tipos-ensayo/${tipoEnsayoId}/variables`, payload)
      const data = res && (res.data ?? res)

      // Actualizar el current si corresponde
      if (current.value?.id === tipoEnsayoId) {
        if (!current.value.variables) {
          current.value.variables = []
        }
        current.value.variables.push(data)
      }

      return data
    } catch (err: any) {
      error.value = err.message || 'Error al agregar variable'
      console.error('Error addVariable:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateVariable(variableId: number, payload: any) {
    loading.value = true
    error.value = null
    try {
      // Nota: Necesitamos el tipoEnsayoId para la ruta, así que obtenemos del current
      if (!current.value?.id) {
        throw new Error('No hay tipo de ensayo seleccionado')
      }

      const res = await api.patch(`/catalogos/tipos-ensayo/${current.value.id}/variables/${variableId}`, payload)
      const data = res && (res.data ?? res)

      // Actualizar en el current
      if (current.value?.variables) {
        const idx = current.value.variables.findIndex(v => v.id === variableId)
        if (idx >= 0) {
          current.value.variables[idx] = data
        }
      }

      return data
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar variable'
      console.error('Error updateVariable:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeVariable(tipoEnsayoId: number, variableId: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/catalogos/tipos-ensayo/${tipoEnsayoId}/variables/${variableId}`)

      // Actualizar el current
      if (current.value?.variables) {
        current.value.variables = current.value.variables.filter(v => v.id !== variableId)
      }

      return { deleted: true }
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar variable'
      console.error('Error removeVariable:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Días de evaluación
  async function fetchDias(tipoEnsayoId: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/catalogos/tipos-ensayo/${tipoEnsayoId}/dias`)
      const data = res && (res.data ?? res)
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar días de evaluación'
      console.error('Error fetchDias:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function setEvaluacion(tipoEnsayoId: number, payload: any) {
    loading.value = true
    error.value = null
    try {
      const res = await api.put(`/catalogos/tipos-ensayo/${tipoEnsayoId}/evaluacion`, payload)
      const data = res && (res.data ?? res)

      // Actualizar el current
      if (current.value?.id === tipoEnsayoId) {
        current.value.evaluacionCsv = data.evaluacionCsv
        if (data.dias) {
          current.value.dias = data.dias
        }
      }

      return data
    } catch (err: any) {
      error.value = err.message || 'Error al establecer días de evaluación'
      console.error('Error setEvaluacion:', err)
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

    // Tipos de Ensayo
    fetchTiposEnsayo,
    fetchTipoEnsayoById,
    createTipoEnsayo,
    updateTipoEnsayo,
    deleteTipoEnsayo,

    // Variables
    fetchVariables,
    addVariable,
    updateVariable,
    removeVariable,

    // Días
    fetchDias,
    setEvaluacion,

    // Helpers
    setFiltro,
    resetPaginacion,
    clearCurrent,
  }
})

