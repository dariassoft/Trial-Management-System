# 🎨 DEMO VISUAL: Menú Drawer Lateral

## 🎬 Comportamiento Visual

### Estado Inicial (Menú Cerrado)
```
┌─────────────────────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  ← Header TMS
│  TMS   Trial Management System    🌙  🔔  [User]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│         📋 Contenido de la página actual           │
│                                                     │
│         (Dashboard, Ensayos, etc.)                 │
│                                                     │
│                                                     │
│                                                     │
│                                            ┌────┐  │
│                                            │ ☰  │  │  ← FAB Flotante
│                                            └────┘  │     (esquina inferior derecha)
└─────────────────────────────────────────────────────┘
```

### Estado Abierto (Menú Desplegado)
```
┌───────────────────┬─────────────────────────────────┐
│ ╔═══════════════╗ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← Overlay oscuro
│ ║ 🧭 Navegación ║ │ ░░                             │   (semi-transparente)
│ ╚═══════════════╝ │ ░░                             │
│ ─────────────────┤ ░░                             │
│                   │ ░░  📋 Contenido bloqueado    │
│ 📊 Dashboard      │ ░░     (no interactivo)        │
│                   │ ░░                             │
│ 🌾 Ensayos        │ ░░                             │
│                   │ ░░                             │
│ 📱 Mediciones  ⌄  │ ░░                             │
│  ├─ 📐 Bloques    │ ░░                             │
│  ├─ 📊 Mediciones │ ░░                             │
│  ├─ 📋 Protocolos │ ░░                             │
│  ├─ 🔬 Tipos      │ ░░                             │
│  ├─ 🌱 Siembra    │ ░░                    ┌────┐  │
│  └─ 🗂️ Cosecha    │ ░░                    │ ✕  │  │ ← FAB cambia a X
│                   │ ░░                    └────┘  │
│ 📈 Reportes       │ ░░                             │
│                   │ ░░                             │
│ 📚 Catálogos   ⌄  │ ░░                             │
│  ├─ 🌾 Cultivos   │ ░░                             │
│  └─ 🌱 Variedades │ ░░                             │
│                   │ ░░                             │
│ ⚙️ Admin        ⌄ │ ░░                             │
│  ├─ 👥 Usuarios   │ ░░                             │
│  └─ 🔐 Roles      │ ░░                             │
└───────────────────┴─────────────────────────────────┘
    ↑
  320px ancho
  Scroll interno
```

## 🎯 Puntos de Interacción

### 1️⃣ Abrir Menú
```
Opciones:
  ✓ Click en FAB (⚪ con ☰)

Animación:
  • Overlay aparece: opacity 0 → 100 (300ms)
  • Drawer desliza: -translate-x-full → translate-x-0 (300ms)
  • FAB rota: 0° → 90° + icono cambia a ✕
```

### 2️⃣ Navegar
```
Click en cualquier item:
  📊 Dashboard ─────────→ Navega a "/" + cierra drawer
  🌾 Ensayos ───────────→ Navega a "/ensayos" + cierra drawer

Expandir secciones:
  📱 Mediciones ⌄ ──────→ Rota chevron 180° + muestra subitems
                         (NO cierra drawer)
```

### 3️⃣ Cerrar Menú
```
Opciones:
  ✓ Click en ✕ del header del drawer
  ✓ Click en overlay (área gris fuera del drawer)
  ✓ Click en FAB (ahora con ✕)
  ✓ Click en cualquier link de navegación

Animación:
  • Drawer desliza: translate-x-0 → -translate-x-full (200ms)
  • Overlay desaparece: opacity 100 → 0 (200ms)
  • FAB rota: 90° → 0° + icono cambia a ☰
```

## 🎨 Estados Visuales

### Items del Menú

#### 1. Normal (sin hover)
```
┌─────────────────────────────────┐
│ 📊 Dashboard                    │  ← text-gray-700 dark:text-gray-300
└─────────────────────────────────┘
```

#### 2. Hover
```
┌─────────────────────────────────┐
│  📊 Dashboard              →    │  ← bg-blue-50, translate-x-1
└─────────────────────────────────┘
   ↑ Fondo azul claro + se desplaza 4px a la derecha
```

#### 3. Activo (página actual)
```
╔═════════════════════════════════╗
║ 📊 Dashboard                    ║  ← bg-blue-600, text-white, shadow-md
╚═════════════════════════════════╝
   ↑ Fondo azul sólido + texto blanco + sombra
```

### Secciones Expandibles

