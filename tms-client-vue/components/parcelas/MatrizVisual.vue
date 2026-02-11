<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        📊 Visualización de Matriz
      </h4>
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ filasTotal }} filas × {{ columnasTotal }} columnas
      </span>
    </div>

    <!-- Leyenda -->
    <div class="flex gap-3 text-xs">
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded border border-gray-400"></div>
        <span class="text-gray-600 dark:text-gray-400">Disponible</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-blue-500 rounded border border-blue-600"></div>
        <span class="text-gray-600 dark:text-gray-400">Seleccionada</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-red-500 rounded border border-red-600"></div>
        <span class="text-gray-600 dark:text-gray-400">Ocupada</span>
      </div>
    </div>

    <!-- Matriz Grid -->
    <div
      class="inline-block p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
      :style="{ display: 'grid', gridTemplateColumns: `repeat(${columnasTotal}, 1fr)`, gap: '4px' }"
    >
      <button
        v-for="celda in celdas"
        :key="`${celda.x}-${celda.y}`"
        type="button"
        @click="!celda.ocupada && seleccionarCelda(celda.x, celda.y)"
        :disabled="celda.ocupada"
        :title="celda.ocupada ? `Posición (${celda.x}, ${celda.y}) - OCUPADA` : `Posición (${celda.x}, ${celda.y})`"
        :class="[
          'w-10 h-10 rounded text-xs font-semibold transition',
          'border-2',
          celda.ocupada
            ? 'bg-red-600 text-white border-red-700 cursor-not-allowed'
            : celda.seleccionada
            ? 'bg-blue-500 text-white border-blue-600 font-bold cursor-pointer'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-500 hover:bg-gray-400 dark:hover:bg-gray-500 cursor-pointer'
        ]"
      >
        <span class="text-xs">{{ celda.x }}</span>
        <span class="text-xs block leading-none">{{ celda.y }}</span>
      </button>
    </div>

    <!-- Info -->
    <div v-if="!posXSeleccionada || !posYSeleccionada" class="text-xs text-gray-500 dark:text-gray-400">
      💡 Haz clic en una celda para seleccionar la posición
    </div>
    <div v-else class="text-xs text-blue-600 dark:text-blue-400 font-medium">
      ✓ Posición seleccionada: X={{ posXSeleccionada }}, Y={{ posYSeleccionada }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  filas: number | null | undefined
  columnas: number | null | undefined
  posXSeleccionada: number | null | undefined
  posYSeleccionada: number | null | undefined
  parcelasOcupadas?: Array<{ x: number; y: number }> | null
}

interface Emits {
  (e: 'select', x: number, y: number): void
}

const props = withDefaults(defineProps<Props>(), {
  parcelasOcupadas: () => [],
})

const emit = defineEmits<Emits>()

const filasTotal = computed(() => props.filas || 0)
const columnasTotal = computed(() => props.columnas || 0)

const celdas = computed(() => {
  const resultado = []
  if (!filasTotal.value || !columnasTotal.value) return resultado

  console.log('🔹 MatrizVisual celdas computed:')
  console.log('   - filas:', filasTotal.value)
  console.log('   - columnas:', columnasTotal.value)
  console.log('   - parcelasOcupadas recibidas:', props.parcelasOcupadas)
  console.log('   - posX seleccionada:', props.posXSeleccionada)
  console.log('   - posY seleccionada:', props.posYSeleccionada)

  for (let y = 1; y <= filasTotal.value; y++) {
    for (let x = 1; x <= columnasTotal.value; x++) {
      const ocupada = (props.parcelasOcupadas || []).some(p => p.x === x && p.y === y)
      const seleccionada = x === props.posXSeleccionada && y === props.posYSeleccionada

      if (ocupada) {
        console.log(`   ✓ Celda (${x}, ${y}) está OCUPADA`)
      }

      resultado.push({
        x,
        y,
        ocupada,
        seleccionada,
      })
    }
  }

  console.log('   → Celdas calculadas:', resultado.length)
  return resultado
})

function seleccionarCelda(x: number, y: number) {
  emit('select', x, y)
}
</script>

