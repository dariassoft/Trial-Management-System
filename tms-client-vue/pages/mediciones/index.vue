<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              📊 Mediciones en Campo
            </h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              Selecciona un ensayo para registrar mediciones
            </p>
          </div>
          <!-- Botón Escanear QR -->
          <button
            @click="abrirEscanerQR"
            class="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg
                   font-medium transition flex items-center gap-2 shadow-lg"
            title="Escanear QR de parcela"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span class="hidden sm:inline">Escanear QR</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Componente QR Scanner Modal -->
    <MediaQRScannerModal
      v-if="showQRScanner"
      @scanned="handleQRScanned"
      @close="showQRScanner = false"
      @error="handleQRError"
    />

    <!-- Contenido -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Búsqueda -->
      <div class="mb-6">
        <input
          v-model="busqueda"
          type="text"
          placeholder="🔍 Buscar ensayo por nombre o código..."
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-500 dark:text-gray-400">Cargando ensayos...</p>
      </div>

      <!-- Lista de Ensayos -->
      <div v-else class="space-y-4">
        <div
          v-for="ensayo in ensayosFiltrados"
          :key="ensayo.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
                 hover:shadow-lg transition-shadow cursor-pointer"
          @click="irAMedicion(ensayo.id)"
        >
          <div class="p-4">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  🌱 {{ ensayo.nombreEnsayo }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ ensayo.codigoLabor || 'Sin código' }}
                </p>
              </div>
              <span
                :class="getStatusClass(ensayo.status?.nombre)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ ensayo.status?.nombre || 'Sin estado' }}
              </span>
            </div>

            <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div class="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <span>🏢</span>
                <span>{{ ensayo.laboratorio?.nombre || 'Sin lab' }}</span>
              </div>
              <div class="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <span>🧪</span>
                <span>{{ ensayo.tipoEnsayo?.nombre || 'Sin tipo' }}</span>
              </div>
              <div class="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <span>📍</span>
                <span>{{ ensayo.provincia || 'Sin ubicación' }}</span>
              </div>
              <div class="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <span>📅</span>
                <span>{{ formatDate(ensayo.fechaSiembra) }}</span>
              </div>
            </div>

            <!-- Botón medir -->
            <div class="mt-4 flex justify-end">
              <button
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                       font-medium transition flex items-center gap-2"
                @click.stop="irAMedicion(ensayo.id)"
              >
                <span>▶</span> Medir
              </button>
            </div>
          </div>
        </div>

        <!-- Sin resultados -->
        <div
          v-if="ensayosFiltrados.length === 0 && !loading"
          class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg"
        >
          <p class="text-gray-500 dark:text-gray-400">
            No se encontraron ensayos
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const router = useRouter()
const api = useApi()

const busqueda = ref('')
const loading = ref(false)
const ensayos = ref<any[]>([])
const showQRScanner = ref(false)

const ensayosFiltrados = computed(() => {
  if (!busqueda.value.trim()) return ensayos.value

  const q = busqueda.value.toLowerCase()
  return ensayos.value.filter((e: any) =>
    e.nombreEnsayo?.toLowerCase().includes(q) ||
    e.codigoLabor?.toLowerCase().includes(q) ||
    e.laboratorio?.nombre?.toLowerCase().includes(q)
  )
})

function getStatusClass(status?: string) {
  const s = status?.toLowerCase() || ''
  if (s.includes('ejecuc') || s.includes('activo')) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  if (s.includes('complet') || s.includes('final')) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  if (s.includes('cancel') || s.includes('suspend')) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

function formatDate(date?: string | null) {
  if (!date) return 'Sin fecha'
  try {
    return new Date(date).toLocaleDateString('es-AR')
  } catch {
    return date
  }
}

function irAMedicion(ensayoId: number) {
  router.push(`/mediciones/${ensayoId}`)
}

// === Funciones QR ===
function abrirEscanerQR() {
  showQRScanner.value = true
}

async function handleQRScanned(data: any) {
  console.log('📱 QR escaneado:', data)
  showQRScanner.value = false

  try {
    // El QR puede contener diferentes formatos:
    // 1. { parcelaId, ensayoId, bloqueId } - JSON estructurado
    // 2. URL con parámetros
    // 3. Texto simple con el código de parcela

    let ensayoId: number | null = null
    let momentoId: number | null = null

    if (data.ensayoId) {
      ensayoId = data.ensayoId
    } else if (data.raw) {
      // Intentar parsear el raw como JSON o extraer info
      try {
        const parsed = JSON.parse(data.raw)
        ensayoId = parsed.ensayoId || parsed.ensayo_id
      } catch {
        // Si no es JSON, buscar por código de parcela
        const codigo = data.raw.trim()
        console.log('🔍 Buscando parcela por código:', codigo)

        // Buscar la parcela por nombre
        const response = await api.get('/parcelas', {
          params: { nombreParcela: codigo, limit: 1 }
        })
        const parcelas = response?.data || response || []

        if (parcelas.length > 0) {
          const parcela = parcelas[0]
          ensayoId = parcela.ensayo?.id || parcela.ensayoId

          // Buscar el momento activo más reciente
          if (ensayoId) {
            const aplicacionesRes = await api.get('/aplicaciones', {
              params: { ensayoId, limit: 10 }
            })
            const aplicaciones = aplicacionesRes?.data || aplicacionesRes || []

            if (aplicaciones.length > 0) {
              // Tomar la última aplicación y su primer momento
              const ultimaApp = aplicaciones[aplicaciones.length - 1]
              if (ultimaApp.momentos && ultimaApp.momentos.length > 0) {
                momentoId = ultimaApp.momentos[0].id
              }
            }
          }
        }
      }
    }

    if (ensayoId && momentoId) {
      // Navegar directamente al momento de medición
      router.push(`/mediciones/${ensayoId}/momento/${momentoId}`)
      alert(`✅ Parcela encontrada. Navegando a mediciones...`)
    } else if (ensayoId) {
      // Navegar al ensayo para seleccionar momento
      router.push(`/mediciones/${ensayoId}`)
      alert(`✅ Ensayo encontrado. Selecciona el momento de evaluación.`)
    } else {
      alert('❌ No se pudo identificar la parcela. Verifica el código QR.')
    }
  } catch (err: any) {
    console.error('Error procesando QR:', err)
    alert('❌ Error al buscar la parcela: ' + (err.message || 'Error desconocido'))
  }
}

function handleQRError(message: string) {
  console.error('Error QR:', message)
  alert('Error de escaneo: ' + message)
}

onMounted(async () => {
  loading.value = true
  try {
    console.log('📋 Cargando ensayos para mediciones...')
    const response = await api.get('/ensayos', { params: { limit: 100 } })
    console.log('📋 Respuesta API:', response)

    // Manejar respuesta: puede ser un array directo o un objeto con data
    if (Array.isArray(response)) {
      ensayos.value = response
    } else if (response?.data && Array.isArray(response.data)) {
      ensayos.value = response.data
    } else {
      ensayos.value = []
    }

    console.log('📋 Ensayos cargados:', ensayos.value.length)
  } catch (err) {
    console.error('❌ Error cargando ensayos:', err)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Mediciones en Campo - TMS',
})
</script>
