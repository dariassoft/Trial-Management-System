<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <button
            @click="router.push('/mediciones')"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ← Volver
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ ensayo?.nombreEnsayo || 'Cargando...' }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ ensayo?.codigoLabor || '' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Contenido -->
    <div v-else class="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Info del ensayo -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📋 Información del Ensayo
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">Laboratorio:</span>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ ensayo?.laboratorio?.nombre || '-' }}
            </p>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Tipo:</span>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ ensayo?.tipoEnsayo?.nombre || '-' }}
            </p>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Fecha Siembra:</span>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ formatDate(ensayo?.fechaSiembra) }}
            </p>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Estado:</span>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ ensayo?.status?.nombre || '-' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tabs de Mediciones: Siembra, Momentos, Cosecha -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <div class="px-4 flex gap-2 overflow-x-auto">
            <button
              @click="tabActivo = 'siembra'"
              :class="[
                'px-4 py-3 font-medium border-b-2 transition whitespace-nowrap',
                tabActivo === 'siembra'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              ]"
            >
              🌱 Siembra
            </button>
            <button
              @click="tabActivo = 'momentos'"
              :class="[
                'px-4 py-3 font-medium border-b-2 transition whitespace-nowrap',
                tabActivo === 'momentos'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              ]"
            >
              📋 Momentos
            </button>
            <button
              @click="tabActivo = 'cosecha'"
              :class="[
                'px-4 py-3 font-medium border-b-2 transition whitespace-nowrap',
                tabActivo === 'cosecha'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              ]"
            >
              🌾 Cosecha
            </button>
          </div>
        </div>

        <!-- Contenido de tabs -->
        <div class="p-4">
          <!-- TAB: SIEMBRA -->
          <div v-if="tabActivo === 'siembra'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">🌱 Datos de Siembra</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Registra los datos de siembra para el ensayo completo (aplica a todas las parcelas)
            </p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de Siembra
                </label>
                <input
                  v-model="formSiembra.fechaSiembra"
                  type="date"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Semillas/m²
                </label>
                <input
                  v-model.number="formSiembra.semillasPorMetro"
                  type="number"
                  step="0.01"
                  placeholder="150"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Densidad (plantas/ha)
                </label>
                <input
                  v-model.number="formSiembra.densidadSiembra"
                  type="number"
                  step="1"
                  placeholder="300000"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Germinación (%)
                </label>
                <input
                  v-model.number="formSiembra.germinacionPct"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="85.5"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vigor Plantas (1-10)
                </label>
                <input
                  v-model.number="formSiembra.vigorPlantasEscala"
                  type="number"
                  step="1"
                  min="1"
                  max="10"
                  placeholder="8"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observaciones
              </label>
              <textarea
                v-model="formSiembra.observaciones"
                rows="3"
                placeholder="Observaciones sobre la siembra..."
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>
            <button
              @click="guardarSiembra"
              :disabled="guardandoSiembra"
              class="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg
                     font-medium transition disabled:opacity-50"
            >
              {{ guardandoSiembra ? 'Guardando...' : '✓ Guardar Siembra' }}
            </button>
          </div>

          <!-- TAB: MOMENTOS -->
          <div v-else-if="tabActivo === 'momentos'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">📋 Momentos de Evaluación</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Los momentos se crean automáticamente desde las aplicaciones. Haz clic en uno para registrar mediciones por parcela.
            </p>
            <div v-if="aplicaciones.length === 0" class="text-center py-8 text-gray-500">
              <p>No hay aplicaciones aún. Crea una aplicación para poder registrar momentos de evaluación.</p>
            </div>
          </div>

          <!-- TAB: COSECHA -->
          <div v-else-if="tabActivo === 'cosecha'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">🌾 Datos de Cosecha</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Registra los datos de cosecha (se capturan por parcela). Variables como gramaje, humedad, calidad de grano, etc.
            </p>
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
              💡 Los datos de cosecha se registran desde la página de <strong>Cosecha</strong> o desde aquí editando cada parcela.
            </div>
            <div class="space-y-4">
              <p class="text-gray-600 dark:text-gray-400">
                Para registrar cosecha por parcela, navega a la sección de parcelas y haz clic en "Editar Cosecha".
              </p>
              <button
                @click="router.push(`/cosecha?ensayoId=${ensayoId}`)"
                class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
              >
                → Ir a Cosecha
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Aplicaciones -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            💉 Aplicaciones
          </h2>
          <button
            @click="abrirNuevaAplicacion"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg
                   font-medium transition flex items-center gap-2"
          >
            <span>+</span> Nueva Aplicación
          </button>
        </div>

        <!-- Lista de aplicaciones -->
        <div v-if="aplicaciones.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          <p>No hay aplicaciones registradas</p>
          <p class="text-sm mt-2">Crea una aplicación para empezar a registrar mediciones</p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="aplicacion in aplicaciones"
            :key="aplicacion.id"
            class="p-4"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ aplicacion.nombreAplicacion }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  📅 {{ formatDateTime(aplicacion.fechaHora) }}
                  <span v-if="aplicacion.estadioCultivo">
                    | 🌿 Estadio: {{ aplicacion.estadioCultivo }}
                  </span>
                </p>
              </div>
              <button
                @click="editarAplicacion(aplicacion)"
                class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                title="Editar aplicación"
              >
                ✏️
              </button>
            </div>

            <!-- Momentos de esta aplicación -->
            <div class="mt-4 space-y-2">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Momentos de evaluación:
              </p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div
                  v-for="momento in aplicacion.momentos"
                  :key="momento.id"
                  @click="irAMedirMomento(momento.id)"
                  class="p-3 rounded-lg border cursor-pointer transition hover:shadow-md"
                  :class="getMomentoClass(momentoProgreso[momento.id])"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ momento.nombreMomento }}
                    </span>
                    <span :class="getMomentoIconClass(momentoProgreso[momento.id])">
                      {{ getMomentoIcon(momentoProgreso[momento.id]) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ formatDate(momento.fechaEvaluacion) }}
                  </p>


                  <!-- Barra de progreso -->
                  <div v-if="momentoProgreso[momento.id]" class="mt-2">
                    <div class="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        class="h-full transition-all duration-300"
                        :class="momentoProgreso[momento.id]?.porcentaje >= 100 ? 'bg-green-500' : 'bg-blue-500'"
                        :style="{ width: `${momentoProgreso[momento.id]?.porcentaje || 0}%` }"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ momentoProgreso[momento.id]?.parcelasMedidas || 0 }}/{{ momentoProgreso[momento.id]?.totalParcelas || 0 }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nueva/Editar Aplicación -->
    <Teleport to="body">
      <div
        v-if="showNuevaAplicacion"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="showNuevaAplicacion = false"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingAplicacionId ? 'Editar Aplicación' : 'Nueva Aplicación' }}
            </h3>
          </div>

          <form @submit.prevent="guardarAplicacion" class="p-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre de la aplicación
              </label>
              <input
                v-model="formAplicacion.nombreAplicacion"
                type="text"
                placeholder="Primera aplicación"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha y hora
              </label>
              <input
                v-model="formAplicacion.fechaHora"
                type="datetime-local"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estadio del cultivo
              </label>
              <input
                v-model="formAplicacion.estadioCultivo"
                type="text"
                placeholder="V2, V4, R1..."
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Temp (°C)
                </label>
                <input
                  v-model.number="formAplicacion.tempC"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Humedad (%)
                </label>
                <input
                  v-model.number="formAplicacion.humedadPct"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Viento (km/h)
                </label>
                <input
                  v-model.number="formAplicacion.vientoKmh"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="showNuevaAplicacion = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100
                       dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="guardando"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                       font-medium transition disabled:opacity-50"
              >
                {{ guardando ? 'Guardando...' : (editingAplicacionId ? 'Guardar Cambios' : 'Crear Aplicación') }}
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
import { useRoute, useRouter } from 'vue-router'
import { useEnsayosStore } from '~/stores/ensayos'
import { useAplicacionesStore } from '~/stores/aplicaciones'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const ensayosStore = useEnsayosStore()
const aplicacionesStore = useAplicacionesStore()
const api = useApi()

