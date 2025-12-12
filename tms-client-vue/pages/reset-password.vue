<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'
import { useAuthStore } from '~/stores/auth'
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'blank',
  middleware: 'auth',
})

const { isDark, toggleTheme } = useTheme()
const authStore = useAuthStore()
const email = ref('')
const step = ref<'email' | 'code' | 'password'>('email')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const newPassword = ref('')
const confirmPassword = ref('')
const resetCode = ref('')

onMounted(() => {
  useTheme().initializeTheme()
  // Si ya está autenticado, redirigir
  if (authStore.isAuthenticated) {
    navigateTo('/')
  }
})

const handleSendEmail = async () => {
  if (!email.value) {
    error.value = 'Por favor ingresa tu email'
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  try {
    // TODO: Implementar endpoint de reset password en el backend
    await authStore.resetPassword(email.value)
    success.value = 'Se ha enviado un código de confirmación a tu email'
    step.value = 'code'
  } catch (err: any) {
    error.value = err.data?.message || 'Error al enviar el código'
  } finally {
    loading.value = false
  }
}

const handleVerifyCode = () => {
  if (!resetCode.value) {
    error.value = 'Por favor ingresa el código'
    return
  }
  error.value = null
  success.value = null
  step.value = 'password'
}

const handleResetPassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (newPassword.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  try {
    // TODO: Implementar endpoint de actualización de contraseña
    console.log('Reseteando contraseña para:', email.value)
    success.value = 'Contraseña actualizada exitosamente. Redirigiendo al login...'
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)
  } catch (err: any) {
    error.value = err.data?.message || 'Error al resetear la contraseña'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  step.value = 'email'
  error.value = null
  success.value = null
  resetCode.value = ''
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
          Recuperar Contraseña
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Restablecer tu contraseña de acceso
        </p>
      </div>

      <!-- Reset Card -->
      <div class="card">
        <!-- Step 1: Email -->
        <form v-if="step === 'email'" @submit.prevent="handleSendEmail" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input-base"
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary"
          >
            {{ loading ? 'Enviando...' : 'Enviar código de confirmación' }}
          </button>
        </form>

        <!-- Step 2: Verify Code -->
        <form v-if="step === 'code'" @submit.prevent="handleVerifyCode" class="space-y-6">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Se ha enviado un código a <strong>{{ email }}</strong>
            </p>
            <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código de confirmación
            </label>
            <input
              id="code"
              v-model="resetCode"
              type="text"
              class="input-base"
              placeholder="123456"
              required
            />
          </div>

          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
          </div>

          <button
            type="submit"
            class="w-full btn-primary"
          >
            Verificar código
          </button>
        </form>

        <!-- Step 3: New Password -->
        <form v-if="step === 'password'" @submit.prevent="handleResetPassword" class="space-y-6">
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva Contraseña
            </label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              class="input-base"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="input-base"
              placeholder="••••••••"
              required
            />
          </div>

          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
          </div>

          <div v-if="success" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p class="text-sm text-green-700 dark:text-green-400">{{ success }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary"
          >
            {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
          </button>
        </form>

        <!-- Navigation -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm text-center">
          <div>
            <button
              v-if="step !== 'email'"
              @click="goBack"
              class="text-primary-600 hover:text-primary-700 font-semibold"
            >
              ← Volver
            </button>
          </div>
          <div>
            <NuxtLink to="/login" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 font-semibold">
              Volver al login
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

