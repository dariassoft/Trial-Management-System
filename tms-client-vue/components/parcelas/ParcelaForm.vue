<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ parcela?.id ? 'Editar' : 'Crear' }} Parcela
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="enviar" class="p-4 space-y-4">
        <!-- Tratamiento (filtrado por ensayo) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tratamiento *
          </label>
          <select
            v-model.number="form.tratamientoId"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar tratamiento...</option>
            <option v-for="t in tratamientosDelEnsayo" :key="t.id" :value="t.id">
              {{ t.descripcion || `Tratamiento ${t.id}` }}
            </option>
          </select>
          <p v-if="tratamientosDelEnsayo.length === 0" class="text-xs text-amber-500 mt-1">
            No hay tratamientos definidos para este ensayo
          </p>
        </div>

        <!-- Nombre/Código (autocompletado) -->
        <div>
          <div class="flex items-center gap-2 mb-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre/Código (autogenerado)
            </label>
            <button
              type="button"
              @click="mostrarInfoNombreCodigo"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              title="¿Cómo se forma el nombre/código?"
            >
              ℹ️
            </button>
          </div>
          <input
            v-model="form.nombreParcela"
            type="text"
            placeholder="Se autocompleta: codigoLabor-bloque-X.Y"
            maxlength="50"
            readonly
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span v-if="codigoLabor && nombreBloque">
              Ejemplo: {{ codigoLabor }}-{{ nombreBloque }}-{{ form.posXGrid || '?' }}.{{ form.posYGrid || '?' }}
            </span>
            <span v-else class="text-amber-600 dark:text-amber-400">
              ⏳ Se completará automáticamente cuando se carguen los datos del ensayo y bloque
            </span>
          </p>
        </div>

        <!-- Posiciones X/Y con información -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Posición en Grilla
            </h3>
            <button
              type="button"
              @click="mostrarInfoPosiciones"
              class="text-blue-600 hover:text-blue-700 text-lg"
              title="¿Qué son las posiciones X/Y?"
            >
              ℹ️
            </button>
          </div>

          <!-- Mostrar matriz visual si hay filas y columnas definidas -->
          <div v-if="filasEnsayo && columnasEnsayo" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <MatrizVisual
              :filas="filasEnsayo"
              :columnas="columnasEnsayo"
              :posXSeleccionada="form.posXGrid"
              :posYSeleccionada="form.posYGrid"
              :parcelasOcupadas="parcelasOcupadas"
              @select="seleccionarCeldaMatriz"
            />
          </div>

          <!-- Inputs para ingresar manualmente -->
          <div class="grid grid-cols-2 gap-2">
            <!-- Posición X -->
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Posición X (opcional)
              </label>
              <input
                v-model.number="form.posXGrid"
                type="number"
                min="1"
                :max="columnasEnsayo || undefined"
                placeholder="Columna"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="columnasEnsayo" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Max: {{ columnasEnsayo }}
              </p>
            </div>

            <!-- Posición Y -->
            <div>
              <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Posición Y (opcional)
              </label>
              <input
                v-model.number="form.posYGrid"
                type="number"
                min="1"
                :max="filasEnsayo || undefined"
                placeholder="Fila"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="filasEnsayo" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Max: {{ filasEnsayo }}
              </p>
            </div>
          </div>

          <!-- Mostrar errores de validación -->
          <div v-if="errorDuplicado" class="p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded text-sm text-red-600 dark:text-red-400">
            ⚠️ {{ errorDuplicado }}
          </div>
        </div>

        <!-- Botón QR -->
        <button
          type="button"
          @click="generarYMostrarQR"
          v-if="form.tratamientoId"
          class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
        >
          📱 Generar QR de Parcela
        </button>

        <!-- Botones de acción -->
        <div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!form.tratamientoId || (isBloqueCompleto && !parcela?.id)"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            {{ parcela?.id ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Modal: Información de Posiciones -->
    <Teleport to="body">
      <div
        v-if="mostrarInfoPos"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="mostrarInfoPos = false"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              Posiciones X y Y en la Grilla
            </h3>
            <button
              @click="mostrarInfoPos = false"
              class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>

          <div class="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">📊 ¿Qué es la Grilla?</h4>
              <p>
                Es una representación bidimensional del bloque o parcela, permitiendo ubicar cada sub-parcela en un plano cartesiano.
              </p>
            </div>

            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                ➡️ Posición X (Columna)
              </h4>
              <p>
                Representa la <strong>columna</strong> en la grilla. Aumenta de izquierda a derecha.
              </p>
              <p class="mt-1 text-xs bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                Ejemplo: X=1 (primera columna), X=2 (segunda columna), etc.
              </p>
            </div>

            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                ⬇️ Posición Y (Fila)
              </h4>
              <p>
                Representa la <strong>fila</strong> en la grilla. Aumenta de arriba hacia abajo.
              </p>
              <p class="mt-1 text-xs bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                Ejemplo: Y=1 (primera fila), Y=2 (segunda fila), etc.
              </p>
            </div>

            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                📍 Ejemplo Visual
              </h4>
              <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-xs">
                <div class="flex gap-1 mb-1">
                  <div class="w-8 h-8 border border-gray-400 flex items-center justify-center">(1,1)</div>
                  <div class="w-8 h-8 border border-gray-400 flex items-center justify-center">(2,1)</div>
                  <div class="w-8 h-8 border border-gray-400 flex items-center justify-center">(3,1)</div>
                </div>
                <div class="flex gap-1">
                  <div class="w-8 h-8 border border-gray-400 flex items-center justify-center">(1,2)</div>
                  <div class="w-8 h-8 border border-blue-600 bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold">
                    (2,2)
                  </div>
                  <div class="w-8 h-8 border border-gray-400 flex items-center justify-center">(3,2)</div>
                </div>
              </div>
              <p class="mt-2 text-xs">
                La celda azul resaltada es la posición X=2, Y=2
              </p>
            </div>

            <div class="bg-amber-50 dark:bg-amber-900/30 p-3 rounded">
              <p class="text-xs">
                <strong>💡 Tip:</strong> Estos campos son opcionales. Solo úsalos si necesitas rastrear la ubicación exacta dentro del bloque.
              </p>
            </div>
          </div>

          <button
            @click="mostrarInfoPos = false"
            class="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Información de Nombre/Código -->
    <Teleport to="body">
      <div
        v-if="mostrarInfoNombre"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="mostrarInfoNombre = false"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              Cómo se forma el Nombre/Código
            </h3>
            <button
              @click="mostrarInfoNombre = false"
              class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>

          <div class="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🏷️ Estructura del Código</h4>
              <p>
                El código se forma automáticamente combinando:
              </p>
              <div class="mt-2 bg-blue-50 dark:bg-blue-900/30 p-3 rounded font-mono text-xs space-y-1">
                <p><strong>Código Labor:</strong> {{ codigoLabor }}</p>
                <p><strong>Nombre Bloque:</strong> {{ nombreBloque }}</p>
                <p><strong>Posición X:</strong> {{ form.posXGrid || '(no definida)' }}</p>
                <p><strong>Posición Y:</strong> {{ form.posYGrid || '(no definida)' }}</p>
              </div>
            </div>

            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">📐 Fórmula</h4>
              <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-xs">
                {{ codigoLabor }}-{{ nombreBloque }}-X.Y
              </div>
            </div>

            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">📝 Ejemplo Completo</h4>
              <div class="bg-amber-50 dark:bg-amber-900/30 p-3 rounded">
                <p class="text-xs">
                  Si: Código Labor = "58-ENTD-43523"
                </p>
                <p class="text-xs">
                  Bloque = "A", Posición X = 2, Posición Y = 3
                </p>
                <p class="text-xs font-semibold mt-2">
                  Resultado: <strong>58-ENTD-43523-A-2.3</strong>
                </p>
              </div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/30 p-3 rounded">
              <p class="text-xs">
                <strong>ℹ️ Nota:</strong> El código se genera automáticamente. Las posiciones (X.Y) son opcionales y se incluyen solo si se definen.
              </p>
            </div>
          </div>

          <button
            @click="mostrarInfoNombre = false"
            class="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Modal: QR y Impresión -->
    <Teleport to="body">
      <div
        v-if="mostrarQRModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="mostrarQRModal = false"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              Código QR de Parcela
            </h3>
            <button
              @click="mostrarQRModal = false"
              class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>

          <!-- QR Code -->
          <div v-if="qrCodeData" class="flex flex-col items-center space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <div id="qrDisplayCanvas"></div>
            </div>

            <!-- Información de la Parcela -->
            <div class="w-full bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-sm space-y-1">
              <p><strong>Ensayo:</strong> {{ qrInfo.ensayoNombre }}</p>
              <p><strong>Laboratorio:</strong> {{ qrInfo.laboratorioNombre }}</p>
              <p><strong>Tipo Ensayo:</strong> {{ qrInfo.tipoEnsayoNombre }}</p>
              <p><strong>Bloque:</strong> {{ qrInfo.bloqueNombre }}</p>
              <p><strong>Parcela:</strong> {{ qrInfo.parcelaNombre }}</p>
              <p><strong>Tratamiento:</strong> {{ qrInfo.tratamientoNombre }}</p>
            </div>

            <!-- Botones de acción -->
            <div class="w-full flex gap-2">
              <button
                type="button"
                @click="imprimirQR"
                class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                🖨️ Imprimir
              </button>
              <button
                type="button"
                @click="descargarQR"
                class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                💾 Descargar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, computed } from 'vue'
