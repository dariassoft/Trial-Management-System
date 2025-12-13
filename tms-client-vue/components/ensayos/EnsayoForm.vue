<template>
  <div class="grid gap-6">
    <!-- Use a combined loading state for the form -->
    <template v-if="!loading && !isLoadingDependentData">
      <form @submit.prevent="handleSubmit" class="grid gap-6">
        <!-- Información Básica -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Información Básica</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-medium mb-1">Nombre Ensayo *</label>
              <input v-model="form.nombreEnsayo" type="text" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200" required />
            </div>
            <div>
              <label class="block font-medium mb-1">Código Labor</label>
              <input v-model="form.codigoLabor" type="text" placeholder="26-BASF-0001-PRE-" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200" />
            </div>
            <div>
              <label class="block font-medium mb-1">Laboratorio</label>
              <select v-model="form.laboratorioId" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200">
                <option :value="null">Seleccionar</option>
                <option v-for="l in catalogosStore.laboratorios" :key="l.id" :value="l.id">{{ l.nombre }}</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Responsable</label>
              <select v-model="form.responsableId" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200">
                <option :value="null">Seleccionar</option>
                <option v-for="r in catalogosStore.usuarios" :key="r.id" :value="r.id">{{ r.nombre }} {{ r.apellido }}</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Protocolo</label>
              <select v-model="form.protocoloId" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200">
                <option :value="null">Seleccionar</option>
                <option v-for="p in catalogosStore.protocolos" :key="p.id" :value="p.id">{{ p.nombre }}</option>
              </select>
            </div>
            <div class="flex items-end gap-2">
              <div class="flex-grow">
                <label class="block font-medium mb-1">Tipo de Ensayo</label>
                <select v-model="form.tipoEnsayoId" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200">
                  <option :value="null">Seleccionar</option>
                  <option v-for="t in catalogosStore.tiposEnsayo" :key="t.id" :value="t.id">{{ t.nombre }}</option>
                </select>
              </div>
              <button
                v-if="selectedTipoEnsayo"
                @click.stop="showTipoEnsayoInfo"
                type="button"
                class="p-2 border rounded h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Ver información del tipo de ensayo"
                ref="tipoEnsayoButton"
              >
                ℹ️
              </button>
            </div>
          </div>

          <!-- Popover para Info de Tipo de Ensayo -->
          <div v-if="showInfo" ref="popover"
               class="fixed z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm"
               :style="popoverStyle">
            <h4 class="font-semibold mb-2">Protocolo para: {{ selectedTipoEnsayo?.nombre }}</h4>
            <div class="space-y-2 text-sm">
              <div>
                <h5 class="font-medium">Días de Evaluación (DDA):</h5>
                <p class="text-gray-700 dark:text-gray-300">{{ selectedTipoEnsayo?.evaluacionCsv || 'No definidos' }}</p>
              </div>
              <div>
                <h5 class="font-medium">Variables a Medir:</h5>
                <ul v-if="variablesInfo.length" class="list-disc list-inside space-y-1 mt-1">
                  <li v-for="v in variablesInfo" :key="v.id">
                    {{ v.nombre_variable }} <span v-if="v.unidad_medida" class="text-gray-500">({{ v.unidad_medida }})</span>
                  </li>
                </ul>
                <p v-else class="text-gray-500 mt-1">No hay variables definidas para este tipo de ensayo.</p>
              </div>
            </div>
            <button @click="showInfo = false" class="mt-4 w-full bg-blue-600 text-white py-1 text-sm rounded hover:bg-blue-700">
              Cerrar
            </button>
          </div>
        </div>

        <!-- Ubicación -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Ubicación</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-medium mb-1">Provincia</label>
              <select v-model="form.provincia" @change="onProvinciaChange" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200">
                <option :value="''">Seleccionar</option>
                <option v-for="p in catalogosStore.provincias" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Departamento</label>
              <select v-model="form.departamento" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200">
                <option :value="''">Seleccionar</option>
                <option v-for="d in departamentos" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Establecimiento</label>
              <input v-model="form.establecimiento" type="text" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200" />
            </div>
            <div>
              <label class="block font-medium mb-1">Lote</label>
              <input v-model="form.lote" type="text" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200" />
            </div>
            <div>
              <label class="block font-medium mb-1">Latitud</label>
              <input v-model.number="form.latitud" type="number" step="0.00000001" placeholder="-65.5113883" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200" />
            </div>
            <div>
              <label class="block font-medium mb-1">Longitud</label>
              <input v-model.number="form.longitud" type="number" step="0.00000001" placeholder="-65.5113883" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200" />
            </div>
            <div class="md:col-span-2">
              <button
                @click="fillGeolocation"
                :disabled="isGeolocating"
                type="button"
                class="w-full px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {{ isGeolocating ? 'Obteniendo ubicación...' : '📍 Obtener Geolocalización' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Cultivo -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Cultivo</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-medium mb-1">Cultivo/Especie</label>
              <select v-model="form.cultivoId" @change="onEspecieChange" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200">
                <option :value="null">Seleccionar</option>
                <option v-for="c in catalogosStore.cultivos" :key="c.id" :value="c.id">{{ c.nombre }}</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Variedad</label>
              <select v-model="form.variedadId" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200">
                <option :value="null">Seleccionar</option>
                <option v-for="v in variedades" :key="v.id" :value="v.id">{{ v.nombre }}</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Tipo de Siembra</label>
              <select v-model="form.tipoSiembraId" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200">
                <option :value="null">Seleccionar</option>
                <option v-for="ts in catalogosStore.tiposSiembra" :key="ts.id" :value="ts.id">{{ ts.nombre }}</option>
              </select>
            </div>
            <div>
              <label class="block font-medium mb-1">Distancia entre surcos (cm)</label>
              <input v-model.number="form.distSurcosCm" type="number" step="0.1" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200" />
            </div>
          </div>
        </div>

        <!-- Fechas -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Fechas</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block font-medium mb-1">Fecha de Inicio</label>
              <input v-model="form.fechaInicio" type="date" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200" />
            </div>
            <div>
              <label class="block font-medium mb-1">Fecha de Siembra</label>
              <input v-model="form.fechaSiembra" type="date" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200" />
            </div>
            <div>
              <label class="block font-medium mb-1">Fecha de Cosecha</label>
              <input v-model="form.fechaCosecha" type="date" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200" />
            </div>
          </div>
        </div>

        <!-- Estado -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Estado</h3>
          <div>
            <label class="block font-medium mb-1">Status</label>
            <select v-model.number="form.statusId" class="w-full border p-2 rounded dark:text-black dark:bg-gray-200">
              <option :value="null">Seleccionar Estado</option>
              <option v-for="s in catalogosStore.statusEnsayos" :key="s.id" :value="s.id">{{ s.nombre }}</option>
            </select>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="emit('cancel')" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
            {{ isEditing ? 'Actualizar Ensayo' : 'Crear Ensayo' }}
          </button>
        </div>
      </form>
    </template>
    <div v-else class="p-4 text-center">Cargando formulario...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, nextTick, onBeforeUnmount } from 'vue'
