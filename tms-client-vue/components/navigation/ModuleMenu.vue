<template>
  <nav class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between py-4">
        <!-- Hamburger Button -->
        <button
          @click="isOpen = !isOpen"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :title="isOpen ? 'Cerrar menú' : 'Abrir menú'"
        >
          <svg
            class="w-6 h-6 text-gray-700 dark:text-gray-300 transition-transform duration-300"
            :style="{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Menu Label -->
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 ml-4">Navegación</span>
      </div>

      <!-- Dropdown Menu (visible when isOpen) -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 -translate-y-2"
        enter-to-class="transform opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 -translate-y-2"
      >
        <div
          v-show="isOpen"
          class="pb-4 border-t border-gray-200 dark:border-gray-700 mt-4 space-y-1"
        >
          <!-- Principal Section -->
          <div v-if="hasAccess('dashboard')" class="px-2 py-1">
            <NuxtLink
              to="/"
              @click="isOpen = false"
              class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors"
              :class="[
                isActive('/')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <span class="text-lg">📊</span>
              <span>Dashboard</span>
            </NuxtLink>
          </div>

          <div v-if="hasAccess('ensayos')" class="px-2 py-1">
            <NuxtLink
              to="/ensayos"
              @click="isOpen = false"
              class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors"
              :class="[
                isActive('/ensayos')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <span class="text-lg">🌾</span>
              <span>Ensayos</span>
            </NuxtLink>
          </div>

          <!-- Mediciones Section -->
          <div v-if="hasMedicionesAccess" class="px-2 py-1">
            <button
              @click="expandedSections.mediciones = !expandedSections.mediciones"
              class="w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span class="flex items-center gap-3">
                <span class="text-lg">📱</span>
                <span>Mediciones</span>
              </span>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :style="{ transform: expandedSections.mediciones ? 'rotate(180deg)' : 'rotate(0deg)' }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 -translate-y-2"
              enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-2"
            >
              <div v-show="expandedSections.mediciones" class="pl-8 space-y-1 mt-1">
                <NuxtLink
                  to="/bloques"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📐 Bloques y Parcelas
                </NuxtLink>
                <NuxtLink
                  to="/mediciones"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📊 Mediciones
                </NuxtLink>
                <NuxtLink
                  to="/protocolos"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📋 Protocolos y Tratamientos
                </NuxtLink>
                <NuxtLink
                  to="/tipos-ensayo"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🔬 Tipos de Ensayo
                </NuxtLink>
                <NuxtLink
                  to="/siembra"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🌱 Siembra
                </NuxtLink>
                <NuxtLink
                  to="/cosecha"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🗂️ Cosecha
                </NuxtLink>
              </div>
            </transition>
          </div>

          <div v-if="hasAccess('reportes')" class="px-2 py-1">
            <NuxtLink
              to="/reportes"
              @click="isOpen = false"
              class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors"
              :class="[
                isActive('/reportes')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <span class="text-lg">📈</span>
              <span>Reportes</span>
            </NuxtLink>
          </div>

          <!-- Catálogos Section -->
          <div v-if="hasCatalogosAccess" class="px-2 py-1">
            <button
              @click="expandedSections.catalogos = !expandedSections.catalogos"
              class="w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span class="flex items-center gap-3">
                <span class="text-lg">📚</span>
                <span>Catálogos</span>
              </span>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :style="{ transform: expandedSections.catalogos ? 'rotate(180deg)' : 'rotate(0deg)' }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 -translate-y-2"
              enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-2"
            >
              <div v-show="expandedSections.catalogos" class="pl-8 space-y-1 mt-1">
                <NuxtLink
                  to="/catalogos/cultivos"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🌾 Cultivos
                </NuxtLink>
                <NuxtLink
                  to="/catalogos/variedades"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🌱 Variedades
                </NuxtLink>
                <NuxtLink
                  to="/catalogos/tipos-ensayo"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🔬 Tipos de Ensayo
                </NuxtLink>
                <NuxtLink
                  to="/catalogos/tipos-siembra"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🌱 Tipos de Siembra
                </NuxtLink>
              </div>
            </transition>
          </div>

          <!-- Admin Section -->
          <div v-if="hasAdminAccess" class="px-2 py-1">
            <button
              @click="expandedSections.admin = !expandedSections.admin"
              class="w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span class="flex items-center gap-3">
                <span class="text-lg">⚙️</span>
                <span>Admin</span>
              </span>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :style="{ transform: expandedSections.admin ? 'rotate(180deg)' : 'rotate(0deg)' }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 -translate-y-2"
              enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-2"
            >
              <div v-show="expandedSections.admin" class="pl-8 space-y-1 mt-1">
                <NuxtLink
                  v-if="hasAccess('productos')"
                  to="/admin/productos"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🏭 Productos
                </NuxtLink>
                <NuxtLink
                  v-if="hasAccess('laboratorios')"
                  to="/admin/laboratorios"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🏭 Laboratorios
                </NuxtLink>
                <NuxtLink
                  v-if="hasAccess('usuarios')"
                  to="/admin/usuarios"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  👥 Usuarios
                </NuxtLink>
                <NuxtLink
                  v-if="hasAccess('roles')"
                  to="/admin/roles"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🔐 Roles
                </NuxtLink>
                <NuxtLink
                  v-if="hasAccess('permisos')"
                  to="/admin/permisos"
                  @click="isOpen = false"
                  class="block px-4 py-2 text-sm rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🔑 Permisos
                </NuxtLink>
              </div>
            </transition>
          </div>

          <div v-if="hasAccess('notificaciones')" class="px-2 py-1">
            <NuxtLink
              to="/notificaciones"
              @click="isOpen = false"
              class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors"
              :class="[
                isActive('/notificaciones')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <span class="text-lg">🔔</span>
              <span>Notificaciones</span>
            </NuxtLink>
          </div>

          <div v-if="hasAccess('settings')" class="px-2 py-1">
            <NuxtLink
              to="/settings"
              @click="isOpen = false"
              class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors"
              :class="[
                isActive('/settings')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <span class="text-lg">⚙️</span>
              <span>Configuración</span>
            </NuxtLink>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Estado del menú
