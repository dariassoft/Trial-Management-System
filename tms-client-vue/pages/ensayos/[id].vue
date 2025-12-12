<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ ensayo?.nombreEnsayo || 'Cargando...' }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Detalles del ensayo</p>
      </div>
      <div class="flex gap-2">
        <NuxtLink
          v-if="!$route.path.endsWith('/edit')"
          :to="`/ensayos/${id}/edit`"
          class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 font-medium"
        >
          ✏️ Editar
        </NuxtLink>
        <button
          @click="openDeleteDialog"
          class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 font-medium"
        >
          🗑️ Eliminar
        </button>
        <button
          @click="$router.back()"
          class="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          ← Atrás
        </button>
      </div>
    </div>
    <!-- Mensajes -->
    <div v-if="errorMessage" class="rounded-lg bg-red-50 dark:bg-red-900 p-4 text-red-800 dark:text-red-200">
      ✗ {{ errorMessage }}
    </div>

    <NuxtPage :ensayo="ensayo" :loading="loading" />

    <!-- Diálogo de eliminación -->
    <DeleteConfirm
      v-if="showDeleteDialog"
      :is-open="showDeleteDialog"
      :title="`¿Eliminar ensayo '${ensayo?.nombreEnsayo}'?`"
      message="Esta acción eliminará permanentemente el ensayo y todos sus datos asociados."
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEnsayosStore } from '~/stores/ensayos'
import DeleteConfirm from '~/components/ensayos/DeleteConfirm.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const router = useRouter()
const route = useRoute()
const ensayosStore = useEnsayosStore()
const id = route.params.id as string

// --- STATE ---
// Hacer que el estado local sea reactivo al estado del store
const ensayo = computed(() => ensayosStore.currentEnsayo)
const loading = computed(() => ensayosStore.loading)
const errorMessage = ref('')
const showDeleteDialog = ref(false)

// --- ACTIONS ---
const loadEnsayo = async () => {
  try {
    await ensayosStore.fetchEnsayoById(id)
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Error al cargar el ensayo'
  }
}

const openDeleteDialog = () => {
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await ensayosStore.deleteEnsayo(id)
    showDeleteDialog.value = false
    router.push('/ensayos')
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Error al eliminar el ensayo'
  }
}

// --- LIFECYCLE ---
useHead({
  title: computed(() => `${ensayo.value?.nombreEnsayo || 'Ensayo'} - TMS`),
})

onMounted(() => {
  loadEnsayo()
})
</script>