import { useCatalogosStore } from '~/stores/catalogos'
import type { Ensayo } from '~/stores/ensayos'
import { useNotifications } from '~/composables/useNotifications'

const props = defineProps<{
  initialData?: Ensayo | null
  isEditing?: boolean
  loading: boolean // This prop comes from the parent (ensayosStore.loading)
}>()

const emit = defineEmits<{
  submit: [data: Partial<Ensayo>]
  cancel: []
}>()

const catalogosStore = useCatalogosStore()
const { showNotification } = useNotifications()

const form = ref<Partial<Ensayo>>({
  nombreEnsayo: '',
  protocoloId: null,
  responsableId: null,
  provincia: '',
  departamento: '',
  establecimiento: '',
  lote: '',
  latitud: undefined,
  longitud: undefined,
  cultivoId: null,
  variedadId: null,
  tipoSiembraId: null,
  distSurcosCm: undefined,
  fechaInicio: '',
  fechaSiembra: '',
  fechaCosecha: '',
  statusId: null,
  laboratorioId: null,
  tipoEnsayoId: null,
  codigoLabor: '',
})

const departamentos = ref([])
const variedades = ref([])
const isLoadingDependentData = ref(true) // Local loading for catalogs and dependent data
const isGeolocating = ref(false)
const showInfo = ref(false)
const variablesInfo = ref([])

