// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'fs'
import path from 'path'

// Cargar variables de entorno según el ambiente
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
const envPath = path.resolve(process.cwd(), envFile)

let apiBase = 'http://localhost:3000/api/v1'

// Leer archivo .env.production o .env.development
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const apiBaseMatch = envContent.match(/NUXT_PUBLIC_API_BASE=(.+)/)
  if (apiBaseMatch && apiBaseMatch[1]) {
    apiBase = apiBaseMatch[1].trim()
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-11-27',
  // En producción se debe servir el artefacto Nitro; en desarrollo se mantiene SPA.
  ssr: process.env.NODE_ENV === 'production',
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  // Módulos
  modules: [
    '@pinia/nuxt',
  ],

  // CSS Global
  css: [
    '~/assets/css/main.css',
  ],

  // Configuración de PostCSS para TailwindCSS
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Configuración de Desarrollo
  devServer: {
    port: 3001,
  },

  // Configuración de CORS y API - Cargada desde .env.production en build
  runtimeConfig: {
    public: {
      apiBase: apiBase,
    },
  },

  // Directorio de componentes auto-importados
  components: {
    dirs: ['~/components'],
  },

  // Composables, stores y utils auto-importados
  imports: {
    dirs: ['~/composables', '~/stores', '~/utils'],
  },

  // Configuración de Nitro para SSR - genera .output/server/index.mjs
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: [],  // No pre-renderizar rutas dinámicas automáticamente
    },
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public',
    },
  },

  // Configuración router para manejar mejor las rutas dinámicas
  router: {
    options: {
      hashMode: false,
    },
  },
})

