<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
    <div class="max-w-6xl mx-auto px-3 md:px-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Protocolos y Tratamientos</h1>
          <p class="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-400">
            Gestiona los protocolos y tratamientos de tus ensayos
          </p>
        </div>
        <button
          @click="abrirFormProtocolo()"
          class="px-4 md:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span>+</span> Nuevo Protocolo
        </button>
      </div>

      <!-- Búsqueda y Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4">
          <!-- Búsqueda (2 columnas) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar
            </label>
            <input
              v-model="busqueda"
              type="text"
              placeholder="Por nombre o descripción..."
              @keyup.enter="aplicarFiltros"
              class="w-full px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10"
            />
          </div>

          <!-- Ordenar por (1.5 columnas) -->
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ordenar
            </label>
            <select
              v-model="protocolosStore.filtros.sort"
              class="w-full px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10"
            >
              <option value="nombre">Nombre</option>
              <option value="id">ID</option>
            </select>
          </div>

          <!-- Dirección (1 columna) -->
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Orden
            </label>
            <select
              v-model="protocolosStore.filtros.order"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-10"
            >
              <option value="ASC">▲ ASC</option>
              <option value="DESC">▼ DESC</option>
            </select>
          </div>

          <!-- Botón Aplicar (1 columna) -->
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              &nbsp;
            </label>
            <button
              @click="aplicarFiltros"
              class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm h-10"
              title="Aplicar filtros"
            >
              ✓ Aplicar
            </button>
          </div>

          <!-- Botón Limpiar (1 columna) -->
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              &nbsp;
            </label>
            <button
              @click="limpiarFiltros"
              class="w-full px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition text-sm h-10"
              title="Limpiar filtros"
            >
              ✕ Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Cargando -->
      <div v-if="protocolosStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error -->
      <div
        v-else-if="protocolosStore.error"
        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 text-red-600 dark:text-red-200"
      >
        {{ protocolosStore.error }}
      </div>

      <!-- Contenido: Tarjetas (Mobile-first) -->
      <template v-else>
        <!-- Sin resultados -->
        <div
          v-if="protocolosStore.items.length === 0"
          class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
        >
          <p class="text-gray-600 dark:text-gray-400 mb-4">No hay protocolos disponibles</p>
          <button
            @click="abrirFormProtocolo()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
          >
            Crear el primer protocolo
          </button>
        </div>

        <!-- Tarjetas Protocolos -->
        <div v-else class="space-y-3 md:space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div
              v-for="protocolo in protocolosStore.items"
              :key="protocolo.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition overflow-hidden"
            >
            <!-- Header de la tarjeta -->
            <div
              @click="abrirDetalleProtocolo(protocolo.id)"
              class="cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div class="flex justify-between items-start gap-3">
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-900 dark:text-white text-lg truncate">
                    {{ protocolo.nombre }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {{ protocolo.descripcion || "Sin descripción" }}
                  </p>
                  <div class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    ID: {{ protocolo.id }}
                    <span v-if="protocolo.tratamientos" class="ml-2">
                      • {{ protocolo.tratamientos.length }} tratamiento(s)
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span
                    class="transition transform text-lg"
                    :class="expandedProtocoloId === protocolo.id ? 'rotate-180' : ''"
                  >
                    ▼
                  </span>
                </div>
              </div>
            </div>

            <!-- Acciones principales (siempre visibles en mobile) -->
            <div class="px-4 pb-3 flex gap-2 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="editarProtocolo(protocolo)"
                class="flex-1 px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded text-sm font-medium transition"
              >
                Editar
              </button>
              <button
                @click="confirmarEliminarProtocolo(protocolo.id, protocolo.nombre)"
                class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
              >
                Eliminar
              </button>
            </div>

            <!-- Detalle expandible: Tratamientos -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              leave-active-class="transition duration-200 ease-in"
              enter-from-class="opacity-0 -translate-y-2"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div
                v-if="expandedProtocoloId === protocolo.id && protocolosStore.current?.id === protocolo.id"
                class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700"
              >
                <!-- Título Tratamientos -->
                <h4 class="font-semibold text-gray-900 dark:text-white mb-3 text-sm md:text-base">
                  Tratamientos ({{ protocolosStore.current?.tratamientos?.length || 0 }})
                </h4>

                <!-- Lista de Tratamientos o vacío -->
                <template v-if="protocolosStore.current?.tratamientos?.length">
                  <div class="space-y-2 mb-4">
                    <div
                      v-for="trat in protocolosStore.current.tratamientos"
                      :key="trat.id"
                      class="bg-white dark:bg-gray-800 rounded p-3 border-l-4 border-blue-500"
                    >
                      <div class="flex justify-between items-start gap-2">
                        <div class="flex-1 min-w-0">
                          <p class="font-medium text-sm text-gray-900 dark:text-white">
                            T{{ trat.numeroTrat }}
                            <span v-if="trat.esTestigo" class="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                              Testigo
                            </span>
                          </p>
                          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {{ trat.descripcion || "Sin descripción" }}
                          </p>
                          <p v-if="trat.productos && trat.productos.length" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {{ trat.productos.length }} producto(s)
                          </p>
                        </div>
                        <div class="flex gap-1 flex-shrink-0">
                          <button
                            @click="editarTratamiento(protocolo.id, trat)"
                            class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition"
                          >
                            Editar
                          </button>
                          <button
                            @click="confirmarEliminarTratamiento(trat.id, trat.numeroTrat)"
                            class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <p v-else class="text-xs text-gray-600 dark:text-gray-400 italic mb-4">
                  Sin tratamientos. Crea uno para comenzar.
                </p>

                <!-- Botón Agregar Tratamiento -->
                <button
                  @click="abrirNuevoTratamiento(protocolo.id)"
                  class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
                >
                  + Agregar Tratamiento
                </button>
              </div>
            </Transition>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div
          v-if="protocolosStore.paginacion.pageCount > 1"
          class="flex justify-center items-center gap-2 mt-6"
        >
          <button
            :disabled="protocolosStore.paginacion.page === 1"
            @click="irAPagina(protocolosStore.paginacion.page - 1)"
            class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-50"
          >
            ◀
          </button>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            Página {{ protocolosStore.paginacion.page }} de {{ protocolosStore.paginacion.pageCount }}
          </span>
          <button
            :disabled="protocolosStore.paginacion.page === protocolosStore.paginacion.pageCount"
            @click="irAPagina(protocolosStore.paginacion.page + 1)"
            class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      </template>
    </div>

    <!-- Modal: Protocolo Form -->
    <ProtocoloForm
      v-if="showFormProtocolo"
      :protocolo="editingProtocolo"
      @save="guardarProtocolo"
      @close="cerrarFormProtocolo"
    />

    <!-- Modal: Tratamiento Form -->
    <TratamientoForm
      v-if="showFormTratamiento"
      :protocolo-id="protocoloSeleccionado"
      :tratamiento="editingTratamiento"
      :existing-numeros="obtenerNumerosTratamientos(protocoloSeleccionado)"
      @save="guardarTratamiento"
      @close="cerrarFormTratamiento"
    />

    <!-- Modal: Confirm Delete -->
    <ConfirmDeleteModal
      v-if="showDeleteConfirm"
      :nombre="deleteTargetNombre"
      @confirmar="ejecutarEliminacion"
      @cancelar="cerrarDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useProtocolos } from '~/composables/useProtocolos'
import { useTratamientos } from '~/composables/useTratamientos'
import ProtocoloForm from './ProtocoloForm.vue'
import TratamientoForm from './TratamientoForm.vue'
import ConfirmDeleteModal from '~/components/common/ConfirmDeleteModal.vue'

definePageMeta({
  middleware: 'auth',
})

const {
  showFormProtocolo,
  editingProtocolo,
  expandedProtocoloId,
  protocolosStore,
  cargarProtocolos,
  crearProtocolo,
  actualizarProtocolo,
  eliminarProtocolo: eliminarProtocoloFn,
  abrirDetalleProtocolo,
  abrirFormProtocolo,
  cerrarFormProtocolo,
} = useProtocolos()

const {
  showFormTratamiento,
  protocoloSeleccionado,
  tratamientosStore,
  crearTratamiento,
  actualizarTratamiento,
  eliminarTratamiento: eliminarTratamientoFn,
  abrirFormTratamiento,
  cerrarFormTratamiento,
} = useTratamientos()

// Variable local INDEPENDIENTE para reactividad correcta
const editingTratamiento = ref<any | null>(null)

const busqueda = ref('')

onMounted(async () => {
  await cargarProtocolos()
})

async function guardarProtocolo(datos: any) {
  try {
    if (editingProtocolo.value?.id) {
      await actualizarProtocolo(editingProtocolo.value.id, datos)
    } else {
      await crearProtocolo(datos)
    }
    await cargarProtocolos()
  } catch (err) {
    console.error('Error al guardar protocolo:', err)
  }
}

function editarProtocolo(protocolo: any) {
  abrirFormProtocolo(protocolo)
}

// Refs para modal de confirmación de eliminación
const showDeleteConfirm = ref(false)
const deleteType = ref<'protocolo' | 'tratamiento' | null>(null)
const deleteTargetId = ref<number | null>(null)
const deleteTargetNombre = ref('')

function confirmarEliminarProtocolo(id: number, nombre: string) {
  deleteType.value = 'protocolo'
  deleteTargetId.value = id
  deleteTargetNombre.value = `el protocolo "${nombre}" y todos sus tratamientos`
  showDeleteConfirm.value = true
}

function confirmarEliminarTratamiento(id: number, numeroTrat: number) {
  deleteType.value = 'tratamiento'
  deleteTargetId.value = id
  deleteTargetNombre.value = `el tratamiento T${numeroTrat}`
  showDeleteConfirm.value = true
}

function cerrarDeleteConfirm() {
  showDeleteConfirm.value = false
  deleteType.value = null
  deleteTargetId.value = null
  deleteTargetNombre.value = ''
}

async function ejecutarEliminacion() {
  if (!deleteTargetId.value || !deleteType.value) return
  
  try {
    if (deleteType.value === 'protocolo') {
      await protocolosStore.deleteProtocolo(deleteTargetId.value)
      await cargarProtocolos()
    } else if (deleteType.value === 'tratamiento') {
      await tratamientosStore.deleteTratamiento(deleteTargetId.value)
      if (expandedProtocoloId.value) {
        await protocolosStore.fetchProtocoloById(expandedProtocoloId.value)
      }
    }
  } catch (err) {
    console.error(`Error al eliminar ${deleteType.value}:`, err)
  } finally {
    cerrarDeleteConfirm()
  }
}

function obtenerNumerosTratamientos(protocoloId: number | null): number[] {
  if (!protocoloId) return []
  const prot = protocolosStore.items.find(p => p.id === protocoloId) || (protocolosStore.current?.id === protocoloId ? protocolosStore.current : null)
  return (prot?.tratamientos || []).map((t: any) => Number(t.numeroTrat)).filter(n => !isNaN(n))
}

function abrirNuevoTratamiento(protocoloId: number) {
  protocoloSeleccionado.value = protocoloId
  editingTratamiento.value = null
  abrirFormTratamiento()
}

async function editarTratamiento(protocoloId: number, tratamiento: any) {
  protocoloSeleccionado.value = protocoloId
  try {
    console.log('📝 Editando tratamiento con ID:', tratamiento.id)
    const datosCompletos = await tratamientosStore.fetchTratamientoById(tratamiento.id)
    console.log('✅ Datos completos cargados:', datosCompletos)

    // Actualizar editingTratamiento
    editingTratamiento.value = datosCompletos
    console.log('📱 editingTratamiento.value = ', editingTratamiento.value)

    // Esperar a que Vue actualice la reactividad ANTES de abrir el modal
    await nextTick()
    console.log('⏳ nextTick completado, abriendo modal')

    // AHORA abrir el modal con el valor correcto
    abrirFormTratamiento()
    console.log('🔓 Modal abierto')
  } catch (err) {
    console.error('❌ Error al cargar tratamiento para edición:', err)
    editingTratamiento.value = tratamiento
    await nextTick()
    abrirFormTratamiento()
  }
}

async function guardarTratamiento(datos: any) {
  try {
    // Extraer datos del tratamiento y productos del payload
    const { tratamiento: datosTrat, productos: productosNuevos } = datos

    if (editingTratamiento.value?.id) {
      // MODO EDICIÓN: Actualizar datos del tratamiento
      await actualizarTratamiento(editingTratamiento.value.id, datosTrat)

      // Gestionar productos en modo edición
      const tratamientoId = editingTratamiento.value.id
      const productosActuales = editingTratamiento.value.productos || []

      // Productos a eliminar: los que no están en productosNuevos
      for (const prodActual of productosActuales) {
        const existeEnNuevos = productosNuevos.some((p: any) => p.id === prodActual.id)
        if (!existeEnNuevos) {
          try {
            await tratamientosStore.deleteTratamientoProducto(prodActual.id)
          } catch (err) {
            console.error('Error al eliminar producto:', err)
          }
        }
      }

      // Productos a crear o actualizar
      for (const prodNuevo of productosNuevos) {
        if (!prodNuevo.id) {
          // Nuevo producto: crear
          try {
            await tratamientosStore.createTratamientoProducto({
              tratamientoId,
              productoId: prodNuevo.productoId,
              dosis: prodNuevo.dosis,
              unidadDosis: prodNuevo.unidadDosis,
              estadio: prodNuevo.estadio,
            })
          } catch (err) {
            console.error('Error al agregar producto:', err)
          }
        } else {
          // Producto existente: actualizar si cambió
          const prodActual = productosActuales.find((p: any) => p.id === prodNuevo.id)
          if (prodActual) {
            try {
              await tratamientosStore.updateTratamientoProducto(prodNuevo.id, {
                dosis: prodNuevo.dosis,
                unidadDosis: prodNuevo.unidadDosis,
                estadio: prodNuevo.estadio,
              })
            } catch (err) {
              console.error('Error al actualizar producto:', err)
            }
          }
        }
      }
    } else {
      // MODO CREACIÓN: Crear nuevo tratamiento
      const resultado = await crearTratamiento(datosTrat)

      // Si se creó exitosamente, agregar productos
      if (resultado?.id && productosNuevos.length > 0) {
        for (const prod of productosNuevos) {
          try {
            await tratamientosStore.createTratamientoProducto({
              tratamientoId: resultado.id,
              productoId: prod.productoId,
              dosis: prod.dosis,
              unidadDosis: prod.unidadDosis,
              estadio: prod.estadio,
            })
          } catch (err) {
            console.error('Error al agregar producto al tratamiento creado:', err)
          }
        }
      }
    }

    // Recargar protocolo actual
    if (expandedProtocoloId.value) {
      await protocolosStore.fetchProtocoloById(expandedProtocoloId.value)
    }

    // Cerrar el modal
    cerrarFormTratamiento()
  } catch (err) {
    console.error('Error al guardar tratamiento:', err)
  }
}




// Aplicar filtros de búsqueda, ordenamiento y orden
async function aplicarFiltros() {
  console.log('🔍 Aplicando filtros:', {
    q: busqueda.value,
    sort: protocolosStore.filtros.sort,
    order: protocolosStore.filtros.order,
  })

  // Actualizar el filtro de búsqueda en el store
  protocolosStore.setFiltro('q', busqueda.value)

  // Resetear a página 1 cuando se aplican nuevos filtros
  protocolosStore.resetPaginacion()

  // Hacer la solicitud con todos los filtros
  try {
    await cargarProtocolos({
      q: busqueda.value,
      sort: protocolosStore.filtros.sort,
      order: protocolosStore.filtros.order,
      page: 1,
    })
    console.log('✅ Filtros aplicados exitosamente')
  } catch (err) {
    console.error('❌ Error al aplicar filtros:', err)
  }
}

// Limpiar todos los filtros
async function limpiarFiltros() {
  console.log('🧹 Limpiando filtros')

  busqueda.value = ''
  protocolosStore.setFiltro('q', '')
  protocolosStore.setFiltro('sort', 'nombre')
  protocolosStore.setFiltro('order', 'ASC')
  protocolosStore.resetPaginacion()

  try {
    await cargarProtocolos({
      q: '',
      sort: 'nombre',
      order: 'ASC',
      page: 1,
    })
    console.log('✅ Filtros limpiados exitosamente')
  } catch (err) {
    console.error('❌ Error al limpiar filtros:', err)
  }
}

async function irAPagina(page: number) {
  await cargarProtocolos({
    page,
    q: busqueda.value,
    sort: protocolosStore.filtros.sort,
    order: protocolosStore.filtros.order,
  })
}
</script>

