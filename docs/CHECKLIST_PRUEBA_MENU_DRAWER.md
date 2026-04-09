# ✅ CHECKLIST DE PRUEBA: Menú Drawer Lateral

## 🚀 Cómo Probar

### 1. Iniciar la aplicación
```bash
# Desde la raíz del proyecto
docker compose up

# O desarrollo local
cd tms-client-vue
npm run dev
```

### 2. Acceder a la aplicación
```
URL: http://localhost:3001
Usuario: dariassoft@gmail.com
Password: 123456
```

## 📋 Tests Visuales

### ✅ Test 1: Apertura del Drawer
**Objetivo**: Verificar que el menú se despliega correctamente

1. [ ] Buscar el botón flotante (FAB) en la esquina inferior derecha
2. [ ] Hacer click en el FAB (icono ☰)
3. [ ] **Verificar**:
   - [ ] Aparece un overlay oscuro semi-transparente
   - [ ] El drawer se desliza desde la izquierda con animación suave
   - [ ] El FAB rota 90° y cambia su ícono a ✕
   - [ ] La animación dura ~300ms y es fluida
   - [ ] El drawer tiene ancho de 320px (no ocupa toda la pantalla)
   - [ ] El contenido de la página queda visible pero bloqueado

**Estado esperado**:
```
✓ Overlay visible con 50% opacidad
✓ Drawer completamente visible
✓ FAB muestra ✕
✓ Contenido principal no se desplaza
```

---

### ✅ Test 2: Header del Drawer
**Objetivo**: Verificar el diseño del encabezado

1. [ ] Con el drawer abierto, observar el header
2. [ ] **Verificar**:
   - [ ] Fondo con degradado azul (de blue-600 a blue-700)
   - [ ] Logo con icono 🧭 y fondo blanco semi-transparente
   - [ ] Texto "Navegación" en blanco y negrita
   - [ ] Botón ✕ a la derecha
   - [ ] Hover en botón ✕ muestra efecto visual (bg más claro)

**Estado esperado**:
```
✓ Degradado azul visible
✓ Logo y título bien alineados
✓ Botón cerrar funcional
```

---

### ✅ Test 3: Items del Menú
**Objetivo**: Verificar estilos y comportamiento de los items

1. [ ] Con el drawer abierto, pasar el mouse sobre "Dashboard"
2. [ ] **Verificar**:
   - [ ] El item se mueve ligeramente a la derecha (translate-x-1)
   - [ ] Aparece un fondo azul claro (blue-50)
   - [ ] La transición es suave (200ms)
   - [ ] El cursor cambia a pointer

3. [ ] Navegar a la página de Dashboard
4. [ ] Abrir el drawer nuevamente
5. [ ] **Verificar**:
   - [ ] El item "Dashboard" tiene fondo azul sólido (blue-600)
   - [ ] El texto es blanco
   - [ ] Tiene una sombra (shadow-md)

**Estado esperado**:
```
Normal:  Texto gris, sin fondo
Hover:   Texto igual, fondo blue-50, desplazado 4px →
Activo:  Texto blanco, fondo blue-600, con sombra
```

---

### ✅ Test 4: Secciones Expandibles
**Objetivo**: Verificar comportamiento de acordeones

1. [ ] Con el drawer abierto, hacer click en "📱 Mediciones"
2. [ ] **Verificar**:
   - [ ] El chevron (⌄) rota 180° apuntando hacia arriba (⌃)
   - [ ] Aparecen los subitems con animación suave
   - [ ] Los subitems tienen indentación y borde azul a la izquierda
   - [ ] La transición es fluida

3. [ ] Hacer click nuevamente en "📱 Mediciones"
4. [ ] **Verificar**:
   - [ ] El chevron vuelve a su posición original (⌄)
   - [ ] Los subitems desaparecen con animación
   - [ ] El drawer no se cierra

**Estado esperado**:
```
Colapsado:  Chevron ⌄, subitems ocultos
Expandido:  Chevron ⌃, subitems visibles con borde azul
```

---

### ✅ Test 5: Navegación y Cierre Automático
**Objetivo**: Verificar que navegar cierra el drawer

1. [ ] Con el drawer abierto, hacer click en "🌾 Ensayos"
2. [ ] **Verificar**:
   - [ ] El drawer se cierra automáticamente
   - [ ] El overlay desaparece
   - [ ] El FAB vuelve a mostrar ☰
   - [ ] La navegación se realiza correctamente
   - [ ] La página de Ensayos se carga

