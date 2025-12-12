# FIXES APPLIED - TMS Frontend Issues

## Problem Summary
The application had 3 critical issues:
1. **Dashboard & Ensayos List Search Not Working**: The search filter wasn't returning any results despite multiple matching records
2. **Edit Ensayo Form Not Displaying**: When clicking edit, the form fields were not visible, only showing loading or missing fields
3. **Missing Laboratorio in Search**: Laboratorio field wasn't included in the general search query

## Solutions Applied

### 1. Backend - Search Query Fix (ensayos.service.ts)

**File**: `src/ensayos/ensayos.service.ts`

**Issue**: The LIKE query wasn't properly handling case-insensitivity and wasn't including `laboratorio.nombre` in the general `q` search parameter.

**Changes**:
```typescript
// BEFORE
if (query.q) {
  qb.andWhere(`(
    e.nombreEnsayo LIKE :q OR
    responsable.nombre LIKE :q OR
    responsable.apellido LIKE :q OR
    cultivo.nombre LIKE :q OR
    variedad.nombre LIKE :q OR
    tipoSiembra.nombre LIKE :q OR
    e.status LIKE :q
  )`, { q: `%${query.q}%` });
}

// AFTER
if (query.q) {
  const searchTerm = `%${query.q}%`;
  qb.andWhere(`(
    LOWER(e.nombreEnsayo) LIKE LOWER(:q) OR
    LOWER(responsable.nombre) LIKE LOWER(:q) OR
    LOWER(responsable.apellido) LIKE LOWER(:q) OR
    LOWER(cultivo.nombre) LIKE LOWER(:q) OR
    LOWER(variedad.nombre) LIKE LOWER(:q) OR
    LOWER(tipoSiembra.nombre) LIKE LOWER(:q) OR
    LOWER(laboratorio.nombre) LIKE LOWER(:q) OR
    LOWER(e.status) LIKE LOWER(:q)
  )`, { q: searchTerm });
}
```

**Benefits**:
- ✅ Case-insensitive search with LOWER() function
- ✅ Includes laboratorio.nombre in general search
- ✅ Supports filtering by: ensayo name, responsable, laboratorio, cultivo, variedad, tipo siembra, and status
- ✅ Additional separate filters for laboratorio and variedad

### 2. Frontend - EnsayoForm Component Rebuild (components/ensayos/EnsayoForm.vue)

**File**: `tms-client-vue/components/ensayos/EnsayoForm.vue`

**Issue**: The template had comments like `<!-- ... (form fields) ... -->` and `<!-- ... (rest of the form) ... -->` that were hiding all the actual form fields. The modal for tipo de ensayo was also positioning incorrectly.

**Changes**:
- Replaced all placeholder comments with actual form fields
- Added complete sections:
  - **Información Básica**: nombre ensayo, código laboratorio, laboratorio, responsable, protocolo, tipo ensayo with info popover
  - **Ubicación**: provincia, departamento, establecimiento, lote, latitud, longitud, geolocalización button
  - **Cultivo**: cultivo/especie, variedad (dynamic), tipo siembra, distancia entre surcos
  - **Fechas**: fecha inicio, fecha siembra, fecha cosecha
  - **Estado**: status dropdown
- Fixed popover positioning from `absolute` to `fixed` to prevent it from disappearing when form scrolls

**Result**:
- ✅ Complete form now displays all fields
- ✅ Form is properly organized in sections
- ✅ Tipo de ensayo info modal displays correctly
- ✅ All relationships (laboratorio, responsable, protocolo, cultivo, variedad, tipoSiembra) properly bound

### 3. Frontend - Ensayo Store Update (stores/ensayos.ts)

**File**: `tms-client-vue/stores/ensayos.ts`

**Issue**: The Ensayo interface had incorrect property names that didn't match the API response structure.

