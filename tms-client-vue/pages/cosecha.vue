<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
    <div class="max-w-7xl mx-auto px-3 md:px-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Cosecha</h1>
          <p class="mt-1 text-gray-600 dark:text-gray-400">Listado completo de cosechas de todos los ensayos</p>
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
              @keyup.enter="cargarParcelas"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Filtrar por Ensayo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ensayo
            </label>
            <select
              v-model.number="filtroEnsayoId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="cargarParcelas"
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
              @click="cargarParcelas"
              class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              🔍 Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Cargando -->
      <div v-if="cargando" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
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
                      class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition"
                      @click="abrirEditorCosecha(parcela)"
                      title="Editar cosecha"
                    >
                      🌾
                    </button>
                    <button
                      class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition"
                      @click="confirmarEliminar(parcela.id)"
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

    <!-- Modal: Editar Cosecha -->
    <Teleport to="body">
      <div
        v-if="showModalCosecha"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="cerrarModalCosecha"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <!-- Header Modal -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                🌾 Editar Cosecha - {{ parcelaEditando?.nombreParcela }}
              </h3>
              <button
                @click="cerrarModalCosecha"
                class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Body Modal -->
          <form @submit.prevent="guardarCosecha" class="p-4 space-y-4">
            <!-- Información de la parcela -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
              <p><strong>Ensayo:</strong> {{ parcelaEditando?.ensayo?.nombreEnsayo }}</p>
              <p><strong>Bloque:</strong> Bloque {{ parcelaEditando?.bloque?.nombreBloque }}</p>
              <p><strong>Tratamiento:</strong> {{ parcelaEditando?.tratamiento?.descripcion || '-' }}</p>
            </div>

            <!-- Campos de cosecha -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de Cosecha
              </label>
              <input
                v-model="formCosecha.fechaCosecha"
                type="date"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Humedad (%)
                </label>
                <input
                  v-model.number="formCosecha.humedadPct"
                  type="number"
                  step="0.01"
                  placeholder="12.5"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kg/ha (corregido)
                </label>
                <input
                  v-model.number="formCosecha.kgHaCorregido"
                  type="number"
                  step="0.1"
                  placeholder="5000"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GIE (Germinación/Integridad/Especificidad)
              </label>
              <input
                v-model.number="formCosecha.gie"
                type="number"
                step="0.01"
                placeholder="95.5"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <!-- NUEVOS CAMPOS: Gramaje y Calidad de Grano -->
            <div class="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-3">📊 Gramaje y Calidad de Grano</h4>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gramaje por Grano (g)
                  </label>
                  <input
                    v-model.number="formCosecha.gramajePorGrano"
                    type="number"
                    step="0.001"
                    placeholder="0.050"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Granos por m²
                  </label>
                  <input
                    v-model.number="formCosecha.granosPorurf"
                    type="number"
                    step="1"
                    placeholder="50000"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Peso de Granos por m² (g)
                </label>
                <input
                  v-model.number="formCosecha.pesoGranosPorUrf"
                  type="number"
                  step="0.1"
                  placeholder="2500"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div class="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dañados (%)
                  </label>
                  <input
                    v-model.number="formCosecha.granosDañados"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="5.0"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Verdes (%)
                  </label>
                  <input
                    v-model.number="formCosecha.granosVerdes"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="2.5"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vanos (%)
                  </label>
                  <input
                    v-model.number="formCosecha.granosVanos"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="1.5"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <!-- NUEVOS CAMPOS: Mediciones de la Parcela -->
            <div class="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-3">🌿 Mediciones de la Parcela por m²</h4>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hojas por m²
                  </label>
                  <input
                    v-model.number="formCosecha.hojasPorUrf"
                    type="number"
                    step="1"
                    placeholder="5000"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Larvas/Plagas por m²
                  </label>
                  <input
                    v-model.number="formCosecha.larvasPorUrf"
                    type="number"
                    step="1"
                    placeholder="10"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Insectos Benéficos por m²
                  </label>
                  <input
                    v-model.number="formCosecha.insectosBeneficiosPorUrf"
                    type="number"
                    step="1"
                    placeholder="25"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Diámetro Espiga (mm)
                  </label>
                  <input
                    v-model.number="formCosecha.diametroEspiga"
                    type="number"
                    step="0.1"
                    placeholder="8.5"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Altura de Planta (cm)
                  </label>
                  <input
                    v-model.number="formCosecha.alturaParcela"
                    type="number"
                    step="0.1"
                    placeholder="75.5"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plantas/m² Final
                  </label>
                  <input
                    v-model.number="formCosecha.densidadPlantasFinal"
                    type="number"
                    step="0.1"
                    placeholder="8.5"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <textarea
                v-model="formCosecha.observaciones"
                rows="3"
                placeholder="Observaciones sobre la cosecha..."
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="cerrarModalCosecha"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100
                       dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="guardandoCosecha"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg
                       font-medium transition disabled:opacity-50"
              >
                {{ guardandoCosecha ? 'Guardando...' : '✓ Guardar Cosecha' }}
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

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const route = useRoute()
const ensayosStore = useEnsayosStore()
const parcelasStore = useParcelasStore()
const api = useApi()

