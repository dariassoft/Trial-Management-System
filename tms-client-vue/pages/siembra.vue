<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
    <div class="max-w-7xl mx-auto px-3 md:px-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">🌱 Siembra</h1>
          <p class="mt-1 text-gray-600 dark:text-gray-400">Registra los datos de siembra por parcela</p>
        </div>
        <NuxtLink
          to="/ensayos"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
        >
          ← Volver a Ensayos
        </NuxtLink>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          <!-- Buscar -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar
            </label>
            <input
              v-model="busqueda"
              type="text"
              placeholder="Nombre o código..."
              @keyup.enter="buscar"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- Filtrar por Ensayo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ensayo
            </label>
            <select
              v-model.number="filtroEnsayoId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              @change="buscar"
            >
              <option :value="null">Todos</option>
              <option v-for="e in ensayos" :key="e.id" :value="e.id">
                {{ e.nombreEnsayo }}
              </option>
            </select>
          </div>

          <!-- Botón Buscar -->
          <div class="flex items-end">
            <button
              @click="buscar"
              class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
            >
              🔍 Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Cargando -->
      <div v-if="cargando" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 text-red-600 dark:text-red-200"
      >
        {{ error }}
      </div>

      <!-- Contenido -->
      <template v-else>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <!-- Sin resultados -->
          <div
            v-if="parcelasFiltered.length === 0"
            class="p-8 text-center"
          >
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              No hay parcelas que coincidan con tu búsqueda
            </p>
            <NuxtLink
              to="/ensayos/new"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
            >
              Crear Ensayo
            </NuxtLink>
          </div>

          <!-- Tabla -->
          <table v-else class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  ID
                </th>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Ensayo
                </th>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Bloque
                </th>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Nombre/Código
                </th>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Tratamiento
                </th>
                <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Posición
                </th>
                <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="parcela in parcelasFiltered"
                :key="parcela.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">
                  {{ parcela.id }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  <div class="text-sm font-medium">{{ parcela.ensayo?.nombreEnsayo }}</div>
                  <div class="text-xs text-gray-500">{{ parcela.ensayo?.codigoLabor }}</div>
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  Bloque {{ parcela.bloque?.nombreBloque }}
                </td>
                <td class="px-4 py-3 text-gray-900 dark:text-white">
                  {{ parcela.nombreParcela || '-' }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ parcela.tratamiento?.descripcion || '-' }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  ({{ parcela.posXGrid || '-' }}, {{ parcela.posYGrid || '-' }})
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex gap-2 justify-center">
                    <button
                      class="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition"
                      @click="abrirEditorSiembra(parcela)"
                      title="Editar siembra"
                    >
                      ✏️
                    </button>
                    <button
                      class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition"
                      @click="confirmarEliminar(parcela)"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Paginación -->
          <div
            v-if="parcelasStore.paginacion.pageCount > 1"
            class="flex justify-center items-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700"
          >
            <button
              :disabled="parcelasStore.paginacion.page === 1"
              @click="irAPagina(parcelasStore.paginacion.page - 1)"
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-50"
            >
              ◀
            </button>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Página {{ parcelasStore.paginacion.page }} de {{ parcelasStore.paginacion.pageCount }}
            </span>
            <button
              :disabled="parcelasStore.paginacion.page === parcelasStore.paginacion.pageCount"
              @click="irAPagina(parcelasStore.paginacion.page + 1)"
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded disabled:opacity-50"
            >
              ▶
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Modal: Editar Siembra -->
    <Teleport to="body">
      <div
        v-if="showModalSiembra"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="cerrarModalSiembra"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <!-- Header Modal -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                🌱 Editar Siembra - {{ parcelaEditando?.nombreParcela }}
              </h3>
              <button
                @click="cerrarModalSiembra"
                class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Body Modal -->
          <form @submit.prevent="guardarSiembra" class="p-4 space-y-4">
            <!-- Información de la parcela -->
            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm">
              <p><strong>Ensayo:</strong> {{ parcelaEditando?.ensayo?.nombreEnsayo }}</p>
              <p><strong>Bloque:</strong> Bloque {{ parcelaEditando?.bloque?.nombreBloque }}</p>
              <p><strong>Tratamiento:</strong> {{ parcelaEditando?.tratamiento?.descripcion || '-' }}</p>
            </div>

            <!-- Checkbox de autocompletar -->
            <div class="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <input
                id="autocompletar"
                type="checkbox"
                v-model="autocompletar"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="autocompletar" class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Rellenar todas las parcelas de este ensayo con los mismos datos
              </label>
            </div>

            <!-- Campos de siembra -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de Siembra
              </label>
              <input
                v-model="formSiembra.fechaSiembra"
                type="date"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Semillas/m²
                </label>
                <input
                  v-model.number="formSiembra.semillasPorMetro"
                  type="number"
                  step="0.01"
                  min="0"
                  max="99999999.99"
                  placeholder="150"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Densidad (plantas/ha)
                </label>
                <input
                  v-model.number="formSiembra.densidadSiembra"
                  type="number"
                  step="0.01"
                  min="0"
                  max="99999999.99"
                  placeholder="300000"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Germinación (%)
                </label>
                <input
                  v-model.number="formSiembra.germinacionPct"
                  type="number"
                  step="0.01"
                  min="0"
                  max="999.99"
                  placeholder="85.5"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vigor Plantas (1-10)
                </label>
                <input
                  v-model.number="formSiembra.vigorPlantasEscala"
                  type="number"
                  step="1"
                  min="1"
                  max="10"
                  placeholder="8"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observaciones
              </label>
              <textarea
                v-model="formSiembra.observaciones"
                rows="3"
                placeholder="Observaciones sobre la siembra..."
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="cerrarModalSiembra"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100
                       dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="guardandoSiembra"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg
                       font-medium transition disabled:opacity-50"
              >
                {{ guardandoSiembra ? 'Guardando...' : '✓ Guardar Siembra' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEnsayosStore } from '~/stores/ensayos'
import { useParcelasStore } from '~/stores/parcelas'
import { useApi } from '~/composables/useApi'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const route = useRoute()
const ensayosStore = useEnsayosStore()
const parcelasStore = useParcelasStore()
const api = useApi()
const { showNotification } = useNotifications()

// Función para redondear un número a una cantidad específica de decimales
function roundToDecimals(value: number | null, decimals: number): number | null {
  if (value === null || value === undefined || isNaN(value)) return null
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

const busqueda = ref('')
const filtroEnsayoId = ref<number | null>(null)
const cargando = ref(false)
const error = ref('')
const showModalSiembra = ref(false)
const parcelaEditando = ref<any>(null)
const guardandoSiembra = ref(false)
const autocompletar = ref(false)

const formSiembra = ref({
  fechaSiembra: '',
  semillasPorMetro: null as number | null,
  densidadSiembra: null as number | null,
  germinacionPct: null as number | null,
  vigorPlantasEscala: null as number | null,
  observaciones: '',
})

const ensayos = computed(() => ensayosStore.items)
const parcelas = computed(() => parcelasStore.items)

const parcelasFiltered = computed(() => {
  return parcelas.value
})

async function cargarParcelas() {
  cargando.value = true
  error.value = ''
  try {
    await ensayosStore.fetchEnsayos({ limit: 100 })
    await parcelasStore.fetchParcelas({
      page: parcelasStore.paginacion.page,
      limit: 10,
      ensayoId: filtroEnsayoId.value || undefined,
      q: busqueda.value.trim() || undefined,
    })
  } catch (err: any) {
    error.value = err.message || 'Error al cargar datos'
  } finally {
    cargando.value = false
  }
}

function buscar() {
  parcelasStore.resetPaginacion()
  cargarParcelas()
}

function irAPagina(page: number) {
  parcelasStore.paginacion.page = page
  cargarParcelas()
}

function abrirEditorSiembra(parcela: any) {
  console.log('🌱 Abriendo editor de siembra para parcela:', parcela.id)
  parcelaEditando.value = parcela
  autocompletar.value = false // Reset checkbox

  // Cargar datos existentes si existen
  if (parcela.siembra) {
    console.log('📊 Datos de siembra encontrados:', parcela.siembra)
    formSiembra.value = {
      fechaSiembra: parcela.siembra.fechaSiembra ? new Date(parcela.siembra.fechaSiembra).toISOString().split('T')[0] : '',
      // Redondear a decimales según BD: precision: 10, scale: 2
      semillasPorMetro: roundToDecimals(parcela.siembra.semillasPorMetro, 2),
      densidadSiembra: roundToDecimals(parcela.siembra.densidadSiembra, 2),
      germinacionPct: roundToDecimals(parcela.siembra.germinacionPct, 2),
      vigorPlantasEscala: parcela.siembra.vigorPlantasEscala ? parseInt(String(parcela.siembra.vigorPlantasEscala), 10) : null,
      observaciones: parcela.siembra.observaciones || '',
    }
  } else {
    // Formulario vacío para nuevo registro
    console.log('📝 Sin datos previos de siembra')
    formSiembra.value = {
      fechaSiembra: '',
      semillasPorMetro: null,
      densidadSiembra: null,
      germinacionPct: null,
      vigorPlantasEscala: null,
      observaciones: '',
    }
  }

  showModalSiembra.value = true
}

function cerrarModalSiembra() {
  showModalSiembra.value = false
  parcelaEditando.value = null
  formSiembra.value = {
    fechaSiembra: '',
    semillasPorMetro: null,
    densidadSiembra: null,
    germinacionPct: null,
    vigorPlantasEscala: null,
    observaciones: '',
  }
}

async function guardarSiembra() {
  if (!parcelaEditando.value) return

  try {
    guardandoSiembra.value = true

    // Convertir valores a números (los inputs HTML pueden devolver strings)
    const semillasPorMetro = formSiembra.value.semillasPorMetro !== null && formSiembra.value.semillasPorMetro !== ''
      ? parseFloat(String(formSiembra.value.semillasPorMetro))
      : null

    const densidadSiembra = formSiembra.value.densidadSiembra !== null && formSiembra.value.densidadSiembra !== ''
      ? parseFloat(String(formSiembra.value.densidadSiembra))
      : null

    const germinacionPct = formSiembra.value.germinacionPct !== null && formSiembra.value.germinacionPct !== ''
      ? parseFloat(String(formSiembra.value.germinacionPct))
      : null

    const vigorPlantasEscala = formSiembra.value.vigorPlantasEscala !== null && formSiembra.value.vigorPlantasEscala !== ''
      ? parseInt(String(formSiembra.value.vigorPlantasEscala), 10)
      : null

    const dto = {
      parcelaId: parcelaEditando.value.id,
      fechaSiembra: formSiembra.value.fechaSiembra || null,
      semillasPorMetro,
      densidadSiembra,
      germinacionPct,
      vigorPlantasEscala,
      observaciones: formSiembra.value.observaciones || null,
    }

    if (autocompletar.value) {
      // Guardar para todas las parcelas del ensayo
      const ensayoId = parcelaEditando.value.ensayo.id
      console.log(`🔄 Guardando siembra para TODAS las parcelas del ensayo ${ensayoId}`)
      await api.post(`/datos-siembra/ensayo/${ensayoId}`, dto)
    } else {
      // Guardar solo para la parcela actual
      const siembraId = parcelaEditando.value.siembra?.id
      if (siembraId) {
        // Actualizar siembra existente
        console.log('📝 Actualizando siembra existente (ID:', siembraId, ') para parcela:', parcelaEditando.value.id)
        console.log('   Datos:', dto)
        await api.patch(`/datos-siembra/${siembraId}`, dto)
      } else {
        // Crear nueva siembra
        console.log('➕ Creando nueva siembra para parcela:', parcelaEditando.value.id)
        console.log('   Datos:', dto)
        await api.post('/datos-siembra', dto)
      }
    }

    // IMPORTANTE: Recargar parcelas para actualizar la relación siembra en el store
    // Esperar un pequeño delay para que el servidor actualice la BD completamente
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log('🔄 Recargando parcelas para actualizar siembra...')
    await cargarParcelas()

    cerrarModalSiembra()
    showNotification('✅ Siembra guardada correctamente', 'success')
  } catch (err: any) {
    console.error('Error al guardar siembra:', err)

    // Mostrar mensajes de error más específicos
    let mensajeError = err.message || 'Error desconocido'

    // Si es un error de duplicidad, sugerir actualización
    if (err.message?.includes('Duplicate entry') || err.message?.includes('duplicate')) {
      mensajeError = 'Ya existe una siembra registrada para esta parcela. Intenta recargar la página y editarla.'
    }

    showNotification('❌ Error al guardar: ' + mensajeError, 'error')
  } finally {
    guardandoSiembra.value = false
  }
}

async function confirmarEliminar(parcela: any) {
  if (parcela.siembra?.id) {
    if (confirm(`¿Estás seguro de que deseas eliminar los datos de siembra de esta parcela?`)) {
      try {
        await api.delete(`/datos-siembra/${parcela.siembra.id}`)
        await cargarParcelas()
        showNotification('✅ Datos de siembra eliminados correctamente', 'success')
      } catch (err: any) {
        showNotification('❌ Error al eliminar: ' + (err.message || 'Error desconocido'), 'error')
      }
    }
  } else {
    showNotification('⚠️ Esta parcela no tiene datos de siembra registrados', 'error')
  }
}

onMounted(() => {
  // Cargar parámetros desde URL
  const ensayoId = route.query.ensayoId as string

  if (ensayoId) {
    filtroEnsayoId.value = parseInt(ensayoId, 10)
  }

  cargarParcelas()
})

useHead({
  title: 'Siembra - TMS',
})
</script>