**Estado esperado**:
```
✓ Drawer cerrado
✓ FAB con ícono ☰
✓ Página "Ensayos" cargada
✓ Animación de cierre fluida (200ms)
```

---

### ✅ Test 6: Cerrar con Overlay
**Objetivo**: Verificar cierre al hacer click fuera del drawer

1. [ ] Abrir el drawer con el FAB
2. [ ] Hacer click en el área oscura (overlay) fuera del drawer
3. [ ] **Verificar**:
   - [ ] El drawer se cierra con animación
   - [ ] El overlay desaparece
   - [ ] El FAB vuelve a su estado original
   - [ ] No se realiza ninguna navegación

**Estado esperado**:
```
✓ Click en overlay cierra drawer
✓ No navega a otra página
✓ Animación fluida
```

---

### ✅ Test 7: Cerrar con Botón X del Header
**Objetivo**: Verificar botón de cierre del header

1. [ ] Abrir el drawer
2. [ ] Hacer click en el botón ✕ del header
3. [ ] **Verificar**:
   - [ ] El drawer se cierra
   - [ ] El overlay desaparece
   - [ ] El FAB vuelve a mostrar ☰

**Estado esperado**:
```
✓ Botón X funciona correctamente
✓ Cierre completo del drawer
```

---

### ✅ Test 8: Cerrar con FAB
**Objetivo**: Verificar toggle del FAB

1. [ ] Abrir el drawer con el FAB (click 1)
2. [ ] Hacer click nuevamente en el FAB (ahora con ✕)
3. [ ] **Verificar**:
   - [ ] El drawer se cierra
   - [ ] El overlay desaparece
   - [ ] El FAB rota de vuelta y muestra ☰

**Estado esperado**:
```
✓ FAB funciona como toggle
✓ Ícono cambia correctamente (☰ ↔ ✕)
✓ Rotación animada
```

---

### ✅ Test 9: Scroll Interno
**Objetivo**: Verificar que el drawer tiene scroll cuando hay muchos items

1. [ ] Abrir el drawer
2. [ ] Expandir "Mediciones", "Catálogos" y "Admin"
3. [ ] Intentar hacer scroll dentro del drawer
4. [ ] **Verificar**:
   - [ ] El drawer tiene scroll interno (overflow-y-auto)
   - [ ] El scroll funciona suavemente
   - [ ] El contenido fuera del drawer NO se desplaza
   - [ ] El header del drawer permanece fijo (opcional)

**Estado esperado**:
```
✓ Scroll interno funcional
✓ Contenido principal bloqueado
✓ Todos los items accesibles
```

---

### ✅ Test 10: Dark Mode
**Objetivo**: Verificar compatibilidad con tema oscuro

1. [ ] Cambiar al modo oscuro (botón 🌙 en el header)
2. [ ] Abrir el drawer
3. [ ] **Verificar**:
   - [ ] El drawer tiene fondo dark:bg-gray-800
   - [ ] El texto es dark:text-gray-300
   - [ ] Los hovers usan dark:bg-gray-700
   - [ ] El degradado del header se mantiene azul
   - [ ] Los bordes son dark:border-gray-700
   - [ ] El overlay mantiene su opacidad

**Estado esperado**:
```
✓ Drawer visible en dark mode
✓ Contraste adecuado
✓ Hovers visibles
✓ Degradado header visible
```

---

### ✅ Test 11: Subitems con Borde
**Objetivo**: Verificar diseño de subitems

1. [ ] Abrir el drawer
2. [ ] Expandir "📱 Mediciones"
3. [ ] **Verificar**:
   - [ ] Los subitems tienen borde azul a la izquierda (border-l-2)
   - [ ] El borde es blue-200 en light mode
   - [ ] El borde es blue-800 en dark mode
   - [ ] Los subitems están indentados correctamente (ml-8 + pl-3)
   - [ ] Hover en subitems muestra translate-x-1

**Estado esperado**:
```
✓ Borde azul visible
✓ Indentación correcta
✓ Hover funciona en subitems
```

---

### ✅ Test 12: Estado Activo en Subitems
**Objetivo**: Verificar que los subitems también muestran estado activo

1. [ ] Navegar a "/bloques"
2. [ ] Abrir el drawer
3. [ ] Expandir "📱 Mediciones"
4. [ ] **Verificar**:
   - [ ] El item "📐 Bloques y Parcelas" NO tiene estilo activo
   - [ ] Solo los items de primer nivel tienen estado activo azul
   - [ ] (Opcional) Si se implementó, los subitems activos tienen otro estilo

