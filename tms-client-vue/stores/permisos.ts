import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { extractArrayFromResponse, extractTotalFromResponse, extractErrorMessage } from '~/utils/apiHelpers'

export interface Permiso {
  id?: number
  rol_id: number
  recurso: string
  accion: string
  descripcion?: string | null
  activo?: boolean
  rol?: { id: number; nombre: string } | null
  createdAt?: string
  updatedAt?: string
}

export const usePermisosStore = defineStore('permisos', () => {
  const api = useApi()
  const permisos = ref<Permiso[]>([])
  const currentPermiso = ref<Permiso | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const filtros = ref({
    sort: 'id',
    order: 'ASC' as 'ASC' | 'DESC',
    rol_id: undefined as number | undefined,
    recurso: '',
    accion: '',
  })

  const accionesDisponibles = ['VER', 'CREAR', 'EDITAR', 'ELIMINAR', 'LISTAR', 'EXPORTAR']
  const recursosDisponibles = [
    'laboratorios',
    'usuarios',
    'roles',
    'permisos',
    'productos',
    'cultivos',
    'variedades',
    'tipos-ensayo',
    'tipos-siembra',
    'ensayos',
    'protocolos',
    'tratamientos',
    'bloques',
    'parcelas',
  ]

  const fetchPermisos = async (params: any = {}) => {
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

      if (filtros.value.rol_id) {
        queryParams.append('rol_id', String(filtros.value.rol_id))
      }
      if (filtros.value.recurso) {
        queryParams.append('recurso', filtros.value.recurso)
      }
      if (filtros.value.accion) {
        queryParams.append('accion', filtros.value.accion)
      }

      const response = await api.get(`/permisos?${queryParams}`)

      permisos.value = extractArrayFromResponse(response)
      total.value = extractTotalFromResponse(response, permisos.value.length)
      currentPage.value = pageValue

      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar permisos')
      console.error('Error en fetchPermisos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPermisosByRolId = async (rol_id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/permisos/rol/${rol_id}`)
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar permisos del rol')
      console.error('Error en fetchPermisosByRolId:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPermisoById = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get(`/permisos/${id}`)
      currentPermiso.value = response
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar el permiso')
      console.error('Error en fetchPermisoById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createPermiso = async (data: Permiso) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/permisos`, data)
      permisos.value.unshift(response)
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al crear permiso')
      console.error('Error en createPermiso:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePermiso = async (id: number, data: Partial<Permiso>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/permisos/${id}`, data)
      const index = permisos.value.findIndex(p => p.id === id)
      if (index !== -1) {
        permisos.value[index] = response
      }
      if (currentPermiso.value?.id === id) {
        currentPermiso.value = response
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al actualizar permiso')
      console.error('Error en updatePermiso:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePermiso = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/permisos/${id}`)
      permisos.value = permisos.value.filter(p => p.id !== id)
      if (currentPermiso.value?.id === id) {
        currentPermiso.value = null
      }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al eliminar permiso')
      console.error('Error en deletePermiso:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const asignarPermisosDefault = async (rol_id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/permisos/rol/${rol_id}/asignar-default`, {})
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al asignar permisos por defecto')
      console.error('Error en asignarPermisosDefault:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  return {
    permisos,
    currentPermiso,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    filtros,
    accionesDisponibles,
    recursosDisponibles,
    fetchPermisos,
    fetchPermisosByRolId,
    fetchPermisoById,
    createPermiso,
    updatePermiso,
    deletePermiso,
    asignarPermisosDefault,
    setCurrentPage,
  }
})

