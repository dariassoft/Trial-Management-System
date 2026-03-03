# 🔧 DEBUGGING - GENERACIÓN DE REPORTES

## 🚀 Cómo verificar que los datos se están recuperando correctamente

### Paso 1: Verificar la vista previa JSON
```bash
curl http://localhost:3000/api/v1/reportes/ensayo/74/vista-previa
```

**Debería retornar algo como:**
```json
{
  "ensayoId": 74,
  "estadisticas": {
    "T1": { "n": 4, "promedio": 5432.5, ... },
    "T2": { "n": 4, "promedio": 6100.75, ... }
  },
  "resumen": {
    "tratamientoRecomendado": "T2",
    "rendimientoMejor": "6100.8",
    ...
  },
  "datosCampoCount": 8,
  "datosTrillaCount": 8,
  "metadata": { ... }
}
```

Si `datosCampoCount` o `datosTrillaCount` son 0, AQUÍ está el problema.

---

## 🔍 Problemas Comunes y Soluciones

### PROBLEMA 1: datosCampoCount = 0
**Causa**: No hay datos de campo en el ensayo
**Verificar en BD**:
```sql
SELECT * FROM Datos_Campo WHERE parcela_id_fk IN (
  SELECT parcela_id FROM Parcela WHERE ensayo_id_fk = 74
);
```

**Solución**: 
- Asegurar que existen registros en Datos_Campo
- Verificar que están asociados a las parcelas correctas

---

### PROBLEMA 2: datosTrillaCount = 0
**Causa**: No hay datos de cosecha en el ensayo
**Verificar en BD**:
```sql
SELECT * FROM Datos_Cosecha WHERE parcela_id_fk IN (
  SELECT parcela_id FROM Parcela WHERE ensayo_id_fk = 74
);
```

**Solución**:
- Crear registros en Datos_Cosecha para cada parcela
- Asegurar que kgHaCorregido y humedadPct tengan valores

---

### PROBLEMA 3: Datos vacíos o "N/A"
**Causa**: Las relaciones no se cargan correctamente
**Verificar en logs** (dentro del docker):
```bash
docker-compose logs tms-backend | grep "Datos de campo:"
```

Debería mostrar:
```
- Datos de campo: 8 registros
- Datos de trilla: 8 registros
```

Si dice 0, el problema está en `obtenerDatosEnsayo()`

---

## 📊 Estructura de Datos Esperada

### Datos de Campo esperados:
```typescript
[
  {
    tratamiento: 1,
    bloque: "A",
    parcela: "P1",
    "3DDA_FITO": 0,
    "7DDA_FITO": 0.5,
    "14DDA_FITO": 1,
    ...
  }
]
```

### Datos de Trilla esperados:
```typescript
[
  {
    tratamiento: 1,
    bloque: "A",
    parcela: "P1",
    humedad: 13.5,
    kgHa: 5432.5,
    gje: 92.3
  }
]
```

---

## 🧪 Test Manual en Docker

Dentro del contenedor del backend:

```bash
# 1. Verificar que el servicio se inicializa correctamente
docker-compose logs tms-backend | grep "Error\|generación"

# 2. Probar el endpoint
curl http://localhost:3000/api/v1/reportes/ensayo/74/vista-previa

# 3. Ver los logs de la petición
docker-compose logs -f tms-backend
```

---

## ✅ Checklist de Compilación

- [ ] npm run build sin errores
- [ ] No hay "Cannot find module" errors
- [ ] Los logs muestran datos recuperados
- [ ] Endpoint /vista-previa retorna datos
- [ ] PDF se genera (aunque sea vacío, el archivo debe existir)
- [ ] Excel se genera (aunque sea vacío, el archivo debe existir)

---

## 🐛 Si Aún No Funciona

**Revisar estos archivos en orden:**

1. **reportes.controller.ts** - ¿Se llama a `obtenerDatosEnsayo()`?
2. **reportes.service.ts** - ¿Se traen las relaciones correctamente?
3. **Base de datos** - ¿Existen los datos?
4. **Logs** - ¿Qué errores aparecen?

---

## 📝 Notas Importantes

- Los datos se traen con `findOne()` + `relations`
- Cada relación anidada debe estar en el array de `relations`
- Si falta una relación, los datos será `undefined`
- El campo `nombre_variable` en ProtocoloVariable es CRÍTICO

---

**Última actualización**: 2026-02-12

