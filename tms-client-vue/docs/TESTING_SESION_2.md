# 🧪 GUÍA DE TESTING SESIÓN 2

**Versión**: 1.0  
**Fecha**: Diciembre 2025  
**Tipo**: Testing Manual - CRUD Ensayos

---

## 📋 INTRODUCCIÓN

Esta guía proporciona instrucciones paso a paso para probar toda la funcionalidad de CRUD de Ensayos implementada en Sesión 2.

**Duración estimada**: 30-45 minutos  
**Requisitos**: Backend y frontend corriendo localmente

---

## ✅ PRE-REQUISITOS

### Servicios Corriendo
- [ ] Backend NestJS corriendo en `http://localhost:3000`
- [ ] Frontend Nuxt corriendo en `http://localhost:3001`
- [ ] MySQL corriendo con datos
- [ ] Swagger accesible en `http://localhost:3000/docs`

### Verificar Acceso
```
✓ Abrir http://localhost:3001 en navegador
✓ Debería redirigir a /login
✓ Swagger debería cargar sin errores
```

---

## 🚀 TEST 1: LOGIN Y NAVEGACIÓN

### Objetivo
Verificar que el login funciona y se puede navegar a ensayos.

### Pasos

1. **Ir a login**
   ```
   URL: http://localhost:3001/login
   ```
   - [ ] Página de login carga
   - [ ] Campos de email/password visibles
   - [ ] Botón "Iniciar sesión" presente

2. **Ingresar credenciales**
   ```
   Email: dariassoft@gmail.com
   Password: 123456
   ```
   - [ ] Campos aceptan input
   - [ ] No hay errores de validación
   - [ ] Botón clickeable

3. **Hacer login**
   - [ ] Clic en "Iniciar sesión"
   - [ ] Spinner/loading aparece
   - [ ] Esperar redirección
   - [ ] Debería ir a dashboard (/)

4. **Navegar a Ensayos**
   - [ ] En dashboard, buscar navegación a Ensayos
   - [ ] URL debería ser `/ensayos`
   - [ ] Debería cargar tabla

---

## 🚀 TEST 2: LISTAR ENSAYOS

### Objetivo
Verificar que la tabla de ensayos carga correctamente.

### Pasos

1. **Verificar página carga**
   ```
   URL: http://localhost:3001/ensayos
   ```
   - [ ] Página carga sin errores
   - [ ] Tabla es visible
   - [ ] Headers de tabla presentes
   - [ ] Console sin errores rojos

2. **Verificar datos**
   - [ ] Si hay ensayos en BD:
     - [ ] Tabla muestra datos
     - [ ] Columnas visibles:
       - [ ] Nombre
       - [ ] Responsable
       - [ ] Cultivo
       - [ ] Variedad
       - [ ] Fecha Siembra
       - [ ] Ubicación
       - [ ] Acciones
   - [ ] Si no hay ensayos:
     - [ ] Mensaje "No hay ensayos" visible

3. **Verificar búsqueda**
   - [ ] Input de búsqueda presente
   - [ ] Escribir nombre de ensayo (si existen)
   - [ ] Tabla filtra en vivo
   - [ ] Buscar por responsable funciona
   - [ ] Buscar por cultivo funciona
   - [ ] Limpiar búsqueda restaura lista

4. **Verificar paginación** (si hay >10 ensayos)
   - [ ] Botones "Anterior" y "Siguiente" presentes
   - [ ] "Anterior" deshabilitado en página 1
   - [ ] "Siguiente" funciona
   - [ ] Número de página muestra
   - [ ] Datos cambian con paginación

5. **Verificar botones**
   - [ ] Botón "+ Nuevo Ensayo" presente
   - [ ] Botones "Ver" presentes en cada fila
   - [ ] Botones "Editar" presentes en cada fila
   - [ ] Botones "Eliminar" presentes en cada fila

---

## 🚀 TEST 3: CREAR ENSAYO

### Objetivo
Verificar que se puede crear un nuevo ensayo correctamente.

### Pasos

