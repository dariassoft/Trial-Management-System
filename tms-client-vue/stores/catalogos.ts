import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';

export const useCatalogosStore = defineStore('catalogos', () => {
  const api = useApi();

  const usuarios = ref([]); // Renombrado de 'responsables' a 'usuarios'
  const provincias = ref([]);
  const especies = ref([]);
  const laboratorios = ref([]);
  const tiposEnsayo = ref([]);
  const tiposSiembra = ref([]);
  const tratamientos = ref([]);
  const protocolos = ref([]);

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
      provincias.value = response || [];
    } catch (error) {
      console.error('Error fetching provincias:', error);
    }
  };
  
  const fetchDepartamentos = async (provincia: string) => {
    if (!provincia) return [];
    try {
      const response = await api.get(`/locations/provincias/${provincia}/departamentos`);
      return response || [];
    } catch (error) {
      console.error('Error fetching departamentos:', error);
      return [];
    }
  };

  const fetchEspecies = async () => {
    try {
      const response = await api.get('/catalogos/cultivos');
      especies.value = response || [];
    } catch (error) {
      console.error('Error fetching especies:', error);
    }
  };

  const fetchVariedades = async (especieId: number) => {
    if (!especieId) return [];
    try {
      const response = await api.get(`/catalogos/cultivos/${especieId}/variedades`);
      return response || [];
    } catch (error) {
      console.error('Error fetching variedades:', error);
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
      tiposEnsayo.value = response || [];
    } catch (error) {
      console.error('Error fetching tipos de ensayo:', error);
    }
  };

  const fetchTiposSiembra = async () => {
    try {
      const response = await api.get('/catalogos/tipos-siembra');
      tiposSiembra.value = response || [];
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
      protocolos.value = response || [];
    } catch (error) {
      console.error('Error fetching protocolos:', error);
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
    usuarios, // Actualizado
    provincias,
    especies,
    laboratorios,
    tiposEnsayo,
    tiposSiembra,
    tratamientos,
    protocolos,
    fetchDepartamentos,
    fetchVariedades,
    fetchVariablesPorTipo,
    init,
  };
});
