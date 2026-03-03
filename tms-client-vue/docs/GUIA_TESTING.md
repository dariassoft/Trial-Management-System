
## 9. Integración Continua (CI)

### GitHub Actions

**.github/workflows/test.yml**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run test
      - run: npm run test:coverage
```

---

## 10. Mejores Prácticas

✅ **Do**
- Usar descriptive test names
- Test comportamiento, no implementación
- Mantener tests pequeños y enfocados
- Usar `beforeEach` para setup
- Mockear dependencias externas

❌ **Don't**
- Testear detalles de implementación
- Crear tests muy grandes
- Esperar en el DOM sin `flushPromises`
- Hardcodear valores mágicos
- Ignorar edge cases

---

## 11. Ejemplos Completos

### Test de Validación

```typescript
it('valida email formato', () => {
  const validEmails = [
    'test@example.com',
    'user.name@example.com',
    'user+tag@example.co.uk',
  ]
  
  const invalidEmails = [
    'invalid.email',
    '@example.com',
    'user@',
  ]
  
  validEmails.forEach(email => {
    expect(isValidEmail(email)).toBe(true)
  })
  
  invalidEmails.forEach(email => {
    expect(isValidEmail(email)).toBe(false)
  })
})
```

### Test de Ciclo de Vida

```typescript
it('inicializa datos al montar', async () => {
  const wrapper = mount(MyComponent)
  
  await wrapper.vm.$nextTick()
  
  expect(wrapper.vm.data).toEqual([...])
})
```

---

**Última actualización**: 2024-11-26
# Guía de Testing - TMS Frontend

Documentación sobre estrategias y herramientas de testing para TMS Frontend.

## 1. Configuración Inicial

### Instalar Dependencias
```bash
npm install -D vitest @vue/test-utils jsdom @testing-library/vue happy-dom
```

### Archivos de Configuración

**vitest.config.ts**
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
    },
  },
})
```

**package.json scripts**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 2. Testing de Stores (Pinia)

### Test básico de Auth Store

**tests/stores/auth.test.ts**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializa con estado vacío', () => {
    const store = useAuthStore()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })

  it('computed isAuthenticated retorna false sin token', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
  })

  it('logout limpia el estado', () => {
    const store = useAuthStore()
    store.token = 'fake-token'
    store.user = { id: 1, nombre: 'Test' }
    
    store.logout()
    
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })
})
```

---

## 3. Testing de Composables

### Test del composable `useTheme`

**tests/composables/useTheme.test.ts**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from '~/composables/useTheme'

describe('useTheme Composable', () => {
  beforeEach(() => {
    // Limpiar localStorage
    localStorage.clear()
    // Reset DOM
    document.documentElement.classList.remove('dark')
  })

  it('inicializa tema correctamente', () => {
    const { isDark, initializeTheme } = useTheme()
    
    initializeTheme()
    
    // Verificar que inicializa con preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    expect(isDark.value).toBe(prefersDark)
  })

  it('toggle cambia el tema', () => {
    const { isDark, toggleTheme } = useTheme()
    isDark.value = false
    
    toggleTheme()
    
    expect(isDark.value).toBe(true)
  })

  it('aplica clase dark al documento', () => {
    const { isDark, toggleTheme } = useTheme()
    isDark.value = false
    
    toggleTheme()
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('guarda preferencia en localStorage', () => {
    const { toggleTheme } = useTheme()
    
    toggleTheme()
    
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})
```

---

## 4. Testing de Componentes

### Test del Login Page

**tests/pages/login.test.ts**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import LoginPage from '~/pages/login.vue'

describe('Login Page', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renderiza formulario de login', () => {
    const wrapper = mount(LoginPage, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
        },
      },
    })
    
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('muestra error si campos están vacíos', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
        },
      },
    })
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(wrapper.vm.error).toBe('Por favor completa todos los campos')
  })

  it('envia credenciales al hacer submit', async () => {
    const wrapper = mount(LoginPage)
    
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    
    // Mock del login
    const authStore = useAuthStore()
    authStore.login = vi.fn().mockResolvedValue({})
    
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    
    expect(authStore.login).toHaveBeenCalledWith('test@test.com', 'password123')
  })
})
```

---

## 5. Testing de API Calls

### Test del composable `useApi`

**tests/composables/useApi.test.ts**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useApi } from '~/composables/useApi'

describe('useApi Composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    global.$fetch = vi.fn()
  })

  it('agregar token al header', async () => {
    const authStore = useAuthStore()
    authStore.token = 'test-token'
    
    const api = useApi()
    
    // Mock fetch
    global.$fetch = vi.fn().mockResolvedValue({ data: [] })
    
    await api.get('/test')
    
    expect(global.$fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })
})
```

---

## 6. Estrategias de Testing

### Coverage Goals
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Qué Testear

1. **Stores**: Acciones, computeds, cambios de estado
2. **Composables**: Hooks de ciclo de vida, reactividad
3. **Componentes**: Rendering, eventos, props
4. **Pages**: Integración con store y API

### Qué NO Testear

- Librerías externas (Tailwind, Nuxt, Vue)
- Métodos del DOM simples (click, focus)
- Iteraciones simples
- Estilos CSS

---

## 7. Mocking y Stubbing

### Mock de $fetch

```typescript
import { vi } from 'vitest'

global.$fetch = vi.fn().mockResolvedValue({
  accessToken: 'token123',
  user: { id: 1, nombre: 'Test' },
})
```

### Mock de useRouter

```typescript
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
}

const wrapper = mount(MyComponent, {
  global: {
    mocks: {
      $router: mockRouter,
    },
  },
})
```

### Mock de Store

```typescript
const mockAuthStore = {
  login: vi.fn().mockResolvedValue({}),
  logout: vi.fn(),
}
```

---

## 8. Ejecutar Tests

### Tests en Modo Watch
```bash
npm run test
```

### UI Interactiva
```bash
npm run test:ui
# Abre http://localhost:51204/__vitest__/
```

### Coverage Report
```bash
npm run test:coverage
# Genera carpeta coverage/
```

### Tests Específicos
```bash
npm run test -- tests/stores/auth.test.ts
npm run test -- tests/ -t "Auth Store"
```

---