1. **Ir a crear**
   ```
   URL: http://localhost:3001/ensayos/new
   O clic en "+ Nuevo Ensayo" desde listado
   ```
   - [ ] Página carga
   - [ ] Título "Crear Nuevo Ensayo" visible
   - [ ] Botón "Atrás" presente
   - [ ] Formulario visible

2. **Verificar secciones del formulario**
   - [ ] **Información Básica**
     - [ ] Nombre Ensayo (input requerido)
     - [ ] Versión Protocolo (input requerido)
     - [ ] Responsable (input opcional)
   
   - [ ] **Ubicación**
     - [ ] Provincia (input requerido)
     - [ ] Departamento (input requerido)
     - [ ] Establecimiento (input opcional)
     - [ ] Lote (input opcional)
     - [ ] Latitud (input numérico opcional)
     - [ ] Longitud (input numérico opcional)
   
   - [ ] **Cultivo**
     - [ ] Especie (select requerido)
     - [ ] Variedad (select requerido)
     - [ ] Tipo de Siembra (input opcional)
     - [ ] Distancia Surcos (input numérico opcional)
     - [ ] Fecha Siembra (date picker requerido)

3. **Validación sin datos**
   - [ ] Dejar todo vacío
   - [ ] Clic en "Crear Ensayo"
   - [ ] Errores aparecen arriba del formulario:
     - "El nombre del ensayo es requerido"
     - "La versión del protocolo es requerida"
     - "La provincia es requerida"
     - "El departamento es requerido"
     - "La especie de cultivo es requerida"
     - "La variedad es requerida"
     - "La fecha de siembra es requerida"

4. **Cargar cultivos**
   - [ ] Click en select "Especie"
   - [ ] Lista de cultivos carga
   - [ ] Options visibles (Soja, Maíz, etc.)
   - [ ] Seleccionar "Soja"

5. **Cargar variedades**
   - [ ] Después de seleccionar cultivo
   - [ ] Click en select "Variedad"
   - [ ] Lista de variedades carga
   - [ ] Options visibles
   - [ ] Seleccionar una variedad

6. **Rellenar formulario válido**
   ```
   Nombre Ensayo: Test Ensayo 001
   Versión Protocolo: v1.0
   Responsable: Juan Pérez
   Provincia: Córdoba
   Departamento: Río Cuarto
   Establecimiento: La Estancia
   Lote: Lote A
   Latitud: -38.7465
   Longitud: -64.2419
   Especie: Soja
   Variedad: Asgrow MG4.2
   Tipo Siembra: Directa
   Distancia Surcos: 52
   Fecha Siembra: 2024-11-01
   ```
   - [ ] Todos los campos tienen datos
   - [ ] No hay errores de validación
   - [ ] Los campos se ven bien

7. **Guardar ensayo**
   - [ ] Clic en "Crear Ensayo"
   - [ ] Loading spinner aparece
   - [ ] Esperar respuesta (2-5 segundos)
   - [ ] Debería redirigir a `/ensayos` (listado)
   - [ ] Mensaje "Ensayo creado correctamente" visible
   - [ ] Nuevo ensayo aparece en la tabla
   - [ ] Datos del nuevo ensayo son correctos

8. **Cancelar creación**
   - [ ] Ir a crear nuevamente
   - [ ] Rellenar parcialmente
   - [ ] Clic en "Cancelar"
   - [ ] Debería volver a `/ensayos`
   - [ ] Cambios NO se guardan

---

## 🚀 TEST 4: VER DETALLE

### Objetivo
Verificar que se puede ver los detalles completos de un ensayo.

### Pasos

1. **Ir a detalle**
   ```
   Desde listado, clic en botón "Ver" de cualquier ensayo
   O URL: http://localhost:3001/ensayos/:id
   ```
   - [ ] Página carga
   - [ ] Título del ensayo visible
   - [ ] Fecha de creación visible
   - [ ] Botones "Editar", "Eliminar", "Volver" presentes

2. **Verificar tabs**
   - [ ] Hay 5 tabs:
     1. [ ] Información
     2. [ ] Aplicaciones
     3. [ ] Tratamientos
     4. [ ] Datos de Campo
     5. [ ] Cosecha

