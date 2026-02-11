<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import type { Producto } from '~/stores/productos'

const props = defineProps<{
  producto?: Producto | null
}>()

const emit = defineEmits<{
  guardar: [data: Producto]
  cancelar: []
}>()

const api = useApi()
const loading = ref(false)
const laboratorios = ref<any[]>([])
const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.producto?.id)

const form = ref<Producto>({
  nombre_comercial: '',
  descripcion: null,
  principio_activo: null,
  formulacion: null,
  tipo: null,
  unidad: null,
  precio: null,
  laboratorioId: undefined,
})

watch(
  () => props.producto,
  (newVal) => {
    if (newVal) {
      form.value = {
        nombre_comercial: newVal.nombre_comercial,
        descripcion: newVal.descripcion ?? null,
        principio_activo: newVal.principio_activo ?? null,
        formulacion: newVal.formulacion ?? null,
        tipo: newVal.tipo ?? null,
        unidad: newVal.unidad ?? null,
        precio: newVal.precio ?? null,
        laboratorioId: newVal.laboratorio?.id,
      }
    } else {
      form.value = {
        nombre_comercial: '',
        descripcion: null,
        principio_activo: null,
        formulacion: null,
        tipo: null,
        unidad: null,
        precio: null,
        laboratorioId: undefined,
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

const cargarLaboratorios = async () => {
  try {
    const response = await api.get('/laboratorios?limit=100')
    laboratorios.value = response.data || []
  } catch (error) {
    console.error('Error al cargar laboratorios:', error)
  }
}

const validar = () => {
  errors.value = {}

  if (!form.value.nombre_comercial) {
    errors.value.nombre_comercial = 'El nombre es requerido'
  }

  if (form.value.nombre_comercial && form.value.nombre_comercial.length > 100) {
    errors.value.nombre_comercial = 'El nombre no puede exceder 100 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

const guardar = () => {
  if (!validar()) return

  loading.value = true
  try {
    const { id, ...dataToSend } = form.value
    emit('guardar', {
      ...dataToSend,
      id: isEditing.value ? props.producto!.id : undefined,
    })
  } finally {
    loading.value = false
  }
}

cargarLaboratorios()
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto' }}
        </h2>
        <button
          @click="$emit('cancelar')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
        >
          ✕
        </button>
      </div>

      <!-- Formulario -->
      <div class="p-6 space-y-6">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre Comercial *
          </label>
          <input
            v-model="form.nombre_comercial"
            type="text"
            placeholder="Ej: Herbicida X, Fungicida ABC"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.nombre_comercial" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.nombre_comercial }}
          </p>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            v-model="form.descripcion"
            placeholder="Descripción detallada del producto..."
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Principio Activo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Principio Activo
            </label>
            <input
              v-model="form.principio_activo"
              type="text"
              placeholder="Ej: Glifosato 48%"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Formulación -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Formulación
            </label>
            <input
              v-model="form.formulacion"
              type="text"
              placeholder="Ej: SL, WP, SC"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Tipo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo
            </label>
            <input
              v-model="form.tipo"
              type="text"
              placeholder="Ej: Herbicida, Fungicida, Insecticida"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Unidad -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unidad
            </label>
            <input
              v-model="form.unidad"
              type="text"
              placeholder="Ej: L/ha, cc/ha, kg/ha"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Precio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Precio
            </label>
            <input
              v-model.number="form.precio"
              type="number"
              placeholder="0.00"
              step="0.01"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Laboratorio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Laboratorio
            </label>
            <select
              v-model.number="form.laboratorioId"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="undefined">Sin laboratorio</option>
              <option v-for="lab in laboratorios" :key="lab.id" :value="lab.id">
                {{ lab.nombre }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3 justify-end">
        <button
          @click="$emit('cancelar')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          ✕ Cancelar
        </button>
        <button
          @click="guardar"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ loading ? '⏳ Guardando...' : isEditing ? '💾 Actualizar' : '➕ Crear' }}
        </button>
      </div>
    </div>
  </div>
</template>

