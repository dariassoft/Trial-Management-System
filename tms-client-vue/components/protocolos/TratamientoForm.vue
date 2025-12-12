<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ tratamiento?.id ? 'Editar' : 'Nuevo' }} Tratamiento
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl">×</button>
      </div>

      <!-- Formulario -->
      <div class="p-4 space-y-4">
        <!-- Número de tratamiento -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de Tratamiento *</label>
          <input
            v-model.number="form.numeroTrat"
            type="number"
            min="1"
            required
            placeholder="1, 2, 3..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Testigo checkbox -->
        <div class="flex items-center gap-3">
          <input
            v-model="form.esTestigo"
            type="checkbox"
            id="esTestigo"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <label for="esTestigo" class="text-sm font-medium text-gray-700 dark:text-gray-300">Este es el tratamiento testigo (control)</label>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
          <textarea
            v-model="form.descripcion"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            :placeholder="form.esTestigo ? 'Control sin aplicación' : 'Ej: Fomesafen 25% - 800 cc/ha - V4'"
          ></textarea>
        </div>

        <!-- Productos (si no es testigo) -->
        <template v-if="!form.esTestigo">
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Productos ({{ form.productos?.length || 0 }})</h3>
              <button
                type="button"
                @click="showProductoForm = true"
                class="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
              >
                + Agregar Producto
              </button>
            </div>

            <!-- Lista de productos -->
            <div v-if="form.productos?.length" class="space-y-2">
              <div v-for="(prod, idx) in form.productos" :key="idx" class="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-start gap-2">
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm text-gray-900 dark:text-white">{{ getProductoNombre(prod.productoId) }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {{ prod.dosis || '—' }} {{ prod.unidadDosis }}
                      <span v-if="prod.estadio" class="ml-2">• {{ prod.estadio }}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="form.productos?.splice(idx, 1)"
                    class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>

            <p v-else class="text-xs text-gray-500 dark:text-gray-400 italic">Sin productos agregados.</p>
          </div>
        </template>

        <!-- Botones -->
        <div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="enviar"
            :disabled="!form.numeroTrat"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            Guardar
          </button>
        </div>
      </div>

      <!-- Modal: Agregar Producto -->
      <div v-if="showProductoForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showProductoForm = false">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="font-bold text-gray-900 dark:text-white">Agregar Producto</h3>
            <button @click="showProductoForm = false" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl">×</button>
          </div>

          <div class="p-4 space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Producto *</label>
              <select
                v-model.number="productoTemp.productoId"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Selecciona un producto...</option>
                <option v-for="p in productos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dosis</label>
              <input
                v-model="productoTemp.dosis"
                type="text"
                placeholder="Ej: 800 o 800+300"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unidad</label>
              <select
                v-model="productoTemp.unidadDosis"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>cc/ha</option>
                <option>ml</option>
                <option>l</option>
                <option>g</option>
                <option>kg</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estadio</label>
              <select
                v-model="productoTemp.estadio"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin especificar</option>
                <option>V2</option>
                <option>V3</option>
                <option>V4</option>
                <option>V5</option>
                <option>V6</option>
                <option>V7</option>
                <option>V8</option>
                <option>R1</option>
                <option>R2</option>
                <option>R3</option>
              </select>
            </div>

            <div class="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="showProductoForm = false"
                class="flex-1 px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded font-medium transition text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                @click="agregarProductoTemp"
                :disabled="!productoTemp.productoId"
                class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium transition text-sm"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted } from 'vue'
import { useCatalogosStore } from '~/stores/catalogos'

interface Props {
  protocoloId: number
  tratamiento?: { id: number; numeroTrat: number; descripcion?: string; esTestigo: boolean; productos?: any[] } | null
}

interface Emits {
  (e: 'save', data: any): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const catalogosStore = useCatalogosStore()

const form = reactive({
  numeroTrat: 1,
  descripcion: '',
  esTestigo: false,
  productos: [] as any[],
})

const showProductoForm = ref(false)
const productoTemp = reactive({
  productoId: null as number | null,
  dosis: '',
  unidadDosis: 'cc/ha',
  estadio: '',
})

const productos = ref<any[]>([])

onMounted(async () => {
  await cargarProductos()
})

async function cargarProductos() {
  try {
    const result = await catalogosStore.fetchProductos()
    productos.value = Array.isArray(result) ? result : result?.data || []
  } catch (err) {
    console.error('Error al cargar productos:', err)
  }
}

watch(
  () => props.tratamiento,
  (newVal) => {
    if (newVal) {
      form.numeroTrat = newVal.numeroTrat
      form.descripcion = newVal.descripcion || ''
      form.esTestigo = newVal.esTestigo
      form.productos = newVal.productos ? JSON.parse(JSON.stringify(newVal.productos)) : []
    } else {
      form.numeroTrat = 1
      form.descripcion = ''
      form.esTestigo = false
      form.productos = []
    }
  },
  { immediate: true },
)

function getProductoNombre(id: number | null) {
  if (!id) return 'Producto'
  const prod = productos.value.find(p => p.id === id)
  return prod?.nombre || `Producto ${id}`
}

function agregarProductoTemp() {
  if (!productoTemp.productoId) return

  const nuevoProducto = {
    productoId: productoTemp.productoId,
    dosis: productoTemp.dosis || null,
    unidadDosis: productoTemp.unidadDosis,
    estadio: productoTemp.estadio || null,
  }

  if (!form.productos) form.productos = []
  form.productos.push(nuevoProducto)

  productoTemp.productoId = null
  productoTemp.dosis = ''
  productoTemp.unidadDosis = 'cc/ha'
  productoTemp.estadio = ''
  showProductoForm.value = false
}

function enviar() {
  emit('save', {
    numeroTrat: form.numeroTrat,
    descripcion: form.descripcion.trim() || null,
    esTestigo: form.esTestigo,
    productos: form.esTestigo ? [] : form.productos,
  })
}
</script>