import QRCode from 'qrcode'
import MatrizVisual from './MatrizVisual.vue'

interface QRInfo {
  ensayoNombre?: string
  laboratorioNombre?: string
  tipoEnsayoNombre?: string
  bloqueNombre?: string
  parcelaNombre?: string
  tratamientoNombre?: string
}

interface Props {
  parcela?: {
    id: number
    nombreParcela?: string
    posXGrid?: number | null
    posYGrid?: number | null
    tratamientoId?: number | null
    tratamiento?: { id: number; descripcion?: string } | null
  } | null
  tratamientos: Array<{ id: number; descripcion: string; protocolo?: { id: number; nombre: string } }>
  ensayo?: {
    id: number
    nombre?: string
    nombreEnsayo: string
    codigoLabor?: string
    filas?: number | null
    columnas?: number | null
    laboratorio?: { id?: number; nombre: string } | null
    tipoEnsayo?: { id?: number; nombre: string } | null
    protocolo?: { id: number; nombre: string } | null
    protocoloId?: number | null
    parcelas?: any[]
  } | null
  bloque?: { id: number; nombreBloque: string } | null
  parcelasExistentes?: Array<{
    id: number
    posXGrid?: number | null
    posYGrid?: number | null
    bloqueId?: number
    bloque?: { id: number; nombreBloque?: string } | null
  }> | null
  isBloqueCompleto?: boolean // New prop
}

