<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useTheme } from '~/composables/useTheme'
import { ref, onMounted } from 'vue'
import ModuleMenu from '~/components/navigation/ModuleMenu.vue'
import TheToast from '~/components/common/TheToast.vue' // Importar el componente de Toast

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const showMenu = ref(false)

onMounted(() => {
  useTheme().initializeTheme()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Toast Notification -->
    <TheToast />

    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">TMS</span>
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">Trial Management System</span>
        </div>

        <!-- Navigation y User Menu -->
        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :title="isDark ? 'Light mode' : 'Dark mode'"
          >
            <svg v-if="!isDark" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8 0 1010.586 10.586z" />
            </svg>
            <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM5 8a1 1 0 100-2H4a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- User Menu -->
          <div class="relative">
            <button
              @click="showMenu = !showMenu"
              class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {{ authStore.user?.nombre?.[0]?.toUpperCase() || 'U' }}
              </div>
              <span class="text-sm text-gray-900 dark:text-white">{{ authStore.user?.nombre }}</span>
            </button>

            <!-- Dropdown -->
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-show="showMenu"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 z-10"
              >
                <div class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                  {{ authStore.userRole }}
                </div>
                <button
                  @click="authStore.logout(); navigateTo('/login'); showMenu = false"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Cerrar sesión
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Menu -->
    <ModuleMenu />

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
      <div class="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>&copy; 2024 Trial Management System. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
