import { ref, computed } from 'vue'
import { useEnsayosStore, type Ensayo } from '~/stores/ensayos'

export const useEnsayos = () => {
  const ensayosStore = useEnsayosStore()
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const authStore = useAuthStore()

  // Estados locales
  const cultivos = ref<any[]>([])
  const variedades = ref<any[]>([])
  const loadingCultivos = ref(false)
  const searchQuery = ref('')
  const filterEstado = ref('todos')
  const filteredEnsayos = computed(() => {
    let result = ensayosStore.ensayos

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        e =>
          e.nombreEnsayo?.toLowerCase().includes(q) ||
          e.responsable?.toLowerCase().includes(q) ||
          e.cultivoEspecie?.toLowerCase().includes(q)
      )
    }

    return result
  })

  // Fetch cultivos
  const fetchCultivos = async () => {
    loadingCultivos.value = true
    try {
      const response = await $fetch(`${apiBase}/catalogos/cultivos`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      cultivos.value = response.data || response || []
      return cultivos.value
    } catch (error) {
      console.error('Error cargando cultivos:', error)
      cultivos.value = []
      throw error
    } finally {
      loadingCultivos.value = false
    }
  }

  // Fetch variedades por cultivo
  const fetchVariedades = async (cultivoEspecie: string) => {
    loadingCultivos.value = true
    try {
      // Encontrar el cultivo_id del cultivo por nombre
      const cultivo = cultivos.value.find(c => c.nombre === cultivoEspecie)
      if (!cultivo) {
        variedades.value = []
        return []
      }

      const response = await $fetch(`${apiBase}/catalogos/cultivos/${cultivo.cultivo_id}/variedades`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      variedades.value = response.data || response || []
      return variedades.value
    } catch (error) {
      console.error('Error cargando variedades:', error)
      variedades.value = []
      throw error
    } finally {
      loadingCultivos.value = false
    }
  }

  // Formatear fecha para input type="date"
  const formatDateForInput = (date: string | Date): string => {
    if (!date) return ''
    const d = new Date(date)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const year = d.getFullYear()
    return `${year}-${month}-${day}`
  }

  // Formatear fecha para mostrar
  const formatDateForDisplay = (date: string | Date): string => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  // Validar formulario
  const validateForm = (data: Ensayo): string[] => {
    const errors: string[] = []

    if (!data.nombreEnsayo?.trim()) errors.push('El nombre del ensayo es requerido')
    if (!data.versionProtocolo?.trim()) errors.push('La versión del protocolo es requerida')
    if (!data.provincia?.trim()) errors.push('La provincia es requerida')
    if (!data.departamento?.trim()) errors.push('El departamento es requerido')
    if (!data.cultivoEspecie?.trim()) errors.push('La especie de cultivo es requerida')
    if (!data.cultivoVariedad?.trim()) errors.push('La variedad es requerida')
    if (!data.fechaSiembra?.trim()) errors.push('La fecha de siembra es requerida')

    if (data.nombreEnsayo && data.nombreEnsayo.length > 255) {
      errors.push('El nombre del ensayo no puede exceder 255 caracteres')
    }

    if (data.versionProtocolo && data.versionProtocolo.length > 20) {
      errors.push('La versión del protocolo no puede exceder 20 caracteres')
    }

    return errors
  }

  // Obtener cultivo por ID
  const getCultivoById = (id: string) => {
    return cultivos.value.find(c => c.id === id || c.cultivo_id === id)
  }

  // Obtener variedad por ID
  const getVariedadById = (id: string) => {
    return variedades.value.find(v => v.id === id || v.cultivo_variedad_id === id)
  }

  return {
    // Store
    ensayosStore,

    // Estados
    cultivos,
    variedades,
    loadingCultivos,
    searchQuery,
    filterEstado,
    filteredEnsayos,

    // Métodos
    fetchCultivos,
    fetchVariedades,
    formatDateForInput,
    formatDateForDisplay,
    validateForm,
    getCultivoById,
    getVariedadById,
  }
}