interface Emits {
  (e: 'save', data: any): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  parcelasExistentes: () => [],
  isBloqueCompleto: false, // Default value for new prop
})
const emit = defineEmits<Emits>()

const form = reactive({
  tratamientoId: null as number | null,
  nombreParcela: '',
  posXGrid: null as number | null,
  posYGrid: null as number | null,
})

const mostrarInfoPos = ref(false)
const mostrarQRModal = ref(false)
const mostrarInfoNombre = ref(false)
const qrCanvas = ref<HTMLCanvasElement | null>(null)
const qrCodeData = ref('')
const qrInfo = reactive<QRInfo>({
  ensayoNombre: '',
  laboratorioNombre: '',
  tipoEnsayoNombre: '',
  bloqueNombre: '',
  parcelaNombre: '',
  tratamientoNombre: '',
})
const errorDuplicado = ref('')

// Propiedades calculadas
const codigoLabor = computed(() => {
  const codigo = props.ensayo?.codigoLabor || ''
  console.log('📌 codigoLabor computed:', codigo, 'ensayo:', props.ensayo)
  return codigo
})
const nombreBloque = computed(() => {
  const bloque = props.bloque?.nombreBloque || ''
  console.log('📌 nombreBloque computed:', bloque)
  return bloque
})

// Filas y columnas del ensayo
const filasEnsayo = computed(() => props.ensayo?.filas || null)
const columnasEnsayo = computed(() => props.ensayo?.columnas || null)

