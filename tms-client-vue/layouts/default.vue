<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useTheme } from '~/composables/useTheme'
import { useNotificacionesStore } from '~/stores/notificaciones'
import { useMenuStore } from '~/stores/menu'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useOfflineStore } from '~/stores/offline'
import SideMenu from '~/components/navigation/SideMenu.vue'
import TheToast from '~/components/common/TheToast.vue'
import OfflineIndicator from '~/components/common/OfflineIndicator.vue'
import WorkflowAssistant from '~/components/common/WorkflowAssistant.vue'

const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const notificacionesStore = useNotificacionesStore()
const menuStore = useMenuStore()
const offlineStore = useOfflineStore()
const route = useRoute()
const showUserMenu = ref(false)
let pollInterval: ReturnType<typeof setInterval> | null = null

const isRouteAllowedOffline = computed(() => {
  const path = route.path
  return path.startsWith('/mediciones')
})

const showOfflineNotice = computed(() => {
  return !offlineStore.isOnline && !isRouteAllowedOffline.value
})

onMounted(() => {
  useTheme().initializeTheme()
  if (authStore.isAuthenticated) {
    notificacionesStore.fetchUnreadCount()
    pollInterval = setInterval(() => {
      if (authStore.isAuthenticated) {
        notificacionesStore.fetchUnreadCount()
      }
    }, 60000)
  }
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-900">
    <!-- Mobile Menu (Drawer) -->
    <div class="md:hidden">
      <SideMenu />
    </div>

    <!-- Desktop Menu (Permanent) -->
    <div class="hidden md:flex md:w-64 md:flex-shrink-0">
      <div class="flex flex-col w-64">
        <div class="flex flex-col flex-1 h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <SideMenu />
        </div>
      </div>
    </div>

    <div class="flex flex-col flex-1 w-0 overflow-hidden">
      <!-- Header -->
      <header class="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
        <button
          @click="menuStore.open()"
          class="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        >
          <span class="sr-only">Open sidebar</span>
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex">
            <div class="flex items-center justify-center"><span class="text-white font-bold">Trial Management System</span></div>
          </div>
          <div class="ml-4 flex items-center md:ml-6">
            <button @click="toggleTheme" class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <svg v-if="!isDark" class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8 0 1010.586 10.586z" /></svg>
              <svg v-else class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM5 8a1 1 0 100-2H4a1 1 0 000 2h1z" clip-rule="evenodd" /></svg>
            </button>
            <NuxtLink to="/notificaciones" class="p-1 ml-3 rounded-full text-gray-400 hover:text-gray-500 relative">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m10 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span v-if="notificacionesStore.unreadCount > 0" class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </NuxtLink>
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div>
                <button @click="showUserMenu = !showUserMenu" class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                    {{ authStore.user?.nombre?.[0]?.toUpperCase() || 'U' }}
                  </div>
                </button>
              </div>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <div v-show="showUserMenu" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <div class="px-4 py-2 text-sm text-gray-700">{{ authStore.userRole }}</div>
                  <a @click="authStore.logout(); navigateTo('/login'); showUserMenu = false" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar sesión</a>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div v-if="showOfflineNotice" class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
              <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-center transform transition-all duration-300 hover:scale-[1.02]">
                <div class="flex flex-col items-center">
                  <!-- Icono de antena desconectada con animación de pulso lento -->
                  <div class="h-20 w-20 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-500 mb-6 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-3.536 5 5 0 011.414-3.536m0 0L11.314 11.3M3 3l18 18" />
                    </svg>
                  </div>
                  
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Sección no disponible sin conexión
                  </h2>
                  <p class="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Esta página requiere conexión activa a internet. En modo offline, puedes seguir registrando mediciones en campo para los ensayos descargados previamente.
                  </p>
                </div>

                <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <NuxtLink
                    to="/mediciones"
                    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 shadow-md hover:shadow-indigo-500/20"
                  >
                    <span class="absolute left-0 inset-y-0 flex items-center pl-3 text-indigo-500 group-hover:text-indigo-400">
                      <!-- Flecha hacia adelante -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                    Ir a Mediciones Offline
                  </NuxtLink>
                </div>
              </div>
            </div>
            
            <slot v-else />
          </div>
        </div>
      </main>
    </div>
    <TheToast />
    <OfflineIndicator />
    <WorkflowAssistant v-if="authStore.isAuthenticated" />
  </div>
</template>
