import { ref, computed } from 'vue'

export const useTheme = () => {
  const isDark = ref(false)

  const initializeTheme = () => {
    if (process.client) {
      // Verificar preferencia guardada o del sistema
      const saved = localStorage.getItem('theme')
      if (saved) {
        isDark.value = saved === 'dark'
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyTheme()
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  const applyTheme = () => {
    if (process.client) {
      const html = document.documentElement
      if (isDark.value) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  return {
    isDark: computed(() => isDark.value),
    initializeTheme,
    toggleTheme,
  }
}

