import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { extractArrayFromResponse, extractTotalFromResponse, extractErrorMessage } from '~/utils/apiHelpers'

export interface Producto {
  id?: number
  nombre_comercial: string
  descripcion?: string | null
  principio_activo?: string | null
  formulacion?: string | null
  tipo?: string | null
  unidad?: string | null
  precio?: number | null
  laboratorio?: { id: number; nombre: string } | null
  laboratorioId?: number
  createdAt?: string
  updatedAt?: string
}

export const useProductosStore = defineStore('productos', () => {
  const api = useApi()
  const productos = ref<Producto[]>([])
  const currentProducto = ref<Producto | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const filtros = ref({
    sort: 'id',
    order: 'ASC' as 'ASC' | 'DESC',
    q: '',
    laboratorioId: undefined as number | undefined,
  })

  const fetchProductos = async (params: any = {}) => {
    loading.value = true
    error.value = null
    try {
      const limitValue = params.limit || pageSize.value
      const pageValue = params.page || currentPage.value
      const queryParams = new URLSearchParams({
        limit: String(limitValue),
        page: String(pageValue),
        sort: filtros.value.sort,
        order: filtros.value.order,
        ...params,
      })

      if (filtros.value.q) {
        queryParams.append('q', filtros.value.q)
      }
      if (filtros.value.laboratorioId) {
        queryParams.append('laboratorioId', String(filtros.value.laboratorioId))
      }

      const response = await api.get(`/productos?${queryParams}`)

      productos.value = extractArrayFromResponse(response)
      total.value = extractTotalFromResponse(response, productos.value.length)
      currentPage.value = pageValue

      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar productos')
      console.error('Error en fetchProductos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProductoById = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get(`/productos/${id}`)
      currentProducto.value = response
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al cargar el producto')
      console.error('Error en fetchProductoById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProducto = async (data: Producto) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/productos`, data)
      productos.value.unshift(response)
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al crear producto')
      console.error('Error en createProducto:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProducto = async (id: number, data: Partial<Producto>) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/productos/${id}`, data)
      const index = productos.value.findIndex(p => p.id === id)
      if (index !== -1) {
        productos.value[index] = response
      }
      if (currentProducto.value?.id === id) {
        currentProducto.value = response
      }
      return response
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al actualizar producto')
      console.error('Error en updateProducto:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProducto = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/productos/${id}`)
      productos.value = productos.value.filter(p => p.id !== id)
      if (currentProducto.value?.id === id) {
        currentProducto.value = null
      }
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al eliminar producto')
      console.error('Error en deleteProducto:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  return {
    productos,
    currentProducto,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    filtros,
    fetchProductos,
    fetchProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    setCurrentPage,
  }
})