const busqueda = ref('')
const filtroEnsayoId = ref<number | null>(null)
const cargando = ref(false)
const error = ref('')
const showModalCosecha = ref(false)
const parcelaEditando = ref<any>(null)
const guardandoCosecha = ref(false)

const formCosecha = ref({
  // Campos básicos de cosecha
  fechaCosecha: '',
  humedadPct: null as number | null,
  kgHaCorregido: null as number | null,
  gie: null as number | null,

  // Nuevos campos: Gramaje y calidad de grano
  gramajePorGrano: null as number | null,  // Gramos por grano (para calcular calidad)
  granosPorurf: null as number | null,     // Granos por m² (superficie)
  pesoGranosPorUrf: null as number | null, // Peso de granos por m² (gramos)

  // Mediciones de la parcela
  hojasPorUrf: null as number | null,      // Cantidad de hojas por m²
  larvasPorUrf: null as number | null,     // Cantidad de larvas/plagas por m²
  insectosBeneficiosPorUrf: null as number | null, // Insectos benéficos por m²

  // Calidad del grano
  granosDañados: null as number | null,    // Porcentaje de granos dañados (%)
  granosVerdes: null as number | null,     // Porcentaje de granos verdes (%)
  granosVanos: null as number | null,      // Porcentaje de granos vanos (%)

  // Otras mediciones importantes
  diametroEspiga: null as number | null,   // Diámetro espiga (mm)
  alturaParcela: null as number | null,    // Altura de planta (cm)
  densidadPlantasFinal: null as number | null, // Plantas/m² al final

  observaciones: '',
})

const ensayos = computed(() => ensayosStore.items)
const parcelas = computed(() => parcelasStore.items)

const parcelasFiltered = computed(() => {
  let filtered = parcelas.value

  if (filtroEnsayoId.value) {
    filtered = filtered.filter((p: any) => p.ensayo?.id === filtroEnsayoId.value)
  }


  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    filtered = filtered.filter((p: any) =>
      p.nombreParcela?.toLowerCase().includes(q) ||
      p.ensayo?.nombreEnsayo?.toLowerCase().includes(q) ||
      p.ensayo?.codigoLabor?.toLowerCase().includes(q)
    )
  }

  return filtered
})

async function cargarParcelas() {
  cargando.value = true
  error.value = ''
  try {
    await ensayosStore.fetchEnsayos({ limit: 100 })
    await parcelasStore.fetchParcelas({ limit: 100 })
  } catch (err: any) {
    error.value = err.message || 'Error al cargar datos'
  } finally {
    cargando.value = false
  }
}

function irAPagina(page: number) {
  parcelasStore.paginacion.page = page
  cargarParcelas()
}

