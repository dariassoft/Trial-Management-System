<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Header fijo -->
    <div class="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between">
          <button
            @click="router.back()"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ← Volver
          </button>
          <div class="text-center">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ momento?.nombreMomento || 'Cargando...' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Parcela {{ parcelaActualIndex + 1 }}/{{ parcelas.length }}
            </p>
          </div>
          <div class="w-10"></div>
        </div>

        <!-- Barra de progreso -->
        <div class="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 transition-all duration-300"
            :style="{ width: `${progresoPorcentaje}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Contenido principal -->
    <div v-else-if="parcelaActual" class="pb-24">
      <!-- Info de la parcela -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              📍 {{ parcelaActual.nombreParcela }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Bloque {{ parcelaActual.bloque?.nombreBloque }} |
              Pos: ({{ parcelaActual.posXGrid }}, {{ parcelaActual.posYGrid }})
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              🧪 Tratamiento
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ parcelaActual.tratamiento?.descripcion || 'Sin tratamiento' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Formulario de mediciones -->
      <div class="p-4 space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          📏 Mediciones
        </h3>

        <!-- Variables a medir -->
        <div
          v-for="(variable, idx) in variables"
          :key="variable.id"
          class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
        >
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ variable.nombre_variable }}
            <span v-if="variable.unidad_medida" class="text-gray-500">
              ({{ variable.unidad_medida }})
            </span>
          </label>

          <!-- Input de texto si la unidad es TEXTO -->
          <textarea
            v-if="isTextVariable(variable)"
            v-model="formMediciones[variable.id]"
            rows="2"
            :placeholder="'Ingrese observación...'"
            class="w-full px-4 py-3 text-base rounded-lg border-2
                   border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>

          <!-- Input numérico para valores numéricos -->
          <input
            v-else
            v-model="formMediciones[variable.id]"
            type="number"
            inputmode="decimal"
            :placeholder="getPlaceholder(variable)"
            class="w-full px-4 py-4 text-2xl text-center rounded-lg border-2
                   border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <!-- Escala visual si aplica -->
          <div
            v-if="hasScale(variable)"
            class="mt-2 flex justify-between"
          >
            <button
              v-for="n in getScaleRange(variable)"
              :key="n"
              @click="formMediciones[variable.id] = String(n)"
              :class="[
                'flex-1 py-2 mx-0.5 rounded text-sm font-medium transition',
                formMediciones[variable.id] === String(n)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              ]"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <!-- Observaciones -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📝 Observaciones
          </label>
          <textarea
            v-model="formObservaciones"
            rows="3"
            placeholder="Notas adicionales..."
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          ></textarea>
        </div>

        <!-- Sección de fotos -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              📸 Fotos
            </h4>
            <button
              @click="tomarFoto"
              class="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm"
            >
              + Agregar
            </button>
          </div>

          <!-- Preview de fotos -->
          <div v-if="fotos.length > 0" class="flex gap-2 overflow-x-auto">
            <div
              v-for="(foto, idx) in fotos"
              :key="idx"
              class="relative w-20 h-20 flex-shrink-0"
            >
              <img
                :src="foto.preview"
                class="w-full h-full object-cover rounded-lg"
              />
              <button
                @click="eliminarFoto(idx)"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
              >
                ×
              </button>
            </div>
          </div>

          <p v-else class="text-sm text-gray-500 dark:text-gray-400">
            Sin fotos adjuntas
          </p>

          <!-- Input file oculto -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            capture="environment"
            @change="handleFileSelect"
            class="hidden"
          />
        </div>
      </div>
    </div>

    <!-- Sin parcelas -->
    <div v-else-if="!loading && parcelas.length === 0" class="p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">
        No hay parcelas para medir
      </p>
    </div>

    <!-- Navegación fija abajo -->
    <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div class="flex gap-2">
        <button
          @click="parcelaAnterior"
          :disabled="parcelaActualIndex === 0"
          class="py-3 px-4 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium
                 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
        >
          ◀
        </button>
        <button
          @click="saltarSiguiente"
          :disabled="esUltimaParcela"
          class="py-3 px-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium
                 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-600 dark:text-gray-400"
        >
          Saltar ▶
        </button>
        <button
          @click="guardarYSiguiente"
          :disabled="guardando"
          class="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg
                 font-medium transition disabled:opacity-50"
        >
          {{ guardando ? 'Guardando...' : (esUltimaParcela ? '✓ Finalizar' : '✓ Guardar →') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useMomentosStore } from '~/stores/momentos'
import { useDatosCampoStore } from '~/stores/datos-campo'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const api = useApi()
const momentosStore = useMomentosStore()
const datosCampoStore = useDatosCampoStore()

const ensayoId = computed(() => Number(route.params.id))
const momentoId = computed(() => Number(route.params.momentoId))

const loading = ref(false)
const guardando = ref(false)
const momento = ref<any>(null)
const parcelas = ref<any[]>([])
const variables = ref<any[]>([])
const parcelaActualIndex = ref(0)
const formMediciones = reactive<Record<number, string>>({})
const formObservaciones = ref('')
const fotos = ref<{ file: File; preview: string }[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

const parcelaActual = computed(() => parcelas.value[parcelaActualIndex.value])
const esUltimaParcela = computed(() => parcelaActualIndex.value >= parcelas.value.length - 1)
const progresoPorcentaje = computed(() => {
  if (parcelas.value.length === 0) return 0
  return Math.round(((parcelaActualIndex.value + 1) / parcelas.value.length) * 100)
})

function getPlaceholder(variable: any) {
  if (variable.unidad_medida === '%') return '0-100'
  return 'Valor'
}

function isTextVariable(variable: any) {
  // Detectar si la variable es de tipo texto (observaciones, notas, etc.)
  const unit = (variable.unidad_medida || '').toLowerCase()
  const name = (variable.nombre_variable || '').toLowerCase()
  return unit.includes('texto') ||
         unit.includes('text') ||
         name.includes('observ') ||
         name.includes('nota') ||
         name.includes('comentario')
}

function hasScale(variable: any) {
  // Detectar si es una escala (ej: 0-5, 1-9)
  const unit = variable.unidad_medida?.toLowerCase() || ''
  return unit.includes('escala') || unit.includes('1-') || unit.includes('0-')
}

function getScaleRange(variable: any): number[] {
  // Extraer el rango de la unidad
  const unit = variable.unidad_medida || ''
  const match = unit.match(/(\d+)-(\d+)/)
  if (match) {
    const min = parseInt(match[1])
    const max = parseInt(match[2])
    const range: number[] = []
    for (let i = min; i <= max; i++) range.push(i)
    return range
  }
  return [0, 1, 2, 3, 4, 5]
}

function parcelaAnterior() {
  if (parcelaActualIndex.value > 0) {
    parcelaActualIndex.value--
    cargarDatosParcela()
  }
}

function saltarSiguiente() {
  if (!esUltimaParcela.value) {
    parcelaActualIndex.value++
    cargarDatosParcela()
  }
}

async function guardarYSiguiente() {
  guardando.value = true
  try {
    // Preparar mediciones
    const mediciones = Object.entries(formMediciones)
      .filter(([_, valor]) => valor !== '' && valor !== undefined)
      .map(([variableId, valor]) => ({
        variable_id: Number(variableId),
        valor: String(valor),
      }))

    // Guardar datos de campo
    await datosCampoStore.guardarMedicion({
      parcela_id_fk: parcelaActual.value.id,
      momento_id_fk: momentoId.value,
      observaciones: formObservaciones.value || undefined,
      mediciones,
    })

    // TODO: Subir fotos si hay

    if (esUltimaParcela.value) {
      alert('✅ Todas las parcelas han sido medidas')
      router.back()
    } else {
      parcelaActualIndex.value++
      cargarDatosParcela()
    }
  } catch (err: any) {
    console.error('Error guardando:', err)
    alert('Error al guardar: ' + (err.message || 'Error desconocido'))
  } finally {
    guardando.value = false
  }
}

function guardarFormActual() {
  // Guardar estado actual del form en memoria (opcional para navegación)
}

function cargarDatosParcela() {
  // Limpiar form
  Object.keys(formMediciones).forEach(key => {
    formMediciones[Number(key)] = ''
  })
  formObservaciones.value = ''
  fotos.value = []

  // Buscar si ya hay medición existente
  const existente = datosCampoStore.findByParcelaMomento(
    parcelaActual.value?.id,
    momentoId.value
  )

  if (existente) {
    formObservaciones.value = existente.observaciones || ''
    existente.mediciones?.forEach((m: any) => {
      if (m.variable?.id) {
        formMediciones[m.variable.id] = m.valor
      }
    })
  }
}

function tomarFoto() {
  fileInput.value?.click()
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    const preview = URL.createObjectURL(file)
    fotos.value.push({ file, preview })
    input.value = ''
  }
}

function eliminarFoto(idx: number) {
  URL.revokeObjectURL(fotos.value[idx].preview)
  fotos.value.splice(idx, 1)
}

onMounted(async () => {
  loading.value = true
  try {
    // Cargar momento con aplicación y ensayo
    const momentoRes = await api.get(`/momentos/${momentoId.value}`)
    momento.value = momentoRes?.data ?? momentoRes
    console.log('📋 Momento cargado:', momento.value)

    // Cargar ensayo para obtener el tipoEnsayoId
    const ensayoRes = await api.get(`/ensayos/${ensayoId.value}`)
    const ensayo = ensayoRes?.data ?? ensayoRes
    console.log('📋 Ensayo cargado:', ensayo)
    const tipoEnsayoId = ensayo?.tipoEnsayo?.id || ensayo?.tipoEnsayoId
    console.log('📋 TipoEnsayo ID:', tipoEnsayoId)

    // Cargar variables del tipo de ensayo
    if (tipoEnsayoId) {
      const variablesRes = await api.get('/protocolo-variables', {
        params: { tipoEnsayoId }
      })
      const variablesData = variablesRes?.data ?? variablesRes
      variables.value = Array.isArray(variablesData) ? variablesData : []
      console.log('📋 Variables cargadas:', variables.value.length)
    } else {
      // Variables por defecto si no hay tipo de ensayo
      console.log('⚠️ No hay tipoEnsayoId, usando variables por defecto')
      variables.value = [
        { id: 1, nombre_variable: '% Control General', unidad_medida: '%' },
        { id: 2, nombre_variable: 'Fitotoxicidad', unidad_medida: 'ESCALA 1-9' },
      ]
    }

    // Cargar parcelas del ensayo
    const parcelasRes = await api.get('/parcelas', {
      params: { ensayoId: ensayoId.value, limit: 200 }
    })
    const parcelasData = parcelasRes?.data ?? parcelasRes
    parcelas.value = Array.isArray(parcelasData)
      ? parcelasData
      : (parcelasData?.data || [])
    console.log('📋 Parcelas cargadas:', parcelas.value.length)

    // Ordenar parcelas por bloque y posición
    parcelas.value.sort((a: any, b: any) => {
      const bloqueA = a.bloque?.nombreBloque || ''
      const bloqueB = b.bloque?.nombreBloque || ''
      if (bloqueA !== bloqueB) return bloqueA.localeCompare(bloqueB)
      if (a.posXGrid !== b.posXGrid) return (a.posXGrid || 0) - (b.posXGrid || 0)
      return (a.posYGrid || 0) - (b.posYGrid || 0)
    })

    // Cargar mediciones existentes
    await datosCampoStore.fetchByMomento(momentoId.value)

    // Cargar datos de la primera parcela
    cargarDatosParcela()
  } catch (err) {
    console.error('❌ Error cargando datos:', err)
  } finally {
    loading.value = false
  }
})

useHead({
  title: computed(() => `Medición - ${momento.value?.nombreMomento || ''}`),
})
</script>
