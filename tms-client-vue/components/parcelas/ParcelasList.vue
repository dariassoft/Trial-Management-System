<template>
  <div class="space-y-4">
    <!-- Header con botón de crear -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Parcelas ({{ parcelas.length }})
      </h3>
      <button
        @click="abrirNuevaParcela"
        :disabled="isBloqueCompleto"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <span>+</span> Nueva Parcela
      </button>
    </div>

    <!-- Notas informativas -->
    <div v-if="ensayoActual" class="space-y-2">
      <div class="p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded text-sm text-blue-800 dark:text-blue-200">
        <p><span class="font-semibold">Nota:</span> Este bloque debe tener {{ parcelasEsperadasPorBloque }} parcelas (una por cada tratamiento).</p>
      </div>
      <div v-if="!isBloqueCompleto && parcelasEsperadasPorBloque > 0" class="p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded text-sm text-yellow-800 dark:text-yellow-200">
        <p><span class="font-semibold">Atención:</span> Faltan por definir {{ parcelasEsperadasPorBloque - parcelas.length }} parcelas para completar este bloque.</p>
      </div>
      <div v-if="parcelas.length > parcelasEsperadasPorBloque && parcelasEsperadasPorBloque > 0" class="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-sm text-red-800 dark:text-red-200">
        <p><span class="font-semibold">Atención:</span> Se han definido {{ parcelas.length - parcelasEsperadasPorBloque }} parcelas de más para este bloque.</p>
      </div>
      <div v-if="isBloqueCompleto" class="p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded text-sm text-green-800 dark:text-green-200">
        <p><span class="font-semibold">Bloque Completo:</span> Se han definido todas las parcelas para este bloque ({{ parcelas.length }}/{{ parcelasEsperadasPorBloque }}).</p>
      </div>
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
        @click="abrirNuevaParcela"
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
              <span v-if="parcela.tratamiento" class="font-medium text-blue-600 dark:text-blue-400 mr-2">
                T{{ parcela.tratamiento.numeroTrat }}
              </span>
              {{ parcela.tratamiento?.descripcion || parcela.tratamiento?.nombreTratamiento || '-' }}
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
                  @click="confirmarEliminarParcela(parcela.id, parcela.nombreParcela)"
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
      :parcelasExistentes="parcelas"
      :todasLasParcelas="todasLasParcelasDelEnsayo"
      :is-bloque-completo="isBloqueCompleto"
      @save="guardarParcela"
      @close="cerrarFormParcela"
    />

    <!-- Modal: Confirm Delete -->
    <ConfirmDeleteModal
      v-if="showDeleteConfirm"
      :nombre="deleteTargetNombre"
      @confirmar="ejecutarEliminacion"
      @cancelar="cerrarDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useParcelas } from '~/composables/useParcelas'
import { useApi } from '~/composables/useApi'
import { useEnsayosStore, type Ensayo } from '~/stores/ensayos'
import { useBloquesStore } from '~/stores/bloques'
import ParcelaForm from './ParcelaForm.vue'
import ConfirmDeleteModal from '~/components/common/ConfirmDeleteModal.vue'

