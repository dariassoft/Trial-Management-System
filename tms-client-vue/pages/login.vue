<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useTheme } from '~/composables/useTheme'
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'blank',
  middleware: 'auth',
})

const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  useTheme().initializeTheme()
  // Si ya está autenticado, redirigir
  if (authStore.isAuthenticated) {
    navigateTo('/')
  }
})

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  loading.value = true
  error.value = null

  try {
    await authStore.login(username.value, password.value)
    // Login exitoso, redirigir
    navigateTo('/')
  } catch (err: any) {
    // Error en login, mostrar mensaje y mantener en login
    error.value = authStore.error || 'Error al iniciar sesión. Por favor intenta de nuevo'
    loading.value = false
  }
}

// Demo credentials
const fillDemo = () => {
  username.value = 'dariassoft@gmail.com'
  password.value = '123456'
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="flex justify-center items-center gap-3 mb-4">
          <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span class="text-3xl text-white font-bold">TMS</span>
          </div>
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-primary-200 dark:hover:bg-gray-700 transition-colors absolute top-4 right-4"
            :title="isDark ? 'Light mode' : 'Dark mode'"
          >
            <svg v-if="!isDark" class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <svg v-else class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM5 8a1 1 0 100-2H4a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bienvenido a TMS
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Sistema de Gestión de Ensayos Agronómicos
        </p>
      </div>

      <!-- Login Card -->
      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Input -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              id="username"
              v-model="username"
              type="email"
              class="input-base"
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="input-base"
              placeholder="••••••••"
              required
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>

          <!-- Demo Credentials -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">Credenciales de demo:</p>
            <button
              type="button"
              @click="fillDemo"
              class="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Usar credenciales de prueba
            </button>
          </div>
        </form>

        <!-- Links -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm text-center">
          <div>
            <NuxtLink to="/reset-password" class="text-primary-600 hover:text-primary-700 font-semibold">
              ¿Olvidaste tu contraseña?
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-gray-600 dark:text-gray-400 mt-8">
        &copy; 2024 Trial Management System. All rights reserved.
      </p>
    </div>
  </div>
</template>

