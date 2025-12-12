import { ref, computed } from 'vue'
import { useProtocolosStore } from '~/stores/protocolos'
import { useTratamientosStore } from '~/stores/tratamientos'

export function useTratamientos() {
  const protocolosStore = useProtocolosStore()
  const tratamientosStore = useTratamientosStore()

  const showFormTratamiento = ref(false)
  const showFormProducto = ref(false)
  const editingTratamiento = ref<any | null>(null)
  const editingProducto = ref<any | null>(null)
  const protocoloSeleccionado = ref<number | null>(null)

  // Cargar tratamientos de un protocolo
  async function cargarTratamientos(protocoloId: number) {
    protocoloSeleccionado.value = protocoloId
    tratamientosStore.setFiltro('protocoloId', protocoloId)
    await tratamientosStore.fetchTratamientos({ protocoloId })
  }

  // Tratamientos
  async function crearTratamiento(datos: any) {
    if (!protocoloSeleccionado.value) throw new Error('Protocolo no seleccionado')

    const payload = {
      protocoloId: protocoloSeleccionado.value,
      numeroTrat: datos.numeroTrat,
      descripcion: datos.descripcion || null,
      esTestigo: datos.esTestigo || false,
    }

    const resultado = await tratamientosStore.createTratamiento(payload)
    showFormTratamiento.value = false
    editingTratamiento.value = null
    return resultado
  }

  async function actualizarTratamiento(id: number, datos: any) {
    const payload = {
      numeroTrat: datos.numeroTrat,
      descripcion: datos.descripcion || null,
      esTestigo: datos.esTestigo || false,
    }

    const resultado = await tratamientosStore.updateTratamiento(id, payload)
    showFormTratamiento.value = false
    editingTratamiento.value = null
    return resultado
  }

  async function eliminarTratamiento(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este tratamiento?')) {
      await tratamientosStore.deleteTratamiento(id)
    }
  }

  // Productos en Tratamiento
  async function agregarProducto(datos: any) {
    if (!editingTratamiento.value?.id) throw new Error('Tratamiento no seleccionado')

    const payload = {
      tratamientoId: editingTratamiento.value.id,
      productoId: datos.productoId,
      dosis: datos.dosis || null,
      unidadDosis: datos.unidadDosis || 'cc/ha',
      estadio: datos.estadio || null,
    }

    const resultado = await tratamientosStore.createTratamientoProducto(payload)
    showFormProducto.value = false
    return resultado
  }

  async function eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      await tratamientosStore.deleteTratamientoProducto(id)
    }
  }

  async function actualizarProducto(id: number, datos: any) {
    const payload = {
      dosis: datos.dosis || null,
      unidadDosis: datos.unidadDosis || 'cc/ha',
      estadio: datos.estadio || null,
    }

    await tratamientosStore.updateTratamientoProducto(id, payload)
    editingProducto.value = null
  }

  // Helpers
  function abrirFormTratamiento(tratamiento?: any) {
    editingTratamiento.value = tratamiento || null
    showFormTratamiento.value = true
  }

  function cerrarFormTratamiento() {
    showFormTratamiento.value = false
    editingTratamiento.value = null
  }

  function abrirFormProducto() {
    showFormProducto.value = true
  }

  function cerrarFormProducto() {
    showFormProducto.value = false
    editingProducto.value = null
  }

  return {
    // Estado
    showFormTratamiento,
    showFormProducto,
    editingTratamiento,
    editingProducto,
    protocoloSeleccionado,

    // Stores
    protocolosStore,
    tratamientosStore,

    // Métodos
    cargarTratamientos,
    crearTratamiento,
    actualizarTratamiento,
    eliminarTratamiento,
    agregarProducto,
    eliminarProducto,
    actualizarProducto,
    abrirFormTratamiento,
    cerrarFormTratamiento,
    abrirFormProducto,
    cerrarFormProducto,
  }
}

