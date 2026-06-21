import { ref, computed } from 'vue'
import { useProtocolosStore } from '~/stores/protocolos'

export function useProtocolos() {
  const protocolosStore = useProtocolosStore()

  const showFormProtocolo = ref(false)
  const editingProtocolo = ref<any | null>(null)
  const expandedProtocoloId = ref<number | null>(null)

  // Cargar protocolos
  async function cargarProtocolos(filtros: Record<string, any> = {}) {
    await protocolosStore.fetchProtocolos(filtros)
  }

  // Protocolos
  async function crearProtocolo(datos: any) {
    const payload = {
      nombre: datos.nombre,
      descripcion: datos.descripcion || null,
    }

    const resultado = await protocolosStore.createProtocolo(payload)
    showFormProtocolo.value = false
    editingProtocolo.value = null
    return resultado
  }

  async function actualizarProtocolo(id: number, datos: any) {
    const payload = {
      nombre: datos.nombre,
      descripcion: datos.descripcion || null,
    }

    const resultado = await protocolosStore.updateProtocolo(id, payload)
    showFormProtocolo.value = false
    editingProtocolo.value = null
    return resultado
  }

  async function eliminarProtocolo(id: number) {
    await protocolosStore.deleteProtocolo(id)
  }

  // Detalle
  async function abrirDetalleProtocolo(id: number) {
    expandedProtocoloId.value = id === expandedProtocoloId.value ? null : id
    if (expandedProtocoloId.value === id) {
      await protocolosStore.fetchProtocoloById(id)
    } else {
      protocolosStore.clearCurrent()
    }
  }

  // Helpers
  function abrirFormProtocolo(protocolo?: any) {
    editingProtocolo.value = protocolo || null
    showFormProtocolo.value = true
  }

  function cerrarFormProtocolo() {
    showFormProtocolo.value = false
    editingProtocolo.value = null
  }

  // Búsqueda y filtros
  function aplicarBusqueda(q: string) {
    protocolosStore.setFiltro('q', q)
    protocolosStore.resetPaginacion()
  }

  function cambiarOrdenamiento(sort: string, order: 'ASC' | 'DESC') {
    protocolosStore.setFiltro('sort', sort)
    protocolosStore.setFiltro('order', order)
    protocolosStore.resetPaginacion()
  }

  return {
    // Estado
    showFormProtocolo,
    editingProtocolo,
    expandedProtocoloId,

    // Store
    protocolosStore,

    // Métodos
    cargarProtocolos,
    crearProtocolo,
    actualizarProtocolo,
    eliminarProtocolo,
    abrirDetalleProtocolo,
    abrirFormProtocolo,
    cerrarFormProtocolo,
    aplicarBusqueda,
    cambiarOrdenamiento,
  }
}

