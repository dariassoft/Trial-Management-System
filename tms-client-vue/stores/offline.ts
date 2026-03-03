import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Tipos para datos pendientes de sincronización
export interface PendingMedicion {
  id: string                    // UUID local
  timestamp: number             // Fecha de creación
  parcelaId: number
  momentoId: number
  ensayoId: number
  observaciones?: string
  mediciones: { variableId: number; valor: string }[]
  synced: boolean
}

export interface PendingMedia {
  id: string                    // UUID local
  timestamp: number
  parcelaId: number
  momentoId: number
  ensayoId: number
  type: 'photo' | 'video'
  blob: Blob
  filename: string
  synced: boolean
}

const DB_NAME = 'tms_offline_db'
const DB_VERSION = 1
const STORE_MEDICIONES = 'pending_mediciones'
const STORE_MEDIA = 'pending_media'

export const useOfflineStore = defineStore('offline', () => {
  // Estado - proteger navigator para SSR
  const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const isSyncing = ref(false)
  const lastSyncTime = ref<number | null>(null)
  const pendingMedicionesCount = ref(0)
  const pendingMediaCount = ref(0)
  const syncError = ref<string | null>(null)

  let db: IDBDatabase | null = null

  // Computed
  const hasPendingData = computed(() =>
    pendingMedicionesCount.value > 0 || pendingMediaCount.value > 0
  )

  const totalPending = computed(() =>
    pendingMedicionesCount.value + pendingMediaCount.value
  )

  // Inicializar IndexedDB
  async function initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      // Proteger para SSR
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB no disponible'))
        return
      }

      if (db) {
        resolve(db)
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('Error abriendo IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        db = request.result
        console.log('✅ IndexedDB inicializado')
        resolve(db)
      }

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result

        // Store para mediciones pendientes
        if (!database.objectStoreNames.contains(STORE_MEDICIONES)) {
          const medicionesStore = database.createObjectStore(STORE_MEDICIONES, { keyPath: 'id' })
          medicionesStore.createIndex('synced', 'synced', { unique: false })
          medicionesStore.createIndex('timestamp', 'timestamp', { unique: false })
          medicionesStore.createIndex('parcelaId', 'parcelaId', { unique: false })
        }

        // Store para fotos/videos pendientes
        if (!database.objectStoreNames.contains(STORE_MEDIA)) {
          const mediaStore = database.createObjectStore(STORE_MEDIA, { keyPath: 'id' })
          mediaStore.createIndex('synced', 'synced', { unique: false })
          mediaStore.createIndex('timestamp', 'timestamp', { unique: false })
          mediaStore.createIndex('type', 'type', { unique: false })
        }
      }
    })
  }

  // Generar UUID
  function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Guardar medición localmente
  async function saveMedicionLocal(data: Omit<PendingMedicion, 'id' | 'timestamp' | 'synced'>): Promise<string> {
    const database = await initDB()

    const medicion: PendingMedicion = {
      id: generateUUID(),
      timestamp: Date.now(),
      synced: false,
      ...data,
    }

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_MEDICIONES], 'readwrite')
      const store = transaction.objectStore(STORE_MEDICIONES)
      const request = store.add(medicion)

      request.onsuccess = () => {
        pendingMedicionesCount.value++
        console.log('💾 Medición guardada localmente:', medicion.id)
        resolve(medicion.id)
      }

      request.onerror = () => {
        console.error('Error guardando medición local:', request.error)
        reject(request.error)
      }
    })
  }

  // Guardar media localmente
  async function saveMediaLocal(data: Omit<PendingMedia, 'id' | 'timestamp' | 'synced'>): Promise<string> {
    const database = await initDB()

    const media: PendingMedia = {
      id: generateUUID(),
      timestamp: Date.now(),
      synced: false,
      ...data,
    }

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_MEDIA], 'readwrite')
      const store = transaction.objectStore(STORE_MEDIA)
      const request = store.add(media)

      request.onsuccess = () => {
        pendingMediaCount.value++
        console.log('💾 Media guardado localmente:', media.id, media.type)
        resolve(media.id)
      }

      request.onerror = () => {
        console.error('Error guardando media local:', request.error)
        reject(request.error)
      }
    })
  }

  // Obtener mediciones pendientes
  async function getPendingMediciones(): Promise<PendingMedicion[]> {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_MEDICIONES], 'readonly')
      const store = transaction.objectStore(STORE_MEDICIONES)
      const index = store.index('synced')
      // Usar getAll con false (boolean value para el índice)
      const request = (index.getAll as any)(false)

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        console.error('Error obteniendo mediciones pendientes:', request.error)
        reject(request.error)
      }
    })
  }

  // Obtener media pendiente
  async function getPendingMedia(): Promise<PendingMedia[]> {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_MEDIA], 'readonly')
      const store = transaction.objectStore(STORE_MEDIA)
      const index = store.index('synced')
      // Usar getAll con false (boolean value para el índice)
      const request = (index.getAll as any)(false)

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        console.error('Error obteniendo media pendiente:', request.error)
        reject(request.error)
      }
    })
  }

  // Marcar como sincronizado
  async function markAsSynced(storeName: string, id: string): Promise<void> {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const item = getRequest.result
        if (item) {
          item.synced = true
          const updateRequest = store.put(item)
          updateRequest.onsuccess = () => {
            if (storeName === STORE_MEDICIONES) {
              pendingMedicionesCount.value = Math.max(0, pendingMedicionesCount.value - 1)
            } else {
              pendingMediaCount.value = Math.max(0, pendingMediaCount.value - 1)
            }
            resolve()
          }
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          resolve()
        }
      }

      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  // Eliminar item sincronizado
  async function deleteItem(storeName: string, id: string): Promise<void> {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Contar pendientes
  async function countPending(): Promise<void> {
    try {
      const database = await initDB()

      // Contar mediciones
      const medicionesCount = await new Promise<number>((resolve, reject) => {
        const transaction = database.transaction([STORE_MEDICIONES], 'readonly')
        const store = transaction.objectStore(STORE_MEDICIONES)
        const index = store.index('synced')
        // Usar getAll() para obtener todos los registros y luego filtrar
        const request = index.getAll()
        request.onsuccess = () => {
          // Filtrar manualmente los registros donde synced === false
          const unsynced = (request.result as any[]).filter(item => item.synced === false)
          resolve(unsynced.length)
        }
        request.onerror = () => {
          console.error('Error contando mediciones:', request.error)
          reject(request.error)
        }
      })

      // Contar media
      const mediaCount = await new Promise<number>((resolve, reject) => {
        const transaction = database.transaction([STORE_MEDIA], 'readonly')
        const store = transaction.objectStore(STORE_MEDIA)
        const index = store.index('synced')
        // Usar getAll() para obtener todos los registros y luego filtrar
        const request = index.getAll()
        request.onsuccess = () => {
          // Filtrar manualmente los registros donde synced === false
          const unsynced = (request.result as any[]).filter(item => item.synced === false)
          resolve(unsynced.length)
        }
        request.onerror = () => {
          console.error('Error contando media:', request.error)
          reject(request.error)
        }
      })

      pendingMedicionesCount.value = medicionesCount
      pendingMediaCount.value = mediaCount
    } catch (err) {
      console.error('Error contando pendientes:', err)
    }
  }

  // Sincronizar todo con el servidor
  async function syncAll(api: any): Promise<{ success: number; failed: number }> {
    if (isSyncing.value) {
      return { success: 0, failed: 0 }
    }

    if (!isOnline.value) {
      syncError.value = 'Sin conexión a internet'
      return { success: 0, failed: 0 }
    }

    isSyncing.value = true
    syncError.value = null
    let success = 0
    let failed = 0

    try {
      // Sincronizar mediciones
      const pendingMediciones = await getPendingMediciones()
      console.log(`📤 Sincronizando ${pendingMediciones.length} mediciones...`)

      for (const medicion of pendingMediciones) {
        try {
          await api.post('/datos-campo', {
            parcela_id_fk: medicion.parcelaId,
            momento_id_fk: medicion.momentoId,
            observaciones: medicion.observaciones,
            mediciones: medicion.mediciones.map(m => ({
              variable_id: m.variableId,
              valor: m.valor,
            })),
          })
          await markAsSynced(STORE_MEDICIONES, medicion.id)
          await deleteItem(STORE_MEDICIONES, medicion.id)
          success++
        } catch (err) {
          console.error('Error sincronizando medición:', medicion.id, err)
          failed++
        }
      }

      // Sincronizar media
      const pendingMediaList = await getPendingMedia()
      console.log(`📤 Sincronizando ${pendingMediaList.length} archivos multimedia...`)

      for (const media of pendingMediaList) {
        try {
          const formData = new FormData()
          formData.append('file', media.blob, media.filename)
          formData.append('parcelaId', String(media.parcelaId))
          formData.append('momentoId', String(media.momentoId))
          formData.append('ensayoId', String(media.ensayoId))
          formData.append('type', media.type)

          await api.post('/fotos/upload', formData)
          await markAsSynced(STORE_MEDIA, media.id)
          await deleteItem(STORE_MEDIA, media.id)
          success++
        } catch (err) {
          console.error('Error sincronizando media:', media.id, err)
          failed++
        }
      }

      lastSyncTime.value = Date.now()
      await countPending()

      console.log(`✅ Sincronización completada: ${success} exitosos, ${failed} fallidos`)
    } catch (err: any) {
      syncError.value = err.message || 'Error en sincronización'
      console.error('Error en sincronización:', err)
    } finally {
      isSyncing.value = false
    }

    return { success, failed }
  }

  // Limpiar datos sincronizados antiguos (más de 7 días)
  async function cleanupOldData(): Promise<number> {
    const database = await initDB()
    const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000) // 7 días
    let deleted = 0

    for (const storeName of [STORE_MEDICIONES, STORE_MEDIA]) {
      await new Promise<void>((resolve) => {
        const transaction = database.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const index = store.index('synced')
        const request = index.openCursor(IDBKeyRange.only(true))

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            if (cursor.value.timestamp < cutoffTime) {
              cursor.delete()
              deleted++
            }
            cursor.continue()
          } else {
            resolve()
          }
        }
      })
    }

    return deleted
  }

  // Listeners para estado de conexión
  function setupOnlineListeners() {
    // Proteger para SSR
    if (typeof window === 'undefined') return

    window.addEventListener('online', () => {
      isOnline.value = true
      console.log('🌐 Conexión restaurada')
    })

    window.addEventListener('offline', () => {
      isOnline.value = false
      console.log('📴 Sin conexión')
    })
  }

  // Inicializar
  async function init() {
    // Proteger para SSR
    if (typeof window === 'undefined') return

    setupOnlineListeners()
    try {
      await initDB()
      await countPending()
    } catch (err) {
      console.warn('⚠️ No se pudo inicializar IndexedDB:', err)
    }
  }

  return {
    // Estado
    isOnline,
    isSyncing,
    lastSyncTime,
    pendingMedicionesCount,
    pendingMediaCount,
    syncError,
    hasPendingData,
    totalPending,

    // Métodos
    init,
    saveMedicionLocal,
    saveMediaLocal,
    getPendingMediciones,
    getPendingMedia,
    syncAll,
    countPending,
    cleanupOldData,
  }
})
