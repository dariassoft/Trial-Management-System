<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
    <div class="max-w-6xl mx-auto px-3 md:px-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Tipos de Ensayo</h1>
          <p class="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-400">
            Gestiona los tipos de ensayo y sus variables de evaluación
          </p>
        </div>
        <button
          @click="abrirFormTipoEnsayo()"
          class="px-4 md:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span>+</span> Nuevo Tipo
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
              placeholder="Por nombre..."
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
              v-model="tiposEnsayoStore.filtros.sort"
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
              v-model="tiposEnsayoStore.filtros.order"
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
      <div v-if="tiposEnsayoStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error -->
      <div
        v-else-if="tiposEnsayoStore.error"
        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 text-red-600 dark:text-red-200"
      >
        {{ tiposEnsayoStore.error }}
      </div>

      <!-- Contenido: Tarjetas (Mobile-first) -->
      <template v-else>
        <!-- Sin resultados -->
        <div
          v-if="!tiposEnsayoStore.tiposEnsayo || tiposEnsayoStore.tiposEnsayo.length === 0"
          class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
        >
          <p class="text-gray-600 dark:text-gray-400 mb-4">No hay tipos de ensayo disponibles</p>
          <button
            @click="abrirFormTipoEnsayo()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
          >
            Crear el primer tipo de ensayo
          </button>
        </div>

        <!-- Tarjetas Tipos de Ensayo -->
        <div v-else class="space-y-3 md:space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div
              v-for="tipo in tiposEnsayoStore.tiposEnsayo"
              :key="tipo.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition overflow-hidden"
            >
              <!-- Header de la tarjeta -->
              <div
                @click="abrirDetalleTipoEnsayo(tipo.id as number)"
                class="cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div class="flex justify-between items-start gap-3">
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 dark:text-white text-lg truncate">
                      {{ tipo.nombre }}
                    </h3>
                    <div class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      ID: {{ tipo.id }}
                      <span v-if="tipo.evaluacionCsv" class="ml-2">
                        • DDA: {{ tipo.evaluacionCsv }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <span
                      class="transition transform text-lg"
                      :class="expandedTipoEnsayoId === tipo.id ? 'rotate-180' : ''"
                    >
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              <!-- Acciones principales (siempre visibles en mobile) -->
              <div class="px-4 pb-3 flex gap-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="editarTipoEnsayo(tipo)"
                  class="flex-1 px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded text-sm font-medium transition"
                >
                  Editar
                </button>
                <button
                  @click="eliminarTipoEnsayo(tipo.id as number)"
                  class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
                >
                  Eliminar
                </button>
              </div>

              <!-- Detalle expandible: Variables y Días -->
              <Transition
                v-if="expandedTipoEnsayoId === tipo.id"
                :key="`detail-${tipo.id}`"
                enter-active-class="transition duration-200 ease-out"
                leave-active-class="transition duration-200 ease-in"
                enter-from-class="opacity-0 -translate-y-2"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div
                  v-if="(tiposEnsayoStore.currentTipo as any)?.id === tipo.id"
                  class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700 space-y-4"
                >
                  <!-- Sección: Días de Evaluación -->
                  <div>
                    <div class="flex justify-between items-center mb-3">
                      <h4 class="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                        Días de Evaluación (DDA)
                      </h4>
                      <button
                        @click="abrirFormDias(tipo.id as number)"
                        class="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition"
                      >
                        Configurar
                      </button>
                    </div>

                    <div v-if="(tiposEnsayoStore.currentTipo as any)?.evaluacionCsv" class="bg-white dark:bg-gray-800 rounded p-3">
                      <p class="text-sm text-gray-700 dark:text-gray-300 break-all">
                        {{ (tiposEnsayoStore.currentTipo as any).evaluacionCsv }}
                      </p>
                    </div>
                    <div v-else class="bg-white dark:bg-gray-800 rounded p-3 text-center">
                      <p class="text-xs text-gray-600 dark:text-gray-400 italic">
                        Sin días de evaluación configurados
                      </p>
                    </div>
                  </div>

                  <!-- Sección: Variables -->
                  <div>
                    <div class="flex justify-between items-center mb-3">
                      <h4 class="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                        Variables ({{ (tiposEnsayoStore.currentTipo as any)?.variables?.length || 0 }})
                      </h4>
                      <button
                        @click="abrirNuevaVariable(tipo.id as number)"
                        class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition"
                      >
                        + Agregar
                      </button>
                    </div>

                    <!-- Lista de Variables o vacío -->
                    <template v-if="(tiposEnsayoStore.currentTipo as any)?.variables?.length">
                      <div class="space-y-2">
                        <div
                          v-for="var_ in (tiposEnsayoStore.currentTipo as any).variables"
                          :key="var_.id"
                          class="bg-white dark:bg-gray-800 rounded p-3 border-l-4 border-green-500"
                        >
                          <div class="flex justify-between items-start gap-2">
                            <div class="flex-1 min-w-0">
                              <p class="font-medium text-sm text-gray-900 dark:text-white">
                                {{ var_.nombre_variable }}
                              </p>
                              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Unidad: {{ var_.unidad_medida }}
                              </p>
                              <p v-if="var_.escala" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Escala: {{ var_.escala }}
                              </p>
                            </div>
                            <div class="flex gap-1 flex-shrink-0">
                              <button
                                @click="editarVariable(var_)"
                                class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition"
                              >
                                Editar
                              </button>
                              <button
                                @click="eliminarVariable(var_.id)"
                                class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition"
                              >
                                X
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <div v-else class="bg-white dark:bg-gray-800 rounded p-3 text-center">
                      <p class="text-xs text-gray-600 dark:text-gray-400 italic">
                        Sin variables. Agrega una para comenzar.
                      </p>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div
          v-if="Math.ceil(tiposEnsayoStore.total / tiposEnsayoStore.pageSize) > 1"
          class="flex justify-center items-center gap-2 mt-6"
        >
          <button
            :disabled="tiposEnsayoStore.currentPage === 1"
            @click="irAPagina(tiposEnsayoStore.currentPage - 1)"
            class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-50"
          >
            ◀
          </button>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            Página {{ tiposEnsayoStore.currentPage }} de {{ Math.ceil(tiposEnsayoStore.total / tiposEnsayoStore.pageSize) }}
          </span>
          <button
            :disabled="tiposEnsayoStore.currentPage === Math.ceil(tiposEnsayoStore.total / tiposEnsayoStore.pageSize)"
            @click="irAPagina(tiposEnsayoStore.currentPage + 1)"
            class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      </template>
    </div>

    <!-- Modal: Tipo de Ensayo Form -->
    <TipoEnsayoForm
      v-if="showFormTipoEnsayo"
      :tipo-ensayo="editingTipoEnsayo"
      @save="guardarTipoEnsayo"
      @close="cerrarFormTipoEnsayo"
    />

    <!-- Modal: Variable Form -->
    <VariableForm
      v-if="showFormVariable"
      :variable="editingVariable"
      @save="agregarVariable"
      @close="cerrarFormVariable"
    />

    <!-- Modal: Días de Evaluación Form -->
    <DiasForm
      v-if="showFormDias"
      :dias-csv="diasInput"
      @save="guardarDias"
      @close="cerrarFormDias"
      @update:diasCsv="(v) => (diasInput = v)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTiposEnsayo } from '~/composables/useTiposEnsayo'
import TipoEnsayoForm from './TipoEnsayoForm.vue'
import VariableForm from './VariableForm.vue'
import DiasForm from './DiasForm.vue'


const {
  showFormTipoEnsayo,
  editingTipoEnsayo,
  expandedTipoEnsayoId,
  tiposEnsayoStore,
  showFormVariable,
  editingVariable,
  showFormDias,
  diasInput,
  cargarTiposEnsayo,
  crearTipoEnsayo,
  actualizarTipoEnsayo,
  eliminarTipoEnsayo: eliminarTipoEnsayoFn,
  abrirDetalleTipoEnsayo,
  abrirFormTipoEnsayo,
  cerrarFormTipoEnsayo,
  abrirNuevaVariable,
  agregarVariable,
  editarVariable,
  eliminarVariable,
  cerrarFormVariable,
  abrirFormDias,
  guardarDias,
  cerrarFormDias,
} = useTiposEnsayo()

const busqueda = ref('')

onMounted(async () => {
  await cargarTiposEnsayo()
})

async function guardarTipoEnsayo(datos: any) {
  try {
    if (editingTipoEnsayo.value?.id) {
      await actualizarTipoEnsayo(editingTipoEnsayo.value.id, datos)
    } else {
      await crearTipoEnsayo(datos)
    }
    await cargarTiposEnsayo()
  } catch (err) {
    console.error('Error al guardar tipo de ensayo:', err)
  }
}

function editarTipoEnsayo(tipo: any) {
  abrirFormTipoEnsayo(tipo)
}

async function eliminarTipoEnsayo(id: number) {
  await eliminarTipoEnsayoFn(id)
  await cargarTiposEnsayo()
}

function aplicarFiltros() {
  tiposEnsayoStore.setFiltro('q', busqueda.value)
  tiposEnsayoStore.resetPaginacion()
  cargarTiposEnsayo()
}

function limpiarFiltros() {
  busqueda.value = ''
  tiposEnsayoStore.setFiltro('q', '')
  tiposEnsayoStore.filtros.sort = 'nombre'
  tiposEnsayoStore.filtros.order = 'ASC'
  tiposEnsayoStore.resetPaginacion()
  cargarTiposEnsayo()
}

function irAPagina(page: number) {
  tiposEnsayoStore.setCurrentPage(page)
  cargarTiposEnsayo({ page })
}
</script>

