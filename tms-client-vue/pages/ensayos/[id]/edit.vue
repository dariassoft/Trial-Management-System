<template>
  <div class="grid gap-6">
    <!-- El componente TheToast se encargará de mostrar las notificaciones -->
    <EnsayoForm
      :initial-data="ensayo"
      :is-editing="true"
      :loading="loading"
      @submit="handleUpdate"
      @cancel="$router.back()"
    />

    <!-- Bloques y Parcelas -->
    <div v-if="ensayo" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Diseño Experimental</h2>
      <BloquesList :ensayo-id="Number(ensayo.id)" :ensayo="ensayo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEnsayosStore, type Ensayo } from '~/stores/ensayos'
import EnsayoForm from '~/components/ensayos/EnsayoForm.vue'
import BloquesList from '~/components/bloques/BloquesList.vue'
import { useNotifications } from '~/composables/useNotifications'

// --- PROPS ---
const props = defineProps<{
  ensayo: Ensayo | null
  loading: boolean
}>()
const { ensayo } = toRefs(props)

// --- STORES & COMPOSABLES ---
const ensayosStore = useEnsayosStore()
const { showNotification } = useNotifications()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string

// --- FUNCTIONS ---
const handleUpdate = async (ensayoData: Partial<Ensayo>) => {
  try {
    // El payload ya se arma correctamente en EnsayoForm,
    // simplemente lo pasamos a la acción del store.
    await ensayosStore.updateEnsayo(id, ensayoData)
    
    showNotification('Ensayo guardado correctamente.', 'success')
    
    // Redirigir a la vista de detalle después de un breve retraso
    setTimeout(() => {
      router.push(`/ensayos/${id}`)
    }, 1500)

  } catch (e: any) {
    showNotification(e.message || 'Ocurrió un error al guardar el ensayo.', 'error')
  }
}
</script>
