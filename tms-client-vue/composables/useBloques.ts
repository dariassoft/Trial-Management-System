import { ref } from 'vue'
import { useBloquesStore } from '~/stores/bloques'

export function useBloques() {
  const bloquesStore = useBloquesStore()

  const showFormBloque = ref(false)
  const editingBloque = ref<any | null>(null)
  const ensayoSeleccionadoId = ref<number | null>(null)

  // Cargar bloques
  async function cargarBloques(filtros: Record<string, any> = {}) {
    await bloquesStore.fetchBloques(filtros)
  }

  // CRUD Bloques
  async function crearBloque(datos: any) {
    const payload = {
      ensayoId: ensayoSeleccionadoId.value,
      nombreBloque: datos.nombreBloque,
    }
    const resultado = await bloquesStore.createBloque(payload)
    showFormBloque.value = false
    editingBloque.value = null
    return resultado
  }

  async function actualizarBloque(id: number, datos: any) {
    const payload = {
      nombreBloque: datos.nombreBloque,
    }
    const resultado = await bloquesStore.updateBloque(id, payload)
    showFormBloque.value = false
    editingBloque.value = null
    return resultado
  }

  async function eliminarBloque(id: number) {
    await bloquesStore.deleteBloque(id)
  }

  // Helpers
  function abrirFormBloque(bloque?: any) {
    editingBloque.value = bloque || null
    showFormBloque.value = true
  }

  function cerrarFormBloque() {
    showFormBloque.value = false
    editingBloque.value = null
  }

  function setEnsayoId(id: number) {
    ensayoSeleccionadoId.value = id
  }

  return {
    // Estado
    showFormBloque,
    editingBloque,
    ensayoSeleccionadoId,
    bloquesStore,

    // Métodos
    cargarBloques,
    crearBloque,
    actualizarBloque,
    eliminarBloque,
    abrirFormBloque,
    cerrarFormBloque,
    setEnsayoId,
  }
}