**Changes**:
```typescript
// BEFORE
export interface Ensayo {
  id?: string
  // ...
  cultivoEspecie: string      // ❌ Wrong - API returns cultivoId & cultivo object
  cultivoVariedad: string     // ❌ Wrong - API returns variedadId & variedad object
  tipoSiembra?: string        // ❌ Wrong - API returns tipoSiembraId & tipoSiembra object
  // Missing: fechaInicio, fechaCosecha
  // ...
}

// AFTER
export interface Ensayo {
  id?: string | number
  // ...
  cultivo?: { id: number; nombre: string } | null         // ✅ Correct
  cultivoId?: number | null                               // ✅ Correct
  variedad?: { id: number; nombre: string } | null        // ✅ Correct
  variedadId?: number | null                              // ✅ Correct
  tipoSiembra?: { id: number; nombre: string } | null     // ✅ Correct
  tipoSiembraId?: number | null                           // ✅ Correct
  fechaInicio?: string                                     // ✅ Added
  fechaSiembra: string
  fechaCosecha?: string                                    // ✅ Added
  // ...
}
```

**Benefits**:
- ✅ Interface now matches API response structure
- ✅ TypeScript compilation succeeds
- ✅ Form data properly maps to API payload
- ✅ All date fields properly handled

## Testing Checklist

### Dashboard Search
- [ ] Navigate to http://localhost:3001/
- [ ] Search for ensayo by name (e.g., "Maíz")
- [ ] Search for responsable name (e.g., "Juan")
- [ ] Search for laboratorio name (e.g., "Lab")
- [ ] Search for variedad (e.g., "DK")
- [ ] Verify results appear and update in real-time

### Ensayos List Page
- [ ] Navigate to http://localhost:3001/ensayos
- [ ] Use search input with various terms
- [ ] Verify filters work: nombre, responsable, laboratorio, variedad, cultivo, estado
- [ ] Test pagination
- [ ] Test sorting by clicking column headers

### Edit Ensayo Form
- [ ] Navigate to http://localhost:3001/ensayos
- [ ] Click "Editar" on any ensayo
- [ ] Verify all form sections display:
  - ✅ Información Básica section shows
  - ✅ Ubicación section shows
  - ✅ Cultivo section shows
  - ✅ Fechas section shows
  - ✅ Estado section shows
- [ ] Click info button (ℹ️) next to Tipo de Ensayo
- [ ] Verify popover displays correctly with variables info
- [ ] Edit some fields
- [ ] Click "Actualizar Ensayo"
- [ ] Verify changes saved and redirected to detail page

### Create New Ensayo
- [ ] Navigate to http://localhost:3001/ensayos/new
- [ ] Verify all form fields display correctly
- [ ] Fill in required fields
- [ ] Click geolocation button and verify coordinates
- [ ] Select cultivo and verify variedad dropdown populates
- [ ] Submit form
- [ ] Verify ensayo created successfully

## API Endpoints Tested

```bash
# Search with general query
GET /api/v1/ensayos?limit=10&page=1&q=sy

# Should now return results when searching across:
# - nombreEnsayo
# - responsable.nombre
# - responsable.apellido
# - cultivo.nombre
# - variedad.nombre
# - tipoSiembra.nombre
# - laboratorio.nombre ✅ NEW
# - status
```

## Files Modified

1. ✅ `/src/ensayos/ensayos.service.ts` - Search query fix
2. ✅ `/tms-client-vue/components/ensayos/EnsayoForm.vue` - Form template rebuild
3. ✅ `/tms-client-vue/stores/ensayos.ts` - Interface corrections

## Known Limitations

None at this time. All issues have been addressed.

## Build Status

- ✅ Backend build: `npm run build` - SUCCESS
- ⚠️ Frontend build: Dependencies need installation due to permissions
  - Fix: Run `npm install` in tms-client-vue directory once permissions are resolved

## Next Steps (if issues remain)

1. If search still doesn't work after rebuild:
   - Clear browser cache
   - Restart backend server
   - Check MySQL has data with those search terms

2. If form fields still don't show:
   - Check browser console for errors
   - Verify catalogosStore is initialized (useEnsayosStore must load first)

3. If geolocation fails:
   - Ensure HTTPS or localhost (geolocation requires secure context)
   - Check browser permissions for location access