3. **Tab Información (activo por defecto)**
   - [ ] Mostrar todas las secciones:
     
     **Información Básica**
     - [ ] Nombre
     - [ ] Versión Protocolo
     - [ ] Responsable
     
     **Ubicación**
     - [ ] Provincia
     - [ ] Departamento
     - [ ] Establecimiento
     
     **Más Ubicación**
     - [ ] Lote
     - [ ] Latitud
     - [ ] Longitud
     
     **Cultivo**
     - [ ] Especie
     - [ ] Variedad
     
     **Siembra**
     - [ ] Fecha Siembra (formateada DD/MM/YYYY)
     - [ ] Tipo Siembra
     - [ ] Distancia Surcos (con unidad "cm")

4. **Verificar otros tabs**
   - [ ] Clic en "Aplicaciones"
     - [ ] Muestra placeholder "se implementará en próximas sesiones"
   - [ ] Clic en "Tratamientos"
     - [ ] Muestra placeholder
   - [ ] Clic en "Datos de Campo"
     - [ ] Muestra placeholder
   - [ ] Clic en "Cosecha"
     - [ ] Muestra placeholder

5. **Botones de acción**
   - [ ] Botón "Editar" presente y clickeable
   - [ ] Botón "Eliminar" presente y clickeable
   - [ ] Botón "Volver" funciona (vuelve a listado)

---

## 🚀 TEST 5: EDITAR ENSAYO

### Objetivo
Verificar que se pueden editar los datos de un ensayo.

### Pasos

1. **Ir a editar**
   ```
   Desde detalle, clic en "Editar"
   O desde listado, clic en "Editar"
   O URL: http://localhost:3001/ensayos/:id/edit
   ```
   - [ ] Página carga
   - [ ] Título "Editar Ensayo" visible
   - [ ] Formulario aparece

2. **Verificar pre-población**
   - [ ] Nombre pre-poblado con valor actual
   - [ ] Versión pre-poblada
   - [ ] Responsable pre-poblado
   - [ ] Provincia pre-poblada
   - [ ] Departamento pre-poblado
   - [ ] Establecimiento pre-poblado
   - [ ] Lote pre-poblado
   - [ ] Latitud pre-poblada
   - [ ] Longitud pre-poblada
   - [ ] Cultivo seleccionado en dropdown
   - [ ] Variedad seleccionada en dropdown
   - [ ] Tipo Siembra pre-poblado
   - [ ] Distancia pre-poblada
   - [ ] Fecha Siembra pre-poblada (formato YYYY-MM-DD)

3. **Editar un campo**
   - [ ] Seleccionar campo "Nombre"
   - [ ] Cambiar a "Test Ensayo Modificado"
   - [ ] Cambiar a otro campo
   - [ ] Cambiar "Responsable" a "Juan Carlos"
   - [ ] Cambiar "Provincia" a "Córdoba" (si fue diferente)

4. **Verificar botón Guardar**
   - [ ] Botón dice "Guardar Cambios" (no "Crear")
   - [ ] Clic en "Guardar Cambios"
   - [ ] Loading spinner aparece
   - [ ] Esperar (2-5 segundos)
   - [ ] Debería redirigir a detalle (`/ensayos/:id`)
   - [ ] Mensaje "Ensayo actualizado correctamente" visible
   - [ ] Los cambios se ven reflejados

5. **Verificar cambios en listado**
   - [ ] Ir a `/ensayos`
   - [ ] Buscar el ensayo modificado
   - [ ] Verificar que los datos están actualizados
   - [ ] Nombre aparece actualizado
   - [ ] Responsable aparece actualizado

6. **Cancelar edición**
   - [ ] Ir a editar de nuevo
   - [ ] Cambiar un campo
   - [ ] Clic en "Cancelar"
   - [ ] Vuelve a detalle
   - [ ] Cambios NO se guardaron

---

## 🚀 TEST 6: ELIMINAR ENSAYO

### Objetivo
Verificar que se puede eliminar un ensayo con confirmación.

### Pasos