const isOpen = ref(false)
const expandedSections = ref({
  mediciones: false,
  catalogos: false,
  admin: false,
})

// Definir todos los módulos disponibles con sus roles
const allModules = {
  dashboard: {
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio', 'Analista'],
  },
  ensayos: {
    roles: ['Superadministrador', 'Administrador', 'Investigador'],
  },
  bloques: {
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio'],
  },
  mediciones: {
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio'],
  },
  protocolos: {
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio'],
  },
  siembra: {
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio'],
  },
  cosecha: {
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio'],
  },
  reportes: {
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Analista'],
  },
  cultivos: {
    roles: ['Superadministrador', 'Administrador', 'Investigador'],
  },
  variedades: {
    roles: ['Superadministrador', 'Administrador', 'Investigador'],
  },
  productos: {
    roles: ['Superadministrador', 'Administrador', 'Manager'],
  },
  laboratorios: {
    roles: ['Superadministrador', 'Administrador'],
  },
  usuarios: {
    roles: ['Superadministrador', 'Administrador'],
  },
  roles: {
    roles: ['Superadministrador'],
  },
  permisos: {
    roles: ['Superadministrador'],
  },
  settings: {
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio', 'Analista'],
  },
  notificaciones: {
    roles: ['Superadministrador', 'Administrador', 'Investigador', 'Técnico de Laboratorio', 'Analista'],
  },
}

// Verificar si el usuario tiene acceso a un módulo específico
const hasAccess = (moduleId: string): boolean => {
  const userRole = authStore.userRole
  const module = allModules[moduleId as keyof typeof allModules]
  if (!module) return false
  return module.roles.includes(userRole)
}

// Verificar si hay acceso a algún módulo del grupo Mediciones
const hasMedicionesAccess = computed(() => {
  return (
    hasAccess('bloques') ||
    hasAccess('mediciones') ||
    hasAccess('protocolos') ||
    hasAccess('siembra') ||
    hasAccess('cosecha')
  )
})

// Verificar si hay acceso a algún módulo del grupo Catálogos
const hasCatalogosAccess = computed(() => {
  return (
    hasAccess('cultivos') ||
    hasAccess('variedades')
  )
})

// Verificar si hay acceso a algún módulo del grupo Admin
const hasAdminAccess = computed(() => {
  return (
    hasAccess('productos') ||
    hasAccess('laboratorios') ||
    hasAccess('usuarios') ||
    hasAccess('roles') ||
    hasAccess('permisos')
  )
})

// Verificar si la ruta actual está activa
const isActive = (href: string) => {
  return route.path === href || (href !== '/' && route.path.startsWith(href))
}
</script>

<style scoped>
/* Transiciones manejadas por Vue */
</style>

