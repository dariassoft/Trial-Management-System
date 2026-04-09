<template>
  <div>
    <!-- Mobile Menu (Drawer) -->
    <div v-if="menuStore.isOpen" class="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true">
      <transition
        enter-active-class="transition-opacity ease-linear duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-linear duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="menuStore.close()"></div>
      </transition>

      <transition
        enter-active-class="transition ease-in-out duration-300 transform"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition ease-in-out duration-300 transform"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button @click="menuStore.close()" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span class="sr-only">Close sidebar</span>
              <svg class="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div class="flex-shrink-0 flex items-center px-4">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center"><span class="text-white font-bold">TMS</span></div>
              <span class="ml-3 text-xl font-bold text-gray-900 dark:text-white">TMS</span>
            </div>
            <nav class="mt-5 px-2 space-y-1">
              <NavLinks />
            </nav>
          </div>
        </div>
      </transition>
      <div class="flex-shrink-0 w-14"></div>
    </div>

    <!-- Desktop Menu (Permanent) -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64">
        <div class="flex flex-col h-0 flex-1">
          <div class="flex items-center h-16 flex-shrink-0 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
             <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center"><span class="text-white font-bold">TMS</span></div>
             <span class="ml-3 text-xl font-bold text-gray-900 dark:text-white">TMS</span>
          </div>
          <div class="flex-1 flex flex-col overflow-y-auto">
            <nav class="flex-1 px-2 py-4 bg-white dark:bg-gray-800 space-y-1">
              <NavLinks />
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '~/stores/menu'
import NavLinks from './NavLinks.vue'

const menuStore = useMenuStore()
</script>
