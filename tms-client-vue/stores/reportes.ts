import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { extractErrorMessage } from '~/utils/apiHelpers'

export const useReportesStore = defineStore('reportes', () => {
  const api = useApi()
  const loading = ref(false)
  const generando = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)

  const generarReportePDF = async (ensayoId: number) => {
    generando.value = true
    error.value = null
    try {
      const response = await api.get(`/reportes/ensayo/${ensayoId}/pdf`, {
        responseType: 'blob',
      })

      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ensayo_${ensayoId}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      success.value = '✅ Reporte PDF generado y descargado correctamente'
      return true
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al generar PDF')
      console.error('Error en generarReportePDF:', err)
      return false
    } finally {
      generando.value = false
    }
  }

  const generarReporteExcel = async (ensayoId: number) => {
    generando.value = true
    error.value = null
    try {
      const response = await api.get(`/reportes/ensayo/${ensayoId}/xls`, {
        responseType: 'blob',
      })

      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ensayo_${ensayoId}_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      success.value = '✅ Reporte Excel generado y descargado correctamente'
      return true
    } catch (err: any) {
      error.value = extractErrorMessage(err, 'Error al generar Excel')
      console.error('Error en generarReporteExcel:', err)
      return false
    } finally {
      generando.value = false
    }
  }

  const limpiarMensajes = () => {
    error.value = null
    success.value = null
  }

  return {
    loading,
    generando,
    error,
    success,
    generarReportePDF,
    generarReporteExcel,
    limpiarMensajes,
  }
})

