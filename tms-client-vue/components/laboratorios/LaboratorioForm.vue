<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Editar Laboratorio' : 'Nuevo Laboratorio' }}
          </h2>
          <button
            @click="cerrar"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="guardar" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del Laboratorio *
            </label>
            <input
              v-model="form.nombre"
              type="text"
              placeholder="Ej: ACME Agro Labs"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p v-if="errors.nombre" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.nombre }}</p>
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              v-model="form.descripcion"
              rows="3"
              placeholder="Describe el laboratorio..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <!-- Dirección, Teléfono, Email -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dirección
              </label>
              <input
                v-model="form.direccion"
                type="text"
                placeholder="Calle y número"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                v-model="form.telefono"
                type="tel"
                placeholder="Ej: 3875789133"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Email y Contacto -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="lab@example.com"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contacto (Persona)
              </label>
              <input
                v-model="form.contacto"
                type="text"
                placeholder="Ing. Juan Pérez"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Estado Activo -->
          <div class="flex items-center gap-2">
            <input
              id="activo"
              v-model="form.esta_activo"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label for="activo" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Laboratorio activo
            </label>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="cerrar"
              class="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
            >
              {{ loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Laboratorio } from '~/stores/laboratorios'

const props = defineProps<{
  laboratorio: Laboratorio | null
}>()

const emit = defineEmits<{
  guardar: [data: Laboratorio]
  cerrar: []
}>()

const loading = ref(false)
const form = ref<Laboratorio>({
  nombre: '',
  descripcion: null,
  direccion: null,
  telefono: null,
  email: null,
  contacto: null,
  esta_activo: true,
})
const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.laboratorio?.id)

watch(
  () => props.laboratorio,
  (newVal) => {
    if (newVal) {
      form.value = {
        nombre: newVal.nombre,
        descripcion: newVal.descripcion || null,
        direccion: newVal.direccion || null,
        telefono: newVal.telefono || null,
        email: newVal.email || null,
        contacto: newVal.contacto || null,
        esta_activo: newVal.esta_activo ?? true,
      }
    } else {
      form.value = {
        nombre: '',
        descripcion: null,
        direccion: null,
        telefono: null,
        email: null,
        contacto: null,
        esta_activo: true,
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

function validar() {
  errors.value = {}

  if (!form.value.nombre) {
    errors.value.nombre = 'El nombre es requerido'
  }

  if (form.value.nombre && form.value.nombre.length > 100) {
    errors.value.nombre = 'El nombre no puede exceder 100 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

function guardar() {
  if (!validar()) return

  loading.value = true
  try {
    // No enviar id en el payload, solo en el evento
    const { id, ...dataToSend } = form.value
    emit('guardar', {
      ...dataToSend,
      id: isEditing.value ? props.laboratorio!.id : undefined,
    })
  } finally {
    loading.value = false
  }
}

function cerrar() {
  emit('cerrar')
}
</script>