interface Props {
  ensayoId: number
  bloqueId: number
  ensayo?: any
  bloque?: any
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
import { useNotifications } from '~/composables/useNotifications'
const { showNotification } = useNotifications()

const tratamientos = ref<any[]>([])
const ensayoCompleto = ref<any>(null)
const ensayosStore = useEnsayosStore()
const bloquesStore = useBloquesStore()
const todasLasParcelasDelEnsayo = ref<any[]>([])

async function cargarTodasLasParcelas() {
  try {
    const res = await api.get('/parcelas', { params: { ensayoId: props.ensayoId, limit: 1000 } })
    const data = res && (res.data ?? res)
    todasLasParcelasDelEnsayo.value = Array.isArray(data) ? data : data?.data || []
  } catch (err) {
    console.error('Error cargando todas las parcelas:', err)
  }
}

// Obtener el ensayo con toda la info (de props o cargado)
const ensayoActual = computed(() => {
  // Priorizar ensayo cargado completo si existe
  if (ensayoCompleto.value) return ensayoCompleto.value
  // Si no, intentar usar el de props
  if (props.ensayo) return props.ensayo
  // Finalmente, buscar en el store
  const storeEnsayo = ensayosStore.currentEnsayo as Ensayo | null
  if (storeEnsayo && Number(storeEnsayo?.id) === Number(props.ensayoId)) return storeEnsayo
  return null
})

const parcelasEsperadasPorBloque = computed(() => {
  if (!ensayoActual.value) return 0
  return ensayoActual.value.columnas || 0
})

const isBloqueCompleto = computed(() => {
  if (!parcelasEsperadasPorBloque.value) return false
  return parcelas.value.length >= parcelasEsperadasPorBloque.value
})

// Obtener bloque actual - DESDE PROPS O STORES
const bloqueActual = computed(() => {
  // Priorizar el bloque que viene como prop
  if (props.bloque) {
    console.log('📌 bloqueActual desde props:', props.bloque)
    return props.bloque
  }

  if (bloquesStore.items && bloquesStore.items.length > 0) {
    const bloque = bloquesStore.items.find((b: any) => b.id === props.bloqueId)
    if (bloque) {
      console.log('📌 bloqueActual desde store:', bloque)
      return bloque
    }
  }

  if (parcelasStore.items && parcelasStore.items.length > 0) {
    const bloque = parcelasStore.items.find((p: any) => p.bloque?.id === props.bloqueId)?.bloque
    if (bloque) {
      console.log('📌 bloqueActual desde parcelas:', bloque)
      return bloque
    }
  }

  console.log('⚠️ bloqueActual no encontrado')
  return null
})

const parcelas = computed(() => parcelasStore.items)

// Cargar ensayo completo con todas las relaciones
async function cargarEnsayoCompleto() {
  try {
    console.log('📋 Cargando ensayo completo para ID:', props.ensayoId)
    const res = await api.get(`/ensayos/${props.ensayoId}`)
    const data = res && (res.data ?? res)
    ensayoCompleto.value = data
    console.log('✅ Ensayo completo cargado:', data?.nombreEnsayo)
    console.log('   - codigoLabor:', data?.codigoLabor)
    console.log('   - protocolo:', data?.protocolo)
    console.log('   - laboratorio:', data?.laboratorio)
    console.log('   - tipoEnsayo:', data?.tipoEnsayo)
    return data
  } catch (err) {
    console.error('Error cargando ensayo completo:', err)
    return null
  }
}

// Cargar tratamientos filtrados por protocolo del ensayo
async function cargarTratamientos() {
  try {
    // Usar ensayoCompleto directamente (ya fue cargado)
    const ensayo = ensayoCompleto.value || props.ensayo
    const protocoloId = ensayo?.protocolo?.id || ensayo?.protocoloId

    console.log('📋 cargarTratamientos - ensayo:', ensayo?.nombreEnsayo)
    console.log('   - protocoloId:', protocoloId)

    if (protocoloId) {
      console.log('📋 Cargando tratamientos FILTRADOS por protocoloId:', protocoloId)
      const res = await api.get('/tratamientos', { params: { protocoloId, limit: 100 } })
      const data = res && (res.data ?? res)

      if (Array.isArray(data)) {
        tratamientos.value = data
        console.log('✅ Tratamientos del protocolo cargados:', data.length)
      } else if (data?.data) {
        tratamientos.value = data.data
        console.log('✅ Tratamientos del protocolo cargados:', data.data.length)
      } else {
        tratamientos.value = []
        console.warn('⚠️ Sin tratamientos para este protocolo')
      }
    } else {
      console.log('⚠️ No hay protocoloId, cargando TODOS los tratamientos como fallback...')
      const res = await api.get('/tratamientos', { params: { limit: 100 } })
      const data = res && (res.data ?? res)

      if (Array.isArray(data)) {
        tratamientos.value = data
      } else if (data?.data) {
        tratamientos.value = data.data
      } else {
        tratamientos.value = []
      }
      console.log('✅ Tratamientos (todos) cargados:', tratamientos.value.length)
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
    // Primero cargar el ensayo completo
    await cargarEnsayoCompleto()
    // Luego cargar tratamientos (que dependen del protocolo del ensayo)
    await Promise.all([
      cargarTratamientos(),
      cargarTodasLasParcelas(),
      // Límite alto para que el mapa visual muestre TODAS las parcelas del bloque como ocupadas
      cargarParcelas({ ensayoId: props.ensayoId, bloqueId: props.bloqueId, limit: 500 })
    ])
    console.log('✅ Datos cargados. Parcelas:', parcelasStore.items.length)
  } catch (err) {
    console.error('Error cargando ParcelasList:', err)
  }
})

async function editarParcela(parcela: any) {
  console.log('🖊️ Abriendo formulario de edición')
  console.log('   - parcela:', parcela)
  console.log('   - parcela.tratamiento:', parcela?.tratamiento)
  console.log('   - ensayoActual:', ensayoActual.value)
  console.log('   - ensayoActual.codigoLabor:', ensayoActual.value?.codigoLabor)
  console.log('   - ensayoActual.protocolo:', ensayoActual.value?.protocolo)
  console.log('   - bloqueActual:', bloqueActual.value)

  // Si no hay ensayo completo, cargarlo primero (igual que en creación)
  if (!ensayoCompleto.value) {
    console.log('⏳ Cargando ensayo completo antes de abrir formulario de edición...')
    await cargarEnsayoCompleto()
    console.log('✅ Ensayo cargado:', ensayoCompleto.value?.nombreEnsayo)
  }

  // Preparar la parcela con tratamientoId extraído del objeto tratamiento
  const parcelaParaEditar = {
    ...parcela,
    tratamientoId: parcela.tratamiento?.id || parcela.tratamientoId,
  }
  console.log('   - parcelaParaEditar:', parcelaParaEditar)

  abrirFormParcela(parcelaParaEditar)
}

async function abrirNuevaParcela() {
  console.log('➕ Abriendo formulario de nueva parcela')
  console.log('   - ensayoCompleto:', ensayoCompleto.value)
  console.log('   - ensayoActual:', ensayoActual.value)
  console.log('   - ensayoActual.codigoLabor:', ensayoActual.value?.codigoLabor)
  console.log('   - ensayoActual.protocolo:', ensayoActual.value?.protocolo)
  console.log('   - bloqueActual:', bloqueActual.value)
  console.log('   - bloqueActual.nombreBloque:', bloqueActual.value?.nombreBloque)
  console.log('   - tratamientos:', tratamientos.value?.length)

  // Si no hay ensayo completo, cargarlo primero
  if (!ensayoCompleto.value) {
    console.log('⏳ Cargando ensayo completo antes de abrir formulario...')
    await cargarEnsayoCompleto()
    console.log('✅ Ensayo cargado:', ensayoCompleto.value?.nombreEnsayo)
  }

  abrirFormParcela()
}

async function guardarParcela(datos: any) {
  try {
    console.log('💾 Guardando parcela con datos:', datos)
    console.log('  - editingParcela?.id:', editingParcela.value?.id)

    if (editingParcela.value?.id) {
      console.log('✏️ MODO EDICIÓN - Actualizando parcela ID:', editingParcela.value.id)
      console.log('  - Datos a actualizar:', datos)
      await actualizarParcela(editingParcela.value.id, datos)
      console.log('  ✅ Actualización enviada')
    } else {
      console.log('➕ MODO CREACIÓN - Creando nueva parcela')
      const datosConBloque = {
        ...datos,
        bloqueId: props.bloqueId,
      }
      console.log('  - Datos con bloqueId:', datosConBloque)
      await crearParcela(datosConBloque)
      console.log('  ✅ Creación enviada')
    }
    console.log('✅ Parcela guardada, recargando listado...')
    await Promise.all([
      cargarTodasLasParcelas(),
      cargarParcelas({ ensayoId: props.ensayoId, bloqueId: props.bloqueId, limit: 500 })
    ])
    console.log('✅ Listado recargado')
    cerrarFormParcela()
  } catch (err: any) {
    console.error('❌ Error al guardar parcela:', err)

    // Manejar error 409 (Conflict - duplicado)
    if (err.response?.status === 409 || err.status === 409) {
      const mensaje = err.response?.data?.message || err.message || 'Esta parcela ya existe en el bloque'
      showNotification(`Conflict al guardar: ${mensaje}. La posición (X, Y) ya está ocupada en este bloque.`, 'error')
      console.log('🚫 Error 409 Conflict - Duplicado de parcela')
      return
    }

    showNotification('Error al guardar: ' + (err instanceof Error ? err.message : 'Error desconocido'), 'error')
  }
}

// Confirmación de eliminación de parcela
const showDeleteConfirm = ref(false)
const deleteTargetId = ref<number | null>(null)
const deleteTargetNombre = ref('')

function confirmarEliminarParcela(id: number, nombre: string | null | undefined) {
  deleteTargetId.value = id
  deleteTargetNombre.value = `la parcela "${nombre || id}"`
  showDeleteConfirm.value = true
}

function cerrarDeleteConfirm() {
  showDeleteConfirm.value = false
  deleteTargetId.value = null
  deleteTargetNombre.value = ''
}

async function ejecutarEliminacion() {
  if (!deleteTargetId.value) return
  try {
    await parcelasStore.deleteParcela(deleteTargetId.value)
    await Promise.all([
      cargarTodasLasParcelas(),
      cargarParcelas({ ensayoId: props.ensayoId, bloqueId: props.bloqueId, limit: 500 })
    ])
  } catch (err) {
    console.error('Error al eliminar parcela:', err)
  } finally {
    cerrarDeleteConfirm()
  }
}
</script>
