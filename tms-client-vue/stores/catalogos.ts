import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';

export const useCatalogosStore = defineStore('catalogos', () => {
  const api = useApi();

  const usuarios = ref([]); // Renombrado de 'responsables' a 'usuarios'
  const provincias = ref([]);
  const cultivos = ref([]); // Renombrado de 'especies' a 'cultivos' para consistencia
  const laboratorios = ref([]);
  const tiposEnsayo = ref([]);
  const tiposSiembra = ref([]);
  const tratamientos = ref([]);
  const protocolos = ref([]);
  const productos = ref([]);

  const fetchUsuarios = async () => { // Renombrado de 'fetchResponsables' a 'fetchUsuarios'
    try {
      const response = await api.get('/users?limit=100');
      if (response && response.data) {
        // Guardar el objeto de usuario completo
        usuarios.value = response.data;
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const fetchProvincias = async () => {
    try {
      const response = await api.get('/locations/provincias');
      // Manejar array directo o dentro de response
      if (Array.isArray(response)) {
        provincias.value = response;
      } else if (response && Array.isArray(response.data)) {
        provincias.value = response.data;
      } else {
        provincias.value = [];
      }
      console.log('✅ Provincias cargadas:', provincias.value.length);
      return provincias.value;
    } catch (error) {
      console.error('Error fetching provincias:', error);
      provincias.value = [];
      return [];
    }
  };

  const fetchEspecies = async () => {
    try {
      const response = await api.get('/catalogos/cultivos');
      // Manejar array directo o dentro de response
      if (Array.isArray(response)) {
        cultivos.value = response;
      } else if (response && Array.isArray(response.data)) {
        cultivos.value = response.data;
      } else {
        cultivos.value = [];
      }
      console.log('✅ Cultivos cargados:', cultivos.value.length);
      return cultivos.value;
    } catch (error) {
      console.error('Error fetching cultivos:', error);
      cultivos.value = [];
      return [];
    }
  };

  const fetchDepartamentos = async (provincia: string) => {
    if (!provincia) return [];
    try {
      const response = await api.get(`/locations/provincias/${provincia}/departamentos`);
      // Manejar array directo o dentro de response
      if (Array.isArray(response)) {
        console.log('✅ Departamentos cargados:', response.length);
        return response;
      } else if (response && Array.isArray(response.data)) {
        console.log('✅ Departamentos cargados:', response.data.length);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching departamentos:', error);
      return [];
    }
  };

  const fetchLaboratorios = async () => {
    try {
      const response = await api.get('/laboratorios?limit=100');
      if (response && response.data) {
        laboratorios.value = response.data;
      }
    } catch (error) {
      console.error('Error fetching laboratorios:', error);
    }
  };

  const fetchTiposEnsayo = async () => {
    try {
      const response = await api.get('/catalogos/tipos-ensayo');
      if (Array.isArray(response)) {
        tiposEnsayo.value = response;
      } else if (response && Array.isArray(response.data)) {
        tiposEnsayo.value = response.data;
      } else {
        tiposEnsayo.value = [];
      }
      console.log('✅ Tipos de ensayo cargados:', tiposEnsayo.value.length);
    } catch (error) {
      console.error('Error fetching tipos de ensayo:', error);
    }
  };

  const fetchTiposSiembra = async () => {
    try {
      const response = await api.get('/catalogos/tipos-siembra');
      if (Array.isArray(response)) {
        tiposSiembra.value = response;
      } else if (response && Array.isArray(response.data)) {
        tiposSiembra.value = response.data;
      } else {
        tiposSiembra.value = [];
      }
      console.log('✅ Tipos de siembra cargados:', tiposSiembra.value.length);
    } catch (error) {
      console.error('Error fetching tipos de siembra:', error);
    }
  };

  const fetchVariablesPorTipo = async (tipoEnsayoId: number) => {
    if (!tipoEnsayoId) return [];
    try {
      const response = await api.get(`/catalogos/tipos-ensayo/${tipoEnsayoId}/variables`);
      return response || [];
    } catch (error) {
      console.error('Error fetching variables por tipo:', error);
      return [];
    }
  };

  const fetchTratamientos = async () => {
    try {
      const response = await api.get('/tratamientos');
      tratamientos.value = response || [];
    } catch (error) {
      console.error('Error fetching tratamientos:', error);
    }
  };

  const fetchProtocolos = async () => {
    try {
      const response = await api.get('/protocolos');
      // El endpoint ahora devuelve { data: [...], meta: {...} }
      if (response && response.data && Array.isArray(response.data)) {
        protocolos.value = response.data;
      } else if (Array.isArray(response)) {
        // Fallback si devuelve un array directo
        protocolos.value = response;
      } else {
        protocolos.value = [];
      }
      console.log('✅ Protocolos cargados:', protocolos.value.length);
    } catch (error) {
      console.error('Error fetching protocolos:', error);
      protocolos.value = [];
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await api.get('/productos');
      if (response && response.data) {
        productos.value = response.data;
      } else if (Array.isArray(response)) {
        productos.value = response;
      }
      return productos.value;
    } catch (error) {
      console.error('Error fetching productos:', error);
      return [];
    }
  };

  const fetchVariedades = async (especieId: number) => {
    if (!especieId) return [];
    try {
      const response = await api.get(`/catalogos/cultivos/${especieId}/variedades`);
      if (Array.isArray(response)) {
        console.log('✅ Variedades cargadas:', response.length);
        return response;
      } else if (response && Array.isArray(response.data)) {
        console.log('✅ Variedades cargadas:', response.data.length);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching variedades:', error);
      return [];
    }
  };

  const init = () => {
    fetchUsuarios(); // Actualizado
    fetchProvincias();
    fetchEspecies();
    fetchLaboratorios();
    fetchTiposEnsayo();
    fetchTiposSiembra();
    fetchTratamientos();
    fetchProtocolos();
  }

  return {
    usuarios,
    provincias,
    cultivos,
    laboratorios,
    tiposEnsayo,
    tiposSiembra,
    tratamientos,
    protocolos,
    productos,
    fetchUsuarios,
    fetchProvincias,
    fetchEspecies,
    fetchLaboratorios,
    fetchTiposEnsayo,
    fetchTiposSiembra,
    fetchTratamientos,
    fetchProtocolos,
    fetchDepartamentos,
    fetchVariedades,
    fetchVariablesPorTipo,
    fetchProductos,
    init,
  };
});
