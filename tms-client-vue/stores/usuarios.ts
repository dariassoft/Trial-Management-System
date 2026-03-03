import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { extractArrayFromResponse, extractTotalFromResponse, extractErrorMessage } from '~/utils/apiHelpers'

export interface Usuario {
  id?: number
  username: string
  nombre?: string | null
  apellido?: string | null
  telefono: string
  fecha_nacimiento?: string | null
  esta_activo?: boolean
  rol?: { id: number; nombre: string } | null
  rolId?: number
  laboratoriosAsignados?: Array<{
    id: number
    laboratorio: { id: number; nombre: string }
  }>
  password?: string
  laboratorioIds?: number[]
}

export const useUsuariosStore = defineStore('usuarios', () => {
  const api = useApi()
  const usuarios = ref<Usuario[]>([])
  const currentUsuario = ref<Usuario | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const filtros = ref({
    sort: 'username',
    order: 'ASC' as 'ASC' | 'DESC',
    q: ''
  })

  const fetchUsuarios = async (params: any = {}) => {
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

      const response = await api.get(`/users?${queryParams}`)

      usuarios.value = extractArrayFromResponse(response)
      total.value = extractTotalFromResponse(response, usuarios.value.length)
      currentPage.value = pageValue

      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar usuarios')
      console.error('Error en fetchUsuarios:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUsuarioById = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get(`/users/${id}`)
      currentUsuario.value = response
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar el usuario')
      console.error('Error en fetchUsuarioById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createUsuario = async (data: Usuario) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/users`, data)
      usuarios.value.unshift(response)
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al crear usuario')
      console.error('Error en createUsuario:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUsuario = async (id: number, data: Partial<Usuario>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/users/${id}`, data)
      const index = usuarios.value.findIndex(u => u.id === id)
      if (index !== -1) {
        usuarios.value[index] = response
      }
      if (currentUsuario.value?.id === id) {
        currentUsuario.value = response
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al actualizar usuario')
      console.error('Error en updateUsuario:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUsuario = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/users/${id}`)
      usuarios.value = usuarios.value.filter(u => u.id !== id)
      if (currentUsuario.value?.id === id) {
        currentUsuario.value = null
      }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al eliminar usuario')
      console.error('Error en deleteUsuario:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const asignarLaboratorios = async (usuarioId: number, laboratorioIds: number[]) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/users/${usuarioId}/laboratorios`, {
        laboratorioIds
      })
      const index = usuarios.value.findIndex(u => u.id === usuarioId)
      if (index !== -1) {
        usuarios.value[index] = response
      }
      if (currentUsuario.value?.id === usuarioId) {
        currentUsuario.value = response
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al asignar laboratorios')
      console.error('Error en asignarLaboratorios:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const quitarLaboratorio = async (usuarioId: number, labId: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/users/${usuarioId}/laboratorios/${labId}`)
      const index = usuarios.value.findIndex(u => u.id === usuarioId)
      if (index !== -1 && usuarios.value[index].laboratoriosAsignados) {
        usuarios.value[index].laboratoriosAsignados = usuarios.value[index].laboratoriosAsignados!.filter(
          lab => lab.laboratorio.id !== labId
        )
      }
      if (currentUsuario.value?.id === usuarioId && currentUsuario.value.laboratoriosAsignados) {
        currentUsuario.value.laboratoriosAsignados = currentUsuario.value.laboratoriosAsignados.filter(
          lab => lab.laboratorio.id !== labId
        )
      }
      return { deleted: true }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al quitar laboratorio')
      console.error('Error en quitarLaboratorio:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  return {
    usuarios,
    currentUsuario,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    filtros,
    fetchUsuarios,
    fetchUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    asignarLaboratorios,
    quitarLaboratorio,
    setCurrentPage,
  }
})

