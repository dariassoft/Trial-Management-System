<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ modoEdicion ? 'Editar' : 'Nuevo' }} Tratamiento
          </h2>
          <!-- DEBUG: Mostrar estado actual -->
          <p class="text-xs text-gray-500 mt-1">
            [DEBUG] modoEdicion={{ modoEdicion }} | tratamiento.id={{ props.tratamiento?.id }}
          </p>
        </div>
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

        <!-- Productos -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Productos ({{ form.productos?.length || 0 }})</h3>
            <button
              v-if="!form.esTestigo"
              type="button"
              @click="showProductoForm = true"
              class="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
            >
              + Agregar Producto
            </button>
            <span v-else class="text-xs text-gray-500 italic">Testigo (sin productos)</span>
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
                  v-if="!form.esTestigo"
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
                <option v-for="p in productos" :key="p.id" :value="p.id">{{ p.nombre_comercial || p.nombre }}</option>
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
              <input
                v-model="productoTemp.unidadDosis"
                type="text"
                placeholder="Ej: cc/ha, ml, l, g, kg"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estadio</label>
              <input
                v-model="productoTemp.estadio"
                type="text"
                placeholder="Ej: V2, V3, V4, V5, R1, R2, etc."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
import { reactive, ref, onMounted, computed, watchEffect } from 'vue'
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

// Computed para detectar modo edición - Forzar reactividad
const modoEdicion = computed(() => {
  const resultado = !!(props.tratamiento && props.tratamiento.id)
  console.log('🔍 modoEdicion computed:', { tratamiento: props.tratamiento, resultado })
  return resultado
})

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
const formularioLlenado = ref(false) // Flag para evitar sobrescribir cambios del usuario

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

// Usar watchEffect en lugar de watch para reactividad más inmediata
// IMPORTANTE: Solo llenar formulario la PRIMERA VEZ que llega el prop
watchEffect(async () => {
  const newVal = props.tratamiento
  console.log('🔄 watchEffect disparado - props.tratamiento:', newVal, 'formularioLlenado:', formularioLlenado.value)

  // Solo llenar el formulario si es la primera vez (no ha sido llenado aún)
  if (newVal && newVal.id && !formularioLlenado.value) {
    console.log('📝 PRIMERA CARGA - Rellenando formulario con datos del tratamiento:', newVal)
    form.numeroTrat = newVal.numeroTrat
    form.descripcion = newVal.descripcion || ''
    form.esTestigo = newVal.esTestigo
    console.log('✅ form.esTestigo actualizado a:', form.esTestigo)

    // Mapear productos SOLO en la carga inicial
    if (newVal.productos && Array.isArray(newVal.productos)) {
      form.productos = newVal.productos.map((p: any) => ({
        id: p.id,
        productoId: p.producto?.id ?? p.productoId,
        dosis: p.dosis ?? null,
        unidadDosis: p.unidadDosis ?? 'cc/ha',
        estadio: p.estadio ?? null,
      }))
    } else {
      form.productos = []
    }
    console.log('✅ Formulario rellenado:', { numeroTrat: form.numeroTrat, esTestigo: form.esTestigo, productos: form.productos.length })

    // Marcar que el formulario ya fue llenado
    formularioLlenado.value = true
    console.log('🔐 Formulario marcado como llenado - cambios del usuario NO serán sobrescritos')
  } else if (!newVal && formularioLlenado.value) {
    console.log('🔄 Prop tratamiento se limpió - RESETEANDO formulario para nuevo tratamiento')
    form.numeroTrat = 1
    form.descripcion = ''
    form.esTestigo = false
    form.productos = []
    formularioLlenado.value = false
  }
})

// Watch para detectar cuando el usuario cambia manualmente form.esTestigo
watchEffect(() => {
  console.log('👁️ form.esTestigo cambió a:', form.esTestigo)
})

function getProductoNombre(productoId: number | null) {
  if (!productoId) return 'Producto'
  const prod = productos.value.find(p => p.id === productoId)
  return prod?.nombre_comercial || prod?.nombre || `Producto ${productoId}`
}

function agregarProductoTemp() {
  console.log('🔵 agregarProductoTemp llamado, productoTemp:', productoTemp)

  if (!productoTemp.productoId) {
    console.warn('⚠️ No hay producto seleccionado')
    return
  }

  const nuevoProducto = {
    productoId: productoTemp.productoId,
    dosis: productoTemp.dosis || null,
    unidadDosis: productoTemp.unidadDosis,
    estadio: productoTemp.estadio || null,
  }

  console.log('✅ Agregando producto:', nuevoProducto)

  if (!form.productos) form.productos = []
  form.productos.push(nuevoProducto)

  console.log('📦 Productos después de agregar:', form.productos)

  // Resetear los valores del formulario de producto
  productoTemp.productoId = null
  productoTemp.dosis = ''
  productoTemp.unidadDosis = 'cc/ha'
  productoTemp.estadio = ''

  console.log('✔️ productoTemp reseteado:', productoTemp)

  // Cerrar el modal
  showProductoForm.value = false
  console.log('🔒 Modal cerrado')
}

function enviar() {
  emit('save', {
    tratamiento: {
      numeroTrat: form.numeroTrat,
      descripcion: form.descripcion.trim() || null,
      esTestigo: form.esTestigo,
    },
    productos: form.esTestigo ? [] : form.productos,
  })
}

</script>

