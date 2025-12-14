<template>
  <div class="space-y-4">
    <!-- Header con botón de crear -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Parcelas ({{ parcelas.length }})
      </h3>
      <button
        @click="abrirFormParcela()"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2"
      >
        <span>+</span> Nueva Parcela
      </button>
    </div>

    <!-- Cargando -->
    <div v-if="parcelasStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="parcelasStore.error"
      class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-600 dark:text-red-200"
    >
      {{ parcelasStore.error }}
    </div>

    <!-- Sin parcelas -->
    <div
      v-else-if="parcelas.length === 0"
      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center"
    >
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        No hay parcelas creadas para este bloque
      </p>
      <button
        @click="abrirFormParcela()"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
      >
        Crear primera parcela
      </button>
    </div>

    <!-- Lista de parcelas en tabla -->
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table class="w-full text-sm">
        <!-- Header -->
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
              ID
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

        <!-- Body -->
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="parcela in parcelas"
            :key="parcela.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <td class="px-4 py-3 text-gray-900 dark:text-white">
              {{ parcela.id }}
            </td>
            <td class="px-4 py-3 text-gray-900 dark:text-white">
              {{ parcela.nombreParcela || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ parcela.tratamiento?.nombreTratamiento || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ parcela.posXGrid || '-' }}, {{ parcela.posYGrid || '-' }}
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex gap-2 justify-center">
                <button
                  @click="editarParcela(parcela)"
                  class="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium transition"
                >
                  Editar
                </button>
                <button
                  @click="eliminarParcela(parcela.id)"
                  class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition"
                >
                  X
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: Parcela Form -->
    <ParcelaForm
      v-if="showFormParcela"
      :parcela="editingParcela"
      :tratamientos="tratamientos"
      :ensayo="ensayoActual"
      :bloque="bloqueActual"
      @save="guardarParcela"
      @close="cerrarFormParcela"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useParcelas } from '~/composables/useParcelas'
import { useApi } from '~/composables/useApi'
import { useEnsayosStore } from '~/stores/ensayos'
import { useBloquesStore } from '~/stores/bloques'
import ParcelaForm from './ParcelaForm.vue'

interface Props {
  ensayoId: number
  bloqueId: number
}

const props = defineProps<Props>()

const {
  showFormParcela,
  editingParcela,
  parcelasStore,
  cargarParcelas,
  crearParcela,
  actualizarParcela,
  eliminarParcela: eliminarParcelaComposable,
  abrirFormParcela,
  cerrarFormParcela,
  setEnsayoId,
  setBloqueId,
} = useParcelas()

const api = useApi()
const tratamientos = ref<any[]>([])
const ensayosStore = useEnsayosStore()
const bloquesStore = useBloquesStore()

// Obtener ensayo y bloque actuales - DESDE STORES (sin logs)
const ensayoActual = computed(() => {
  if (ensayosStore.currentEnsayo?.id === props.ensayoId) {
    return ensayosStore.currentEnsayo
  }

  if (ensayosStore.items && ensayosStore.items.length > 0) {
    const ensayo = ensayosStore.items.find((e: any) => e.id === props.ensayoId)
    if (ensayo) return ensayo
  }

  if (parcelasStore.items && parcelasStore.items.length > 0) {
    const ensayo = parcelasStore.items.find((p: any) => p.ensayo?.id === props.ensayoId)?.ensayo
    if (ensayo) return ensayo
  }

  return null
})

const bloqueActual = computed(() => {
  if (bloquesStore.items && bloquesStore.items.length > 0) {
    const bloque = bloquesStore.items.find((b: any) => b.id === props.bloqueId)
    if (bloque) return bloque
  }

  if (parcelasStore.items && parcelasStore.items.length > 0) {
    const bloque = parcelasStore.items.find((p: any) => p.bloque?.id === props.bloqueId)?.bloque
    if (bloque) return bloque
  }

  return null
})

const parcelas = computed(() => parcelasStore.items)

// Cargar tratamientos
async function cargarTratamientos() {
  try {
    const res = await api.get('/tratamientos', { params: { limit: 100 } })
    const data = res && (res.data ?? res)

    if (Array.isArray(data)) {
      tratamientos.value = data
    } else if (data?.data) {
      tratamientos.value = data.data
    } else {
      tratamientos.value = []
    }
  } catch (err) {
    console.error('Error cargando tratamientos:', err)
    tratamientos.value = []
  }
}

// Inicializar
onMounted(async () => {
  console.log('📋 ParcelasList montado para bloqueId:', props.bloqueId)

  setEnsayoId(props.ensayoId)
  setBloqueId(props.bloqueId)

  try {
    console.log('🔄 Cargando datos para bloque...')
    await Promise.all([
      cargarTratamientos(),
      cargarParcelas({ ensayoId: props.ensayoId, bloqueId: props.bloqueId })
    ])
    console.log('✅ Datos cargados. Parcelas:', parcelasStore.items.length)
  } catch (err) {
    console.error('Error cargando ParcelasList:', err)
  }
})

async function editarParcela(parcela: any) {
  abrirFormParcela(parcela)
}

async function guardarParcela(datos: any) {
  try {
    if (editingParcela.value?.id) {
      await actualizarParcela(editingParcela.value.id, datos)
    } else {
      await crearParcela(datos)
    }
    await cargarParcelas({ ensayoId: props.ensayoId, bloqueId: props.bloqueId })
  } catch (err) {
    console.error('Error al guardar parcela:', err)
  }
}

async function eliminarParcela(id: number) {
  await eliminarParcelaComposable(id)
  await cargarParcelas({ ensayoId: props.ensayoId, bloqueId: props.bloqueId })
}
</script>

