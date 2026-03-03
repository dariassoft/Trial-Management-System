<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Crear Nuevo Ensayo</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Completa el formulario para registrar un nuevo ensayo</p>
      </div>
      <button
        @click="$router.back()"
        class="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        ← Atrás
      </button>
    </div>

    <!-- Formulario -->
    <EnsayoForm
      :is-editing="false"
      @submit="handleSubmit"
      @cancel="$router.back()"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useEnsayosStore, type Ensayo } from '~/stores/ensayos'
import EnsayoForm from '~/components/ensayos/EnsayoForm.vue'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

useHead({
  title: 'Nuevo Ensayo - TMS',
})

const router = useRouter()
const ensayosStore = useEnsayosStore()
const { showNotification } = useNotifications()

const handleSubmit = async (ensayoData: Partial<Ensayo>) => {
  try {
    await ensayosStore.createEnsayo(ensayoData)
    
    showNotification('Ensayo creado correctamente.', 'success')

    setTimeout(() => {
      router.push('/ensayos')
    }, 1500)
    
  } catch (error: any) {
    console.error('Error al crear ensayo:', error)
    showNotification(error.data?.message || error.message || 'Error al crear ensayo', 'error')
  }
}
</script>
