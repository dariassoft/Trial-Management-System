<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
    <div class="max-w-7xl mx-auto px-3 md:px-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Bloques y Parcelas</h1>
          <p class="mt-1 text-gray-600 dark:text-gray-400">Gestiona el diseño experimental de tus ensayos</p>
        </div>
        <NuxtLink
          to="/ensayos"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          ← Volver a Ensayos
        </NuxtLink>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <!-- Buscar Ensayo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar Ensayo
            </label>
            <input
              v-model="busquedaEnsayo"
              type="text"
              placeholder="Nombre o código..."
              @keyup.enter="buscar"
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
              @change="buscar"
            >
              <option :value="null">Todos los ensayos</option>
              <option v-for="e in ensayos" :key="e.id" :value="e.id">
                {{ e.nombreEnsayo }}
              </option>
            </select>
          </div>

          <!-- Botón Buscar -->
          <div class="flex items-end">
            <button
              @click="buscar"
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
        <!-- Sin resultados -->
        <div
          v-if="bloquesFiltered.length === 0"
          class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
        >
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            No hay bloques que coincidan con tu búsqueda
          </p>
          <NuxtLink
            to="/ensayos/new"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Crear Ensayo
          </NuxtLink>
        </div>

        <!-- Bloques agrupados por ensayo -->
        <div v-else class="space-y-6">
          <div
            v-for="grupo in bloquesPorEnsayo"
            :key="grupo.ensayo.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <!-- Header del Ensayo -->
            <div
              @click="toggleEnsayoExpandido(grupo.ensayo.id)"
              class="cursor-pointer p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex justify-between items-center bg-blue-50 dark:bg-blue-900/30 border-b border-gray-200 dark:border-gray-700"
            >
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ grupo.ensayo.nombreEnsayo }}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Código: {{ grupo.ensayo.codigoLabor || '-' }} • Bloques: {{ grupo.bloques.length }}
                </p>
              </div>
              <span
                class="transition transform text-lg"
                :class="ensayoExpandido === grupo.ensayo.id ? 'rotate-180' : ''"
              >
                ▼
              </span>
            </div>

            <!-- Bloques del ensayo -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              leave-active-class="transition duration-200 ease-in"
              enter-from-class="opacity-0"
              leave-to-class="opacity-0"
            >
              <div v-if="ensayoExpandido === grupo.ensayo.id" class="p-6 bg-gray-50 dark:bg-gray-700">
                <div class="space-y-4">
                  <div
                    v-for="bloque in grupo.bloques"
                    :key="bloque.id"
                    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <!-- Header del Bloque -->
                    <div
                      @click="toggleBloqueExpandido(bloque.id)"
                      class="cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex justify-between items-center"
                    >
                      <h3 class="font-semibold text-gray-900 dark:text-white">
                        Bloque {{ bloque.nombreBloque }} (ID: {{ bloque.id }})
                      </h3>
                      <span
                        class="transition transform"
                        :class="bloqueExpandido === bloque.id ? 'rotate-180' : ''"
                      >
                        ▼
                      </span>
                    </div>

                    <!-- Parcelas del Bloque -->
                    <Transition
                      enter-active-class="transition duration-200 ease-out"
                      leave-active-class="transition duration-200 ease-in"
                      enter-from-class="opacity-0"
                      leave-to-class="opacity-0"
                    >
                      <div
                        v-if="bloqueExpandido === bloque.id"
                        class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700"
                      >
                        <ParcelasList
                          :ensayo-id="grupo.ensayo.id"
                          :bloque-id="bloque.id"
                          :ensayo="grupo.ensayo"
                          :bloque="bloque"
                        />
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>
            </Transition>
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
import ParcelasList from '~/components/parcelas/ParcelasList.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const route = useRoute()
const ensayosStore = useEnsayosStore()
const bloquesStore = useBloquesStore()

const busquedaEnsayo = ref('')
const filtroEnsayoId = ref<number | null>(null)
const cargando = ref(false)
const error = ref('')
const ensayoExpandido = ref<number | null>(null)
const bloqueExpandido = ref<number | null>(null)

const ensayos = computed(() => ensayosStore.items)
const bloques = computed(() => bloquesStore.items)

const bloquesFiltered = computed(() => {
  let filtered = bloques.value

  if (filtroEnsayoId.value) {
    filtered = filtered.filter((b: any) => b.ensayo?.id === filtroEnsayoId.value)
  }

  if (busquedaEnsayo.value.trim()) {
    const q = busquedaEnsayo.value.toLowerCase()
    filtered = filtered.filter((b: any) =>
      b.ensayo?.nombreEnsayo?.toLowerCase().includes(q) ||
      b.ensayo?.codigoLabor?.toLowerCase().includes(q)
    )
  }

  return filtered
})

const bloquesPorEnsayo = computed(() => {
  const mapa = new Map<number, any>()

  bloquesFiltered.value.forEach((bloque: any) => {
    const ensayoId = bloque.ensayo?.id
    if (!ensayoId) return

    if (!mapa.has(ensayoId)) {
      mapa.set(ensayoId, {
        ensayo: bloque.ensayo,
        bloques: [],
      })
    }

    mapa.get(ensayoId)!.bloques.push(bloque)
  })

  return Array.from(mapa.values())
})

function toggleEnsayoExpandido(ensayoId: number) {
  ensayoExpandido.value = ensayoExpandido.value === ensayoId ? null : ensayoId
}

function toggleBloqueExpandido(bloqueId: number) {
  bloqueExpandido.value = bloqueExpandido.value === bloqueId ? null : bloqueId
}

async function buscar() {
  cargando.value = true
  error.value = ''
  try {
    await ensayosStore.fetchEnsayos({ limit: 100 })
    await bloquesStore.fetchBloques({ limit: 100 })
  } catch (err: any) {
    error.value = err.message || 'Error al cargar datos'
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  // Si viene con parámetro ensayoId, aplicar filtro automáticamente
  const ensayoId = route.query.ensayoId as string
  if (ensayoId) {
    filtroEnsayoId.value = parseInt(ensayoId, 10)
    busquedaEnsayo.value = ''
  }
  buscar()
})

// Expandir automáticamente el primer ensayo si viene con filtro
watch(bloquesPorEnsayo, (nuevosGrupos) => {
  if (filtroEnsayoId.value && nuevosGrupos.length > 0) {
    ensayoExpandido.value = filtroEnsayoId.value
  }
}, { immediate: true })

useHead({
  title: 'Bloques y Parcelas - TMS',
})
</script>