**Nota**: Actualmente solo los items de primer nivel tienen estado activo. Los subitems no lo implementan.

---

### ✅ Test 13: Responsive en Móvil
**Objetivo**: Verificar comportamiento en pantallas pequeñas

1. [ ] Abrir DevTools (F12)
2. [ ] Activar modo responsive y seleccionar iPhone SE (375px)
3. [ ] Abrir el drawer
4. [ ] **Verificar**:
   - [ ] El drawer mantiene 320px de ancho (no ocupa 100%)
   - [ ] El FAB es accesible
   - [ ] Touch funciona correctamente
   - [ ] El overlay cubre toda la pantalla

**Mejora futura**: Hacer que el drawer ocupe 100% en móvil con `max-w-sm lg:w-80`

---

### ✅ Test 14: Permisos por Rol
**Objetivo**: Verificar que los items se muestran según permisos

1. [ ] Login como "Invitado" (si existe)
2. [ ] Abrir el drawer
3. [ ] **Verificar**:
   - [ ] Solo se muestran items permitidos para ese rol
   - [ ] Secciones sin items permitidos no aparecen
   - [ ] Admin section no visible para roles bajos

**Roles de prueba**:
- Superadministrador: Ve todo
- Administrador: Ve casi todo menos permisos
- Manager: Ve operativos
- Tecnico: Ve módulos básicos
- Invitado: Solo dashboard y notificaciones

---

### ✅ Test 15: Performance
**Objetivo**: Verificar que las animaciones son fluidas

1. [ ] Abrir DevTools > Performance
2. [ ] Grabar mientras se abre/cierra el drawer varias veces
3. [ ] **Verificar**:
   - [ ] FPS se mantiene cerca de 60fps
   - [ ] No hay janks (caídas bruscas)
   - [ ] Las transiciones usan GPU (transform, opacity)
   - [ ] No hay repaint innecesario del contenido principal

**Herramientas**:
- Chrome DevTools > Performance > FPS meter
- Chrome DevTools > Rendering > Paint flashing

---

## 🐛 Bugs Conocidos

### Posibles Problemas

1. **Overlay no cubre todo en algunas resoluciones**
   - Solución: Verificar `fixed inset-0` está aplicado

2. **Drawer se corta en pantallas muy pequeñas**
   - Solución: Agregar `max-w-full` al drawer

3. **Z-index conflicto con modales**
   - Solución: Revisar z-index de otros componentes

4. **Scroll de página no bloqueado**
   - Solución: Agregar `overflow-hidden` al body cuando drawer abierto

## 📊 Resumen de Verificación

### Checklist Rápido
- [ ] ✅ Drawer abre desde izquierda con animación
- [ ] ✅ Overlay aparece con transparencia
- [ ] ✅ FAB cambia de ☰ a ✕
- [ ] ✅ Items tienen hover effect
- [ ] ✅ Items activos tienen fondo azul
- [ ] ✅ Secciones expandibles funcionan
- [ ] ✅ Navegación cierra el drawer
- [ ] ✅ Click en overlay cierra el drawer
- [ ] ✅ Botón X cierra el drawer
- [ ] ✅ FAB toggle funciona
- [ ] ✅ Scroll interno funciona
- [ ] ✅ Dark mode se ve bien
- [ ] ✅ Subitems tienen borde azul
- [ ] ✅ Permisos por rol funcionan
- [ ] ✅ Animaciones a 60fps

## 🎯 Criterios de Aceptación

### Mínimo Viable
- ✅ Drawer se abre y cierra sin errores
- ✅ Navegación funciona correctamente
- ✅ Contenido no se desplaza al abrir menú
- ✅ Todas las animaciones son fluidas

### Experiencia Completa
- ✅ Todas las formas de cerrar funcionan
- ✅ Efectos hover son suaves
- ✅ Estados visuales claros (normal/hover/activo)
- ✅ Dark mode perfecto
- ✅ Responsive en todos los tamaños
- ✅ Sin bugs visuales

## 🚀 Siguientes Pasos

Si todos los tests pasan:
1. [ ] Documentar cualquier bug encontrado
2. [ ] Considerar mejoras opcionales (ver docs/MEJORA_MENU_DRAWER_LATERAL.md)
3. [ ] Feedback del usuario final
4. [ ] Iteración basada en uso real

---

**¡Listo para probar!** 🎉

Cualquier problema encontrado, documentarlo con:
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots/video si es posible
- Navegador y versión

