<template>
  <div>
    <!-- Principal Section -->
    <div v-if="hasAccess('dashboard')">
      <NuxtLink to="/" @click="closeMenu" :class="linkClasses('/')">
        <span class="text-lg">📊</span>
        <span>Dashboard</span>
      </NuxtLink>
    </div>

    <div v-if="hasAccess('ensayos')">
      <NuxtLink to="/ensayos" @click="closeMenu" :class="linkClasses('/ensayos')">
        <span class="text-lg">🌾</span>
        <span>Ensayos</span>
      </NuxtLink>
    </div>

    <!-- Mediciones Section -->
    <div v-if="hasMedicionesAccess">
      <button @click="toggleSection('mediciones')" :class="buttonClasses">
        <span class="flex items-center gap-3">
          <span class="text-lg">📱</span>
          <span>Mediciones</span>
        </span>
        <svg :class="arrowClasses(expandedSections.mediciones)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div v-show="expandedSections.mediciones" class="pl-8 space-y-1 mt-1">
        <NuxtLink to="/bloques" @click="closeMenu" :class="subLinkClasses('/bloques')">📐 Bloques y Parcelas</NuxtLink>
        <NuxtLink to="/mediciones" @click="closeMenu" :class="subLinkClasses('/mediciones')">📊 Mediciones</NuxtLink>
        <NuxtLink to="/protocolos" @click="closeMenu" :class="subLinkClasses('/protocolos')">📋 Protocolos</NuxtLink>
        <NuxtLink to="/tipos-ensayo" @click="closeMenu" :class="subLinkClasses('/tipos-ensayo')">🔬 Tipos de Ensayo</NuxtLink>
        <NuxtLink to="/siembra" @click="closeMenu" :class="subLinkClasses('/siembra')">🌱 Siembra</NuxtLink>
        <NuxtLink to="/cosecha" @click="closeMenu" :class="subLinkClasses('/cosecha')">🗂️ Cosecha</NuxtLink>
      </div>
    </div>

    <div v-if="hasAccess('reportes')">
      <NuxtLink to="/reportes" @click="closeMenu" :class="linkClasses('/reportes')">
        <span class="text-lg">📈</span>
        <span>Reportes</span>
      </NuxtLink>
    </div>

    <!-- Catálogos Section -->
    <div v-if="hasCatalogosAccess">
      <button @click="toggleSection('catalogos')" :class="buttonClasses">
        <span class="flex items-center gap-3">
          <span class="text-lg">📚</span>
          <span>Catálogos</span>
        </span>
        <svg :class="arrowClasses(expandedSections.catalogos)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div v-show="expandedSections.catalogos" class="pl-8 space-y-1 mt-1">
        <NuxtLink to="/catalogos/cultivos" @click="closeMenu" :class="subLinkClasses('/catalogos/cultivos')">🌾 Cultivos</NuxtLink>
        <NuxtLink to="/catalogos/variedades" @click="closeMenu" :class="subLinkClasses('/catalogos/variedades')">🌱 Variedades</NuxtLink>
        <NuxtLink to="/catalogos/tipos-ensayo" @click="closeMenu" :class="subLinkClasses('/catalogos/tipos-ensayo')">🔬 Tipos de Ensayo</NuxtLink>
        <NuxtLink to="/catalogos/tipos-siembra" @click="closeMenu" :class="subLinkClasses('/catalogos/tipos-siembra')">🌱 Tipos de Siembra</NuxtLink>
        <NuxtLink v-if="hasAccess('productos')" to="/admin/productos" @click="closeMenu" :class="subLinkClasses('/admin/productos')">🧪 Productos</NuxtLink>
        <NuxtLink v-if="hasAccess('laboratorios')" to="/admin/laboratorios" @click="closeMenu" :class="subLinkClasses('/admin/laboratorios')">🏭 Laboratorios</NuxtLink>
      </div>
    </div>

    <!-- Admin Section -->
    <div v-if="hasAdminAccess">
      <button @click="toggleSection('admin')" :class="buttonClasses">
        <span class="flex items-center gap-3">
          <span class="text-lg">⚙️</span>
          <span>Admin</span>
        </span>
        <svg :class="arrowClasses(expandedSections.admin)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div v-show="expandedSections.admin" class="pl-8 space-y-1 mt-1">
        <NuxtLink v-if="hasAccess('usuarios')" to="/admin/usuarios" @click="closeMenu" :class="subLinkClasses('/admin/usuarios')">👥 Usuarios</NuxtLink>
        <NuxtLink v-if="hasAccess('roles')" to="/admin/roles" @click="closeMenu" :class="subLinkClasses('/admin/roles')">🔐 Roles</NuxtLink>
        <NuxtLink v-if="hasAccess('permisos')" to="/admin/permisos" @click="closeMenu" :class="subLinkClasses('/admin/permisos')">🔑 Permisos</NuxtLink>
      </div>
    </div>

    <div v-if="hasAccess('notificaciones')">
      <NuxtLink to="/notificaciones" @click="closeMenu" :class="linkClasses('/notificaciones')">
        <span class="text-lg">🔔</span>
        <span>Notificaciones</span>
      </NuxtLink>
    </div>

    <div v-if="hasAccess('settings')">
      <NuxtLink to="/settings" @click="closeMenu" :class="linkClasses('/settings')">
        <span class="text-lg">⚙️</span>
        <span>Configuración</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useMenuStore } from '~/stores/menu'

