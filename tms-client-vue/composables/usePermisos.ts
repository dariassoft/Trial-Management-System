import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { usePermisosStore } from '~/stores/permisos'

export const usePermisos = () => {
  const authStore = useAuthStore()
  const permisosStore = usePermisosStore()

  // Mapeo de acciones HTTP a permisos
  const accionesMap = {
    'GET': 'VER',
    'POST': 'CREAR',
    'PATCH': 'EDITAR',
    'PUT': 'EDITAR',
    'DELETE': 'ELIMINAR',
  }

  /**
   * Verifica si el usuario actual tiene un permiso específico
   * @param recurso - Nombre del recurso (ej: 'laboratorios', 'usuarios')
   * @param accion - Acción (VER, CREAR, EDITAR, ELIMINAR, LISTAR, EXPORTAR)
   * @returns boolean
   */
  const tienePermiso = (recurso: string, accion: string): boolean => {
    // Verificar en memoria (requiere que fetchPermisosByRolId se haya ejecutado)
    const tienePermisoLocal = permisosStore.permisos.some(
      (p) => p.recurso === recurso && p.accion === accion && p.activo
    )

    return tienePermisoLocal
  }

  /**
   * Verifica si el usuario puede ver un recurso
   */
  const puedeVer = (recurso: string): boolean => tienePermiso(recurso, 'VER')

  /**
   * Verifica si el usuario puede listar un recurso
   */
  const puedeListar = (recurso: string): boolean => tienePermiso(recurso, 'LISTAR')

  /**
   * Verifica si el usuario puede crear en un recurso
   */
  const puedeCrear = (recurso: string): boolean => tienePermiso(recurso, 'CREAR')

  /**
   * Verifica si el usuario puede editar en un recurso
   */
  const puedeEditar = (recurso: string): boolean => tienePermiso(recurso, 'EDITAR')

  /**
   * Verifica si el usuario puede eliminar en un recurso
   */
  const puedeEliminar = (recurso: string): boolean => tienePermiso(recurso, 'ELIMINAR')

  /**
   * Verifica si el usuario puede exportar un recurso
   */
  const puedeExportar = (recurso: string): boolean => tienePermiso(recurso, 'EXPORTAR')

  /**
   * Carga los permisos del rol actual
   */
  const cargarPermisos = async () => {
    if (!authStore.user?.rol_id) return

    try {
      const permisos = await permisosStore.fetchPermisosByRolId(authStore.user.rol_id)
      return permisos
    } catch (error) {
      console.error('Error al cargar permisos:', error)
    }
  }

  /**
   * Verifica múltiples permisos (AND lógico)
   */
  const tienePermisos = (...permisos: Array<{ recurso: string; accion: string }>): boolean => {
    return permisos.every(({ recurso, accion }) => tienePermiso(recurso, accion))
  }

  /**
   * Verifica al menos uno de los permisos (OR lógico)
   */
  const tieneAlgunoPermiso = (...permisos: Array<{ recurso: string; accion: string }>): boolean => {
    return permisos.some(({ recurso, accion }) => tienePermiso(recurso, accion))
  }

  return {
    tienePermiso,
    puedeVer,
    puedeListar,
    puedeCrear,
    puedeEditar,
    puedeEliminar,
    puedeExportar,
    cargarPermisos,
    tienePermisos,
    tieneAlgunoPermiso,
  }
}