const ensayoId = computed(() => Number(route.params.id))
const loading = ref(false)
const guardando = ref(false)
const guardandoSiembra = ref(false)
const guardandoCosecha = ref(false)
const showNuevaAplicacion = ref(false)
const editingAplicacionId = ref<number | null>(null)
const tabActivo = ref<'siembra' | 'momentos' | 'cosecha'>('siembra')

const ensayo = ref<any>(null)
const aplicaciones = computed(() => aplicacionesStore.items || [])
const momentoProgreso = ref<Record<number, any>>({})

const formAplicacion = ref({
  nombreAplicacion: 'Primera aplicación',
  fechaHora: '',
  estadioCultivo: '',
  tempC: null as number | null,
  humedadPct: null as number | null,
  vientoKmh: null as number | null,
})

const formSiembra = ref({
  fechaSiembra: '',
  semillasPorMetro: null as number | null,
  densidadSiembra: null as number | null,
  germinacionPct: null as number | null,
  vigorPlantasEscala: null as number | null,
  observaciones: '',
})

const formCosecha = ref({
  fechaCosecha: '',
  humedadPct: null as number | null,
  kgHaCorregido: null as number | null,
  gie: null as number | null,
  observaciones: '',
})

function editarAplicacion(aplicacion: any) {
  editingAplicacionId.value = aplicacion.id
  formAplicacion.value = {
    nombreAplicacion: aplicacion.nombreAplicacion || '',
    fechaHora: aplicacion.fechaHora ? new Date(aplicacion.fechaHora).toISOString().slice(0, 16) : '',
    estadioCultivo: aplicacion.estadioCultivo || '',
    tempC: aplicacion.tempC || null,
    humedadPct: aplicacion.humedadPct || null,
    vientoKmh: aplicacion.vientoKmh || null,
  }
  showNuevaAplicacion.value = true
}