const route = useRoute()
const authStore = useAuthStore()
const menuStore = useMenuStore()

const expandedSections = ref({
  mediciones: false,
  catalogos: false,
  admin: false,
})

const closeMenu = () => {
  if (window.innerWidth < 768) { // Only close on mobile
    menuStore.close()
  }
}

const toggleSection = (section: keyof typeof expandedSections.value) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

// Watch for route changes to auto-expand sections
watch(route, (newRoute) => {
  const path = newRoute.path
  expandedSections.value.mediciones = path.startsWith('/bloques') || path.startsWith('/mediciones') || path.startsWith('/protocolos') || path.startsWith('/siembra') || path.startsWith('/cosecha')
  expandedSections.value.catalogos = path.startsWith('/catalogos') || path.startsWith('/admin/productos') || path.startsWith('/admin/laboratorios')
  expandedSections.value.admin = path.startsWith('/admin/usuarios') || path.startsWith('/admin/roles') || path.startsWith('/admin/permisos')
}, { immediate: true })


// --- Access Control ---
const allModules = {
  dashboard: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico', 'Invitado'] },
  ensayos: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico'] },
  bloques: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico'] },
  mediciones: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico'] },
  protocolos: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico'] },
  siembra: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico'] },
  cosecha: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico'] },
  reportes: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico'] },
  cultivos: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico'] },
  variedades: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico'] },
  productos: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico'] },
  laboratorios: { roles: ['Superadministrador', 'Administrador', 'Manager'] },
  usuarios: { roles: ['Superadministrador', 'Administrador'] },
  roles: { roles: ['Superadministrador'] },
  permisos: { roles: ['Superadministrador'] },
  settings: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico', 'Invitado'] },
  notificaciones: { roles: ['Superadministrador', 'Administrador', 'Manager', 'Tecnico', 'Invitado'] },
}

const hasAccess = (moduleId: string): boolean => {
  const userRole = authStore.userRole
  const module = allModules[moduleId as keyof typeof allModules]
  return !!module && module.roles.includes(userRole)
}

const hasMedicionesAccess = computed(() => hasAccess('bloques') || hasAccess('mediciones') || hasAccess('protocolos') || hasAccess('siembra') || hasAccess('cosecha'))
const hasCatalogosAccess = computed(() => hasAccess('cultivos') || hasAccess('variedades') || hasAccess('productos') || hasAccess('laboratorios'))
const hasAdminAccess = computed(() => hasAccess('usuarios') || hasAccess('roles') || hasAccess('permisos'))

// --- Dynamic Classes ---
const isActive = (href: string) => route.path === href || (href !== '/' && route.path.startsWith(href))

const linkClasses = (href: string) => [
  'flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors w-full text-left',
  isActive(href)
    ? 'bg-blue-600 text-white'
    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
]

const subLinkClasses = (href: string) => [
  'block px-4 py-2 text-sm rounded-lg transition-colors',
  isActive(href)
    ? 'font-semibold text-blue-600 dark:text-blue-400'
    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
]

const buttonClasses = [
  'w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
]

const arrowClasses = (isExpanded: boolean) => [
  'w-5 h-5 transition-transform duration-200',
  isExpanded ? 'transform rotate-180' : ''
]
</script>
