<!-- components/common/WorkflowAssistant.vue -->
<script setup lang="ts">
import { watch, computed } from 'vue'
import { useAsistenteFlujoStore } from '~/stores/asistente-flujo'
import { useEnsayosStore } from '~/stores/ensayos'

const route = useRoute()
const router = useRouter()
const store = useAsistenteFlujoStore()
const ensayosStore = useEnsayosStore()
const authStore = useAuthStore()

// Detectar ensayoId de la ruta actual
const ensayoIdFromRoute = computed(() => {
  // Rutas tipo /ensayos/123, /ensayos/123/...
  const match = route.path.match(/\/ensayos\/(\d+)/)
  if (match) return parseInt(match[1])
  return null
})

// Ensayo actual: de la ruta o del store
const ensayoIdActivo = computed(() => {
  return ensayoIdFromRoute.value || (ensayosStore.currentEnsayo?.id ? Number(ensayosStore.currentEnsayo.id) : null)
})

// Estado del panel: auto-detectar modo
const cargarDatos = async () => {
  if (ensayoIdActivo.value) {
    try {
      await store.fetchEstado(ensayoIdActivo.value)
    } catch { /* ignore */ }
  } else {
    try {
      await store.fetchPrerequisitos()
    } catch { /* ignore */ }
  }
}

// Cargar al abrir el panel
watch(() => store.isOpen, async (open) => {
  if (open) {
    await cargarDatos()
  }
})

// Recargar al cambiar de ruta si el panel está abierto
watch(() => route.path, async () => {
  if (store.isOpen) {
    await cargarDatos()
  }
})

const navigateTo = (ruta: string) => {
  router.push(ruta)
}

// Iconos SVG para cada tipo de paso
const iconPaths: Record<string, string> = {
  'building': 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
  'clipboard-list': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  'beaker': 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.341 4.024A2.25 2.25 0 0115.5 20.25H8.5a2.25 2.25 0 01-2.159-1.726L5 14.5m14 0H5',
  'document-check': 'M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9.375-9zM14.25 7.5l-2.25 3-1.5-1.5',
  'view-grid': 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
  'table-cells': 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-12.75A1.125 1.125 0 014.5 4.5h15a1.125 1.125 0 011.125 1.125v12.75m-20.25 0h20.25m0 0a1.125 1.125 0 01-1.125 1.125m1.125-1.125V5.625',
  'calendar': 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
  'leaf': 'M12 21c-4.97 0-9-2.686-9-6s4.03-6 9-6c1.5-4 4.5-6 9-6-1 3-1 6-1 9 0 3.314-4.03 9-8 9z',
  'chart-bar': 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  'archive-box': 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
  'document-text': 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
}

const getIconPath = (icono?: string) => {
  return iconPaths[icono || 'document-check'] || iconPaths['document-check']
}

// Color de la barra de progreso
const progressColor = computed(() => {
  const pct = store.porcentaje
  if (pct >= 100) return 'bg-green-500'
  if (pct >= 60) return 'bg-blue-500'
  if (pct >= 30) return 'bg-yellow-500'
  return 'bg-red-500'
})

// Color del botón flotante
const fabColor = computed(() => {
  if (!store.estadoFlujo) return 'bg-indigo-600 hover:bg-indigo-700'
  const pct = store.porcentaje
  if (pct >= 100) return 'bg-green-600 hover:bg-green-700'
  if (pct >= 60) return 'bg-blue-600 hover:bg-blue-700'
  return 'bg-indigo-600 hover:bg-indigo-700'
})
</script>