1. **Ir a eliminar**
   ```
   Desde detalle, clic en "Eliminar"
   O desde listado, clic en "Eliminar"
   ```
   - [ ] Diálogo modal aparece
   - [ ] Fondo oscuro detrás
   - [ ] Título "¿Eliminar ensayo?" visible
   - [ ] Mensaje informativo visible
   - [ ] Botones "Cancelar" y "Eliminar" presentes

2. **Cancelar eliminación**
   - [ ] Clic en "Cancelar"
   - [ ] Diálogo se cierra
   - [ ] Vuelve a detalle o listado
   - [ ] Ensayo NO se elimina
   - [ ] Verificar en BD que existe

3. **Confirmar eliminación**
   - [ ] Clic en "Eliminar" nuevamente
   - [ ] Diálogo modal aparece
   - [ ] Clic en "Eliminar"
   - [ ] Loading spinner en botón
   - [ ] Esperar (2-5 segundos)
   - [ ] Debería redirigir a `/ensayos` (listado)
   - [ ] Mensaje "Ensayo eliminado correctamente" visible
   - [ ] Ensayo NO aparece en la tabla
   - [ ] Número total de ensayos disminuye

---

## 🚀 TEST 7: BÚSQUEDA AVANZADA

### Objetivo
Verificar que la búsqueda filtra correctamente.

### Pasos

1. **Búsqueda por nombre**
   - [ ] Ir a `/ensayos`
   - [ ] En input de búsqueda, escribir "Soja"
   - [ ] Tabla filtra en vivo
   - [ ] Solo muestra ensayos con "Soja" en el nombre
   - [ ] Limpiar búsqueda restaura lista

2. **Búsqueda por responsable**
   - [ ] Escribir en búsqueda "Juan" (o responsable existente)
   - [ ] Filtra ensayos que tenga ese responsable
   - [ ] Case insensitive funciona (prueba con "juan")
   - [ ] Búsqueda parcial funciona

3. **Búsqueda por cultivo**
   - [ ] Escribir en búsqueda "Maíz"
   - [ ] Filtra ensayos con cultivo Maíz
   - [ ] Búsqueda sin resultados:
     - [ ] Escribe "ZZZZZZ"
     - [ ] Muestra "No se encontraron ensayos..."
     - [ ] Tabla está vacía

4. **Búsqueda combinada**
   - [ ] Crear varios ensayos diferentes
   - [ ] Buscar por diferentes términos
   - [ ] Verificar que filtra correctamente

---

## 🚀 TEST 8: PAGINACIÓN

### Objetivo
Verificar que la paginación funciona correctamente.

**Nota**: Necesitas al menos 11 ensayos para ver paginación.

### Pasos

1. **Crear múltiples ensayos** (al menos 11)
   - [ ] Usando TEST 3 (crear)
   - [ ] Crear 11+ ensayos con nombres diferentes
   - [ ] Esperar a que todos aparezcan en listado

2. **Verificar paginación aparece**
   - [ ] En `/ensayos`
   - [ ] Debajo de la tabla
   - [ ] Controles de paginación visibles
   - [ ] Texto "Mostrando X a Y de Z ensayos"
   - [ ] Botones "Anterior" y "Siguiente" presentes

3. **Botón "Anterior"**
   - [ ] En página 1, debe estar deshabilitado (gris)
   - [ ] Clic no hace nada
   - [ ] En página 2, debe estar habilitado
   - [ ] Clic va a página anterior

4. **Botón "Siguiente"**
   - [ ] En última página, deshabilitado
   - [ ] En página intermedia, habilitado
   - [ ] Clic carga siguiente 10 registros
   - [ ] Tabla se actualiza
   - [ ] Contador de página se actualiza

5. **Navegación de páginas**
   - [ ] Clic "Siguiente" varias veces
   - [ ] Contador aumenta (1 → 2 → 3, etc.)
   - [ ] Datos cambian
   - [ ] Clic "Anterior" decrece
   - [ ] Puedes volver a página 1

---

## 🚀 TEST 9: VALIDACIONES

### Objetivo
Verificar todas las validaciones del formulario.

### Pasos

