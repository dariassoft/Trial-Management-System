// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-27',
  ssr: false, // SPA Mode
  devtools: { enabled: true },

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


  // Configuración de CORS y API
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api/v1',
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

  // Auto-import de $fetch
  nitro: {
    prerender: {
      crawlLinks: false,
    },
  },
})

