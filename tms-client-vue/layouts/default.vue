<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useTheme } from '~/composables/useTheme'
import { useNotificacionesStore } from '~/stores/notificaciones'
import { useMenuStore } from '~/stores/menu'
import { ref, onMounted, onUnmounted } from 'vue'
import SideMenu from '~/components/navigation/SideMenu.vue'
import TheToast from '~/components/common/TheToast.vue'
import OfflineIndicator from '~/components/common/OfflineIndicator.vue'

const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const notificacionesStore = useNotificacionesStore()
const menuStore = useMenuStore()
const showUserMenu = ref(false)
let pollInterval: ReturnType<typeof setInterval> | null = null

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
            <!-- You can add a search bar here if needed -->
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
            <slot />
          </div>
        </div>
      </main>
    </div>
    <TheToast />
    <OfflineIndicator />
  </div>
</template>