1. **Campos requeridos**
   - [ ] Ir a crear ensayo
   - [ ] Dejar "Nombre" vacío, intentar guardar
     - [ ] Error: "El nombre del ensayo es requerido"
   - [ ] Llenar nombre, dejar "Versión" vacía
     - [ ] Error: "La versión del protocolo es requerida"
   - [ ] Llenar versión, dejar "Provincia" vacía
     - [ ] Error: "La provincia es requerida"
   - [ ] Verificar para: Departamento, Especie, Variedad, Fecha

2. **Largo máximo**
   - [ ] Nombre: max 255 caracteres
     - [ ] Escribir 256 caracteres
     - [ ] No debería aceptar más
   - [ ] Versión: max 20 caracteres
     - [ ] Escribir 21 caracteres
     - [ ] No debería aceptar más

3. **Validación de fecha**
   - [ ] Ir a crear
   - [ ] En fecha siembra, date picker debe aceptar solo fechas válidas
   - [ ] No permitir fechas futuras (depende de lógica)
   - [ ] Formato debe ser YYYY-MM-DD

4. **Cultivos/Variedades**
   - [ ] Seleccionar cultivo sin variedad
   - [ ] Intentar guardar
   - [ ] Error: "La variedad es requerida"
   - [ ] Seleccionar cultivo
   - [ ] Variedades cargan
   - [ ] Seleccionar variedad
   - [ ] Guardar debería funcionar

5. **Números opcionales**
   - [ ] Latitud/Longitud son opcionales
   - [ ] Dejar vacíos y guardar
   - [ ] Debería guardar sin error
   - [ ] Escribir texto en Latitud
   - [ ] Solo números permiten

---

## 🚀 TEST 10: RESPONSIVIDAD

### Objetivo
Verificar que la UI funciona en diferentes tamaños de pantalla.

### Pasos

1. **Desktop (1920x1080)**
   - [ ] Abrir DevTools (F12)
   - [ ] Desactivar device emulation (Ctrl+Shift+M)
   - [ ] Layout es completo
   - [ ] Columnas de tabla visibles
   - [ ] Formulario bien distribuido
   - [ ] Sin scroll horizontal

2. **Tablet (768x1024)**
   - [ ] DevTools → Device emulation → iPad
   - [ ] Layout cambia a responsivo
   - [ ] Tabla puede tener scroll horizontal
   - [ ] Formulario se apila
   - [ ] Botones accesibles
   - [ ] Texto legible

3. **Mobile (375x667)**
   - [ ] DevTools → Device emulation → iPhone
   - [ ] Layout completamente apilado
   - [ ] Tabla con scroll horizontal (debajo)
   - [ ] Formulario en una columna
   - [ ] Botones tamaño grande
   - [ ] Icónos y emojis visibles
   - [ ] Sin overflow

4. **Verificar elementos clave**
   - [ ] Search input usable en mobile
   - [ ] Botones clickeables con dedo
   - [ ] Campos de formulario suficientemente grandes
   - [ ] Espaciado vertical suficiente
   - [ ] Sin contenido cortado

---

## 🚀 TEST 11: INTEGRACIÓN API

### Objetivo
Verificar que los calls a la API funcionan correctamente.

### Pasos

1. **Abrir DevTools Network**
   - [ ] F12 → Network tab
   - [ ] Limpiar requests (botón de papelera)

2. **Crear ensayo**
   - [ ] Llenar formulario
   - [ ] Clic guardar
   - [ ] En Network tab, buscar request POST
     - [ ] URL: `/api/v1/ensayos`
     - [ ] Method: POST
     - [ ] Status: 201 o 200
     - [ ] Payload tiene todos los campos
     - [ ] Response tiene ID del nuevo ensayo

3. **Ver listado**
   - [ ] Ir a `/ensayos`
   - [ ] En Network, buscar GET request
     - [ ] URL: `/api/v1/ensayos?limit=10&page=1`
     - [ ] Status: 200
     - [ ] Response tiene array de ensayos
     - [ ] Response tiene `total`, `page`, `limit`

4. **Editar ensayo**
   - [ ] Ir a editar
   - [ ] Cambiar algo
   - [ ] Guardar
   - [ ] En Network, buscar PATCH request
     - [ ] URL: `/api/v1/ensayos/:id`
     - [ ] Status: 200
     - [ ] Payload tiene campos actualizados