const tratamientosDelEnsayo = computed(() => {
  console.log('==== tratamientosDelEnsayo computed ====')
  console.log('📦 props.tratamientos disponibles:', props.tratamientos?.length || 0)
  console.log('📦 props.ensayo:', props.ensayo)
  console.log('📦 protocolo ID del ensayo:', props.ensayo?.protocolo?.id)

  // Si no hay tratamientos, devolver vacío
  if (!props.tratamientos || props.tratamientos.length === 0) {
    console.log('⚠️ No hay tratamientos disponibles')
    return []
  }

  // Los tratamientos ya vienen filtrados por protocoloId desde el backend
  // Si el ensayo tiene protocolo, retornar directamente los tratamientos
  if (props.ensayo?.protocolo?.id || props.ensayo?.protocoloId) {
    console.log('✅ Tratamientos ya filtrados por backend:', props.tratamientos.length)
    return props.tratamientos
  }

  // Si no hay protocolo en el ensayo, mostrar todos (fallback)
  console.log('⚠️ No hay protocolo en ensayo, retornando todos los tratamientos')
  return props.tratamientos
})

// Watch para ver cuando cambian los props
watch(
  () => props.parcela,
  (newVal) => {
    console.log('📝 ParcelaForm: parcela prop cambió:', newVal)
    if (newVal?.id) {
      // EDICIÓN: Cargar datos de parcela existente
      console.log('✏️ Modo EDICIÓN - Cargando datos de parcela existente')
      // El tratamientoId puede venir directamente o dentro del objeto tratamiento
      form.tratamientoId = newVal.tratamientoId || newVal.tratamiento?.id || null
      form.posXGrid = newVal.posXGrid || null
      form.posYGrid = newVal.posYGrid || null
      console.log('   - tratamientoId cargado:', form.tratamientoId)
      console.log('   - posXGrid cargado:', form.posXGrid)
      console.log('   - posYGrid cargado:', form.posYGrid)

      // Regenerar el nombre con los datos actuales del ensayo/bloque y las posiciones
      // Esto asegura que el nombre siempre tenga el formato correcto
      autocompletarNombre()
      console.log('   - nombreParcela regenerado:', form.nombreParcela)
    } else {
      // CREACIÓN: Limpiar form e intentar autocompletar
      console.log('➕ Modo CREACIÓN - Inicializando form vacío')
      form.tratamientoId = null
      form.nombreParcela = ''
      form.posXGrid = null
      form.posYGrid = null
      // Autocompletar nombre cuando sea nuevo
      autocompletarNombre()
    }
  },
  { immediate: true },
)

// Watch para ver cuando se cargan los props del ensayo y bloque
watch(
  () => [props.ensayo?.id, props.bloque?.id],
  ([ensayoId, bloqueId]) => {
    console.log('🔄 Props ensayo/bloque cargados:', { ensayoId, bloqueId })
    console.log('  - Verificando si es creación:', !props.parcela?.id)

    // Si es creación y los datos están listos, autocompletar
    if (!props.parcela?.id && ensayoId && bloqueId && !form.nombreParcela) {
      console.log('✅ Datos listos - Auto-completando nombre')
      autocompletarNombre()
    }
  }
)

// Watch para auto-completar cuando cambian los datos del ensayo/bloque o posiciones
watch(
  () => [codigoLabor.value, nombreBloque.value, form.posXGrid, form.posYGrid],
  ([codigo, bloque, posX, posY], oldValues) => {
    console.log('🔄 Auto-completar watch disparado')
    console.log('  - codigoLabor:', codigo)
    console.log('  - nombreBloque:', bloque)
    console.log('  - posX:', posX)
    console.log('  - posY:', posY)
    console.log('  - parcela id:', props.parcela?.id)
    console.log('  - nombreParcela actual:', form.nombreParcela)
    console.log('  - oldValues:', oldValues)

    // Siempre regenerar el nombre cuando cambien las posiciones o datos
    // Tanto en creación como en edición
    console.log('✅ Regenerando nombre de parcela')
    autocompletarNombre()
  },
  { immediate: true }  // Ejecutar inmediatamente al montar
)

