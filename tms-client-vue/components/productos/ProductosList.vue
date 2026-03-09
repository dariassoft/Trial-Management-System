<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useProductosStore, type Producto } from '~/stores/productos'
import ProductoForm from './ProductoForm.vue'
import ConfirmDeleteModal from '~/components/common/ConfirmDeleteModal.vue'

const productosStore = useProductosStore()
const mostrarForm = ref(false)
const mostrarConfirmarEliminar = ref(false)
const productoEnEdicion = ref<Producto | null>(null)
const productoAEliminar = ref<Producto | null>(null)
const viewMode = ref<'tabla' | 'tarjetas'>('tabla')

const isLoading = computed(() => productosStore.loading)
const productos = computed(() => productosStore.productos)
const totalPages = computed(() => Math.ceil(productosStore.total / productosStore.pageSize))

watch(
  () => productosStore.currentPage,
  () => {
    productosStore.fetchProductos()
  }
)

const inicializar = async () => {
  try {
    await productosStore.fetchProductos()
  } catch (error) {
    // Manejo silencioso del error en la inicialización
    console.warn('No se pudieron cargar productos inicialmente:', error)
  }
}

const aplicarFiltros = async () => {
  productosStore.setCurrentPage(1)
  await productosStore.fetchProductos()
}

const limpiarFiltros = () => {
  productosStore.filtros.q = ''
  productosStore.setCurrentPage(1)
  productosStore.fetchProductos()
}

const abrirFormProducto = () => {
  productoEnEdicion.value = null
  mostrarForm.value = true
}

const editarProducto = (producto: Producto) => {
  productoEnEdicion.value = producto
  mostrarForm.value = true
}

async function guardarProducto(data: Producto) {
  try {
    if (productoEnEdicion.value?.id) {
      const { id: _, ...dataToUpdate } = data
      await productosStore.updateProducto(productoEnEdicion.value.id, dataToUpdate as Producto)
    } else {
      await productosStore.createProducto(data)
    }
    cerrarForm()
    await productosStore.fetchProductos()
  } catch (error) {
    console.error('Error al guardar producto:', error)
  }
}

const confirmarEliminar = (producto: Producto) => {
  productoAEliminar.value = producto
  mostrarConfirmarEliminar.value = true
}

const eliminarProducto = async () => {
  if (!productoAEliminar.value?.id) return
  try {
    await productosStore.deleteProducto(productoAEliminar.value.id)
    cancelarEliminar()
    await productosStore.fetchProductos()
  } catch (error) {
    console.error('Error al eliminar producto:', error)
  }
}

const cancelarEliminar = () => {
  productoAEliminar.value = null
  mostrarConfirmarEliminar.value = false
}

const cerrarForm = () => {
  mostrarForm.value = false
  productoEnEdicion.value = null
}

async function irAPagina(page: number) {
  const totalPagesVal = Math.ceil(productosStore.total / productosStore.pageSize)
  if (page >= 1 && page <= totalPagesVal) {
    productosStore.setCurrentPage(page)
    await productosStore.fetchProductos()
  }
}

// Inicializar solo en el cliente, después del montaje
onMounted(() => {
  inicializar()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Productos</h1>
        <p class="text-gray-600 dark:text-gray-400">Gestión de insumos, herbicidas, fungicidas y semillas</p>
      </div>
      <button
        @click="abrirFormProducto"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
      >
        ➕ Nuevo Producto
      </button>
    </div>

    <!-- Filtros -->
    <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar producto
          </label>
          <input
            v-model="productosStore.filtros.q"
            type="text"
            placeholder="Nombre, tipo, principio activo..."
            @keyup.enter="aplicarFiltros"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          @click="aplicarFiltros"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          🔍 Buscar
        </button>
        <button
          @click="limpiarFiltros"
          class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition"
        >
          ✕ Limpiar
        </button>
      </div>
    </div>

    <!-- Vista Tabla (Desktop) -->
    <div class="hidden md:block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Tipo</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Unidad</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Precio</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Laboratorio</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="isLoading" class="text-center py-8">
            <td colspan="6" class="py-4">⏳ Cargando...</td>
          </tr>
          <tr v-else-if="productos.length === 0" class="text-center py-8">
            <td colspan="6" class="py-4 text-gray-500 dark:text-gray-400">Sin productos registrados</td>
          </tr>
          <tr v-for="producto in productos" :key="producto.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <td class="px-4 py-3 text-gray-900 dark:text-white">
              <div class="font-medium">{{ producto.nombre_comercial }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ producto.principio_activo }}</div>
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ producto.tipo || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ producto.unidad || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ producto.precio ? `$${producto.precio}` : '-' }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ producto.laboratorio?.nombre || '-' }}
            </td>
            <td class="px-4 py-3 text-center space-x-2">
              <button
                @click="editarProducto(producto)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                title="Editar"
              >
                ✏️
              </button>
              <button
                @click="confirmarEliminar(producto)"
                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                title="Eliminar"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Vista Tarjetas (Mobile) -->
    <div class="md:hidden grid gap-3">
      <div v-if="isLoading" class="text-center py-8">⏳ Cargando...</div>
      <div v-else-if="productos.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        Sin productos registrados
      </div>
      <div
        v-for="producto in productos"
        :key="producto.id"
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <div class="space-y-2">
          <div>
            <div class="font-bold text-gray-900 dark:text-white">{{ producto.nombre_comercial }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">{{ producto.principio_activo }}</div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400">Tipo:</span>
              <div class="text-gray-900 dark:text-white">{{ producto.tipo || '-' }}</div>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Unidad:</span>
              <div class="text-gray-900 dark:text-white">{{ producto.unidad || '-' }}</div>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Precio:</span>
              <div class="text-gray-900 dark:text-white">{{ producto.precio ? `$${producto.precio}` : '-' }}</div>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Laboratorio:</span>
              <div class="text-gray-900 dark:text-white">{{ producto.laboratorio?.nombre || '-' }}</div>
            </div>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <button
            @click="editarProducto(producto)"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm transition"
          >
            ✏️ Editar
          </button>
          <button
            @click="confirmarEliminar(producto)"
            class="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-sm transition"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="productos.length > 0" class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {{ (productosStore.currentPage - 1) * productosStore.pageSize + 1 }} a
        {{ Math.min(productosStore.currentPage * productosStore.pageSize, productosStore.total) }} de
        {{ productosStore.total }} productos
      </div>
      <div class="flex gap-2">
        <button
          @click="irAPagina(productosStore.currentPage - 1)"
          :disabled="productosStore.currentPage === 1"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Anterior
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in Math.min(5, totalPages)"
            :key="page"
            @click="irAPagina(page)"
            :class="page === productosStore.currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            "
            class="px-3 py-1 rounded transition"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="irAPagina(productosStore.currentPage + 1)"
          :disabled="productosStore.currentPage >= totalPages"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de Formulario -->
    <ProductoForm
      v-if="mostrarForm"
      :producto="productoEnEdicion"
      @guardar="guardarProducto"
      @cancelar="cerrarForm"
    />

    <!-- Modal de Confirmación de Eliminación -->
    <ConfirmDeleteModal
      v-if="mostrarConfirmarEliminar"
      :item-name="`'${productoAEliminar?.nombre_comercial}'`"
      @confirmar="eliminarProducto"
      @cancelar="cancelarEliminar"
    />
  </div>
</template>

