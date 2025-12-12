<template>
  <nav class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-wrap gap-2 py-4">
        <!-- Modules based on user role -->
        <NuxtLink
          v-for="module in availableModules"
          :key="module.id"
          :to="module.href"
          class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          :class="[
            isActive(module.href)
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <span class="text-lg">{{ module.icon }}</span>
          <span>{{ module.name }}</span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Definir módulos disponibles
const allModules = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: '📊',
    href: '/',
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio', 'Analista'],
  },
  {
    id: 'ensayos',
    name: 'Ensayos',
    icon: '🌾',
    href: '/ensayos',
    roles: ['Superadministrador', 'Administrador', 'Investigador'],
  },
  {
    id: 'protocolos',
    name: 'Protocolos y Tratamientos',
    icon: '📋',
    href: '/protocolos',
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio'],
  },
  {
    id: 'parcelas',
    name: 'Parcelas',
    icon: '📍',
    href: '/parcelas',
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio'],
  },
  {
    id: 'datos-campo',
    name: 'Datos de Campo',
    icon: '📝',
    href: '/datos-campo',
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio'],
  },
  {
    id: 'laboratorios',
    name: 'Laboratorios',
    icon: '🔬',
    href: '/laboratorios',
    roles: ['Superadministrador', 'Administrador'],
  },
  {
    id: 'usuarios',
    name: 'Usuarios',
    icon: '👥',
    href: '/admin/usuarios',
    roles: ['Superadministrador'],
  },
  {
    id: 'reportes',
    name: 'Reportes',
    icon: '📈',
    href: '/reportes',
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Analista'],
  },
]

// Filtrar módulos según rol del usuario
const availableModules = computed(() => {
  const userRole = authStore.userRole
  return allModules.filter(module => module.roles.includes(userRole))
})

// Verificar si la ruta actual está activa
const isActive = (href: string) => {
  return route.path === href || (href !== '/' && route.path.startsWith(href))
}
</script>

<style scoped>
/* Transiciones suaves */
.router-link-active {
  @apply transition-all duration-200;
}
</style>

