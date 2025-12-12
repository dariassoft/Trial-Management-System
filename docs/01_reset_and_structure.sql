/*
 * ===============================================
 * TMS - TRIAL MANAGEMENT SYSTEM
 * BASE DE DATOS - SINCRONIZACIÓN COMPLETA
 * ===============================================
 *
 * Este archivo contiene la estructura FINAL de la BD
 * sincronizada con todas las entidades TypeORM del backend
 *
 * Orden de ejecución:
 * 1. Este archivo (00_reset_and_structure.sql)
 * 2. 01_seed_auth_roles.sql
 * 3. 02_seed_catalogos.sql
 * 4. 03_seed_tipos_ensayo.sql
 * 5. 04_seed_laboratorios.sql
 * ===============================================
 */

-- ===============================================
-- ELIMINAR TABLAS EXISTENTES (si existen)
-- ===============================================
DROP TABLE IF EXISTS Foto_Registro;
DROP TABLE IF EXISTS Datos_Campo_Medicion;
DROP TABLE IF EXISTS Datos_Campo;
DROP TABLE IF EXISTS Datos_Cosecha;
DROP TABLE IF EXISTS Momento_Evaluacion;
DROP TABLE IF EXISTS Parcela;
DROP TABLE IF EXISTS Bloque;
DROP TABLE IF EXISTS Tipo_Ensayo_EvaluacionDia;
DROP TABLE IF EXISTS Tipo_Ensayo_Variable;
DROP TABLE IF EXISTS Tipo_Ensayo;
DROP TABLE IF EXISTS Tratamiento_Producto;
DROP TABLE IF EXISTS Tratamiento;
DROP TABLE IF EXISTS Aplicacion;
DROP TABLE IF EXISTS Ensayo;
DROP TABLE IF EXISTS Protocolo_Variable;
DROP TABLE IF EXISTS Producto;
DROP TABLE IF EXISTS Laboratorio;
DROP TABLE IF EXISTS Usuario_Laboratorio;
DROP TABLE IF EXISTS Cultivo_Variedad;
DROP TABLE IF EXISTS Cultivo;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Rol;

-- ===============================================
-- 0. TABLAS DE AUTENTICACIÓN Y AUTORIZACIÓN
-- ===============================================