5. **Eliminar**
   - [ ] Eliminar un ensayo
   - [ ] En Network, buscar DELETE request
     - [ ] URL: `/api/v1/ensayos/:id`
     - [ ] Status: 200

---

## 🚀 TEST 12: MANEJO DE ERRORES

### Objetivo
Verificar que los errores se manejan gracefully.

### Pasos

1. **Error de validación**
   - [ ] Crear ensayo sin campos
   - [ ] Error muestra arriba del formulario
   - [ ] Mensaje es legible
   - [ ] Puedes corregir y intentar de nuevo

2. **Error de API (simular)**
   - [ ] Abrir DevTools Console
   - [ ] Detener servidor backend (docker-compose down)
   - [ ] Intentar crear ensayo
   - [ ] Error muestra claramente:
     - [ ] "Error al crear el ensayo"
     - [ ] No crash
     - [ ] Puedes intentar de nuevo

3. **Token expirado (simular)**
   - [ ] Abrir DevTools Storage → Cookies
   - [ ] Eliminar/modificar token
   - [ ] Intentar crear ensayo
   - [ ] Debería:
     - [ ] Hacer logout automático
     - [ ] Redirigir a login
     - [ ] Mostrar mensaje

4. **No encontrado**
   - [ ] Navegar a `/ensayos/999999`
   - [ ] Ensayo no existe
   - [ ] Muestra error:
     - [ ] "El ensayo no fue encontrado"
     - [ ] Botón volver a listado

---

## 🧪 TESTING CHECKLIST FINAL

### CRUD Ensayos
- [ ] **Crear**: ✓ Funciona
- [ ] **Listar**: ✓ Funciona
- [ ] **Ver detalle**: ✓ Funciona
- [ ] **Editar**: ✓ Funciona
- [ ] **Eliminar**: ✓ Funciona

### Búsqueda y Paginación
- [ ] **Búsqueda**: ✓ Funciona
- [ ] **Paginación**: ✓ Funciona (si hay datos)

### Validación
- [ ] **Campos requeridos**: ✓ Funciona
- [ ] **Largo máximo**: ✓ Funciona
- [ ] **Formato fecha**: ✓ Funciona
- [ ] **Cultivos/variedades**: ✓ Funciona

### UI/UX
- [ ] **Desktop**: ✓ Responsive
- [ ] **Tablet**: ✓ Responsive
- [ ] **Mobile**: ✓ Responsive
- [ ] **Mensajes**: ✓ Claros
- [ ] **Loading**: ✓ Visible

### API
- [ ] **GET /ensayos**: ✓ Funciona
- [ ] **POST /ensayos**: ✓ Funciona
- [ ] **PATCH /ensayos/:id**: ✓ Funciona
- [ ] **DELETE /ensayos/:id**: ✓ Funciona
- [ ] **Catálogos**: ✓ Funciona

### Errores
- [ ] **Validación**: ✓ Muestra errores
- [ ] **API**: ✓ Maneja errores
- [ ] **Red**: ✓ Maneja desconexión
- [ ] **Token**: ✓ Logout automático

---

## 📊 RESULTADO FINAL

### Tests Pasados: ___/12
- [ ] Test 1: LOGIN
- [ ] Test 2: LISTAR
- [ ] Test 3: CREAR
- [ ] Test 4: VER DETALLE
- [ ] Test 5: EDITAR
- [ ] Test 6: ELIMINAR
- [ ] Test 7: BÚSQUEDA
- [ ] Test 8: PAGINACIÓN
- [ ] Test 9: VALIDACIONES
- [ ] Test 10: RESPONSIVIDAD
- [ ] Test 11: API
- [ ] Test 12: ERRORES

### Bugs Encontrados
```
(Lista aquí cualquier bug encontrado)
1. 
2. 
3. 
```

### Observaciones
```
(Notas generales)
```

---

## ✅ APROBACIÓN

**Tester**: _____________  
**Fecha**: _____________  
**Status**: _____ (APROBADO / RECHAZADO)  

**Firma**: _____________

---

**¡TESTING COMPLETADO! 🎉**