#### Colapsada
```
┌─────────────────────────────────┐
│ 📱 Mediciones               ⌄   │  ← Chevron apunta abajo
└─────────────────────────────────┘
```

#### Expandida
```
┌─────────────────────────────────┐
│ 📱 Mediciones               ⌃   │  ← Chevron apunta arriba (180° rotado)
├─────────────────────────────────┤
│ │ 📐 Bloques y Parcelas         │
│ │ 📊 Mediciones                 │  ← Borde azul izquierdo
│ │ 📋 Protocolos                 │     Indentado 2rem
│ │ 🔬 Tipos de Ensayo            │     Hover con translate-x-1
│ │ 🌱 Siembra                    │
│ │ 🗂️ Cosecha                    │
└─────────────────────────────────┘
```

## 🎭 Header del Drawer

```
╔═══════════════════════════════════╗
║ 🧭 Navegación              [✕]    ║  ← Degradado blue-600 → blue-700
╚═══════════════════════════════════╝
  ↑                            ↑
Logo con bg blanco         Botón cerrar
20% opacidad               Hover: bg-white 20%
```

## 🔘 FAB (Floating Action Button)

### Cerrado
```
    ┌──────┐
    │  ☰   │  ← bg-blue-600, shadow-2xl
    └──────┘     Hover: scale-110 + bg-blue-700
      64x64      Position: fixed bottom-6 right-6
```

### Abierto
```
    ┌──────┐
    │  ✕   │  ← Rotado 90°
    └──────┘
```

## 🌈 Paleta de Colores

### Light Mode
```
Background:    #FFFFFF (white)
Text:          #374151 (gray-700)
Hover:         #EFF6FF (blue-50)
Active:        #2563EB (blue-600)
Border:        #BFDBFE (blue-200)
Overlay:       rgba(0,0,0,0.5)
```

### Dark Mode
```
Background:    #1F2937 (gray-800)
Text:          #D1D5DB (gray-300)
Hover:         #374151 (gray-700)
Active:        #2563EB (blue-600)
Border:        #1E40AF (blue-800)
Overlay:       rgba(0,0,0,0.5)
```

## ⚡ Animaciones

### Timing Functions
```
Drawer entrada:  ease-out (suave al final)
Drawer salida:   ease-in (suave al inicio)
Overlay:         linear
Items hover:     ease-in-out
Chevrons:        ease (default)
```

### Durations
```
Drawer apertura:      300ms
Drawer cierre:        200ms
Overlay fade-in:      300ms
Overlay fade-out:     200ms
Items hover:          200ms
Chevron rotation:     200ms
FAB scale:            300ms
```

## 📱 Responsive Breakpoints

### Desktop (> 1024px)
```
Drawer: 320px ancho fijo (w-80)
Overlay: 100% viewport
FAB: Visible siempre
```

### Tablet (768px - 1024px)
```
Drawer: 320px (sin cambios)
Overlay: 100% viewport
FAB: Visible siempre
```

### Mobile (< 768px)
```
Drawer: Podría expandirse a 100% viewport width
        (implementación futura con max-w-sm)
FAB: Más grande? (p-5, w-16 h-16)
```

## 🎯 Z-Index Layers

```
┌─ z-50: Drawer (tope absoluto)
│  ┌─ Header con degradado
│  ├─ Contenido scrolleable
│  └─ Items de navegación
│
├─ z-40: Overlay oscuro
│  └─ Click handler para cerrar
│
├─ z-30: FAB button
│  └─ Siempre accesible
│
├─ z-10: User dropdown (header)
│  └─ Menú de usuario
│
└─ z-0: Contenido principal
   └─ Páginas de la app
```

## 🧪 Estados de Testing Visual

### ✅ Verificar
- [ ] Drawer se desliza suavemente desde la izquierda
- [ ] Overlay aparece con transparencia correcta (50%)
- [ ] Click en overlay cierra el drawer
- [ ] FAB rota 90° al abrir
- [ ] Ícono del FAB cambia (☰ ↔ ✕)
- [ ] Items tienen efecto hover con traslación
- [ ] Items activos tienen fondo azul y sombra
- [ ] Chevrons rotan 180° al expandir
- [ ] Subitems tienen borde azul a la izquierda
- [ ] Scroll funciona dentro del drawer
- [ ] Dark mode se ve correctamente
- [ ] Degradado del header es visible
- [ ] Todas las transiciones son fluidas (60fps)

---

**Resultado**: Menú lateral moderno tipo Material Design con animaciones fluidas y múltiples formas de interacción. 🎨✨

