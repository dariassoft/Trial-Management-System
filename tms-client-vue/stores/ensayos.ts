import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { extractArrayFromResponse, extractTotalFromResponse, extractErrorMessage } from '~/utils/apiHelpers'
import type { Usuario } from '~/stores/usuarios'

export interface Ensayo {
  id?: string | number
  nombreEnsayo: string
  responsable?: Usuario | null
  responsableId?: number | null
  provincia: string
  departamento: string
  establecimiento?: string
  lote?: string
  latitud?: number
  longitud?: number
  cultivo?: { id: number; nombre: string } | null
  cultivoId?: number | null
  variedad?: { id: number; nombre: string } | null
  variedadId?: number | null
  tipoSiembra?: { id: number; nombre: string } | null
  tipoSiembraId?: number | null
  distSurcosCm?: number
  filas?: number | null
  columnas?: number | null
  cantBloques?: number | null
  fechaInicio?: string
  fechaSiembra: string
  fechaCosecha?: string
  laboratorio?: { id: number; nombre: string } | null
  laboratorioId?: number | null
  tipoEnsayo?: { id: number; nombre: string } | null
  tipoEnsayoId?: number | null
  protocolo?: { id: number; nombre: string } | null
  protocoloId?: number | null
  codigoLabor?: string
  status?: { id: number; nombre: string } | null
  statusId?: number | null
  createdAt?: string
  updatedAt?: string
}

export const useEnsayosStore = defineStore('ensayos', () => {
  const api = useApi();
  const ensayos = ref<Ensayo[]>([])
  const currentEnsayo = ref<Ensayo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  const fetchEnsayoById = async (id: string) => {
    loading.value = true
    try {
      const response = await api.get(`/ensayos/${id}`);
      currentEnsayo.value = response;
      return response;
    } catch (err) {
      error.value = err.data?.message || 'Error al cargar el ensayo';
      console.error('Error en fetchEnsayoById:', err);
      throw err;
    } finally {
      loading.value = false
    }
  }

  const updateEnsayo = async (id: string, data: Partial<Ensayo>) => {
    loading.value = true
    error.value = null
    try {
      await api.patch(`/ensayos/${id}`, data)
      // Después de actualizar, volver a fetchear el ensayo para obtener los datos frescos
      const updatedEnsayo = await fetchEnsayoById(id);
      
      // Actualizar también la lista de ensayos si existe
      const index = ensayos.value.findIndex(e => e.id === id);
      if (index !== -1) {
        ensayos.value[index] = updatedEnsayo;
      }

    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al actualizar ensayo')
      console.error('Error en updateEnsayo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const fetchEnsayos = async (params: any = {}) => {
    loading.value = true
    error.value = null
    try {
      const limitValue = params.limit || pageSize.value
      const pageValue = params.page || currentPage.value
      const queryParams = new URLSearchParams({
        limit: String(limitValue),
        page: String(pageValue),
        ...params,
      })

      const response = await api.get(`/ensayos?${queryParams}`)

      // Usar helpers para extraer datos de manera consistente
      ensayos.value = extractArrayFromResponse(response)
      total.value = extractTotalFromResponse(response, ensayos.value.length)
      currentPage.value = pageValue

      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar ensayos')
      console.error('Error en fetchEnsayos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchEnsayosForSelect = async (term: string) => {
    try {
      const response = await api.get(`/ensayos/select?term=${term}`);
      return response; // Devuelve directamente la respuesta de la API
    } catch (err) {
      console.error('Error en fetchEnsayosForSelect:', err);
      throw err;
    }
  };

  const createEnsayo = async (data: Ensayo) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/ensayos`, data)
      ensayos.value.unshift(response)
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al crear ensayo')
      console.error('Error en createEnsayo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteEnsayo = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/ensayos/${id}`)
      ensayos.value = ensayos.value.filter(e => e.id !== id)
      if (currentEnsayo.value?.id === id) {
        currentEnsayo.value = null
      }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al eliminar ensayo')
      console.error('Error en deleteEnsayo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed para acceso consistente con otros stores
  const items = computed(() => ensayos.value)

  return {
    ensayos,
    items,
    currentEnsayo,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    fetchEnsayos,
    fetchEnsayoById,
    createEnsayo,
    updateEnsayo,
    deleteEnsayo,
    fetchEnsayosForSelect,
  }
})