// Watch para validar límites de filas y columnas
watch(
  () => [form.posXGrid, form.posYGrid, filasEnsayo.value, columnasEnsayo.value],
  ([posX, posY, filas, columnas]) => {
    console.log('🔍 Validando límites:', { posX, posY, filas, columnas })
    errorDuplicado.value = ''

    // Validar que X no exceda columnas
    if (columnas && posX && posX > columnas) {
      console.warn(`⚠️ Posición X (${posX}) excede columnas (${columnas})`)
      errorDuplicado.value = `Posición X no puede ser mayor a ${columnas}`
      form.posXGrid = columnas
      return
    }

    // Validar que Y no exceda filas
    if (filas && posY && posY > filas) {
      console.warn(`⚠️ Posición Y (${posY}) excede filas (${filas})`)
      errorDuplicado.value = `Posición Y no puede ser mayor a ${filas}`
      form.posYGrid = filas
      return
    }

    // Validar duplicados en el mismo bloque
    if (posX && posY && props.parcelasExistentes) {
      const duplicado = props.parcelasExistentes.some(
        p => {
          const bloqueId = p.bloque?.id || p.bloqueId  // Intenta ambas estructuras
          return Number(bloqueId) === Number(props.bloque?.id) &&
               p.posXGrid === posX &&
               p.posYGrid === posY &&
               p.id !== props.parcela?.id
        }
      )

      if (duplicado) {
        console.warn(`⚠️ Posición (${posX}, ${posY}) ya existe en este bloque`)
        errorDuplicado.value = `La posición (${posX}, ${posY}) ya está ocupada en este bloque`
      }
    }
  }
)

function autocompletarNombre() {
  const codigo = codigoLabor.value?.trim() || ''
  const bloque = nombreBloque.value?.trim() || ''

  let nombreGenerado = ''

  if (codigo) nombreGenerado = codigo
  if (bloque) nombreGenerado = nombreGenerado ? `${nombreGenerado}-${bloque}` : bloque

  if (form.posXGrid && form.posYGrid) {
    // Con posiciones: sufijo X.Y (garantiza unicidad dentro del bloque)
    nombreGenerado += `-${form.posXGrid}.${form.posYGrid}`
  } else if (form.tratamientoId) {
    // Sin posiciones: agregar tratamientoId para evitar duplicados con parcelas antiguas
    nombreGenerado += `-T${form.tratamientoId}`
  }

  form.nombreParcela = nombreGenerado || 'PARCELA'

  console.log('✏️ Nombre autogenerado:', form.nombreParcela)
}

function mostrarInfoPosiciones() {
  mostrarInfoPos.value = true
}

function mostrarInfoNombreCodigo() {
  mostrarInfoNombre.value = true
}

function seleccionarCeldaMatriz(x: number, y: number) {
  form.posXGrid = x
  form.posYGrid = y
  errorDuplicado.value = '' // Limpiar errores al seleccionar nueva celda
  console.log(`✓ Celda seleccionada: (${x}, ${y})`)
}