CREATE TABLE Rol (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Usuario (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id_fk INT NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NULL,
    apellido VARCHAR(100) NULL,
    telefono VARCHAR(50) NULL,
    fecha_nacimiento DATE NULL,
    esta_activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (rol_id_fk) REFERENCES Rol(rol_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_usuario_username ON Usuario(username);
CREATE INDEX idx_usuario_rol ON Usuario(rol_id_fk);
CREATE INDEX idx_usuario_activo ON Usuario(esta_activo);

-- ===============================================
-- 1. TABLAS DE CATÁLOGO Y CONFIGURACIÓN
-- ===============================================

CREATE TABLE Cultivo (
    cultivo_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Cultivo_Variedad (
    variedad_id INT AUTO_INCREMENT PRIMARY KEY,
    cultivo_id_fk INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,

    FOREIGN KEY (cultivo_id_fk) REFERENCES Cultivo(cultivo_id) ON DELETE CASCADE,
    UNIQUE(cultivo_id_fk, nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_variedad_cultivo ON Cultivo_Variedad(cultivo_id_fk);

-- Diccionario de variables de medición
CREATE TABLE Protocolo_Variable (
    variable_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_variable VARCHAR(100) NOT NULL UNIQUE,
    unidad_medida VARCHAR(30) NULL,
    descripcion TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Tipos de Ensayo (Clasificación de ensayos)
CREATE TABLE Tipo_Ensayo (
    tipo_ensayo_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL UNIQUE,
    evaluacion_csv VARCHAR(255) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla puente: Tipo Ensayo <-> Variable (Muchos a Muchos)
CREATE TABLE Tipo_Ensayo_Variable (
    tipo_ensayo_variable_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_ensayo_id_fk INT NOT NULL,
    variable_id_fk INT NOT NULL,
    orden INT NULL,
    requerido BOOLEAN NOT NULL DEFAULT FALSE,
    unidad_override VARCHAR(30) NULL,
    escala VARCHAR(50) NULL,
    rango_min DECIMAL(10,2) NULL,
    rango_max DECIMAL(10,2) NULL,

    FOREIGN KEY (tipo_ensayo_id_fk) REFERENCES Tipo_Ensayo(tipo_ensayo_id) ON DELETE CASCADE,
    FOREIGN KEY (variable_id_fk) REFERENCES Protocolo_Variable(variable_id) ON DELETE CASCADE,
    UNIQUE(tipo_ensayo_id_fk, variable_id_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_tiev_tipo ON Tipo_Ensayo_Variable(tipo_ensayo_id_fk);
CREATE INDEX idx_tiev_var ON Tipo_Ensayo_Variable(variable_id_fk);

-- Tabla de Días de Evaluación por Tipo de Ensayo
CREATE TABLE Tipo_Ensayo_EvaluacionDia (
    tipo_eval_dia_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_ensayo_id_fk INT NOT NULL,
    dia INT NOT NULL,

    FOREIGN KEY (tipo_ensayo_id_fk) REFERENCES Tipo_Ensayo(tipo_ensayo_id) ON DELETE CASCADE,
    UNIQUE(tipo_ensayo_id_fk, dia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_tied_tipo ON Tipo_Ensayo_EvaluacionDia(tipo_ensayo_id_fk);

-- Tabla de Laboratorios
CREATE TABLE Laboratorio (
    lab_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Productos
CREATE TABLE Producto (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    lab_id_fk INT,
    nombre_comercial VARCHAR(100) NOT NULL,
    principio_activo VARCHAR(255),
    formulacion VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (lab_id_fk) REFERENCES Laboratorio(lab_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_producto_lab ON Producto(lab_id_fk);

-- Tabla puente: Usuario <-> Laboratorio (Muchos a Muchos)
CREATE TABLE Usuario_Laboratorio (
    usuario_lab_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id_fk INT NOT NULL,
    lab_id_fk INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id_fk) REFERENCES Usuario(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (lab_id_fk) REFERENCES Laboratorio(lab_id) ON DELETE CASCADE,
    UNIQUE(usuario_id_fk, lab_id_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_usuario_laboratorio ON Usuario_Laboratorio(usuario_id_fk);
CREATE INDEX idx_laboratorio_usuario ON Usuario_Laboratorio(lab_id_fk);

-- ===============================================
-- 2. TABLAS CENTRALES DEL ENSAYO
-- ===============================================

CREATE TABLE Ensayo (
    ensayo_id INT AUTO_INCREMENT PRIMARY KEY,
    lab_id_fk INT NULL,
    nombre_ensayo VARCHAR(255) NOT NULL,
    codigo_labor VARCHAR(50) NULL,
    version_protocolo VARCHAR(20),
    tipo_ensayo_id_fk INT NULL,
    responsable VARCHAR(100),

    -- Ubicación
    provincia VARCHAR(100),
    departamento VARCHAR(100),
    establecimiento VARCHAR(100),
    lote VARCHAR(50),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),

    -- Cultivo
    cultivo_especie VARCHAR(100),
    cultivo_variedad VARCHAR(100),
    tipo_siembra VARCHAR(50),
    dist_surcos_cm DECIMAL(5, 2),
    fecha_siembra DATE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (lab_id_fk) REFERENCES Laboratorio(lab_id) ON DELETE SET NULL,
    FOREIGN KEY (tipo_ensayo_id_fk) REFERENCES Tipo_Ensayo(tipo_ensayo_id) ON DELETE SET NULL,
    UNIQUE(nombre_ensayo, version_protocolo),
    UNIQUE KEY uq_ensayo_lab_codigo (lab_id_fk, codigo_labor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_ensayo_lab ON Ensayo(lab_id_fk);
CREATE INDEX idx_ensayo_codigo ON Ensayo(codigo_labor);
CREATE INDEX idx_ensayo_tipo ON Ensayo(tipo_ensayo_id_fk);
CREATE INDEX idx_ensayo_nombre ON Ensayo(nombre_ensayo);

-- Tabla de Aplicaciones (Eventos de aplicación de tratamientos)
CREATE TABLE Aplicacion (
    aplicacion_id INT AUTO_INCREMENT PRIMARY KEY,
    ensayo_id_fk INT NOT NULL,
    nombre_aplicacion VARCHAR(100) DEFAULT 'Primera aplicación',
    fecha_hora DATETIME,
    estadio_cultivo VARCHAR(50),

    -- Condiciones ambientales
    temp_c DECIMAL(4, 1),
    humedad_pct DECIMAL(4, 1),
    viento_kmh DECIMAL(4, 1),

    -- Equipo
    equipo_info VARCHAR(255),
    pico_info VARCHAR(100),
    presion_bar DECIMAL(4, 2),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_aplicacion_ensayo ON Aplicacion(ensayo_id_fk);

-- ===============================================
-- 3. TABLAS DE DISEÑO EXPERIMENTAL
-- ===============================================

CREATE TABLE Tratamiento (
    tratamiento_id INT AUTO_INCREMENT PRIMARY KEY,
    ensayo_id_fk INT NOT NULL,
    numero_trat INT NOT NULL,
    descripcion TEXT,
    es_testigo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE,
    UNIQUE(ensayo_id_fk, numero_trat)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_tratamiento_ensayo ON Tratamiento(ensayo_id_fk);

-- Tabla puente: Tratamiento <-> Producto (Muchos a Muchos)
CREATE TABLE Tratamiento_Producto (
    trat_prod_id INT AUTO_INCREMENT PRIMARY KEY,
    tratamiento_id_fk INT NOT NULL,
    producto_id_fk INT NOT NULL,
    dosis VARCHAR(50),
    unidad_dosis VARCHAR(20) DEFAULT 'cc/ha',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (tratamiento_id_fk) REFERENCES Tratamiento(tratamiento_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id_fk) REFERENCES Producto(producto_id) ON DELETE CASCADE,
    UNIQUE(tratamiento_id_fk, producto_id_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_tratprod_trat ON Tratamiento_Producto(tratamiento_id_fk);
CREATE INDEX idx_tratprod_prod ON Tratamiento_Producto(producto_id_fk);

-- Tabla de Bloques
CREATE TABLE Bloque (
    bloque_id INT AUTO_INCREMENT PRIMARY KEY,
    ensayo_id_fk INT NOT NULL,
    nombre_bloque VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE,
    UNIQUE(ensayo_id_fk, nombre_bloque)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_bloque_ensayo ON Bloque(ensayo_id_fk);

-- Tabla de Parcelas (Unidad Experimental)
CREATE TABLE Parcela (
    parcela_id INT AUTO_INCREMENT PRIMARY KEY,
    ensayo_id_fk INT NOT NULL,
    bloque_id_fk INT NOT NULL,
    tratamiento_id_fk INT NOT NULL,
    nombre_parcela VARCHAR(50) NULL,
    pos_x_grid INT,
    pos_y_grid INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE,
    FOREIGN KEY (bloque_id_fk) REFERENCES Bloque(bloque_id) ON DELETE CASCADE,
    FOREIGN KEY (tratamiento_id_fk) REFERENCES Tratamiento(tratamiento_id) ON DELETE CASCADE,

    UNIQUE(bloque_id_fk, tratamiento_id_fk),
    UNIQUE KEY uq_parcela_ensayo_nombre (ensayo_id_fk, nombre_parcela)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_parcela_ensayo ON Parcela(ensayo_id_fk);
CREATE INDEX idx_parcela_bloque ON Parcela(bloque_id_fk);
CREATE INDEX idx_parcela_trat ON Parcela(tratamiento_id_fk);
CREATE INDEX idx_parcela_nombre ON Parcela(nombre_parcela);

-- ===============================================
-- 4. TABLAS DE RECOLECCIÓN DE DATOS
-- ===============================================

-- Momentos de Evaluación (3DDA, 7DDA, etc.)
CREATE TABLE Momento_Evaluacion (
    momento_id INT AUTO_INCREMENT PRIMARY KEY,
    aplicacion_id_fk INT NOT NULL,
    nombre_momento VARCHAR(50) NOT NULL,
    dias_despues_aplicacion INT,
    fecha_evaluacion DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (aplicacion_id_fk) REFERENCES Aplicacion(aplicacion_id) ON DELETE CASCADE,
    UNIQUE(aplicacion_id_fk, nombre_momento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_momento_app ON Momento_Evaluacion(aplicacion_id_fk);

-- Datos de Campo (Registro de visitas/mediciones)
CREATE TABLE Datos_Campo (
    dato_campo_id INT AUTO_INCREMENT PRIMARY KEY,
    parcela_id_fk INT NOT NULL,
    momento_id_fk INT NOT NULL,
    observaciones TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (parcela_id_fk) REFERENCES Parcela(parcela_id) ON DELETE CASCADE,
    FOREIGN KEY (momento_id_fk) REFERENCES Momento_Evaluacion(momento_id) ON DELETE CASCADE,

    UNIQUE(parcela_id_fk, momento_id_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_datocampo_parcela ON Datos_Campo(parcela_id_fk);
CREATE INDEX idx_datocampo_momento ON Datos_Campo(momento_id_fk);

-- Mediciones por Visita (Patrón EAV: Entity-Attribute-Value)
CREATE TABLE Datos_Campo_Medicion (
    medicion_id INT AUTO_INCREMENT PRIMARY KEY,
    dato_campo_id_fk INT NOT NULL,
    variable_id_fk INT NOT NULL,
    valor VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (dato_campo_id_fk) REFERENCES Datos_Campo(dato_campo_id) ON DELETE CASCADE,
    FOREIGN KEY (variable_id_fk) REFERENCES Protocolo_Variable(variable_id) ON DELETE CASCADE,
    UNIQUE(dato_campo_id_fk, variable_id_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_medicion_visita ON Datos_Campo_Medicion(dato_campo_id_fk);
CREATE INDEX idx_medicion_variable ON Datos_Campo_Medicion(variable_id_fk);

-- Fotos de Registro
CREATE TABLE Foto_Registro (
    foto_id INT AUTO_INCREMENT PRIMARY KEY,
    dato_campo_id_fk INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NULL,
    fecha_subida TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (dato_campo_id_fk) REFERENCES Datos_Campo(dato_campo_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_foto_datocampo ON Foto_Registro(dato_campo_id_fk);

-- Datos de Cosecha (Trilla)
CREATE TABLE Datos_Cosecha (
    cosecha_id INT AUTO_INCREMENT PRIMARY KEY,
    parcela_id_fk INT NOT NULL,

    fecha_cosecha DATE,
    humedad_pct DECIMAL(5, 2),
    kg_ha_corregido DECIMAL(10, 2),
    gie DECIMAL(10, 2),
    observaciones TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (parcela_id_fk) REFERENCES Parcela(parcela_id) ON DELETE CASCADE,
    UNIQUE(parcela_id_fk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_cosecha_parcela ON Datos_Cosecha(parcela_id_fk);

-- ===============================================
-- ✅ ESTRUCTURA COMPLETADA
-- ===============================================
-- La BD está lista para recibir seeds de datos
-- ===============================================

