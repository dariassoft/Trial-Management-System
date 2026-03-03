<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
    <div class="max-w-7xl mx-auto px-3 md:px-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Parcelas</h1>
          <p class="mt-1 text-gray-600 dark:text-gray-400">Listado completo de parcelas de todos los ensayos</p>
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

          <!-- Filtrar por Bloque -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bloque
            </label>
            <select
              v-model.number="filtroBloqueId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="cargarParcelas"
            >
              <option :value="null">Todos</option>
              <option v-for="b in bloques" :key="b.id" :value="b.id">
                Bloque {{ b.nombreBloque }}
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
                  {{ parcela.tratamiento?.nombreTratamiento || '-' }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  ({{ parcela.posXGrid || '-' }}, {{ parcela.posYGrid || '-' }})
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex gap-2 justify-center">
                    <button
                      class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition"
                      @click="editarParcela(parcela)"
                    >
                      ✏️
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEnsayosStore } from '~/stores/ensayos'
import { useBloquesStore } from '~/stores/bloques'
import { useParcelasStore } from '~/stores/parcelas'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const route = useRoute()
const ensayosStore = useEnsayosStore()
const bloquesStore = useBloquesStore()
const parcelasStore = useParcelasStore()

const busqueda = ref('')
const filtroEnsayoId = ref<number | null>(null)
const filtroBloqueId = ref<number | null>(null)
const cargando = ref(false)
const error = ref('')

const ensayos = computed(() => ensayosStore.items)
const bloques = computed(() => bloquesStore.items)
const parcelas = computed(() => parcelasStore.items)

const parcelasFiltered = computed(() => {
  let filtered = parcelas.value

  if (filtroEnsayoId.value) {
    filtered = filtered.filter((p: any) => p.ensayo?.id === filtroEnsayoId.value)
  }

  if (filtroBloqueId.value) {
    filtered = filtered.filter((p: any) => p.bloque?.id === filtroBloqueId.value)
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
    await bloquesStore.fetchBloques({ limit: 100 })
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

function editarParcela(parcela: any) {
  console.log('Editar parcela:', parcela)
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
  const bloqueId = route.query.bloqueId as string

  if (ensayoId) {
    filtroEnsayoId.value = parseInt(ensayoId, 10)
  }
  if (bloqueId) {
    filtroBloqueId.value = parseInt(bloqueId, 10)
  }

  cargarParcelas()
})

useHead({
  title: 'Parcelas - TMS',
})
</script>

