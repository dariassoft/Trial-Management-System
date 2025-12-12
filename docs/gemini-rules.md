# Reglas para la Interacción con Gemini en el Proyecto `tms-backend`

## 1. Objetivo del Proyecto
El objetivo principal de este proyecto es desarrollar una API RESTful utilizando NestJS para el sistema de gestión de pruebas (`Trial Management System`). Esta API debe ser robusta, escalable, bien documentada y fácil de mantener.

## 2. Tecnologías Clave
Las siguientes tecnologías son fundamentales para el desarrollo de este proyecto:

*   **Framework**: NestJS (versión 11.x)
*   **Lenguaje**: TypeScript (versión 5.x)
*   **Base de Datos**: MySQL
*   **ORM (Object-Relational Mapper)**: TypeORM (versión 0.3.x)
*   **Documentación de API**: Swagger (a través de `@nestjs/swagger` y `swagger-ui-express`)
*   **Validación y Transformación de Datos**: `class-validator` y `class-transformer`
*   **Gestión de Configuración**: `@nestjs/config`

## 3. Estructura del Proyecto
Se sigue la estructura modular estándar de NestJS. Los módulos deben encapsular funcionalidades relacionadas (e.g., `users`, `products`, `auth`).

## 4. Principios de Desarrollo

### 4.1. Convenciones de Código
*   **TypeScript**: Adherirse a las mejores prácticas de TypeScript, incluyendo tipado estricto.
*   **ESLint/Prettier**: Mantener la consistencia del código siguiendo las configuraciones definidas en `eslint.config.mjs` y `.prettierrc`.
*   **Nomenclatura**:
    *   Clases, interfaces, tipos: `PascalCase`
    *   Funciones, variables: `camelCase`
    *   Archivos: `kebab-case` (e.g., `user.controller.ts`, `auth.module.ts`)

### 4.2. Arquitectura
*   **Modularidad**: Cada funcionalidad principal debe residir en su propio módulo NestJS.
*   **Capas**: Seguir una arquitectura de capas clara (Controladores, Servicios, Repositorios/Entidades).
    *   **Controladores**: Manejan las solicitudes HTTP, validan la entrada y delegan la lógica de negocio a los servicios.
    *   **Servicios**: Contienen la lógica de negocio principal y orquestan las operaciones de datos.
    *   **Entidades/Repositorios**: Interactúan directamente con la base de datos a través de TypeORM.
*   **DTOs (Data Transfer Objects)**: Utilizar DTOs para la validación de entrada y salida de datos en los controladores, aprovechando `class-validator` y `class-transformer`.

### 4.3. Base de Datos
*   **TypeORM**: Utilizar TypeORM para todas las interacciones con la base de datos.
*   **Entidades**: Definir entidades claras y bien tipadas que mapeen a las tablas de la base de datos.
*   **Migraciones**: Se recomienda el uso de migraciones de TypeORM para gestionar cambios en el esquema de la base de datos.

### 4.4. Documentación
*   **Swagger**: Todas las rutas de la API deben estar documentadas utilizando los decoradores de Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`, etc.).
*   **Comentarios**: Utilizar comentarios JSDoc para documentar clases, métodos y propiedades importantes.

### 4.5. Manejo de Errores
*   Implementar un manejo de errores consistente utilizando los mecanismos de excepciones de NestJS (filtros de excepciones, excepciones HTTP).

### 4.6. Configuración
*   Utilizar `@nestjs/config` para gestionar las variables de entorno y la configuración de la aplicación.

## 5. Interacción con Gemini

*   **Claridad**: Las solicitudes a Gemini deben ser claras, concisas y específicas.
*   **Contexto**: Proporcionar siempre el contexto relevante (archivos involucrados, fragmentos de código, objetivo de la tarea).
*   **Validación**: Antes de solicitar una modificación, si es posible, verificar si hay errores o advertencias en el código actual utilizando `analyze_current_file`.
*   **Refactorización**: Si se solicita una refactorización, especificar el objetivo (e.g., mejorar legibilidad, optimizar rendimiento, aplicar un patrón de diseño).
*   **Nuevas Funcionalidades**: Al solicitar nuevas funcionalidades, describir el comportamiento esperado, los endpoints de la API, los modelos de datos y cualquier lógica de negocio relevante.

Este archivo servirá como guía para todas las interacciones futuras, asegurando que las contribuciones de Gemini estén alineadas con los estándares y objetivos del proyecto.