function abrirNuevaAplicacion() {
  editingAplicacionId.value = null
  formAplicacion.value = {
    nombreAplicacion: 'Primera aplicación',
    fechaHora: '',
    estadioCultivo: '',
    tempC: null,
    humedadPct: null,
    vientoKmh: null,
  }
  showNuevaAplicacion.value = true
}

function formatDate(date?: string | null) {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleDateString('es-AR')
  } catch {
    return date
  }
}

function formatDateTime(date?: string | null) {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleString('es-AR')
  } catch {
    return date
  }
}

function getMomentoClass(progreso: any) {
  if (!progreso) return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'

  if (progreso.estado === 'completado') {
    return 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/30'
  }
  if (progreso.estado === 'en_progreso') {
    return 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30'
  }
  return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
}

function getMomentoIcon(progreso: any) {
  if (!progreso) return '📋'
  if (progreso.estado === 'completado') return '✅'
  if (progreso.estado === 'en_progreso') return '🔵'
  return '⏳'
}

function getMomentoIconClass(progreso: any) {
  return 'text-lg'
}

async function cargarProgresoMomentos() {
  for (const aplicacion of aplicaciones.value) {
    if (aplicacion.momentos) {
      for (const momento of aplicacion.momentos) {
        try {
          const res = await api.get(`/momentos/${momento.id}/progreso`)
          const progreso = res?.data ?? res
          momentoProgreso.value[momento.id] = progreso
        } catch (err) {
          console.error(`Error cargando progreso del momento ${momento.id}:`, err)
        }
      }
    }
  }
}

function irAMedirMomento(momentoId: number) {
  console.log('🎯 Navegando a momento:', momentoId)
  console.log('🎯 URL:', `/mediciones/${ensayoId.value}/momento/${momentoId}`)
  router.push(`/mediciones/${ensayoId.value}/momento/${momentoId}`)
}

async function guardarAplicacion() {
  guardando.value = true
  try {
    // Construir objeto solo con campos que tienen valor
    const datos: Record<string, any> = {}

    if (formAplicacion.value.nombreAplicacion) {
      datos.nombreAplicacion = formAplicacion.value.nombreAplicacion
    }
    if (formAplicacion.value.fechaHora) {
      datos.fechaHora = formAplicacion.value.fechaHora
    }
    if (formAplicacion.value.estadioCultivo) {
      datos.estadioCultivo = formAplicacion.value.estadioCultivo
    }
    // Convertir a números - los inputs HTML devuelven strings
    if (formAplicacion.value.tempC !== null && formAplicacion.value.tempC !== undefined && formAplicacion.value.tempC !== '') {
      datos.tempC = parseFloat(String(formAplicacion.value.tempC))
    }
    if (formAplicacion.value.humedadPct !== null && formAplicacion.value.humedadPct !== undefined && formAplicacion.value.humedadPct !== '') {
      datos.humedadPct = parseFloat(String(formAplicacion.value.humedadPct))
    }
    if (formAplicacion.value.vientoKmh !== null && formAplicacion.value.vientoKmh !== undefined && formAplicacion.value.vientoKmh !== '') {
      datos.vientoKmh = parseFloat(String(formAplicacion.value.vientoKmh))
    }

    if (editingAplicacionId.value) {
      // Modo edición - NO enviar ensayoId
      console.log('📝 Actualizando aplicación:', editingAplicacionId.value, datos)
      await aplicacionesStore.update(editingAplicacionId.value, datos)
    } else {
      // Modo creación - incluir ensayoId
      datos.ensayoId = ensayoId.value
      console.log('➕ Creando aplicación:', datos)
      await aplicacionesStore.create(datos)
    }

    showNuevaAplicacion.value = false
    editingAplicacionId.value = null

    // Recargar aplicaciones
    await aplicacionesStore.fetchByEnsayo(ensayoId.value)

    // Recargar progreso
    await cargarProgresoMomentos()

    // Reset form
    formAplicacion.value = {
      nombreAplicacion: 'Primera aplicación',
      fechaHora: '',
      estadioCultivo: '',
      tempC: null,
      humedadPct: null,
      vientoKmh: null,
    }
  } catch (err) {
    console.error('Error guardando aplicación:', err)
    alert('Error al guardar la aplicación')
  } finally {
    guardando.value = false
  }
}