<template>
  <!-- Botón Flotante (FAB) -->
  <button
    @click="store.toggle()"
    :class="fabColor"
    class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg text-white flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
    :title="store.isOpen ? 'Cerrar asistente' : 'Abrir asistente de flujo'"
  >
    <!-- Ícono del asistente (varita mágica / checklist) -->
    <svg v-if="!store.isOpen" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
    <!-- Ícono cerrar -->
    <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>

    <!-- Badge de progreso -->
    <span
      v-if="!store.isOpen && store.estadoFlujo"
      class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-xs font-bold flex items-center justify-center shadow"
      :class="{
        'text-green-600': store.porcentaje >= 100,
        'text-blue-600': store.porcentaje >= 60 && store.porcentaje < 100,
        'text-yellow-600': store.porcentaje >= 30 && store.porcentaje < 60,
        'text-red-600': store.porcentaje < 30,
      }"
    >
      {{ store.porcentaje }}%
    </span>
  </button>

  <!-- Panel del Asistente (slide-in desde la derecha) -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-300 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div
      v-if="store.isOpen"
      class="fixed top-0 right-0 z-40 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-2xl flex flex-col overflow-hidden"
    >
      <!-- Header del panel -->
      <div class="px-5 py-4 bg-indigo-600 text-white flex-shrink-0">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            Asistente de Flujo
          </h2>
          <button @click="store.close()" class="text-white/80 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Subtítulo contextual -->
        <p class="text-sm text-indigo-200 mt-1">
          <template v-if="ensayoIdActivo">
            Ensayo {{ store.estadoFlujo?.nombreEnsayo || `#${ensayoIdActivo}` }}
          </template>
          <template v-else>
            ¿Qué deseas hacer?
          </template>
        </p>
      </div>

      <!-- Contenido scrollable -->
      <div class="flex-1 overflow-y-auto">
        <!-- Loading -->
        <div v-if="store.loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>

        <!-- Error -->
        <div v-else-if="store.error" class="p-5">
          <div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p class="text-red-700 dark:text-red-300 text-sm">{{ store.error }}</p>
            <button @click="cargarDatos()" class="mt-2 text-sm text-red-600 dark:text-red-400 underline">Reintentar</button>
          </div>
        </div>

        <!-- MODO: Inicio (sin ensayo seleccionado, sin datos aún) -->
        <div v-else-if="store.modo === 'inicio' && !store.loading" class="p-5 space-y-4">
          <div class="text-center py-6">
            <svg class="mx-auto w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <h3 class="mt-3 text-lg font-semibold text-gray-700 dark:text-gray-200">¿En qué te puedo ayudar?</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Selecciona una opción para comenzar</p>
          </div>

          <button
            @click="store.fetchPrerequisitos()"
            class="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">Crear nuevo Ensayo</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Verificar prerequisitos y comenzar</p>
              </div>
            </div>
          </button>

          <button
            @click="navigateTo('/ensayos')"
            class="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">Continuar Ensayo existente</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Seleccionar un ensayo para ver su progreso</p>
              </div>
            </div>
          </button>

          <button
            @click="navigateTo('/reportes')"
            class="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">Generar Reportes</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Exportar PDF o Excel de un ensayo</p>
              </div>
            </div>
          </button>
        </div>

        <!-- MODO: Prerequisitos (antes de crear un ensayo) -->
        <div v-else-if="store.modo === 'prerequisitos' && store.prerequisitos" class="p-5">
          <!-- Mensaje resumen -->
          <div
            class="mb-4 p-3 rounded-lg text-sm"
            :class="store.prerequisitos.puedeCrearEnsayo
              ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800'"
          >
            <div class="flex items-center gap-2">
              <svg v-if="store.prerequisitos.puedeCrearEnsayo" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium">{{ store.prerequisitos.mensaje }}</span>
            </div>
          </div>

          <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Prerequisitos</h3>

          <div class="space-y-2">
            <div
              v-for="pre in store.prerequisitos.prerequisitos"
              :key="pre.id"
              class="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
              :class="pre.disponible
                ? 'border-green-200 dark:border-green-800'
                : 'border-red-200 dark:border-red-800'"
              @click="navigateTo(pre.ruta)"
            >
              <!-- Estado -->
              <div class="flex-shrink-0">
                <div v-if="pre.disponible" class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-else class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ pre.nombre }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ pre.detalle }}</p>
              </div>

              <!-- Flecha -->
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>

          <!-- Botón crear ensayo -->
          <div class="mt-6">
            <button
              v-if="store.prerequisitos.puedeCrearEnsayo"
              @click="navigateTo('/ensayos/new')"
              class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Crear Nuevo Ensayo
            </button>
            <button
              @click="store.reset()"
              class="w-full mt-2 py-2 px-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              ← Volver al menú
            </button>
          </div>
        </div>

        <!-- MODO: Estado del flujo de un ensayo -->
        <div v-else-if="store.modo === 'estado' && store.estadoFlujo" class="p-5">
          <!-- Barra de progreso -->
          <div class="mb-5">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="font-medium text-gray-700 dark:text-gray-200">Progreso general</span>
              <span class="font-bold" :class="{
                'text-green-600': store.porcentaje >= 100,
                'text-blue-600': store.porcentaje >= 60 && store.porcentaje < 100,
                'text-yellow-600': store.porcentaje >= 30 && store.porcentaje < 60,
                'text-red-600': store.porcentaje < 30,
              }">{{ store.porcentaje }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                class="h-2.5 rounded-full transition-all duration-500"
                :class="progressColor"
                :style="{ width: `${store.porcentaje}%` }"
              ></div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ store.pasosCompletados }}/{{ store.totalPasos }} pasos completados
            </p>
          </div>

          <!-- Siguiente paso sugerido -->
          <div v-if="store.siguientePaso" class="mb-5 p-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Siguiente paso</p>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ store.siguientePaso.nombre }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ store.siguientePaso.descripcion }}</p>
            <button
              @click="navigateTo(store.siguientePaso.ruta)"
              class="mt-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
            >
              Ir al paso
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          <!-- Lista de pasos (stepper vertical) -->
          <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Pasos del flujo</h3>

          <div class="relative">
            <!-- Línea vertical -->
            <div class="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

            <div class="space-y-1">
              <div
                v-for="paso in store.pasos"
                :key="paso.id"
                class="relative flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                :class="{ 'bg-indigo-50/50 dark:bg-indigo-900/10': store.siguientePaso?.id === paso.id }"
                @click="navigateTo(paso.ruta)"
              >
                <!-- Indicador del paso -->
                <div class="relative z-10 flex-shrink-0">
                  <!-- Completado -->
                  <div v-if="paso.completado" class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <!-- Siguiente (activo) -->
                  <div v-else-if="store.siguientePaso?.id === paso.id" class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm ring-4 ring-indigo-100 dark:ring-indigo-900/50">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path :d="getIconPath(paso.icono)" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <!-- Pendiente -->
                  <div v-else class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ paso.orden }}</span>
                  </div>
                </div>

                <!-- Contenido del paso -->
                <div class="flex-1 min-w-0 pt-0.5">
                  <p class="text-sm font-medium" :class="{
                    'text-green-700 dark:text-green-300': paso.completado,
                    'text-indigo-700 dark:text-indigo-300': !paso.completado && store.siguientePaso?.id === paso.id,
                    'text-gray-600 dark:text-gray-400': !paso.completado && store.siguientePaso?.id !== paso.id,
                  }">
                    {{ paso.nombre }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ paso.detalle }}</p>
                  <!-- Barra de progreso mini para pasos con progreso parcial -->
                  <div v-if="paso.progreso && !paso.completado" class="mt-1.5 flex items-center gap-2">
                    <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        class="bg-amber-400 h-1.5 rounded-full"
                        :style="{ width: `${Math.min(100, (parseInt(paso.progreso.split('/')[0]) / Math.max(1, parseInt(paso.progreso.split('/')[1]))) * 100)}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-400 whitespace-nowrap">{{ paso.progreso }}</span>
                  </div>
                </div>

                <!-- Flecha -->
                <svg class="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              @click="cargarDatos()"
              class="w-full py-2 px-4 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Actualizar estado
            </button>
            <button
              @click="store.reset()"
              class="w-full py-2 px-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              ← Volver al menú
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Overlay (mobile) -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="store.isOpen"
      class="fixed inset-0 bg-black/30 z-30 sm:hidden"
      @click="store.close()"
    ></div>
  </Transition>
</template>


