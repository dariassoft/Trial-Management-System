<template>
  <div class="rounded-lg border border-gray-200 bg-white">
    <!-- Encabezado con acciones -->
    <div class="flex flex-col gap-4 border-b border-gray-200 p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ ensayo.nombreEnsayo }}</h2>
        <p class="mt-1 text-sm text-gray-600">
          Creado el {{ formatDateForDisplay(ensayo.createdAt) }}
        </p>
      </div>
      <div class="flex gap-2">
        <button
          @click="$emit('edit')"
          class="flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
        >
          ✏️ Editar
        </button>
        <button
          @click="$emit('delete')"
          class="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          🗑️ Eliminar
        </button>
        <button
          @click="$emit('back')"
          class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          ← Volver
        </button>
      </div>
    </div>

    <!-- Contenido en tabs -->
    <div>
      <!-- Tabs -->
      <div class="flex border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'flex-1 px-6 py-3 text-center font-medium',
            activeTab === tab
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Contenido de tabs -->
      <div class="p-6">
        <!-- Tab: Información General -->
        <div v-if="activeTab === 'Información'">
          <div class="grid gap-6 md:grid-cols-2">
            <!-- Información Básica -->
            <div>
              <h3 class="mb-4 font-semibold text-gray-800">Información Básica</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-xs font-medium text-gray-500">NOMBRE</label>
                  <p class="text-gray-900">{{ ensayo.nombreEnsayo }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500">VERSIÓN PROTOCOLO</label>
                  <p class="text-gray-900">{{ ensayo.versionProtocolo }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500">RESPONSABLE</label>
                  <p class="text-gray-900">{{ ensayo.responsable || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Ubicación -->
            <div>
              <h3 class="mb-4 font-semibold text-gray-800">Ubicación</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-xs font-medium text-gray-500">PROVINCIA</label>
                  <p class="text-gray-900">{{ ensayo.provincia }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500">DEPARTAMENTO</label>
                  <p class="text-gray-900">{{ ensayo.departamento }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500">ESTABLECIMIENTO</label>
                  <p class="text-gray-900">{{ ensayo.establecimiento || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Más Ubicación -->
            <div>
              <h3 class="mb-4 font-semibold text-gray-800">Más Detalles de Ubicación</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-xs font-medium text-gray-500">LOTE</label>
                  <p class="text-gray-900">{{ ensayo.lote || '-' }}</p>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-xs font-medium text-gray-500">LATITUD</label>
                    <p class="text-gray-900">{{ ensayo.latitud || '-' }}</p>
                  </div>
                  <div>
                    <label class="text-xs font-medium text-gray-500">LONGITUD</label>
                    <p class="text-gray-900">{{ ensayo.longitud || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cultivo -->
            <div>
              <h3 class="mb-4 font-semibold text-gray-800">Cultivo</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-xs font-medium text-gray-500">ESPECIE</label>
                  <p class="text-gray-900">{{ ensayo.cultivoEspecie }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500">VARIEDAD</label>
                  <p class="text-gray-900">{{ ensayo.cultivoVariedad }}</p>
                </div>
              </div>
            </div>

            <!-- Siembra -->
            <div>
              <h3 class="mb-4 font-semibold text-gray-800">Siembra</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-xs font-medium text-gray-500">FECHA SIEMBRA</label>
                  <p class="text-gray-900">{{ formatDateForDisplay(ensayo.fechaSiembra) }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500">TIPO SIEMBRA</label>
                  <p class="text-gray-900">{{ ensayo.tipoSiembra || '-' }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500">DISTANCIA SURCOS</label>
                  <p class="text-gray-900">{{ ensayo.distSurcosCm || '-' }} cm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Aplicaciones (placeholder) -->
        <div v-else-if="activeTab === 'Aplicaciones'" class="text-center text-gray-500">
          <p class="py-8">Aplicaciones del ensayo (se implementará en próximas sesiones)</p>
        </div>

        <!-- Tab: Tratamientos (placeholder) -->
        <div v-else-if="activeTab === 'Tratamientos'" class="text-center text-gray-500">
          <p class="py-8">Tratamientos del ensayo (se implementará en próximas sesiones)</p>
        </div>

        <!-- Tab: Datos de Campo (placeholder) -->
        <div v-else-if="activeTab === 'Datos de Campo'" class="text-center text-gray-500">
          <p class="py-8">Datos de campo (se implementará en próximas sesiones)</p>
        </div>

        <!-- Tab: Cosecha (placeholder) -->
        <div v-else-if="activeTab === 'Cosecha'" class="text-center text-gray-500">
          <p class="py-8">Datos de cosecha (se implementará en próximas sesiones)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ensayo } from '~/stores/ensayos'
import { useEnsayos } from '~/composables/useEnsayos'

defineProps<{
  ensayo: Ensayo
}>()

defineEmits<{
  edit: []
  delete: []
  back: []
}>()

const { formatDateForDisplay } = useEnsayos()

const tabs = ['Información', 'Aplicaciones', 'Tratamientos', 'Datos de Campo', 'Cosecha']
const activeTab = ref('Información')
</script>

