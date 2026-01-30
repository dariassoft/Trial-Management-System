<template>
  <div class="space-y-4">
    <!-- Botones de captura -->
    <div class="flex gap-2">
      <button
        @click="openCamera('photo')"
        class="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
               font-medium transition flex items-center justify-center gap-2"
      >
        📷 Foto
      </button>
      <button
        @click="openCamera('video')"
        class="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
               font-medium transition flex items-center justify-center gap-2"
      >
        🎥 Video
      </button>
      <button
        @click="openFilePicker"
        class="py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
               rounded-lg font-medium transition"
        title="Seleccionar archivo"
      >
        📁
      </button>
    </div>

    <!-- Límites -->
    <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
      📸 Máx {{ settings.maxPhotoSizeMB }}MB | 🎥 Máx {{ settings.maxVideoSeconds }}s / {{ settings.maxVideoSizeMB }}MB
    </p>

    <!-- Preview de archivos capturados -->
    <div v-if="capturedFiles.length > 0" class="space-y-2">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
        Archivos capturados ({{ capturedFiles.length }})
      </p>
      <div class="flex gap-2 overflow-x-auto pb-2">
        <div
          v-for="(file, idx) in capturedFiles"
          :key="idx"
          class="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
        >
          <!-- Foto preview -->
          <img
            v-if="file.type === 'photo'"
            :src="file.preview"
            alt="Foto capturada"
            class="w-full h-full object-cover"
          />
          <!-- Video preview -->
          <div v-else class="w-full h-full flex items-center justify-center">
            <video
              :src="file.preview"
              class="w-full h-full object-cover"
              muted
            ></video>
            <span class="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-2xl">
              ▶
            </span>
          </div>
          <!-- Indicador de tipo -->
          <span class="absolute top-1 left-1 text-xs bg-black/50 text-white px-1 rounded">
            {{ file.type === 'photo' ? '📷' : '🎥' }}
          </span>
          <!-- Botón eliminar -->
          <button
            @click="removeFile(idx)"
            class="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white
                   rounded-full text-xs flex items-center justify-center"
          >
            ✕
          </button>
          <!-- Indicador pendiente de sync -->
          <span
            v-if="file.pendingSync"
            class="absolute bottom-1 left-1 text-xs bg-yellow-500 text-black px-1 rounded"
          >
            ⏳
          </span>
        </div>
      </div>
    </div>

    <!-- Fotos/Videos ya guardados -->
    <div v-if="props.existingPhotos && props.existingPhotos.length > 0" class="space-y-2">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
        ✅ Guardados ({{ props.existingPhotos.length }})
      </p>
      <div class="flex gap-2 overflow-x-auto pb-2">
        <div
          v-for="photo in props.existingPhotos"
          :key="photo.id"
          class="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-green-500"
        >
          <!-- Foto -->
          <img
            v-if="photo.mime_type?.startsWith('image/')"
            :src="getPhotoUrl(photo.file_path)"
            alt="Foto guardada"
            class="w-full h-full object-cover cursor-pointer"
            @click="openFullscreen(photo)"
          />
          <!-- Video -->
          <div v-else class="w-full h-full flex items-center justify-center cursor-pointer" @click="openFullscreen(photo)">
            <video
              :src="getPhotoUrl(photo.file_path)"
              class="w-full h-full object-cover"
              muted
            ></video>
            <span class="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-2xl">
              ▶
            </span>
          </div>
          <!-- Indicador de tipo -->
          <span class="absolute top-1 left-1 text-xs bg-green-600 text-white px-1 rounded">
            {{ photo.mime_type?.startsWith('video/') ? '🎥' : '📷' }}
          </span>
          <!-- Botón eliminar -->
          <button
            @click="deleteExistingPhoto(photo.id)"
            class="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white
                   rounded-full text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Input file oculto -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*,video/*"
      @change="handleFileSelect"
      class="hidden"
    />

    <!-- Modal de cámara -->
    <Teleport to="body">
      <div
        v-if="showCamera"
        class="fixed inset-0 z-50 bg-black flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 bg-black/80">
          <button
            @click="closeCamera"
            class="text-white text-lg px-4 py-2"
          >
            ✕ Cancelar
          </button>
          <span class="text-white font-medium">
            {{ captureMode === 'photo' ? '📷 Foto' : '🎥 Video' }}
          </span>
          <button
            @click="switchCamera"
            class="text-white text-lg px-4 py-2"
          >
            🔄
          </button>
        </div>

        <!-- Video preview -->
        <div class="flex-1 relative">
          <video
            ref="videoPreview"
            autoplay
            playsinline
            muted
            class="w-full h-full object-cover"
          ></video>

          <!-- Contador de grabación -->
          <div
            v-if="isRecording"
            class="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <span class="w-3 h-3 bg-white rounded-full animate-pulse"></span>
            <span class="font-mono text-lg">{{ formatTime(recordingTime) }}</span>
            <span class="text-sm">/ {{ settings.maxVideoSeconds }}s</span>
          </div>
        </div>

        <!-- Controles -->
        <div class="p-6 bg-black/80 flex justify-center">
          <button
            v-if="captureMode === 'photo'"
            @click="takePhoto"
            class="w-20 h-20 rounded-full bg-white border-4 border-gray-300
                   hover:bg-gray-100 transition flex items-center justify-center"
          >
            <span class="w-16 h-16 rounded-full bg-white"></span>
          </button>

          <button
            v-else
            @click="toggleRecording"
            class="w-20 h-20 rounded-full transition flex items-center justify-center"
            :class="isRecording ? 'bg-red-600' : 'bg-white border-4 border-red-500'"
          >
            <span
              :class="isRecording ? 'w-8 h-8 rounded bg-white' : 'w-16 h-16 rounded-full bg-red-500'"
            ></span>
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Canvas oculto para captura de foto -->
    <canvas ref="photoCanvas" class="hidden"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue'
import { useSettingsStore } from '~/stores/settings'
import { useOfflineStore } from '~/stores/offline'

interface CapturedFile {
  type: 'photo' | 'video'
  blob: Blob
  preview: string
  filename: string
  pendingSync: boolean
}

interface ExistingPhoto {
  id: number
  file_name: string
  file_path: string
  mime_type: string
}

const props = defineProps<{
  parcelaId: number
  momentoId: number
  ensayoId: number
  existingPhotos?: ExistingPhoto[]
}>()

const emit = defineEmits<{
  (e: 'captured', files: CapturedFile[]): void
  (e: 'error', message: string): void
  (e: 'deleteExisting', photoId: number): void
}>()

const settingsStore = useSettingsStore()
const offlineStore = useOfflineStore()

const settings = computed(() => settingsStore.settings)

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const videoPreview = ref<HTMLVideoElement | null>(null)
const photoCanvas = ref<HTMLCanvasElement | null>(null)

// Estado
const showCamera = ref(false)
const captureMode = ref<'photo' | 'video'>('photo')
const capturedFiles = ref<CapturedFile[]>([])
const isRecording = ref(false)
const recordingTime = ref(0)
const facingMode = ref<'user' | 'environment'>('environment')

// Media
let mediaStream: MediaStream | null = null
let mediaRecorder: MediaRecorder | null = null
let recordedChunks: Blob[] = []
let recordingInterval: ReturnType<typeof setInterval> | null = null

// Abrir cámara
async function openCamera(mode: 'photo' | 'video') {
  captureMode.value = mode
  showCamera.value = true

  try {
    await startCamera()
  } catch (err: any) {
    console.error('Error abriendo cámara:', err)
    emit('error', 'No se pudo acceder a la cámara')
    closeCamera()
  }
}

// Iniciar cámara
async function startCamera() {
  // Detener stream anterior si existe
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
  }

  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: facingMode.value,
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    audio: captureMode.value === 'video',
  }

  mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

  if (videoPreview.value) {
    videoPreview.value.srcObject = mediaStream
  }
}

// Cambiar cámara frontal/trasera
async function switchCamera() {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  await startCamera()
}

// Cerrar cámara
function closeCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
  isRecording.value = false
  recordingTime.value = 0
  showCamera.value = false
}

// Tomar foto
async function takePhoto() {
  if (!videoPreview.value || !photoCanvas.value) return

  const video = videoPreview.value
  const canvas = photoCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Configurar canvas con tamaño del video
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // Dibujar frame actual
  ctx.drawImage(video, 0, 0)

  // Convertir a blob
  canvas.toBlob(
    async (blob) => {
      if (!blob) {
        emit('error', 'Error al capturar foto')
        return
      }

      // Verificar tamaño
      const sizeMB = blob.size / (1024 * 1024)
      if (sizeMB > settings.value.maxPhotoSizeMB) {
        emit('error', `Foto muy grande (${sizeMB.toFixed(1)}MB). Máximo: ${settings.value.maxPhotoSizeMB}MB`)
        return
      }

      const filename = `foto_${Date.now()}.jpg`
      const preview = URL.createObjectURL(blob)

      const file: CapturedFile = {
        type: 'photo',
        blob,
        preview,
        filename,
        pendingSync: !offlineStore.isOnline,
      }

      capturedFiles.value.push(file)
      emit('captured', capturedFiles.value)

      // Guardar localmente si está offline
      if (!offlineStore.isOnline) {
        await offlineStore.saveMediaLocal({
          parcelaId: props.parcelaId,
          momentoId: props.momentoId,
          ensayoId: props.ensayoId,
          type: 'photo',
          blob,
          filename,
        })
      }

      closeCamera()
    },
    'image/jpeg',
    settings.value.photoQuality
  )
}

// Toggle grabación de video
function toggleRecording() {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

// Iniciar grabación
function startRecording() {
  if (!mediaStream) return

  recordedChunks = []

  const options = { mimeType: 'video/webm;codecs=vp9' }
  try {
    mediaRecorder = new MediaRecorder(mediaStream, options)
  } catch {
    // Fallback para navegadores que no soportan vp9
    mediaRecorder = new MediaRecorder(mediaStream)
  }

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data)
    }
  }

  mediaRecorder.onstop = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' })

    // Verificar tamaño
    const sizeMB = blob.size / (1024 * 1024)
    if (sizeMB > settings.value.maxVideoSizeMB) {
      emit('error', `Video muy grande (${sizeMB.toFixed(1)}MB). Máximo: ${settings.value.maxVideoSizeMB}MB`)
      return
    }

    const filename = `video_${Date.now()}.webm`
    const preview = URL.createObjectURL(blob)

    const file: CapturedFile = {
      type: 'video',
      blob,
      preview,
      filename,
      pendingSync: !offlineStore.isOnline,
    }

    capturedFiles.value.push(file)
    emit('captured', capturedFiles.value)

    // Guardar localmente si está offline
    if (!offlineStore.isOnline) {
      await offlineStore.saveMediaLocal({
        parcelaId: props.parcelaId,
        momentoId: props.momentoId,
        ensayoId: props.ensayoId,
        type: 'video',
        blob,
        filename,
      })
    }

    closeCamera()
  }

  mediaRecorder.start()
  isRecording.value = true
  recordingTime.value = 0

  // Contador de tiempo
  recordingInterval = setInterval(() => {
    recordingTime.value++

    // Auto-detener si llega al límite
    if (recordingTime.value >= settings.value.maxVideoSeconds) {
      stopRecording()
    }
  }, 1000)
}

// Detener grabación
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop()
  }
  if (recordingInterval) {
    clearInterval(recordingInterval)
    recordingInterval = null
  }
  isRecording.value = false
}

// Formatear tiempo mm:ss
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Abrir selector de archivos
function openFilePicker() {
  fileInput.value?.click()
}

// Manejar selección de archivo
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const isVideo = file.type.startsWith('video/')
  const isPhoto = file.type.startsWith('image/')

  if (!isVideo && !isPhoto) {
    emit('error', 'Tipo de archivo no soportado')
    return
  }

  // Verificar tamaño
  const sizeMB = file.size / (1024 * 1024)
  const maxSize = isVideo ? settings.value.maxVideoSizeMB : settings.value.maxPhotoSizeMB

  if (sizeMB > maxSize) {
    emit('error', `Archivo muy grande (${sizeMB.toFixed(1)}MB). Máximo: ${maxSize}MB`)
    return
  }

  const preview = URL.createObjectURL(file)
  const filename = `${isVideo ? 'video' : 'foto'}_${Date.now()}.${file.name.split('.').pop()}`

  const capturedFile: CapturedFile = {
    type: isVideo ? 'video' : 'photo',
    blob: file,
    preview,
    filename,
    pendingSync: !offlineStore.isOnline,
  }

  capturedFiles.value.push(capturedFile)
  emit('captured', capturedFiles.value)

  // Guardar localmente si está offline
  if (!offlineStore.isOnline) {
    await offlineStore.saveMediaLocal({
      parcelaId: props.parcelaId,
      momentoId: props.momentoId,
      ensayoId: props.ensayoId,
      type: isVideo ? 'video' : 'photo',
      blob: file,
      filename,
    })
  }

  // Limpiar input
  input.value = ''
}

// Eliminar archivo
function removeFile(index: number) {
  const file = capturedFiles.value[index]
  URL.revokeObjectURL(file.preview)
  capturedFiles.value.splice(index, 1)
  emit('captured', capturedFiles.value)
}

// Obtener URL completa de la foto guardada
function getPhotoUrl(filePath: string): string {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:3000/api/v1'
  // Extraer solo el host del apiBase (sin /api/v1)
  const baseUrl = apiBase.replace(/\/api\/v1$/, '')
  return `${baseUrl}${filePath}`
}

// Abrir foto/video en pantalla completa
function openFullscreen(photo: { file_path: string; mime_type: string }) {
  const url = getPhotoUrl(photo.file_path)
  window.open(url, '_blank')
}

// Eliminar foto existente
function deleteExistingPhoto(photoId: number) {
  if (confirm('¿Eliminar este archivo?')) {
    emit('deleteExisting', photoId)
  }
}

// Limpiar al desmontar
onUnmounted(() => {
  closeCamera()
  capturedFiles.value.forEach(file => {
    URL.revokeObjectURL(file.preview)
  })
})

// Exponer métodos
defineExpose({
  capturedFiles,
  clearFiles: () => {
    capturedFiles.value.forEach(file => URL.revokeObjectURL(file.preview))
    capturedFiles.value = []
  },
})
</script>
