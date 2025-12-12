# Decisión de Arquitectura: Refactorización de Protocolos y Tratamientos

## Fecha: 11 de Diciembre de 2025

## Estado: Implementado

## Contexto

Inicialmente, el campo `Ensayo.versionProtocolo` se interpretó como una cadena de texto para identificar la versión de un protocolo. Sin embargo, la necesidad real del negocio es vincular cada `Ensayo` a un `Protocolo` predefinido, donde un `Protocolo` agrupa una serie de `Tratamientos`, y cada `Tratamiento` especifica los `Productos` y sus `Dosis`.

La estructura original no permitía esta granularidad ni la reutilización de conjuntos de tratamientos. La refactorización busca establecer una relación clara y reutilizable entre `Ensayo`, `Protocolo` y `Tratamiento`.

## Decisión

Se ha decidido re-arquitecturar la relación entre Ensayos y Tratamientos introduciendo una nueva entidad `Protocolo` y modificando las relaciones existentes.

### Cambios en la Estructura de Datos (Backend - TypeORM Entities)

1.  **Nueva Entidad `Protocolo`:**
    *   **Propósito:** Actuar como un contenedor maestro para un conjunto de `Tratamientos` que pueden ser aplicados en múltiples `Ensayos`.
    *   **Campos:**
        *   `id` (Primary Key)
        *   `nombre` (VARCHAR, UNIQUE): Nombre descriptivo del protocolo (ej. "Protocolo Herbicida Maíz Post-Emergencia").
        *   `descripcion` (TEXT, NULLABLE): Detalles del protocolo.
    *   **Relaciones:** `OneToMany` con `Tratamiento`.

2.  **Modificación de `Tratamiento`:**
    *   **Eliminación:** Se elimina la relación `ManyToOne` con `Ensayo` (`ensayo_id_fk`). Un `Tratamiento` ahora pertenece a un `Protocolo`, no directamente a un `Ensayo`.
    *   **Adición:** Se añade una relación `ManyToOne` con `Protocolo` (`protocolo_id_fk`).
    *   **Restricción `UNIQUE`:** Se actualiza para `['protocolo', 'numeroTrat']`.

3.  **Modificación de `Ensayo`:**
    *   **Eliminación:** Se elimina el campo `versionProtocolo` (VARCHAR).
    *   **Eliminación:** Se elimina la relación `ManyToOne` con `Tratamiento` (`protocoloTratamiento`).
    *   **Adición:** Se añade una relación `ManyToOne` con `Protocolo` (`protocolo_id_fk`).
    *   **Restricción `UNIQUE`:** Se actualiza para `['nombreEnsayo', 'protocolo']`.

### Cambios en la Base de Datos (Scripts SQL)

Se han creado y/o modificado los siguientes scripts SQL para reflejar estos cambios:

*   `11_create_protocolo_table.sql`: Crea la nueva tabla `Protocolo`.
*   `12_alter_tratamiento_add_protocolo_fk.sql`: Modifica la tabla `Tratamiento` para eliminar la FK a `Ensayo` y añadir la FK a `Protocolo`. Incluye correcciones para `DROP COLUMN IF EXISTS` y `DROP FOREIGN KEY IF EXISTS` en MySQL.
*   `13_alter_ensayo_add_protocolo_fk.sql`: Modifica la tabla `Ensayo` para eliminar `version_protocolo` y la FK a `Tratamiento`, y añadir la FK a `Protocolo`. Incluye correcciones para `DROP COLUMN IF EXISTS` y `DROP FOREIGN KEY IF EXISTS` en MySQL.
*   `14_seed_protocolos_tratamientos_productos.sql`: Seeder actualizado para poblar las tablas `Protocolo`, `Tratamiento` y `Tratamiento_Producto` con datos de ejemplo consistentes con la nueva estructura.

**Es CRÍTICO ejecutar estos scripts en el orden especificado después de un `docker-compose down -v` y `docker-compose up --build` para asegurar la integridad de la base de datos.**

### Cambios en el Backend (NestJS)

1.  **Nuevo Módulo `ProtocolosModule`:**
    *   Se creó un módulo completo (`ProtocolosService`, `ProtocolosController`) para gestionar el CRUD de la entidad `Protocolo`.
    *   Se añadió `ProtocolosModule` a `AppModule`.
2.  **Actualización de DTOs:**
    *   `CreateEnsayoDto` y `UpdateEnsayoDto` ahora esperan `protocoloId` (INT) en lugar de `versionProtocolo` (VARCHAR) o `protocoloTratamientoId`.
3.  **Actualización de Servicios:**
    *   `EnsayosService`: Se ajustaron los métodos `create`, `update` y `findOne` para manejar la nueva relación `protocolo`.
    *   `TratamientosService`: Se ajustaron los métodos `create`, `update` y `findAll`/`findOne` para manejar la nueva relación `protocolo` (eliminando la dependencia directa de `Ensayo`).
4.  **Swagger:** La documentación de la API se actualizará automáticamente para reflejar los nuevos endpoints y la estructura de los DTOs.

### Cambios en el Frontend (Nuxt.js/Vue)

1.  **Actualización de `catalogosStore`:**
    *   Se añadió `fetchProtocolos()` para obtener la lista de protocolos disponibles.
    *   Se añadió una propiedad reactiva `protocolos` para almacenar estos datos.
2.  **Actualización de `EnsayoForm.vue`:**
    *   El campo "Versión Protocolo" se reemplazó por un `<select>` que muestra los `Protocolos` disponibles (`protocolosStore.protocolos`).
    *   El `v-model` del formulario ahora apunta a `form.protocolo`.
    *   La lógica de inicialización y el `payload` de `submit` se ajustaron para enviar el `id` del `Protocolo` seleccionado.
3.  **Actualización de `pages/ensayos/[id]/index.vue`:**
    *   La vista de detalles ahora muestra el `nombre` del `Protocolo` asociado al ensayo.

## Consecuencias

*   **Mayor Coherencia:** La estructura de datos ahora refleja mejor la lógica de negocio de protocolos y tratamientos.
*   **Reutilización:** Los protocolos y tratamientos son ahora entidades reutilizables, no atadas a un único ensayo.
*   **Preparación para CRUD:** Se sienta una base sólida para la futura implementación de un CRUD completo para `Protocolos` y `Tratamientos` en el frontend.
*   **Impacto en Datos Existentes:** La migración requiere un reseteo de la base de datos o una migración de datos cuidadosa si hay datos preexistentes que deben conservarse. Para este desarrollo, se asume un reseteo.

## Acciones Futuras

*   Implementar el CRUD completo para `Protocolos` y `Tratamientos` en el frontend.
*   Desarrollar la lógica para asociar `Tratamientos` específicos de un `Protocolo` a un `Ensayo` (más allá de solo el `protocolo_id_fk` en `Ensayo`).