const tipoEnsayoButton = ref<HTMLElement | null>(null);
const popover = ref<HTMLElement | null>(null);
const popoverStyle = ref({});

const selectedTipoEnsayo = computed(() => {
  if (!form.value.tipoEnsayoId) return null;
  return catalogosStore.tiposEnsayo.find(t => t.id === form.value.tipoEnsayoId);
});

const formatDateForInput = (date: string | Date | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

const onProvinciaChange = async () => {
  form.value.departamento = ''
  departamentos.value = []
  if (form.value.provincia) {
    departamentos.value = await catalogosStore.fetchDepartamentos(form.value.provincia)
  }
}

const onEspecieChange = async () => {
  form.value.variedadId = null
  variedades.value = []
  if (form.value.cultivoId) {
    variedades.value = await catalogosStore.fetchVariedades(form.value.cultivoId)
  }
}

const showTipoEnsayoInfo = async () => {
  if (!selectedTipoEnsayo.value) return;
  variablesInfo.value = await catalogosStore.fetchVariablesPorTipo(selectedTipoEnsayo.value.id);
  showInfo.value = true;
  await nextTick(); // Ensure popover is rendered before calculating position
  positionPopover();
}

const positionPopover = () => {
  if (tipoEnsayoButton.value && popover.value) {
    const buttonRect = tipoEnsayoButton.value.getBoundingClientRect();
    const popoverRect = popover.value.getBoundingClientRect();
    const formElement = tipoEnsayoButton.value.closest('form');
    const formRect = formElement ? formElement.getBoundingClientRect() : null;

    if (!formRect) return;

    // Calculate position relative to the form container
    let top = buttonRect.top - formRect.top;
    let left = buttonRect.right - formRect.left + 10; // 10px padding from button

    // Check for overflow on the right
    if (left + popoverRect.width > formRect.width) {
      // Try positioning to the left of the button
      left = buttonRect.left - formRect.left - popoverRect.width - 10;
    }

    // If still overflowing or positioned off-screen left, position below
    if (left < 0 || left + popoverRect.width > formRect.width) {
      top = buttonRect.bottom - formRect.top + 10; // Position below the button
      left = buttonRect.left - formRect.left; // Align with button's left edge
      
      // Adjust if positioning below overflows right
      if (left + popoverRect.width > formRect.width) {
        left = formRect.width - popoverRect.width - 10; // 10px from right edge of form
      }
      // Ensure it's not off screen left
      if (left < 0) left = 10;
    }

    popoverStyle.value = {
      top: `${top}px`,
      left: `${left}px`,
      position: 'absolute',
    };
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (showInfo.value && popover.value && !popover.value.contains(event.target as Node) &&
      tipoEnsayoButton.value && !tipoEnsayoButton.value.contains(event.target as Node)) {
    showInfo.value = false;
  }
};

const fillGeolocation = () => {
  if (navigator.geolocation) {
    isGeolocating.value = true
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.value.latitud = position.coords.latitude
        form.value.longitud = position.coords.longitude
        showNotification('Geolocalización obtenida correctamente.', 'success')
        isGeolocating.value = false
      },
      (geoError) => {
        console.error('Error al obtener geolocalización:', geoError)
        showNotification(`Error al obtener geolocalización: ${geoError.message}`, 'error')
        isGeolocating.value = false
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  } else {
    showNotification('Tu navegador no soporta la geolocalización.', 'error')
  }
}

const handleSubmit = () => {
  const lat = form.value.latitud ? parseFloat(String(form.value.latitud)) : null;
  const lon = form.value.longitud ? parseFloat(String(form.value.longitud)) : null;
  const dist = form.value.distSurcosCm ? parseFloat(String(form.value.distSurcosCm)) : null;

  const payload: Partial<Ensayo> = {
    id: form.value.id,
    nombreEnsayo: form.value.nombreEnsayo,
    protocoloId: form.value.protocoloId,
    responsableId: form.value.responsableId,
    provincia: form.value.provincia,
    departamento: form.value.departamento,
    establecimiento: form.value.establecimiento,
    lote: form.value.lote,
    latitud: isNaN(lat) ? null : lat,
    longitud: isNaN(lon) ? null : lon,
    cultivoId: form.value.cultivoId,
    variedadId: form.value.variedadId,
    tipoSiembraId: form.value.tipoSiembraId,
    distSurcosCm: isNaN(dist) ? null : dist,
    fechaInicio: form.value.fechaInicio,
    fechaSiembra: form.value.fechaSiembra,
    fechaCosecha: form.value.fechaCosecha,
    statusId: form.value.statusId,
    laboratorioId: form.value.laboratorioId,
    tipoEnsayoId: form.value.tipoEnsayoId,
    codigoLabor: form.value.codigoLabor,
  };
  emit('submit', payload);
}

const loadDependentData = async (data: Ensayo | null) => {
  isLoadingDependentData.value = true;
  console.log('EnsayoForm: Starting loadDependentData. isLoadingDependentData = true');
  try {
    // Cargar explícitamente los catálogos principales necesarios
    console.log('EnsayoForm: Loading catalogs...');
    await Promise.all([
      catalogosStore.fetchProvincias(),
      catalogosStore.fetchProtocolos(),
      catalogosStore.fetchEspecies(),
      catalogosStore.fetchUsuarios(),
      catalogosStore.fetchLaboratorios(),
      catalogosStore.fetchTiposEnsayo(),
      catalogosStore.fetchTiposSiembra(),
      catalogosStore.fetchStatusEnsayos(),
    ]);
    console.log('EnsayoForm: Catalogs loaded successfully');

    if (data) {
      console.log('EnsayoForm: Populating form with initialData:', data);
      form.value = {
        ...data,
        fechaInicio: formatDateForInput(data.fechaInicio),
        fechaSiembra: formatDateForInput(data.fechaSiembra),
        fechaCosecha: formatDateForInput(data.fechaCosecha),
        laboratorioId: data.laboratorio?.id || null,
        tipoEnsayoId: data.tipoEnsayo?.id || null,
        protocoloId: data.protocolo?.id || null,
        responsableId: data.responsable?.id || null,
        cultivoId: data.cultivo?.id || null,
        variedadId: data.variedad?.id || null,
        tipoSiembraId: data.tipoSiembra?.id || null,
        statusId: data.status?.id || null,
      };

      // Fetch dependent data based on initialData
      if (form.value.provincia) {
        console.log('EnsayoForm: Fetching departamentos for provincia:', form.value.provincia);
        departamentos.value = await catalogosStore.fetchDepartamentos(form.value.provincia);
      }
      if (form.value.cultivoId) {
        console.log('EnsayoForm: Fetching variedades for cultivoId:', form.value.cultivoId);
        variedades.value = await catalogosStore.fetchVariedades(form.value.cultivoId);
      }
    } else {
      console.log('EnsayoForm: Initializing form for new ensayo.');
      form.value.statusId = null;
    }
  } catch (e) {
    console.error("EnsayoForm: Error loading dependent data for form:", e);
    showNotification('Error al cargar datos iniciales del formulario.', 'error');
  } finally {
    isLoadingDependentData.value = false;
    console.log('EnsayoForm: Finished loadDependentData. isLoadingDependentData = false');
  }
};

watch(() => props.initialData, (newInitialData) => {
  console.log('EnsayoForm: initialData prop changed:', newInitialData);
  // Only load dependent data if initialData is provided (for editing)
  // or if it's a new form and catalogs haven't been loaded yet.
  if (newInitialData || !props.isEditing) { // If editing and data arrives, or if new form
    loadDependentData(newInitialData);
  }
}, { immediate: true, deep: true });

onMounted(() => {
  console.log('EnsayoForm: Mounted. props.isEditing:', props.isEditing, 'props.initialData:', props.initialData);
  // If not editing, or if initialData was not immediately available,
  // ensure dependent data is loaded.
  if (!props.isEditing && !props.initialData) {
    loadDependentData(null); // For new form
  } else if (props.isEditing && props.initialData) {
    // If editing and initialData is already there, watch will handle it.
    // But we need to ensure catalogs are loaded if not already.
    // This check prevents redundant catalog fetches if watch with immediate:true already did it.
    if (!catalogosStore.tiposEnsayo.length) {
      loadDependentData(props.initialData);
    }
  }
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
