<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useReportesStore } from '~/stores/reportes'
import { useEnsayosStore } from '~/stores/ensayos'

const reportesStore = useReportesStore()
const ensayosStore = useEnsayosStore()

const ensayoSeleccionado = ref<number | null>(null)
const tipoReporte = ref<'pdf' | 'excel'>('pdf')
const vistaPreviaData = ref<any>(null)
const mostrarVistaPrevia = ref(false)

const ensayos = computed(() => ensayosStore.ensayos)
const generando = computed(() => reportesStore.generando)
const error = computed(() => reportesStore.error)
const success = computed(() => reportesStore.success)

onMounted(async () => {
  await ensayosStore.fetchEnsayos()
})

const generarReporte = async () => {
  if (!ensayoSeleccionado.value) {
    alert('Por favor selecciona un ensayo')
    return
  }

  reportesStore.limpiarMensajes()

  if (tipoReporte.value === 'pdf') {
    await reportesStore.generarReportePDF(ensayoSeleccionado.value)
  } else {
    await reportesStore.generarReporteExcel(ensayoSeleccionado.value)
  }
}

const obtenerVistaPrevia = async () => {
  if (!ensayoSeleccionado.value) {
    alert('Por favor selecciona un ensayo')
    return
  }

  const ensayo = ensayos.value.find(e => e.id === ensayoSeleccionado.value)
  if (!ensayo) {
    alert('Ensayo no encontrado')
    return
  }

  // TODO: Obtener datos reales del ensayo desde la BD
  const datosCampo = []
  const datosTrilla = []

  vistaPreviaData.value = await reportesStore.obtenerVistaPreviaReporte(
    ensayoSeleccionado.value,
    datosCampo,
    datosTrilla
  )

  if (vistaPreviaData.value) {
    mostrarVistaPrevia.value = true
  }
}
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Generador de Reportes</h1>
        <p class="text-gray-600 dark:text-gray-400">Crea reportes profesionales en PDF o Excel</p>
      </div>
      <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
        <span class="text-2xl">📊</span>
      </div>
    </div>

    <!-- Mensajes de feedback -->
    <div v-if="error" class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
      <p class="text-sm text-red-800 dark:text-red-400">
        <span class="font-bold">❌ Error:</span> {{ error }}
      </p>
    </div>

    <div v-if="success" class="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
      <p class="text-sm text-green-800 dark:text-green-400">
        <span class="font-bold">{{ success }}</span>
      </p>
    </div>

    <!-- Formulario Principal -->
    <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <div class="space-y-6">
        <!-- Seleccionar Ensayo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🌾 Seleccionar Ensayo
          </label>
          <select
            v-model.number="ensayoSeleccionado"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="null">-- Elige un ensayo --</option>
            <option v-for="ensayo in ensayos" :key="ensayo.id" :value="ensayo.id">
              {{ ensayo.nombre || `Ensayo #${ensayo.id}` }}
            </option>
          </select>
          <p v-if="ensayos.length === 0" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No hay ensayos disponibles
          </p>
        </div>

        <!-- Tipo de Reporte -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            📄 Tipo de Reporte
          </label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="tipoReporte"
                type="radio"
                value="pdf"
                class="w-4 h-4 text-blue-600"
              />
              <span class="text-gray-700 dark:text-gray-300">
                <strong>PDF</strong> - Profesional e imprimible
              </span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="tipoReporte"
                type="radio"
                value="excel"
                class="w-4 h-4 text-blue-600"
              />
              <span class="text-gray-700 dark:text-gray-300">
                <strong>Excel</strong> - Interactivo y editable
              </span>
            </label>
          </div>
        </div>

        <!-- Descripciones -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            :class="tipoReporte === 'pdf' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30'"
            class="border rounded-lg p-4 transition"
          >
            <p class="font-medium text-gray-900 dark:text-white">📄 Reporte PDF</p>
            <ul class="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>✓ 8 páginas profesionales</li>
              <li>✓ Gráficos integrados</li>
              <li>✓ Resumen ejecutivo</li>
              <li>✓ Listo para imprimir</li>
            </ul>
          </div>

          <div
            :class="tipoReporte === 'excel' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30'"
            class="border rounded-lg p-4 transition"
          >
            <p class="font-medium text-gray-900 dark:text-white">📊 Reporte Excel</p>
            <ul class="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>✓ 6 hojas con datos</li>
              <li>✓ Fórmulas calculadas</li>
              <li>✓ Gráficos interactivos</li>
              <li>✓ Editable</li>
            </ul>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex flex-col gap-3 sm:flex-row">
          <button
            @click="generarReporte"
            :disabled="!ensayoSeleccionado || generando"
            class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            <span v-if="!generando">
              {{ tipoReporte === 'pdf' ? '📄 Generar y Descargar PDF' : '📊 Generar y Descargar Excel' }}
            </span>
            <span v-else>
              ⏳ Generando {{ tipoReporte === 'pdf' ? 'PDF' : 'Excel' }}...
            </span>
          </button>

          <button
            @click="obtenerVistaPrevia"
            :disabled="!ensayoSeleccionado"
            class="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            👁️ Vista Previa
          </button>
        </div>
      </div>
    </div>

    <!-- Vista Previa -->
    <div v-if="mostrarVistaPrevia && vistaPreviaData" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">👁️ Vista Previa de Datos Procesados</h2>
        <button
          @click="mostrarVistaPrevia = false"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <div class="space-y-4">
        <!-- Estadísticas -->
        <div>
          <h3 class="font-bold text-gray-900 dark:text-white mb-3">📊 Estadísticas por Tratamiento</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-700">
                  <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Trat</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">N</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Promedio</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Desviación</th>
                  <th class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">CV %</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stats, trat) in vistaPreviaData.estadisticas" :key="trat" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="border border-gray-300 dark:border-gray-600 px-3 py-2 font-medium">{{ trat }}</td>
                  <td class="border border-gray-300 dark:border-gray-600 px-3 py-2">{{ stats.n }}</td>
                  <td class="border border-gray-300 dark:border-gray-600 px-3 py-2">{{ (stats.promedio as any).toFixed(2) }}</td>
                  <td class="border border-gray-300 dark:border-gray-600 px-3 py-2">{{ (stats.desviacion as any).toFixed(2) }}</td>
                  <td class="border border-gray-300 dark:border-gray-600 px-3 py-2">{{ (stats.coefVariacion as any).toFixed(2) }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
      <p class="text-sm text-blue-800 dark:text-blue-400">
        <strong>ℹ️ Información:</strong> Los reportes incluyen análisis estadístico completo, gráficos profesionales,
        resumen ejecutivo y recomendaciones basadas en los datos del ensayo.
      </p>
    </div>
  </div>
</template>