async function generarYMostrarQR() {
  try {
    console.log('📱 Iniciando generación de QR...')

    const tratamiento = props.tratamientos.find(t => t.id === form.tratamientoId)
    console.log('📋 Tratamiento encontrado:', tratamiento)

    // Datos QR: JSON string con parámetros de la parcela
    const qrDataStr = JSON.stringify({
      ensayoId: props.ensayo?.id,
      bloqueId: props.bloque?.id,
      tratamientoId: form.tratamientoId,
      nombreParcela: form.nombreParcela,
      posX: form.posXGrid,
      posY: form.posYGrid,
    })

    console.log('📝 QR Data:', qrDataStr)

    qrCodeData.value = qrDataStr
    Object.assign(qrInfo, {
      ensayoNombre: props.ensayo?.nombreEnsayo || props.ensayo?.nombre || 'Sin nombre',
      laboratorioNombre: props.ensayo?.laboratorio?.nombre || 'Sin laboratorio',
      tipoEnsayoNombre: props.ensayo?.tipoEnsayo?.nombre || 'Sin tipo',
      bloqueNombre: `Bloque ${nombreBloque.value || props.bloque?.nombreBloque || '?'}`,
      parcelaNombre: form.nombreParcela || `(${form.posXGrid || '?'}, ${form.posYGrid || '?'})`,
      tratamientoNombre: tratamiento?.descripcion || 'Sin tratamiento',
    })

    console.log('📦 QR Info:', qrInfo)
    mostrarQRModal.value = true

    // Esperar a que el DOM se actualice con el nuevo qrCodeData
    await new Promise(resolve => setTimeout(resolve, 100))

    // Buscar el div y generar el QR allí
    const displayDiv = document.getElementById('qrDisplayCanvas')
    if (!displayDiv) {
      console.error('❌ No se encontró div#qrDisplayCanvas')
      return
    }

    const canvas = document.createElement('canvas')
    console.log('🎨 Generando QR en canvas...')

    QRCode.toCanvas(
      canvas,
      qrDataStr,
      { width: 250, margin: 1, color: { dark: '#000000', light: '#FFFFFF' } },
      (err) => {
        if (err) {
          console.error('❌ Error en QRCode.toCanvas:', err)
          alert('Error al generar QR: ' + err.message)
        } else {
          console.log('✅ QR generado exitosamente')
          // Limpiar div anterior y agregar el nuevo canvas
          displayDiv.innerHTML = ''
          displayDiv.appendChild(canvas)
          // Guardar el canvas para impresión/descarga
          qrCanvas.value = canvas
        }
      }
    )
  } catch (err) {
    console.error('❌ Error al generar QR:', err)
    alert('Error: ' + (err instanceof Error ? err.message : 'Error desconocido'))
  }
}

function imprimirQR() {
  const canvas = qrCanvas.value as HTMLCanvasElement | null
  if (!canvas) return

  const printWindow = window.open('', '', 'height=800,width=600')
  if (!printWindow) return

  // Convertir canvas a imagen
  const qrImage = canvas.toDataURL('image/png')

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <title>Código QR - Parcela</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
          background: white;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 20px;
          border: 1px solid #ccc;
        }
        h2 {
          margin-top: 0;
          color: #333;
        }
        .qr-container {
          margin: 20px 0;
          text-align: center;
        }
        .qr-container img {
          max-width: 300px;
          border: 2px solid #333;
          padding: 10px;
        }
        .info {
          margin-top: 20px;
          text-align: left;
          border-top: 2px solid #333;
          padding-top: 15px;
        }
        .info p {
          margin: 8px 0;
          font-size: 12px;
        }
        .info-label {
          font-weight: bold;
          display: inline-block;
          min-width: 140px;
        }
        .footer {
          margin-top: 20px;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }
        @media print {
          body {
            margin: 0;
            padding: 10px;
          }
          .container {
            border: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>📱 Código QR - Parcela</h2>

        <div class="qr-container">
          <img src="${qrImage}" alt="Código QR" />
        </div>

        <div class="info">
          <p><span class="info-label">Ensayo:</span> ${qrInfo.ensayoNombre}</p>
          <p><span class="info-label">Laboratorio:</span> ${qrInfo.laboratorioNombre}</p>
          <p><span class="info-label">Tipo Ensayo:</span> ${qrInfo.tipoEnsayoNombre}</p>
          <p><span class="info-label">Bloque:</span> ${qrInfo.bloqueNombre}</p>
          <p><span class="info-label">Parcela:</span> ${qrInfo.parcelaNombre}</p>
          <p><span class="info-label">Tratamiento:</span> ${qrInfo.tratamientoNombre}</p>
        </div>

        <div class="footer">
          <p>Impreso el: ${new Date().toLocaleString('es-AR')}</p>
          <p>Sistema: Trial Management System (TMS)</p>
        </div>
      </div>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()

  setTimeout(() => {
    printWindow!.print()
    printWindow!.close()
  }, 250)
}

function descargarQR() {
  const srcCanvas = qrCanvas.value as HTMLCanvasElement | null
  if (!srcCanvas) return

  // Crear canvas con leyenda
  const downloadCanvas = document.createElement('canvas')
  const ctx = downloadCanvas.getContext('2d')
  if (!ctx) return

  const qrSize = 250
  const padding = 20
  const textHeight = 120
  const totalWidth = qrSize + 2 * padding
  const totalHeight = qrSize + textHeight + 3 * padding

  downloadCanvas.width = totalWidth
  downloadCanvas.height = totalHeight

  // Fondo blanco
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, totalWidth, totalHeight)

  // Dibujar QR en el centro
  ctx.drawImage(srcCanvas, padding, padding, qrSize, qrSize)

  // Texto
  ctx.fillStyle = 'black'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'left'

  const textX = padding
  const textY = qrSize + padding + 20
  const lineHeight = 15

  ctx.fillText(`Ensayo: ${qrInfo.ensayoNombre}`, textX, textY)
  ctx.fillText(`Laboratorio: ${qrInfo.laboratorioNombre}`, textX, textY + lineHeight)
  ctx.fillText(`Tipo Ensayo: ${qrInfo.tipoEnsayoNombre}`, textX, textY + lineHeight * 2)
  ctx.fillText(`Bloque: ${qrInfo.bloqueNombre}`, textX, textY + lineHeight * 3)
  ctx.fillText(`Parcela: ${qrInfo.parcelaNombre}`, textX, textY + lineHeight * 4)
  ctx.fillText(`Tratamiento: ${qrInfo.tratamientoNombre}`, textX, textY + lineHeight * 5)

  // Descargar
  const link = document.createElement('a')
  link.href = downloadCanvas.toDataURL('image/png')
  link.download = `parcela-qr-${qrInfo.parcelaNombre}-${new Date().getTime()}.png`
  link.click()
}

