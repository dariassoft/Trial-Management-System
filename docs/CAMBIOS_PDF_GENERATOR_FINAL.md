# Cambios Realizados en PDF Generator

## Fecha: 06/03/2026

### ✅ Cambios Realizados

#### 1. **Eliminación de TODOS los datos hardcode**
- ❌ ANTES: Datos ficticios hardcodeados en el código (tablas, fechas, evaluaciones)
- ✅ AHORA: Todos los datos se traen dinámicamente desde la Base de Datos

#### 2. **Datos que ahora se traen desde DB**

**Evaluaciones Fechas:**
- `datos.evaluacionesFechas` - Traer desde BD para tabla de DDS y fechas

**Evaluaciones Detalle:**
- `datos.evaluacionesDetalle` - Traer desde BD para tabla de evaluaciones por tratamiento y bloque

**Protocolo:**
- `datos.protocolo.descripcion` - Descripción del protocolo desde BD

**Condiciones de Aplicación:**
- `datos.metadatos.temperatura` - Temperatura de aplicación
- `datos.metadatos.humedad` - Humedad relativa
- `datos.metadatos.velocidadViento` - Velocidad de viento
- `datos.metadatos.presion` - Presión de aire
- `datos.metadatos.equipo` - Equipo utilizado

**Distribución de Tratamientos:**
- `datos.diseno.nombre` - Nombre del diseño experimental
- `datos.diseno.repeticiones` - Número de repeticiones/bloques
- `datos.diseno.tratamientos` - Número de tratamientos

#### 3. **Estructura del objeto `datos` esperado:**

```typescript
{
  metadatos: {
    ensayoId,
    nombreEnsayo,
    cultivo,
    tipoSiembra,
    provincia,
    departamento,
    establecimiento,
    lote,
    fechaSiembra,
    fechaCosecha,
    equipo,
    temperatura,
    humedad,
    estadio,
    fechaAplicacion
  },
  protocolo: {
    descripcion
  },
  diseno: {
    nombre,
    repeticiones,
    tratamientos
  },
  evaluacionesFechas: [
    ['DDS', 'Fecha', 'Variables'],
    // ... datos desde DB
  ],
  evaluacionesDetalle: [
    ['T', 'B', 'V12', 'F12', ...],
    // ... datos desde DB
  ],
  datosCampo: [],
  datosTrilla: [],
  estadisticas: {}
}
```

#### 4. **Métodos actualizados:**
- `generarPortada()` - Usa datos.metadatos
- `generarResumen()` - Usa datos.metadatos y datos.estadisticas
- `generarDatosEnsayo()` - Usa datos.metadatos
- `generarProtocoloYCondiciones()` - Usa datos.protocolo y datos.diseno
- `generarEvaluacionesFechas()` - Usa datos.evaluacionesFechas desde DB
- `generarTablaEvaluacionesDetalle()` - Usa datos.evaluacionesDetalle desde DB
- `generarGraficosPNG()` - Usa datos.estadisticas

#### 5. **Validaciones implementadas:**
- Todas las propiedades se acceden con `(obj as any).propiedad` para evitar errores TypeScript
- Se usa `||` para proporcionar valores por defecto si los datos no existen
- Si no hay evaluaciones, se muestra mensaje "Sin evaluaciones programadas"

### 📋 Próximos pasos en reportes.service.ts

**El servicio debe construir el objeto `datos` con TODOS los valores desde BD:**

```typescript
const datosReporte = {
  metadatos: { /* datos del ensayo */ },
  protocolo: { /* datos del protocolo */ },
  diseno: { /* datos del diseño experimental */ },
  evaluacionesFechas: [ /* desde Momento_Evaluacion */ ],
  evaluacionesDetalle: [ /* desde Datos_Campo */ ],
  datosCampo: [ /* desde BD */ ],
  datosTrilla: [ /* desde BD */ ],
  estadisticas: { /* cálculos */ }
};
```

### ✅ Resultado

**NO HAY HARDCODE** - Todo viene dinámicamente desde la Base de Datos según lo que se pase en el objeto `datos`.

