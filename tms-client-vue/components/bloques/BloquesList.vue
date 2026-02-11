<template>
  <div class="space-y-4">
    <!-- Header con botón de crear -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Bloques ({{ bloques.length }})
      </h3>
      <button
        @click="abrirFormBloque()"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2"
      >
        <span>+</span> Nuevo Bloque
      </button>
    </div>

    <!-- Cargando -->
    <div v-if="bloquesStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="bloquesStore.error"
      class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-600 dark:text-red-200"
    >
      {{ bloquesStore.error }}
    </div>

    <!-- Sin bloques -->
    <div
      v-else-if="bloques.length === 0"
      class="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center"
    >
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        No hay bloques creados para este ensayo
      </p>
      <button
        @click="abrirFormBloque()"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
      >
        Crear primer bloque
      </button>
    </div>

    <!-- Lista de bloques -->
    <div v-else class="space-y-3">
      <div
        v-for="bloque in bloques"
        :key="bloque.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition"
      >
        <!-- Header del bloque (clickeable para expandir) -->
        <div
          @click="toggleBloqueExpandido(bloque.id)"
          class="cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex justify-between items-center"
        >
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
              Bloque {{ bloque.nombreBloque }}
            </h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              ID: {{ bloque.id }}
            </p>
          </div>
          <span
            class="transition transform text-lg"
            :class="bloqueExpandido === bloque.id ? 'rotate-180' : ''"
          >
            ▼
          </span>
        </div>

        <!-- Acciones principales -->
        <div class="px-4 pb-3 flex gap-2 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="editarBloque(bloque)"
            class="flex-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium transition"
          >
            Editar
          </button>
          <button
            @click="eliminarBloque(bloque.id)"
            class="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
          >
            Eliminar
          </button>
        </div>

        <!-- Detalle expandible: Parcelas - SOLO para el bloque expandido -->
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
            <!-- Componente ParcelasList - Montado SOLO aquí, una vez -->
            <ParcelasList
              v-if="bloqueExpandido === bloque.id"
              :key="`parcelas-${bloqueExpandido}`"
              :ensayo-id="ensayoId"
              :ensayo="props.ensayo"
              :bloque-id="bloque.id"
              :bloque="bloque"
            />
          </div>
        </Transition>
      </div>
    </div>

    <!-- Modal: Bloque Form -->
    <BloqueForm
      v-if="showFormBloque"
      :bloque="editingBloque"
      @save="guardarBloque"
      @close="cerrarFormBloque"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useBloques } from '~/composables/useBloques'
import BloqueForm from './BloqueForm.vue'
import ParcelasList from '../parcelas/ParcelasList.vue'

interface Props {
  ensayoId: number
  ensayo?: any
}

const props = defineProps<Props>()

const {
  showFormBloque,
  editingBloque,
  bloquesStore,
  cargarBloques,
  crearBloque,
  actualizarBloque,
  eliminarBloque: eliminarBloqueComposable,
  abrirFormBloque,
  cerrarFormBloque,
  setEnsayoId,
} = useBloques()

const bloques = computed(() => {
  return bloquesStore.items || []
})
const bloqueExpandido = ref<number | null>(null)

// Inicializar
onMounted(async () => {
  setEnsayoId(props.ensayoId)
  await cargarBloques({ ensayoId: props.ensayoId })
})

function toggleBloqueExpandido(bloqueId: number) {
  console.log('✅ CLICK DETECTADO en bloque:', bloqueId)
  console.log('  Estado anterior:', bloqueExpandido.value)
  bloqueExpandido.value = bloqueExpandido.value === bloqueId ? null : bloqueId
  console.log('  Estado nuevo:', bloqueExpandido.value)
}

async function editarBloque(bloque: any) {
  abrirFormBloque(bloque)
}

async function guardarBloque(datos: any) {
  try {
    if (editingBloque.value?.id) {
      await actualizarBloque(editingBloque.value.id, datos)
    } else {
      await crearBloque(datos)
    }
    await cargarBloques({ ensayoId: props.ensayoId })
  } catch (err) {
    console.error('Error al guardar bloque:', err)
  }
}

async function eliminarBloque(id: number) {
  await eliminarBloqueComposable(id)
  await cargarBloques({ ensayoId: props.ensayoId })
}
</script>

