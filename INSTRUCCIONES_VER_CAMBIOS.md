# 🎬 INSTRUCCIONES PARA VER LOS CAMBIOS

**Cambios realizados**:
1. ✅ Rutas absolutas agregadas a `gemini-rules.md`
2. ✅ Página Protocolos: 2 columnas
3. ✅ Inputs de búsqueda: altura uniforme (h-10)
4. ✅ Botón Editar: color amber-700 (amarillento)

---

## 🚀 Pasos para ver los cambios

### 1. Ubícate en la raíz del proyecto
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem
```

### 2. Reinicia el contenedor frontend
```bash
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml restart nuxt
```

### 3. Espera a que compile (30-60 segundos)

### 4. Abre en navegador
```
http://localhost:3001/protocolos
```

### 5. Verifica los cambios
- ✅ Tarjetas en **2 columnas** (desktop)
- ✅ Inputs de búsqueda **alineados horizontalmente**
- ✅ Botón Editar en **color amarillo/amber**

---

## 🔧 Si necesitas acceder al contenedor para npm commands

```bash
# Desde raíz del proyecto
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem

# Entrar al contenedor
docker-compose -f tms-backend/tms-client-vue/docker-compose.frontend.yml exec nuxt bash

# Dentro del contenedor (si necesitas reinstalar o dev completo)
npm install
npm run dev
```

---

## 📱 Responsive Design

- **Mobile** (< 768px): 1 columna
- **Tablet/Desktop** (≥ 768px): 2 columnas

---

## 📝 Archivos Modificados

1. `/tms-backend/gemini-rules.md` - Rutas absolutas
2. `/tms-backend/tms-client-vue/components/protocolos/ProtocoloList.vue` - UI changes

---

**Listo para revisar** ✅

