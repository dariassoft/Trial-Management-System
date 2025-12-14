import { ref } from 'vue'
import { useParcelasStore } from '~/stores/parcelas'

export function useParcelas() {
  const parcelasStore = useParcelasStore()

  const showFormParcela = ref(false)
  const editingParcela = ref<any | null>(null)
  const ensayoSeleccionadoId = ref<number | null>(null)
  const bloqueSeleccionadoId = ref<number | null>(null)

  // Cargar parcelas
  async function cargarParcelas(filtros: Record<string, any> = {}) {
    await parcelasStore.fetchParcelas(filtros)
  }

  // CRUD Parcelas
  async function crearParcela(datos: any) {
    const payload = {
      ensayoId: ensayoSeleccionadoId.value,
      bloqueId: bloqueSeleccionadoId.value,
      tratamientoId: datos.tratamientoId,
      nombreParcela: datos.nombreParcela,
      posXGrid: datos.posXGrid,
      posYGrid: datos.posYGrid,
    }
    const resultado = await parcelasStore.createParcela(payload)
    showFormParcela.value = false
    editingParcela.value = null
    return resultado
  }

  async function actualizarParcela(id: number, datos: any) {
    const payload = {
      nombreParcela: datos.nombreParcela,
      posXGrid: datos.posXGrid,
      posYGrid: datos.posYGrid,
    }
    const resultado = await parcelasStore.updateParcela(id, payload)
    showFormParcela.value = false
    editingParcela.value = null
    return resultado
  }

  async function eliminarParcela(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta parcela?')) {
      await parcelasStore.deleteParcela(id)
    }
  }

  // Helpers
  function abrirFormParcela(parcela?: any) {
    editingParcela.value = parcela || null
    showFormParcela.value = true
  }

  function cerrarFormParcela() {
    showFormParcela.value = false
    editingParcela.value = null
  }

  function setEnsayoId(id: number) {
    ensayoSeleccionadoId.value = id
  }

  function setBloqueId(id: number) {
    bloqueSeleccionadoId.value = id
  }

  return {
    // Estado
    showFormParcela,
    editingParcela,
    ensayoSeleccionadoId,
    bloqueSeleccionadoId,
    parcelasStore,

    // Métodos
    cargarParcelas,
    crearParcela,
    actualizarParcela,
    eliminarParcela,
    abrirFormParcela,
    cerrarFormParcela,
    setEnsayoId,
    setBloqueId,
  }
}