function abrirEditorCosecha(parcela: any) {
  console.log('📋 Abriendo editor de cosecha para parcela:', parcela.id)
  parcelaEditando.value = parcela

  // Cargar datos existentes si existen
  if (parcela.cosecha) {
    formCosecha.value = {
      fechaCosecha: parcela.cosecha.fechaCosecha ? new Date(parcela.cosecha.fechaCosecha).toISOString().split('T')[0] : '',
      humedadPct: parcela.cosecha.humedadPct || null,
      kgHaCorregido: parcela.cosecha.kgHaCorregido || null,
      gie: parcela.cosecha.gie || null,
      gramajePorGrano: parcela.cosecha.gramajePorGrano || null,
      granosPorurf: parcela.cosecha.granosPorurf || null,
      pesoGranosPorUrf: parcela.cosecha.pesoGranosPorUrf || null,
      granosDañados: parcela.cosecha.granosDañados || null,
      granosVerdes: parcela.cosecha.granosVerdes || null,
      granosVanos: parcela.cosecha.granosVanos || null,
      hojasPorUrf: parcela.cosecha.hojasPorUrf || null,
      larvasPorUrf: parcela.cosecha.larvasPorUrf || null,
      insectosBeneficiosPorUrf: parcela.cosecha.insectosBeneficiosPorUrf || null,
      diametroEspiga: parcela.cosecha.diametroEspiga || null,
      alturaParcela: parcela.cosecha.alturaParcela || null,
      densidadPlantasFinal: parcela.cosecha.densidadPlantasFinal || null,
      observaciones: parcela.cosecha.observaciones || '',
    }
  } else {
    // Formulario vacío para nuevo registro
    formCosecha.value = {
      fechaCosecha: '',
      humedadPct: null,
      kgHaCorregido: null,
      gie: null,
      gramajePorGrano: null,
      granosPorurf: null,
      pesoGranosPorUrf: null,
      granosDañados: null,
      granosVerdes: null,
      granosVanos: null,
      hojasPorUrf: null,
      larvasPorUrf: null,
      insectosBeneficiosPorUrf: null,
      diametroEspiga: null,
      alturaParcela: null,
      densidadPlantasFinal: null,
      observaciones: '',
    }
  }

  showModalCosecha.value = true
}

function cerrarModalCosecha() {
  showModalCosecha.value = false
  parcelaEditando.value = null
  formCosecha.value = {
    fechaCosecha: '',
    humedadPct: null,
    kgHaCorregido: null,
    gie: null,
    gramajePorGrano: null,
    granosPorurf: null,
    pesoGranosPorUrf: null,
    granosDañados: null,
    granosVerdes: null,
    granosVanos: null,
    hojasPorUrf: null,
    larvasPorUrf: null,
    insectosBeneficiosPorUrf: null,
    diametroEspiga: null,
    alturaParcela: null,
    densidadPlantasFinal: null,
    observaciones: '',
  }
}

async function guardarCosecha() {
  if (!parcelaEditando.value) return

  try {
    guardandoCosecha.value = true

    const dto = {
      parcelaId: parcelaEditando.value.id,

      // Campos básicos
      fechaCosecha: formCosecha.value.fechaCosecha || null,
      humedadPct: formCosecha.value.humedadPct,
      kgHaCorregido: formCosecha.value.kgHaCorregido,
      gie: formCosecha.value.gie,

      // Nuevos campos: Gramaje y calidad
      gramajePorGrano: formCosecha.value.gramajePorGrano,
      granosPorurf: formCosecha.value.granosPorurf,
      pesoGranosPorUrf: formCosecha.value.pesoGranosPorUrf,
      granosDañados: formCosecha.value.granosDañados,
      granosVerdes: formCosecha.value.granosVerdes,
      granosVanos: formCosecha.value.granosVanos,

      // Nuevos campos: Mediciones de parcela
      hojasPorUrf: formCosecha.value.hojasPorUrf,
      larvasPorUrf: formCosecha.value.larvasPorUrf,
      insectosBeneficiosPorUrf: formCosecha.value.insectosBeneficiosPorUrf,
      diametroEspiga: formCosecha.value.diametroEspiga,
      alturaParcela: formCosecha.value.alturaParcela,
      densidadPlantasFinal: formCosecha.value.densidadPlantasFinal,

      observaciones: formCosecha.value.observaciones || null,
    }

    if (parcelaEditando.value.cosecha?.id) {
      // Actualizar
      console.log('📝 Actualizando cosecha:', parcelaEditando.value.cosecha.id)
      await api.patch(`/datos-cosecha/${parcelaEditando.value.cosecha.id}`, dto)
    } else {
      // Crear
      console.log('➕ Creando nueva cosecha')
      await api.post('/datos-cosecha', dto)
    }

    // Recargar parcelas
    await cargarParcelas()
    cerrarModalCosecha()
    alert('✅ Cosecha guardada correctamente')
  } catch (err: any) {
    console.error('Error al guardar cosecha:', err)
    alert('❌ Error al guardar: ' + (err.message || 'Error desconocido'))
  } finally {
    guardandoCosecha.value = false
  }
}

function confirmarEliminar(parcelaId: number) {
  if (confirm('¿Estás seguro de que deseas eliminar esta parcela?')) {
    parcelasStore.deleteParcela(parcelaId).then(() => {
      cargarParcelas()
    })
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
  title: 'Cosecha - TMS',
})
</script>

