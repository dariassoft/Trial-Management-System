import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';

export const useCatalogosStore = defineStore('catalogos', () => {
  const api = useApi();

  const usuarios = ref([]);
  const provincias = ref([]);
  const cultivos = ref([]);
  const laboratorios = ref([]);
  const tiposEnsayo = ref([]);
  const tiposSiembra = ref([]);
  const tratamientos = ref([]);
  const protocolos = ref([]);
  const productos = ref([]);
  const statusEnsayos = ref([]);
  const roles = ref([]); // <-- Added roles state

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/users?limit=100');
      if (response && response.data) {
        usuarios.value = response.data;
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  // Function to fetch roles from the backend
  const fetchRoles = async (options: { limit?: number } = {}) => {
    try {
      const response = await api.get('/roles', { params: { limit: options.limit || 100 } });
      if (response && response.data) {
        roles.value = response.data;
      } else if (Array.isArray(response)) {
        roles.value = response;
      }
      console.log('✅ Roles cargados:', roles.value.length);
      return roles.value;
    } catch (error) {
      console.error('Error fetching roles:', error);
      roles.value = [];
      return [];
    }
  };

  const fetchProvincias = async () => {
    try {
      const response = await api.get('/locations/provincias');
      if (Array.isArray(response)) {
        provincias.value = response;
      } else if (response && Array.isArray(response.data)) {
        provincias.value = response.data;
      }
    } catch (error) {
      console.error('Error fetching provincias:', error);
    }
  };

  const fetchEspecies = async () => {
    try {
      const response = await api.get('/catalogos/cultivos');
      if (Array.isArray(response)) {
        cultivos.value = response;
      } else if (response && Array.isArray(response.data)) {
        cultivos.value = response.data;
      }
    } catch (error) {
      console.error('Error fetching cultivos:', error);
    }
  };

  const fetchDepartamentos = async (provincia: string) => {
    if (!provincia) return [];
    try {
      const response = await api.get(`/locations/provincias/${provincia}/departamentos`);
      return Array.isArray(response) ? response : response.data || [];
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
      }
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
      }
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
      if (response && response.data && Array.isArray(response.data)) {
        protocolos.value = response.data;
      } else if (Array.isArray(response)) {
        protocolos.value = response;
      }
    } catch (error) {
      console.error('Error fetching protocolos:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await api.get('/productos?limit=999');
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
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error('Error fetching variedades:', error);
      return [];
    }
  };

  const fetchStatusEnsayos = async () => {
    try {
      const response = await api.get('/status-ensayos');
      if (Array.isArray(response)) {
        statusEnsayos.value = response;
      } else if (response && Array.isArray(response.data)) {
        statusEnsayos.value = response.data;
      }
    } catch (error) {
      console.error('Error fetching status ensayos:', error);
    }
  };

  const init = () => {
    fetchUsuarios();
    fetchProvincias();
    fetchEspecies();
    fetchLaboratorios();
    fetchTiposEnsayo();
    fetchTiposSiembra();
    fetchTratamientos();
    fetchProtocolos();
    fetchStatusEnsayos();
    fetchRoles();
  };

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
    statusEnsayos,
    roles,
    fetchUsuarios,
    fetchProvincias,
    fetchEspecies,
    fetchLaboratorios,
    fetchTiposEnsayo,
    fetchTiposSiembra,
    fetchTratamientos,
    fetchProtocolos,
    fetchStatusEnsayos,
    fetchRoles,
    fetchDepartamentos,
    fetchVariedades,
    fetchVariablesPorTipo,
    fetchProductos,
    init,
  };
});
