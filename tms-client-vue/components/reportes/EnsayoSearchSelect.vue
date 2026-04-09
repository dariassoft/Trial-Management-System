<template>
  <div class="relative" ref="root">
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      🌾 Seleccionar Ensayo
    </label>
    <input
      type="text"
      v-model="searchTerm"
      @focus="isDropdownVisible = true"
      @input="handleInput"
      placeholder="Buscar por nombre de ensayo..."
      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div
      v-if="isDropdownVisible && (isLoading || (options && options.length > 0))"
      class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
    >
      <ul>
        <li v-if="isLoading" class="px-4 py-2 text-gray-500 dark:text-gray-400">Buscando...</li>
        <li
          v-for="option in options"
          :key="option.id"
          @click="selectOption(option)"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          {{ `Ensayo #${option.id} - ${option.nombreEnsayo}` }}
        </li>
      </ul>
    </div>
    <p v-if="!isLoading && searchTerm.length >= 3 && options && options.length === 0" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      No se encontraron ensayos con ese nombre.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useEnsayosStore } from '~/stores/ensayos';
import type { Ensayo } from '~/entities/ensayo.entity';

const emit = defineEmits(['update:modelValue']);

const ensayosStore = useEnsayosStore();
const searchTerm = ref('');
const options = ref<Partial<Ensayo>[] | null>([]);
const isLoading = ref(false);
const isDropdownVisible = ref(false);
const root = ref<HTMLElement | null>(null);

// Manual implementation of onClickOutside
const handleClickOutside = (event: MouseEvent) => {
  if (root.value && !root.value.contains(event.target as Node)) {
    isDropdownVisible.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});


let debounceTimer: ReturnType<typeof setTimeout>;

const handleInput = () => {
  clearTimeout(debounceTimer);
  if (searchTerm.value.length >= 3) {
    isLoading.value = true;
    isDropdownVisible.value = true;
    debounceTimer = setTimeout(async () => {
      await search();
    }, 500);
  } else {
    options.value = [];
    isDropdownVisible.value = false;
  }
};

const search = async () => {
  if (searchTerm.value.length < 3) {
    options.value = [];
    isLoading.value = false;
    return;
  }
  try {
    options.value = await ensayosStore.fetchEnsayosForSelect(searchTerm.value);
  } catch (error) {
    console.error('Error fetching ensayos:', error);
    options.value = [];
  } finally {
    isLoading.value = false;
  }
};

const selectOption = (option: Partial<Ensayo>) => {
  if (option && option.id) {
    searchTerm.value = `Ensayo #${option.id} - ${option.nombreEnsayo}`;
    emit('update:modelValue', option.id);
    isDropdownVisible.value = false;
  }
};
</script>