function enviar() {
  console.log('📨 Enviando parcela')
  console.log('  - form.tratamientoId:', form.tratamientoId)
  console.log('  - form.nombreParcela:', form.nombreParcela)
  console.log('  - form.posXGrid:', form.posXGrid)
  console.log('  - form.posYGrid:', form.posYGrid)

  // If creating a new parcel and the block is already complete, prevent submission
  if (props.isBloqueCompleto && !props.parcela?.id) {
    alert('Este bloque ya está completo. No se pueden crear más parcelas en él.')
    return
  }

  // Validar que tratamientoId esté definido
  if (form.tratamientoId === null || form.tratamientoId === undefined) {
    console.error('❌ Error: tratamientoId es requerido')
    alert('Por favor selecciona un tratamiento')
    return
  }

  // Validar que al menos haya posiciones o nombre
  if (!form.nombreParcela && (!form.posXGrid || !form.posYGrid)) {
    console.error('❌ Error: Se requiere nombre o posiciones')
    alert('Por favor ingresa un nombre o posiciones')
    return
  }

  // Validar límites de filas y columnas
  if (columnasEnsayo.value && form.posXGrid && form.posXGrid > columnasEnsayo.value) {
    alert(`Posición X no puede ser mayor a ${columnasEnsayo.value}`)
    return
  }

  if (filasEnsayo.value && form.posYGrid && form.posYGrid > filasEnsayo.value) {
    alert(`Posición Y no puede ser mayor a ${filasEnsayo.value}`)
    return
  }

  // Validar duplicados dentro del mismo bloque
  if (form.posXGrid && form.posYGrid && props.parcelasExistentes) {
    const duplicado = props.parcelasExistentes.some(
      p => {
        const bloqueId = p.bloque?.id || p.bloqueId  // Intenta ambas estructuras
        return Number(bloqueId) === Number(props.bloque?.id) &&
             p.posXGrid === form.posXGrid &&
             p.posYGrid === form.posYGrid &&
             p.id !== props.parcela?.id
      }
    )

    if (duplicado) {
      alert(`La posición (${form.posXGrid}, ${form.posYGrid}) ya está ocupada en este bloque`)
      return
    }
  }

  const datos = {
    tratamientoId: form.tratamientoId,
    nombreParcela: form.nombreParcela.trim() || null,
    posXGrid: form.posXGrid || null,
    posYGrid: form.posYGrid || null,
  }

  console.log('✅ Emitiendo save con datos válidos:', datos)
  emit('save', datos)
}
</script>
