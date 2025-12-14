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
              {{ t.nombreTratamiento }}
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
                placeholder="Columna"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                placeholder="Fila"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
            :disabled="!form.tratamientoId"
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
              <canvas ref="qrCanvas" />
            </div>

            <!-- Información de la Parcela -->
            <div class="w-full bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-sm space-y-1">
              <p><strong>Ensayo:</strong> {{ qrInfo.ensayoNombre }}</p>
              <p><strong>Laboratorio:</strong> {{ qrInfo.laboratorioNombre }}</p>
              <p><strong>Tipo Ensayo:</strong> {{ qrInfo.tipoEnsayoNombre }}</p>
              <p><strong>Bloque:</strong> {{ qrInfo.bloqueNombre }}</p>
              <p><strong>Parcela:</strong> {{ qrInfo.parcelaNombre }}</p>
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

interface Props {
  parcela?: { id: number; nombreParcela?: string; posXGrid?: number; posYGrid?: number; tratamientoId: number } | null
  tratamientos: Array<{ id: number; nombreTratamiento: string }>
  ensayo?: { id: number; nombreEnsayo: string; codigoLabor?: string; laboratorio?: { nombre: string }; tipoEnsayo?: { nombre: string } }
  bloque?: { id: number; nombreBloque: string }
}

interface Emits {
  (e: 'save', data: any): void
  (e: 'close'): void
}

const props = defineProps<Props>()
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
const qrInfo = ref<any>({})

// Propiedades calculadas
const codigoLabor = computed(() => {
  const valor = props.ensayo?.codigoLabor
  console.log('📌 codigoLabor prop:', valor)
  return valor ?? ''
})
const nombreBloque = computed(() => {
  const valor = props.bloque?.nombreBloque
  console.log('📌 nombreBloque prop:', valor)
  return valor ?? ''
})

const tratamientosDelEnsayo = computed(() => {
  console.log('📌 tratamientosDelEnsayo:', props.tratamientos)
  return props.tratamientos ?? []
})

// Watch para ver cuando cambian los props
watch(
  () => [props.ensayo?.codigoLabor, props.bloque?.nombreBloque],
  ([newCodigo, newBloque]) => {
    console.log('👀 Props cambiaron - Código:', newCodigo, 'Bloque:', newBloque)
    // Auto-completar si hay datos válidos
    if (newCodigo && newBloque && !form.nombreParcela) {
      console.log('🔄 Auto-completando nombre/código (desde props watch)...')
      autocompletarNombre()
    }
  }
)

// Auto-completar nombre cuando cambian posiciones
watch(
  () => [form.posXGrid, form.posYGrid],
  () => {
    // Solo auto-completar si hay valores válidos
    if (
      form.posXGrid &&
      form.posYGrid &&
      codigoLabor.value &&
      nombreBloque.value &&
      !form.nombreParcela // Solo si está vacío
    ) {
      console.log('🔄 Auto-completando nombre/código (desde posiciones)...')
      autocompletarNombre()
    }
  }
)

watch(
  () => props.parcela,
  (newVal) => {
    if (newVal) {
      form.tratamientoId = newVal.tratamientoId
      form.nombreParcela = newVal.nombreParcela || ''
      form.posXGrid = newVal.posXGrid || null
      form.posYGrid = newVal.posYGrid || null
    } else {
      form.tratamientoId = null
      form.nombreParcela = ''
      form.posXGrid = null
      form.posYGrid = null
    }
  },
  { immediate: true },
)

function autocompletarNombre() {
  const numero = form.posXGrid && form.posYGrid ? `-${form.posXGrid}.${form.posYGrid}` : ''
  form.nombreParcela = `${codigoLabor.value}-${nombreBloque.value}${numero}`
}

function mostrarInfoPosiciones() {
  mostrarInfoPos.value = true
}

function mostrarInfoNombreCodigo() {
  mostrarInfoNombre.value = true
}

async function generarYMostrarQR() {
  try {
    console.log('📱 Iniciando generación de QR...')

    if (!qrCanvas.value) {
      console.error('❌ Canvas ref no está disponible')
      alert('Error: No se pudo generar QR (canvas no disponible)')
      return
    }

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
    qrInfo.value = {
      ensayoNombre: props.ensayo?.nombreEnsayo || 'Sin nombre',
      laboratorioNombre: props.ensayo?.laboratorio?.nombre || 'Sin laboratorio',
      tipoEnsayoNombre: props.ensayo?.tipoEnsayo?.nombre || 'Sin tipo',
      bloqueNombre: `Bloque ${nombreBloque.value}`,
      parcelaNombre: form.nombreParcela || `(${form.posXGrid}, ${form.posYGrid})`,
      tratamientoNombre: tratamiento?.nombreTratamiento || 'Sin tratamiento',
    }

    console.log('📦 QR Info:', qrInfo.value)

    // Generar QR en canvas
    console.log('🎨 Generando QR en canvas...')
    QRCode.toCanvas(
      qrCanvas.value,
      qrDataStr,
      { width: 250, margin: 1, color: { dark: '#000000', light: '#FFFFFF' } },
      (err) => {
        if (err) {
          console.error('❌ Error en QRCode.toCanvas:', err)
          alert('Error al generar QR: ' + err.message)
        } else {
          console.log('✅ QR generado exitosamente')
          mostrarQRModal.value = true
        }
      }
    )
  } catch (err) {
    console.error('❌ Error al generar QR:', err)
    alert('Error: ' + (err instanceof Error ? err.message : 'Error desconocido'))
  }
}

function imprimirQR() {
  if (!qrCanvas.value) return

  const printWindow = window.open('', '', 'height=600,width=600')
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <title>Código QR - Parcela</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
        .qr-container { margin: 20px 0; }
        canvas { max-width: 300px; }
        .info { margin-top: 20px; text-align: left; border: 1px solid #ccc; padding: 10px; }
        .info p { margin: 5px 0; }
        .info strong { display: inline-block; width: 120px; }
      </style>
    </head>
    <body>
      <h2>Código QR - Parcela</h2>
      <div class="qr-container">
        ${qrCanvas.value!.outerHTML}
      </div>
      <div class="info">
        <p><strong>Ensayo:</strong> ${qrInfo.value.ensayoNombre}</p>
        <p><strong>Laboratorio:</strong> ${qrInfo.value.laboratorioNombre}</p>
        <p><strong>Tipo Ensayo:</strong> ${qrInfo.value.tipoEnsayoNombre}</p>
        <p><strong>Bloque:</strong> ${qrInfo.value.bloqueNombre}</p>
        <p><strong>Parcela:</strong> ${qrInfo.value.parcelaNombre}</p>
        <p><strong>Tratamiento:</strong> ${qrInfo.value.tratamientoNombre}</p>
      </div>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()

  setTimeout(() => {
    printWindow!.print()
  }, 250)
}

function descargarQR() {
  if (!qrCanvas.value) return

  const link = document.createElement('a')
  link.href = qrCanvas.value.toDataURL('image/png')
  link.download = `parcela-${qrInfo.value.parcelaNombre}.png`
  link.click()
}

function enviar() {
  if (!form.tratamientoId) return

  emit('save', {
    tratamientoId: form.tratamientoId,
    nombreParcela: form.nombreParcela.trim() || null,
    posXGrid: form.posXGrid,
    posYGrid: form.posYGrid,
  })
}
</script>

