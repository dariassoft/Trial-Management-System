import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'
import { ref } from 'vue'

export interface Medicion {
  id?: number
  variableId: number
  variable?: {
    id: number
    nombre_variable: string
    unidad_medida?: string
  }
  valor: string
}

export interface DatosCampo {
  id: number
  observaciones?: string | null
  parcela?: {
    id: number
    nombreParcela: string
    posXGrid?: number
    posYGrid?: number
    bloque?: {
      id: number
      nombreBloque: string
    }
    tratamiento?: {
      id: number
      descripcion: string
    }
  }
  momento?: {
    id: number
    nombreMomento: string
    diasDespuesAplicacion?: number
  }
  mediciones?: Medicion[]
  fotos?: any[]
}

export interface CreateDatosCampoDto {
  parcela_id_fk: number
  momento_id_fk: number
  observaciones?: string
  mediciones?: { variable_id: number; valor: string }[]
}

export const useDatosCampoStore = defineStore('datosCampo', () => {
  const api = useApi()

  // Estado
  const items = ref<DatosCampo[]>([])
  const current = ref<DatosCampo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Obtener datos de campo por momento
  async function fetchByMomento(momentoId: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/datos-campo', { params: { momentoId, limit: 200 } })
      console.log('📡 fetchByMomento respuesta raw:', res)

      // La API devuelve { data: [...], meta: {...} }
      let data: any[]
      if (res?.data && Array.isArray(res.data)) {
        data = res.data
      } else if (Array.isArray(res)) {
        data = res
      } else {
        data = res?.data?.data || res?.data || []
      }

      console.log('📡 fetchByMomento items procesados:', data.length)
      if (data.length > 0) {
        console.log('📡 Primer item fotos:', data[0]?.fotos?.length)
      }

      items.value = data
      return items.value
    } catch (err: any) {
      error.value = err.message || 'Error al cargar datos de campo'
      console.error('Error fetchByMomento:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener datos de campo por parcela
  async function fetchByParcela(parcelaId: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/datos-campo', { params: { parcelaId, limit: 200 } })
      const data = res && (res.data ?? res)
      items.value = Array.isArray(data) ? data : (data?.data || [])
      return items.value
    } catch (err: any) {
      error.value = err.message || 'Error al cargar datos de campo'
      console.error('Error fetchByParcela:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Obtener un registro por ID
  async function fetchById(id: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/datos-campo/${id}`)
      const data = res && (res.data ?? res)
      current.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar datos de campo'
      console.error('Error fetchById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Crear o actualizar medición para una parcela/momento
  async function guardarMedicion(dto: CreateDatosCampoDto) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/datos-campo', dto)
      const data = res && (res.data ?? res)
      current.value = data

      // Actualizar en la lista si existe
      const idx = items.value.findIndex(
        item => item.parcela?.id === dto.parcela_id_fk && item.momento?.id === dto.momento_id_fk
      )
      if (idx !== -1) {
        items.value[idx] = data
      } else {
        items.value.push(data)
      }

      return data
    } catch (err: any) {
      error.value = err.message || 'Error al guardar medición'
      console.error('Error guardarMedicion:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar un registro existente
  async function update(id: number, dto: Partial<CreateDatosCampoDto>) {
    loading.value = true
    error.value = null
    try {
      const res = await api.patch(`/datos-campo/${id}`, dto)
      const data = res && (res.data ?? res)
      current.value = data

      const idx = items.value.findIndex(item => item.id === id)
      if (idx !== -1) {
        items.value[idx] = data
      }

      return data
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar'
      console.error('Error update:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Buscar si ya existe medición para parcela/momento
  function findByParcelaMomento(parcelaId: number, momentoId: number): DatosCampo | undefined {
    return items.value.find(
      item => item.parcela?.id === parcelaId && item.momento?.id === momentoId
    )
  }

  // Subir foto o video para una visita (DatosCampo)
  async function uploadFoto(visitaId: number, file: Blob, filename: string): Promise<any> {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('file', file, filename)

      // Usar $fetch directamente para FormData
      const config = useRuntimeConfig()
      const baseURL = config.public.apiBase || 'http://localhost:3000/api/v1'
      const authStore = useAuthStore()

      const res = await $fetch(`${baseURL}/datos-campo/${visitaId}/upload-foto`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '',
        },
      })

      console.log('📸 Foto subida:', res)
      return res
    } catch (err: any) {
      error.value = err.message || 'Error al subir foto'
      console.error('Error uploadFoto:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Limpiar estado
  function reset() {
    items.value = []
    current.value = null
    error.value = null
  }

  return {
    items,
    current,
    loading,
    error,
    fetchByMomento,
    fetchByParcela,
    fetchById,
    guardarMedicion,
    update,
    findByParcelaMomento,
    uploadFoto,
    reset,
  }
})
