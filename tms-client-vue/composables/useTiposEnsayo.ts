import { ref } from 'vue'
import { useTiposEnsayoStore } from '~/stores/tiposEnsayo'

export function useTiposEnsayo() {
  const tiposEnsayoStore = useTiposEnsayoStore()

  const showFormTipoEnsayo = ref(false)
  const editingTipoEnsayo = ref<any | null>(null)
  const expandedTipoEnsayoId = ref<number | null>(null)

  const showFormVariable = ref(false)
  const editingVariable = ref<any | null>(null)
  const tipoEnsayoSeleccionado = ref<number | null>(null)

  const showFormDias = ref(false)
  const diasInput = ref<string>('')

  // Cargar tipos de ensayo
  async function cargarTiposEnsayo(filtros: Record<string, any> = {}) {
    await tiposEnsayoStore.fetchTiposEnsayo(filtros)
  }

  // Tipos de Ensayo CRUD
  async function crearTipoEnsayo(datos: any) {
    const payload = {
      nombre: datos.nombre,
      evaluacionCsv: datos.evaluacionCsv || null,
      activo: datos.activo !== false,
    }

    const resultado = await tiposEnsayoStore.createTipoEnsayo(payload)
    showFormTipoEnsayo.value = false
    editingTipoEnsayo.value = null
    return resultado
  }

  async function actualizarTipoEnsayo(id: number, datos: any) {
    const payload = {
      nombre: datos.nombre,
      activo: datos.activo !== false,
    }

    const resultado = await tiposEnsayoStore.updateTipoEnsayo(id, payload)
    showFormTipoEnsayo.value = false
    editingTipoEnsayo.value = null
    return resultado
  }

  async function eliminarTipoEnsayo(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este tipo de ensayo? Se eliminarán también sus variables y días de evaluación.')) {
      await tiposEnsayoStore.deleteTipoEnsayo(id)
    }
  }

  // Detalle
  async function abrirDetalleTipoEnsayo(id: number) {
    expandedTipoEnsayoId.value = id === expandedTipoEnsayoId.value ? null : id
    if (expandedTipoEnsayoId.value === id) {
      await tiposEnsayoStore.fetchTipoEnsayoById(id)
    } else {
      tiposEnsayoStore.clearCurrent()
    }
  }

  // Helpers - Tipo de Ensayo
  function abrirFormTipoEnsayo(tipoEnsayo?: any) {
    editingTipoEnsayo.value = tipoEnsayo || null
    showFormTipoEnsayo.value = true
  }

  function cerrarFormTipoEnsayo() {
    showFormTipoEnsayo.value = false
    editingTipoEnsayo.value = null
  }

  // Variables
  function abrirNuevaVariable(tipoEnsayoId: number) {
    tipoEnsayoSeleccionado.value = tipoEnsayoId
    editingVariable.value = null
    showFormVariable.value = true
  }

  async function agregarVariable(datos: any) {
    try {
      if (tipoEnsayoSeleccionado.value) {
        if (editingVariable.value?.id) {
          // Modo edición
          await tiposEnsayoStore.updateVariable(editingVariable.value.id, datos)
        } else {
          // Modo creación
          await tiposEnsayoStore.addVariable(tipoEnsayoSeleccionado.value, datos)
        }

        // Recargar el tipo de ensayo actual
        if (expandedTipoEnsayoId.value) {
          await abrirDetalleTipoEnsayo(expandedTipoEnsayoId.value)
        }
      }
      showFormVariable.value = false
      editingVariable.value = null
    } catch (err) {
      console.error('Error al guardar variable:', err)
    }
  }

  function editarVariable(variable: any) {
    tipoEnsayoSeleccionado.value = expandedTipoEnsayoId.value || null
    editingVariable.value = variable
    showFormVariable.value = true
  }

  async function eliminarVariable(variableId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta variable?')) {
      try {
        if (expandedTipoEnsayoId.value) {
          await tiposEnsayoStore.removeVariable(expandedTipoEnsayoId.value, variableId)
        }

        // Recargar el tipo de ensayo actual
        if (expandedTipoEnsayoId.value) {
          await abrirDetalleTipoEnsayo(expandedTipoEnsayoId.value)
        }
      } catch (err) {
        console.error('Error al eliminar variable:', err)
      }
    }
  }

  function cerrarFormVariable() {
    showFormVariable.value = false
    editingVariable.value = null
  }

  // Días de evaluación
  function abrirFormDias(tipoEnsayoId: number) {
    tipoEnsayoSeleccionado.value = tipoEnsayoId
    diasInput.value = ''

    if (tiposEnsayoStore.current?.id === tipoEnsayoId && tiposEnsayoStore.current.evaluacionCsv) {
      diasInput.value = tiposEnsayoStore.current.evaluacionCsv
    }

    showFormDias.value = true
  }

  async function guardarDias() {
    try {
      if (tipoEnsayoSeleccionado.value) {
        // Convertir string a array de números
        const dias = diasInput.value
          .split(',')
          .map(d => d.trim())
          .filter(d => d.length > 0)
          .map(d => parseInt(d, 10))
          .filter(d => !isNaN(d) && d >= 0)

        if (dias.length === 0) {
          alert('Ingresa al menos un día válido')
          return
        }

        await tiposEnsayoStore.setEvaluacion(tipoEnsayoSeleccionado.value, { dias })

        // Recargar el tipo de ensayo actual
        if (expandedTipoEnsayoId.value) {
          await abrirDetalleTipoEnsayo(expandedTipoEnsayoId.value)
        }
      }
      showFormDias.value = false
    } catch (err) {
      console.error('Error al guardar días:', err)
    }
  }

  function cerrarFormDias() {
    showFormDias.value = false
    diasInput.value = ''
  }

  // Búsqueda y filtros
  function aplicarBusqueda(q: string) {
    tiposEnsayoStore.setFiltro('q', q)
    tiposEnsayoStore.resetPaginacion()
  }

  function cambiarOrdenamiento(sort: string, order: 'ASC' | 'DESC') {
    tiposEnsayoStore.setFiltro('sort', sort)
    tiposEnsayoStore.setFiltro('order', order)
    tiposEnsayoStore.resetPaginacion()
  }

  return {
    // Estado
    showFormTipoEnsayo,
    editingTipoEnsayo,
    expandedTipoEnsayoId,
    showFormVariable,
    editingVariable,
    tipoEnsayoSeleccionado,
    showFormDias,
    diasInput,

    // Store
    tiposEnsayoStore,

    // Métodos
    cargarTiposEnsayo,
    crearTipoEnsayo,
    actualizarTipoEnsayo,
    eliminarTipoEnsayo,
    abrirDetalleTipoEnsayo,
    abrirFormTipoEnsayo,
    cerrarFormTipoEnsayo,

    // Variables
    abrirNuevaVariable,
    agregarVariable,
    editarVariable,
    eliminarVariable,
    cerrarFormVariable,

    // Días
    abrirFormDias,
    guardarDias,
    cerrarFormDias,

    // Búsqueda
    aplicarBusqueda,
    cambiarOrdenamiento,
  }
}

