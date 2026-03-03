# ⚠️ EL PDF SE GENERA PERO SIN DATOS - SOLUCIONES

## Problema: PDF vacío o solo con "N/A"

Esto significa que:
- ✅ El PDF se genera correctamente (estructura)
- ❌ Pero los datos no se pasan al PDF

---

## 🔍 Paso 1: Verificar Vista Previa

```bash
curl http://localhost:3000/api/v1/reportes/ensayo/74/vista-previa | jq '.'
```

**Si la vista previa tiene datos**, entonces el problema está en PDF o Excel generators.

**Si la vista previa está vacía**, el problema está en `obtenerDatosEnsayo()`.

---

## ✅ Caso 1: Vista previa CON datos, PDF sin datos

**Problema**: Los datos se recuperan pero no llegan al generador

**Solución**: Revisar que `datosCampo` y `datosTrilla` se pasen correctamente

En `reportes.controller.ts` línea ~45:
```typescript
const { datosCampo, datosTrilla, metadadatos } = 
  await this.reportesService.obtenerDatosEnsayo(ensayoId);

console.log('DEBUG:', { datosCampo, datosTrilla }); // AGREGAR ESTO

const buffer = await this.reportesService.generarPDF(
  datosCampo,    // ✅ Se pasa aquí
  datosTrilla,   // ✅ Se pasa aquí
  metadadatos,
);
```

---

## ❌ Caso 2: Vista previa VACÍA

**Problema**: Los datos no se recuperan de la BD

**Solución A**: Revisar relaciones en `findOne()`

Editar `reportes.service.ts` línea ~43:
```typescript
const ensayo = await this.ensayoRepository.findOne({
  where: { id: ensayoId },
  relations: [
    'laboratorio',
    'cultivo',
    'variedad',
    'tipoSiembra',
    'protocolo',
    'responsable',
    'parcelas',              // ✅ CRÍTICO
    'parcelas.bloque',       // ✅ CRÍTICO
    'parcelas.tratamiento',  // ✅ CRÍTICO
    'parcelas.datosCampo',   // ✅ CRÍTICO
    'parcelas.datosCampo.mediciones',      // ✅ CRÍTICO
    'parcelas.datosCampo.mediciones.variable', // ✅ CRÍTICO
    'parcelas.cosecha',      // ✅ CRÍTICO
  ],
});

console.log('DEBUG - Ensayo cargado:', {
  id: ensayo?.id,
  parcelas: ensayo?.parcelas?.length || 0,
  primeraParcela: {
    datosCampo: ensayo?.parcelas?.[0]?.datosCampo?.length || 0,
    mediciones: ensayo?.parcelas?.[0]?.datosCampo?.[0]?.mediciones?.length || 0,
    cosecha: !!ensayo?.parcelas?.[0]?.cosecha,
  }
});
```

**Solución B**: Agregar más logging

En `reportes.service.ts` línea ~70:
```typescript
if (ensayo.parcelas && ensayo.parcelas.length > 0) {
  console.log(`DEBUG - Parcelas encontradas: ${ensayo.parcelas.length}`);
  
  for (const parcela of ensayo.parcelas) {
    console.log(`  - Parcela ${parcela.id}:`);
    console.log(`    - Datos campo: ${parcela.datosCampo?.length || 0}`);
    console.log(`    - Cosecha: ${parcela.cosecha ? 'Sí' : 'No'}`);
    
    if (parcela.datosCampo?.length > 0) {
      console.log(`      - Mediciones en primer dato: ${parcela.datosCampo[0].mediciones?.length || 0}`);
    }
  }
}
```

---

## 🛠️ Verificación Paso a Paso

### Paso 1: Ver los logs del backend
```bash
docker-compose logs -f tms-backend | grep "DEBUG\|Datos de"
```

### Paso 2: Hacer la petición
```bash
curl http://localhost:3000/api/v1/reportes/ensayo/74/vista-previa
```

### Paso 3: Analizar lo que aparece en los logs

**Ejemplo de logs correctos:**
```
🔄 Generando PDF para ensayo 74
  ✅ Datos de campo: 8 registros
  ✅ Datos de trilla: 4 registros
  ✅ Metadata: {"ensayoId": 74, ...}
  ✅ PDF generado: 45234 bytes
```

**Ejemplo de logs problemáticos:**
```
🔄 Generando PDF para ensayo 74
  ✅ Datos de campo: 0 registros     ⚠️⚠️⚠️ PROBLEMA AQUÍ
  ✅ Datos de trilla: 0 registros    ⚠️⚠️⚠️ PROBLEMA AQUÍ
```

---

## 🔧 Si Sigue sin Funcionar

**Opción A**: Usar QueryBuilder en lugar de relaciones

Reemplazar en `reportes.service.ts`:
```typescript
async obtenerDatosEnsayo(ensayoId: number) {
  // En lugar de findOne + relations, usar QueryBuilder
  const datosCampo = await this.datosCampoRepository
    .createQueryBuilder('dc')
    .leftJoinAndSelect('dc.parcela', 'p')
    .leftJoinAndSelect('p.tratamiento', 't')
    .leftJoinAndSelect('p.bloque', 'b')
    .leftJoinAndSelect('dc.mediciones', 'm')
    .leftJoinAndSelect('m.variable', 'v')
    .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
    .getMany();

  console.log('DEBUG - Datos Campo encontrados:', datosCampo.length);
  
  return datosCampo;
}
```

**Opción B**: Verificar que los nombres de las tablas y columnas sean correctos

En la BD ejecutar:
```sql
SHOW COLUMNS FROM Datos_Campo;
SHOW COLUMNS FROM Datos_Cosecha;
SHOW COLUMNS FROM Protocolo_Variable;
```

Asegurar que los nombres coincidan exactamente (mayúsculas, guiones, etc.)

---

## 📋 Checklist Final

- [ ] Vista previa retorna datos (datosCampoCount > 0)
- [ ] Vista previa retorna estadísticas (T1, T2, etc.)
- [ ] Vista previa retorna resumen con tratamientoRecomendado
- [ ] Logs muestran "Datos de campo: X registros"
- [ ] PDF se descarga sin errores
- [ ] Excel se descarga sin errores
- [ ] PDF contiene información (no solo plantilla vacía)
- [ ] Excel tiene múltiples hojas con datos

---

**Si todo esto pasa y aún no ves datos**, el problema está en `pdf-generator.ts` o `excel-generator.ts`.

En ese caso, revisar que:
1. Los generadores reciben correctamente los datos
2. Los datos se insertan en las celdas/páginas
3. Los bucles iteren sobre datosCampo y datosTrilla

