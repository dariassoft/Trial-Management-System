import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'

/** Paso individual del flujo */
export interface PasoFlujo {
  id: string
  orden: number
  nombre: string
  descripcion: string
  completado: boolean
  detalle?: string
  progreso?: string
  ruta: string
  icono?: string
}

/** Progreso general */
export interface ProgresoFlujo {
  completados: number
  total: number
  porcentaje: number
}

/** Estado completo del flujo de un ensayo */
export interface EstadoFlujo {
  ensayoId: number
  nombreEnsayo: string
  pasos: PasoFlujo[]
  siguientePaso?: PasoFlujo | null
  progreso: ProgresoFlujo
}

/** Prerequisito global */
export interface PrerequisitoPaso {
  id: string
  nombre: string
  disponible: boolean
  cantidad: number
  detalle?: string
  ruta: string
}

/** Prerequisitos globales */
export interface Prerequisitos {
  puedeCrearEnsayo: boolean
  prerequisitos: PrerequisitoPaso[]
  mensaje?: string
}

export const useAsistenteFlujoStore = defineStore('asistente-flujo', () => {
  const api = useApi()

  // Estado
  const isOpen = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const estadoFlujo = ref<EstadoFlujo | null>(null)
  const prerequisitos = ref<Prerequisitos | null>(null)
  const ensayoIdActual = ref<number | null>(null)
  const modo = ref<'estado' | 'prerequisitos' | 'inicio'>('inicio')

  // Computed
  const porcentaje = computed(() => estadoFlujo.value?.progreso?.porcentaje ?? 0)
  const siguientePaso = computed(() => estadoFlujo.value?.siguientePaso ?? null)
  const pasos = computed(() => estadoFlujo.value?.pasos ?? [])
  const pasosCompletados = computed(() => pasos.value.filter(p => p.completado).length)
  const totalPasos = computed(() => pasos.value.length)

  // Acciones
  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const fetchEstado = async (ensayoId: number) => {
    loading.value = true
    error.value = null
    ensayoIdActual.value = ensayoId
    modo.value = 'estado'
    try {
      const response = await api.get(`/asistente-flujo/estado/${ensayoId}`)
      estadoFlujo.value = response as EstadoFlujo
      return response
    } catch (err: any) {
      error.value = err?.data?.message || 'Error al cargar el estado del flujo'
      console.error('Error en fetchEstado:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPrerequisitos = async () => {
    loading.value = true
    error.value = null
    modo.value = 'prerequisitos'
    try {
      const response = await api.get('/asistente-flujo/prerequisitos')
      prerequisitos.value = response as Prerequisitos
      return response
    } catch (err: any) {
      error.value = err?.data?.message || 'Error al cargar prerequisitos'
      console.error('Error en fetchPrerequisitos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    estadoFlujo.value = null
    prerequisitos.value = null
    ensayoIdActual.value = null
    modo.value = 'inicio'
    error.value = null
  }

  return {
    // Estado
    isOpen,
    loading,
    error,
    estadoFlujo,
    prerequisitos,
    ensayoIdActual,
    modo,
    // Computed
    porcentaje,
    siguientePaso,
    pasos,
    pasosCompletados,
    totalPasos,
    // Acciones
    toggle,
    open,
    close,
    fetchEstado,
    fetchPrerequisitos,
    reset,
  }
})

