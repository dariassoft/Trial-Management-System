import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { extractArrayFromResponse, extractTotalFromResponse, extractErrorMessage } from '~/utils/apiHelpers'

export interface Rol {
  id?: number
  nombre: string
  descripcion?: string | null
  usuariosCount?: number
}

export const useRolesStore = defineStore('roles', () => {
  const api = useApi()
  const roles = ref<Rol[]>([])
  const currentRol = ref<Rol | null>(null)
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

  const fetchRoles = async (params: any = {}) => {
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

      const response = await api.get(`/roles?${queryParams}`)

      roles.value = extractArrayFromResponse(response)
      total.value = extractTotalFromResponse(response, roles.value.length)
      currentPage.value = pageValue

      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar roles')
      console.error('Error en fetchRoles:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRolById = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get(`/roles/${id}`)
      currentRol.value = response
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar el rol')
      console.error('Error en fetchRolById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createRol = async (data: Rol) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/roles`, data)
      roles.value.unshift(response)
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al crear rol')
      console.error('Error en createRol:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRol = async (id: number, data: Partial<Rol>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/roles/${id}`, data)
      const index = roles.value.findIndex(r => r.id === id)
      if (index !== -1) {
        roles.value[index] = response
      }
      if (currentRol.value?.id === id) {
        currentRol.value = response
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al actualizar rol')
      console.error('Error en updateRol:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRol = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/roles/${id}`)
      roles.value = roles.value.filter(r => r.id !== id)
      if (currentRol.value?.id === id) {
        currentRol.value = null
      }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al eliminar rol')
      console.error('Error en deleteRol:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  return {
    roles,
    currentRol,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    filtros,
    fetchRoles,
    fetchRolById,
    createRol,
    updateRol,
    deleteRol,
    setCurrentPage,
  }
})

