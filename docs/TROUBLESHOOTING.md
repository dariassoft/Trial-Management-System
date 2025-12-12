# Troubleshooting Guide - TMS Frontend Fixes

## Problem 1: Search Still Not Working

### Symptoms
- Entering search terms returns empty results
- API returns `{"data":[], "meta":{"total":0}}`
- Worked before but not after changes

### Root Causes & Solutions

#### 1.1 Backend not rebuilt
**Check**: Verify the dist folder has recent changes
```bash
ls -lh dist/ensayos/ensayos.service.js
```
Should show current date/time

**Fix**: Rebuild the backend
```bash
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend
npm run build
npm start  # or restart your running instance
```

#### 1.2 Database doesn't have matching data
**Check**: Verify data exists in database
```sql
-- Connect to your MySQL/MariaDB instance
USE tms_database;
SELECT COUNT(*) FROM ensayo;
SELECT DISTINCT nombreEnsayo FROM ensayo LIMIT 5;
```

**Fix**: If no data, seed the database
```bash
cd docs
cat 06_seed_ensayos_prueba.sql | mysql -u user -p tms_database
```

#### 1.3 Browser cache showing old API response
**Check**: Open DevTools → Application → Cache Storage/Clear All

**Fix**: 
```bash
# Hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Or clear all browser cache
Settings → Privacy & Security → Clear browsing data
```

#### 1.4 Laboratorio not being searched
**Check**: Ensure laboratorio table has data and relationships
```sql
SELECT e.nombreEnsayo, e.id, l.nombre as laboratorio 
FROM ensayo e
LEFT JOIN laboratorio l ON e.laboratorio_id = l.id
WHERE l.nombre IS NOT NULL
LIMIT 5;
```

**Fix**: Verify foreign key relationships
```sql
SHOW CREATE TABLE ensayo\G
-- Look for: CONSTRAINT `FK_ensayo_laboratorio` FOREIGN KEY (`laboratorio_id`)
```

## Problem 2: Edit Form Not Displaying

### Symptoms
- Click "Editar" button, page loads but form is blank
- See "Cargando formulario..." message for too long
- Browser console shows errors

### Root Causes & Solutions

#### 2.1 catalogosStore not initialized
**Check**: Open DevTools Console (F12) and see if there are errors:
```javascript
// In console, type:
$nuxt._vm.$pinia._s.get('catalogos')  // Check if catalogos store exists
```

**Fix**: Ensure catalogos store is loading properly
```bash
# Restart the frontend dev server
cd tms-client-vue
npm run dev
```

#### 2.2 Store data not loading
**Check**: Look for API errors in Network tab
- Open DevTools → Network
- Click "Editar" on an ensayo
- Look for failed requests to `/api/v1/catalogos/*`

**Fix**: If catalog endpoints fail, verify they exist
```bash
# Test API endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/catalogos/laboratorios

curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/catalogos/usuarios

curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/catalogos/protocolos
```

#### 2.3 Form component props not being passed
**Check**: In the page file `pages/ensayos/[id]/edit.vue`, verify props
```bash
# The page parent ([id].vue) should pass:
# :ensayo="ensayo" 
# :loading="loading"
# to the child page component
```

**Fix**: Verify the NuxtPage directive in `pages/ensayos/[id].vue` has the props:
```vue
<NuxtPage :ensayo="ensayo" :loading="loading" />
```

#### 2.4 Form fields have wrong data types
**Check**: Console → inspect the form object
```javascript
// In browser console:
store = pinia.state.value.ensayos
console.log(store.currentEnsayo)  // Check structure
```

**Fix**: Verify the Ensayo interface matches API response
- Check that `cultivoId`, `variedadId`, `tipoSiembraId` are numbers or null
- Check that relationship objects (`cultivo`, `variedad`, etc.) are objects or null

## Problem 3: Popover Info Modal Issues

### Symptoms
- Info button (ℹ️) next to Tipo Ensayo doesn't work
- Popover appears outside visible area
- Modal cuts off content

### Root Causes & Solutions

#### 3.1 Popover positioning incorrect
**Check**: Inspect element styling
- Open DevTools → Inspector
- Click info button
- Look for popover div styling

**Fix**: The popover is now set to `position: fixed` instead of `absolute`
- This should position it relative to viewport instead of form
- If still wrong, check for CSS classes overriding the style

#### 3.2 z-index too low
**Check**: Verify z-index in DevTools
- The popover should have `z-50` class (Tailwind: z-index: 50)
- Check if other elements have higher z-index

**Fix**: Add higher z-index if needed
```vue
<div v-if="showInfo" class="fixed z-[9999] ...">  <!-- Increase z-index -->
```

#### 3.3 Variables not loading
**Check**: Look at network requests when clicking info button
- DevTools → Network → Filter for "variables" or "protocolo"
- Should see request to `/catalogos/variables-por-tipo/{id}`

