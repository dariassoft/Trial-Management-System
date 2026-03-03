<template>
  <div>
    <!-- Botón para abrir escáner -->
    <button
      @click="openScanner"
      class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg
             font-medium transition flex items-center justify-center gap-2"
    >
      <span class="text-xl">📱</span>
      <span>Escanear QR de Parcela</span>
    </button>

    <!-- Modal de escáner -->
    <Teleport to="body">
      <div
        v-if="showScanner"
        class="fixed inset-0 z-50 bg-black flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 bg-black/80">
          <button
            @click="closeScanner"
            class="text-white text-lg px-4 py-2"
          >
            ✕ Cancelar
          </button>
          <span class="text-white font-medium">📱 Escanear QR</span>
          <button
            @click="switchCamera"
            class="text-white text-lg px-4 py-2"
          >
            🔄
          </button>
        </div>

        <!-- Área de escaneo -->
        <div class="flex-1 relative">
          <video
            ref="videoElement"
            autoplay
            playsinline
            muted
            class="w-full h-full object-cover"
          ></video>

          <!-- Overlay con marco de escaneo -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative w-64 h-64">
              <!-- Marco de escaneo -->
              <div class="absolute inset-0 border-2 border-white/50 rounded-lg"></div>
              <!-- Esquinas destacadas -->
              <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
              <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
              <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
              <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>

              <!-- Línea de escaneo animada -->
              <div
                class="absolute left-2 right-2 h-0.5 bg-green-400 animate-scan"
              ></div>
            </div>
          </div>

          <!-- Overlay oscuro fuera del marco -->
          <div class="absolute inset-0 pointer-events-none">
            <div class="absolute inset-0 bg-black/50"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-transparent" style="box-shadow: 0 0 0 9999px rgba(0,0,0,0.5);"></div>
          </div>
        </div>

        <!-- Instrucciones -->
        <div class="p-6 bg-black/80 text-center">
          <p class="text-white text-lg">
            {{ scanning ? '🔍 Buscando código QR...' : '📷 Posiciona el código QR en el marco' }}
          </p>
          <p v-if="lastError" class="text-red-400 text-sm mt-2">
            {{ lastError }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'

// jsQR se carga dinámicamente
let jsQR: any = null

export interface QRData {
  parcelaId: number
  ensayoId?: number
  bloqueId?: number
  nombreParcela?: string
  raw: string
}

const emit = defineEmits<{
  (e: 'scanned', data: QRData): void
  (e: 'error', message: string): void
  (e: 'cancel'): void
}>()

// Refs
const videoElement = ref<HTMLVideoElement | null>(null)

// Estado
const showScanner = ref(false)
const scanning = ref(false)
const lastError = ref<string | null>(null)
const facingMode = ref<'user' | 'environment'>('environment')

// Media
let mediaStream: MediaStream | null = null
let animationFrameId: number | null = null
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let jsQRLoaded = ref(false)

// Cargar jsQR dinámicamente
onMounted(async () => {
  try {
    const module = await import('jsqr')
    jsQR = module.default
    jsQRLoaded.value = true
    console.log('✅ jsQR cargado correctamente')
  } catch (err) {
    console.warn('⚠️ jsQR no disponible, el escáner QR no funcionará')
    jsQRLoaded.value = false
  }
})

// Abrir escáner
async function openScanner() {
  if (!jsQRLoaded.value) {
    emit('error', 'El escáner QR no está disponible. Instale jsqr: npm install jsqr')
    return
  }

  showScanner.value = true
  lastError.value = null

  try {
    await startCamera()
    startScanning()
  } catch (err: any) {
    console.error('Error abriendo escáner:', err)
    lastError.value = 'No se pudo acceder a la cámara'
    emit('error', 'No se pudo acceder a la cámara')
  }
}

// Iniciar cámara
async function startCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
  }

  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: facingMode.value,
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  }

  mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

  if (videoElement.value) {
    videoElement.value.srcObject = mediaStream
    await videoElement.value.play()
  }

  // Crear canvas para análisis
  if (!canvas) {
    canvas = document.createElement('canvas')
    ctx = canvas.getContext('2d', { willReadFrequently: true })
  }
}

// Cambiar cámara
async function switchCamera() {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  stopScanning()
  await startCamera()
  startScanning()
}

// Iniciar escaneo
function startScanning() {
  scanning.value = true
  scanFrame()
}

// Escanear frame
function scanFrame() {
  if (!showScanner.value || !videoElement.value || !canvas || !ctx || !jsQR) {
    return
  }

  const video = videoElement.value

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    // Configurar canvas
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Dibujar frame
    ctx.drawImage(video, 0, 0)

    // Obtener datos de imagen
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Escanear con jsQR
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })

      if (code) {
        console.log('📱 QR detectado:', code.data)
        handleQRCode(code.data)
        return
      }
    } catch (err) {
      console.error('Error escaneando QR:', err)
    }
  }

  // Continuar escaneando
  animationFrameId = requestAnimationFrame(scanFrame)
}

// Procesar código QR
function handleQRCode(data: string) {
  try {
    // Intentar parsear como JSON
    let parsed: any

    try {
      parsed = JSON.parse(data)
    } catch {
      // Si no es JSON, intentar parsear formato simple
      // Formato esperado: "PARCELA:123" o "P:123:E:456:B:789"
      if (data.startsWith('PARCELA:') || data.startsWith('P:')) {
        const parts = data.split(':')
        parsed = { parcelaId: parseInt(parts[1], 10) }

        if (parts.length > 2) {
          for (let i = 2; i < parts.length; i += 2) {
            const key = parts[i]
            const value = parts[i + 1]
            if (key === 'E') parsed.ensayoId = parseInt(value, 10)
            if (key === 'B') parsed.bloqueId = parseInt(value, 10)
          }
        }
      } else {
        // Intentar extraer ID de parcela del texto
        const match = data.match(/parcela[:\s]*(\d+)/i)
        if (match) {
          parsed = { parcelaId: parseInt(match[1], 10) }
        } else {
          throw new Error('Formato QR no reconocido')
        }
      }
    }

    // Validar que tenga parcelaId
    if (!parsed.parcelaId || isNaN(parsed.parcelaId)) {
      throw new Error('QR no contiene ID de parcela válido')
    }

    const qrData: QRData = {
      parcelaId: parsed.parcelaId,
      ensayoId: parsed.ensayoId,
      bloqueId: parsed.bloqueId,
      nombreParcela: parsed.nombreParcela || parsed.nombre,
      raw: data,
    }

    emit('scanned', qrData)
    closeScanner()
  } catch (err: any) {
    console.error('Error procesando QR:', err)
    lastError.value = err.message || 'Error leyendo código QR'
    // Continuar escaneando
    animationFrameId = requestAnimationFrame(scanFrame)
  }
}

// Detener escaneo
function stopScanning() {
  scanning.value = false
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

// Cerrar escáner
function closeScanner() {
  stopScanning()

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }

  showScanner.value = false
  emit('cancel')
}

// Limpiar al desmontar
onUnmounted(() => {
  closeScanner()
})

// Exponer métodos
defineExpose({
  open: openScanner,
  close: closeScanner,
})
</script>

<style scoped>
@keyframes scan {
  0%, 100% {
    top: 0.5rem;
  }
  50% {
    top: calc(100% - 0.5rem);
  }
}

.animate-scan {
  animation: scan 2s ease-in-out infinite;
}
</style>