async function guardarSiembra() {
  try {
    guardandoSiembra.value = true
    const dto = {
      ensayoId: ensayoId.value,
      fechaSiembra: formSiembra.value.fechaSiembra || null,
      semillasPorMetro: formSiembra.value.semillasPorMetro,
      densidadSiembra: formSiembra.value.densidadSiembra,
      germinacionPct: formSiembra.value.germinacionPct,
      vigorPlantasEscala: formSiembra.value.vigorPlantasEscala,
      observaciones: formSiembra.value.observaciones || null,
    }

    // Guardar para cada parcela del ensayo
    const parcelasRes = await api.get('/parcelas', {
      params: { ensayoId: ensayoId.value, limit: 500 }
    })
    const parcelas = Array.isArray(parcelasRes) ? parcelasRes : (parcelasRes?.data || [])

    for (const parcela of parcelas) {
      const siembraDto = {
        parcelaId: parcela.id,
        ...dto
      }
      delete (siembraDto as any).ensayoId

      // Buscar si ya existe siembra para esta parcela
      const existentes = await api.get('/datos-siembra?parcelaId=' + parcela.id)
      const siembras = Array.isArray(existentes) ? existentes : (existentes?.data || [])

      if (siembras.length > 0) {
        // Actualizar
        await api.patch(`/datos-siembra/${siembras[0].id}`, siembraDto)
      } else {
        // Crear
        await api.post('/datos-siembra', siembraDto)
      }
    }

    alert('✅ Siembra guardada correctamente para todas las parcelas')
  } catch (err: any) {
    console.error('Error guardando siembra:', err)
    alert('Error al guardar: ' + (err.message || 'Error desconocido'))
  } finally {
    guardandoSiembra.value = false
  }
}

async function guardarCosecha() {
  try {
    guardandoCosecha.value = true
    const dto = {
      ensayoId: ensayoId.value,
      fechaCosecha: formCosecha.value.fechaCosecha || null,
      humedadPct: formCosecha.value.humedadPct,
      kgHaCorregido: formCosecha.value.kgHaCorregido,
      gie: formCosecha.value.gie,
      observaciones: formCosecha.value.observaciones || null,
    }

    // Guardar para cada parcela del ensayo
    const parcelasRes = await api.get('/parcelas', {
      params: { ensayoId: ensayoId.value, limit: 500 }
    })
    const parcelas = Array.isArray(parcelasRes) ? parcelasRes : (parcelasRes?.data || [])

    for (const parcela of parcelas) {
      const cosechaDto = {
        parcelaId: parcela.id,
        ...dto
      }
      delete (cosechaDto as any).ensayoId

      if (parcela.cosecha?.id) {
        // Actualizar
        await api.patch(`/datos-cosecha/${parcela.cosecha.id}`, cosechaDto)
      } else {
        // Crear
        await api.post('/datos-cosecha', cosechaDto)
      }
    }

    alert('✅ Cosecha guardada correctamente para todas las parcelas')
  } catch (err: any) {
    console.error('Error guardando cosecha:', err)
    alert('Error al guardar: ' + (err.message || 'Error desconocido'))
  } finally {
    guardandoCosecha.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    // Cargar ensayo
    const res = await api.get(`/ensayos/${ensayoId.value}`)
    ensayo.value = res?.data ?? res

    // Cargar aplicaciones
    await aplicacionesStore.fetchByEnsayo(ensayoId.value)

    // Cargar progreso de cada momento
    await cargarProgresoMomentos()
  } catch (err) {
    console.error('Error cargando datos:', err)
  } finally {
    loading.value = false
  }
})

useHead({
  title: computed(() => `Mediciones - ${ensayo.value?.nombreEnsayo || 'Ensayo'}`),
})
</script>