**Fix**: Ensure backend endpoint exists
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/catalogos/variables-por-tipo/1
```

## Problem 4: Date Fields Not Saving

### Symptoms
- Dates show as "Invalid Date"
- Form submits but dates are null in database
- Date picker shows wrong format

### Root Causes & Solutions

#### 4.1 Date format mismatch
**Check**: Verify formatDateForInput function
- Should convert to ISO format (YYYY-MM-DD)
- Input type="date" requires this format

**Fix**: The form has this function:
```typescript
const formatDateForInput = (date: string | Date | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}
```
This is correct.

#### 4.2 Timezone issues
**Check**: Verify database stores dates in UTC
```sql
SELECT DATE_FORMAT(fechaSiembra, '%Y-%m-%d %H:%i:%S') FROM ensayo LIMIT 1;
```

**Fix**: Ensure backend timezone is set correctly
```typescript
// In create/update DTO, dates are handled as:
...(fechaSiembra && { fechaSiembra: new Date(fechaSiembra) })
// This converts string to Date object for database
```

## Problem 5: Variedad Dropdown Empty

### Symptoms
- Select cultivo/especie
- Variedad dropdown shows "Seleccionar" but no options
- No error messages

### Root Causes & Solutions

#### 5.1 Dynamic loading not triggered
**Check**: Open DevTools Console
- Select a cultivo
- Look for console logs about fetching variedades

**Fix**: The form has this watcher:
```typescript
const onEspecieChange = async () => {
  form.value.variedadId = null
  variedades.value = []
  if (form.value.cultivoId) {
    variedades.value = await catalogosStore.fetchVariedades(form.value.cultivoId)
  }
}
```
Ensure `fetchVariedades` is called on cultivo change.

#### 5.2 API endpoint not returning data
**Check**: Test the endpoint directly
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/catalogos/variedades-por-cultivo/1
```

Should return array of variedades.

**Fix**: If endpoint 404s, check that it exists in backend
```bash
grep -r "variedades-por-cultivo" src/catalogos/
```

#### 5.3 cultivoId not being set
**Check**: Verify v-model binding
```vue
<!-- Should be: -->
<select v-model="form.cultivoId" @change="onEspecieChange">
```

**Fix**: Ensure the select has correct v-model and @change handler

## General Debugging Steps

### 1. Enable Debug Logging
**Frontend**: Open console (F12) and look for Vue logs
**Backend**: Check NestJS logs
```bash
# Terminal running backend should show logs
# If not, enable debug:
DEBUG=* npm start
```

### 2. Network Tab Analysis
- Open DevTools → Network tab
- Perform action (search, edit, etc.)
- Check all requests completed successfully (200 status)
- Look for failed requests (4xx, 5xx errors)
- Examine request/response payloads

### 3. Database Inspection
```bash
# Connect to database
mysql -u root -p tms_database

# Check data exists
SELECT COUNT(*) FROM ensayo;
SELECT COUNT(*) FROM laboratorio;
SELECT COUNT(*) FROM cultivo_variedad;

# Check relationships
SELECT e.nombreEnsayo, l.nombre FROM ensayo e
LEFT JOIN laboratorio l ON e.laboratorio_id = l.id;
```

### 4. API Response Inspection
```bash
# Test search endpoint with sample data
curl -s "http://localhost:3000/api/v1/ensayos?q=test" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" | jq '.'
```

### 5. Browser DevTools
- **Console tab**: Watch for JavaScript errors
- **Network tab**: Watch for failed API requests
- **Storage tab**: Check localStorage for token/session
- **Application tab**: Check if Pinia stores are loaded

## Quick Reset Procedure

If all else fails, try a complete reset:

```bash
# 1. Stop both frontend and backend
# Ctrl+C in both terminals

# 2. Clear caches
cd /media/Datos/Projects/WebstormProjects/TrialManagementSystem/tms-backend/tms-client-vue
rm -rf .nuxt node_modules/.cache

# 3. Rebuild backend
cd ../
npm run build

# 4. Restart both
# Terminal 1 (Backend):
npm start

# Terminal 2 (Frontend):
cd tms-client-vue
npm run dev

# 5. Clear browser cache
# DevTools → Application → Clear All

# 6. Access http://localhost:3001 and test
```

## Getting Help

If problems persist:

1. Check FIXES_APPLIED.md for what changed
2. Review git diff to see exact changes:
   ```bash
   git diff src/ensayos/ensayos.service.ts
   git diff tms-client-vue/components/ensayos/EnsayoForm.vue
   git diff tms-client-vue/stores/ensayos.ts
   ```

3. Check backend logs for SQL errors:
   ```bash
   # Enable MySQL logging to see actual queries
   ```

4. Create issue with:
   - Browser console errors (F12 Console tab)
   - Network tab errors (F12 Network tab)
   - API response payload
   - Database data verification


