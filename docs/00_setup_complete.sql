/*
 * ===============================================
 * SETUP COMPLETO DE BASE DE DATOS - TMS
 * ===============================================
 * Este script ejecuta todos los pasos en el orden correcto
 *
 * Orden de ejecución:
 * 1. Crear tablas base (database.sql)
 * 2. Seed de roles y usuario (auth_seed.sql)
 * 3. Catálogos iniciales (cultivo_y_cultivo_variedad.sql)
 * 4. Seed de tipos de ensayo (tipo_ensayo_seed.sql)
 * 5. Alterar Ensayo (alter_ensayo_laboratorio.sql)
 * 6. Alterar Parcela (alter_parcela_nombre.sql)
 */

-- ===============================================
-- PASO 1: CREAR TODAS LAS TABLAS BASE
-- ===============================================
-- Esto incluye: Rol, Usuario, Cultivo, Ensayo, etc.
-- Ver: ../database.sql

-- Eliminar tablas si existen para permitir una recreación limpia
DROP TABLE IF EXISTS Datos_Cosecha;
DROP TABLE IF EXISTS Datos_Campo_Medicion;
DROP TABLE IF EXISTS Datos_Campo;
DROP TABLE IF EXISTS Momento_Evaluacion;
DROP TABLE IF EXISTS Parcela;
DROP TABLE IF EXISTS Bloque;
DROP TABLE IF EXISTS Tratamiento_Producto;
DROP TABLE IF EXISTS Tratamiento;
DROP TABLE IF EXISTS Aplicacion;
DROP TABLE IF EXISTS Producto;
DROP TABLE IF EXISTS Laboratorio;
DROP TABLE IF EXISTS Ensayo;
DROP TABLE IF EXISTS Tipo_Ensayo_EvaluacionDia;
DROP TABLE IF EXISTS Tipo_Ensayo_Variable;
DROP TABLE IF EXISTS Tipo_Ensayo;
DROP TABLE IF EXISTS Protocolo_Variable;
DROP TABLE IF EXISTS Cultivo_Variedad;
DROP TABLE IF EXISTS Cultivo;
DROP TABLE IF EXISTS Usuario_Laboratorio;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Rol;

/*
 * ===============================================
 * 0. TABLAS DE AUTENTICACIÓN Y AUTORIZACIÓN
 * ===============================================
 */

-- Tabla de Roles (para control de acceso basado en roles)
CREATE TABLE Rol (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
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

    FOREIGN KEY (rol_id_fk) REFERENCES Rol(rol_id) ON DELETE RESTRICT,
    CONSTRAINT uk_usuario_username UNIQUE (username)
);

-- Tabla de Laboratorios asignados a Usuarios (M:N)
CREATE TABLE Usuario_Laboratorio (
    usuario_lab_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id_fk INT NOT NULL,
    lab_id_fk INT NOT NULL,

    FOREIGN KEY (usuario_id_fk) REFERENCES Usuario(usuario_id) ON DELETE CASCADE
);

-- Índices para autenticación
CREATE INDEX idx_usuario_username ON Usuario(username);
CREATE INDEX idx_usuario_rol ON Usuario(rol_id_fk);
CREATE INDEX idx_usuario_laboratorio ON Usuario_Laboratorio(usuario_id_fk);

/*
 * ===============================================
 * 1. TABLAS DE CATÁLOGO Y CONFIGURACIÓN
 * ===============================================
 */

-- Tabla de Cultivos (Especies)
CREATE TABLE Cultivo (
    cultivo_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Variedades (ligada a Cultivo)
CREATE TABLE Cultivo_Variedad (
    variedad_id INT AUTO_INCREMENT PRIMARY KEY,
    cultivo_id_fk INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,

    FOREIGN KEY (cultivo_id_fk) REFERENCES Cultivo(cultivo_id) ON DELETE CASCADE,
    UNIQUE(cultivo_id_fk, nombre)
);

CREATE INDEX idx_variedad_cultivo ON Cultivo_Variedad(cultivo_id_fk);

-- Diccionario de variables de medición (debe estar antes de Tipo_Ensayo_Variable)
CREATE TABLE Protocolo_Variable (
    variable_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_variable VARCHAR(100) NOT NULL UNIQUE,
    unidad_medida VARCHAR(30) NULL,
    descripcion TEXT NULL
);

-- Tabla de Tipos de Ensayo
CREATE TABLE IF NOT EXISTS Tipo_Ensayo (
    tipo_ensayo_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL UNIQUE,
    evaluacion_csv VARCHAR(255) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla puente para predefinir las variables por Tipo de Ensayo
CREATE TABLE IF NOT EXISTS Tipo_Ensayo_Variable (
    tipo_ensayo_variable_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_ensayo_id_fk INT NOT NULL,
    variable_id_fk INT NOT NULL,
    orden INT NULL,
    requerido BOOLEAN NOT NULL DEFAULT FALSE,
    unidad_override VARCHAR(30) NULL,
    escala VARCHAR(50) NULL,
    rango_min DECIMAL(10,2) NULL,
    rango_max DECIMAL(10,2) NULL,

    CONSTRAINT fk_tiev_tipo FOREIGN KEY (tipo_ensayo_id_fk) REFERENCES Tipo_Ensayo(tipo_ensayo_id) ON DELETE CASCADE,
    CONSTRAINT fk_tiev_var FOREIGN KEY (variable_id_fk) REFERENCES Protocolo_Variable(variable_id),
    CONSTRAINT uq_tiev UNIQUE (tipo_ensayo_id_fk, variable_id_fk)
);

-- Normalización de días de evaluación para Tipo de Ensayo
CREATE TABLE IF NOT EXISTS Tipo_Ensayo_EvaluacionDia (
    tipo_eval_dia_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_ensayo_id_fk INT NOT NULL,
    dia INT NOT NULL,
    CONSTRAINT fk_tied_tipo FOREIGN KEY (tipo_ensayo_id_fk) REFERENCES Tipo_Ensayo(tipo_ensayo_id) ON DELETE CASCADE,
    CONSTRAINT uq_tied UNIQUE (tipo_ensayo_id_fk, dia)
);

CREATE INDEX idx_tiev_tipo ON Tipo_Ensayo_Variable(tipo_ensayo_id_fk);
CREATE INDEX idx_tiev_var ON Tipo_Ensayo_Variable(variable_id_fk);
CREATE INDEX idx_tied_tipo ON Tipo_Ensayo_EvaluacionDia(tipo_ensayo_id_fk);

-- Tabla de Laboratorios (Empresas)
CREATE TABLE Laboratorio (
    lab_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Productos (Químicos, Biológicos, etc.)
CREATE TABLE Producto (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    lab_id_fk INT,
    nombre_comercial VARCHAR(100) NOT NULL,
    principio_activo VARCHAR(255),
    formulacion VARCHAR(50),

    FOREIGN KEY (lab_id_fk) REFERENCES Laboratorio(lab_id)
);

-- Agregar FK a Usuario_Laboratorio ahora que existe Laboratorio
ALTER TABLE Usuario_Laboratorio
ADD CONSTRAINT fk_usuario_laboratorio FOREIGN KEY (lab_id_fk) REFERENCES Laboratorio(lab_id) ON DELETE CASCADE;

/*
 * ===============================================
 * 2. TABLAS CENTRALES DEL ENSAYO
 * ===============================================
 */

-- Tabla de Ensayo (Protocolo general)
CREATE TABLE Ensayo (
    ensayo_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ensayo VARCHAR(255) NOT NULL,
    version_protocolo VARCHAR(20),
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

    UNIQUE(nombre_ensayo, version_protocolo)
);

-- Tabla de Aplicaciones (Eventos)
CREATE TABLE Aplicacion (
    aplicacion_id INT AUTO_INCREMENT PRIMARY KEY,
    ensayo_id_fk INT NOT NULL,
    nombre_aplicacion VARCHAR(100) DEFAULT 'Primera aplicación',
    fecha_hora DATETIME,
    estadio_cultivo VARCHAR(50),

    -- Condiciones
    temp_c DECIMAL(4, 1),
    humedad_pct DECIMAL(4, 1),
    viento_kmh DECIMAL(4, 1),

    -- Equipo
    equipo_info VARCHAR(255),
    pico_info VARCHAR(100),
    presion_bar DECIMAL(4, 2),

    FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE
);

/*
 * ===============================================
 * 3. TABLAS DE DISEÑO EXPERIMENTAL
 * ===============================================
 */

-- Tabla de Tratamientos
CREATE TABLE Tratamiento (
    tratamiento_id INT AUTO_INCREMENT PRIMARY KEY,
    ensayo_id_fk INT NOT NULL,
    numero_trat INT NOT NULL,
    descripcion TEXT,
    es_testigo BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE,
    UNIQUE(ensayo_id_fk, numero_trat)
);

-- Tabla de unión Tratamiento <-> Producto (Muchos a Muchos)
CREATE TABLE Tratamiento_Producto (
    trat_prod_id INT AUTO_INCREMENT PRIMARY KEY,
    tratamiento_id_fk INT NOT NULL,
    producto_id_fk INT NOT NULL,
    dosis VARCHAR(50),
    unidad_dosis VARCHAR(20) DEFAULT 'cc/ha',

    FOREIGN KEY (tratamiento_id_fk) REFERENCES Tratamiento(tratamiento_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id_fk) REFERENCES Producto(producto_id),
    UNIQUE(tratamiento_id_fk, producto_id_fk)
);

-- Tabla de Bloques (Grupos de parcelas)
CREATE TABLE Bloque (
    bloque_id INT AUTO_INCREMENT PRIMARY KEY,
    ensayo_id_fk INT NOT NULL,
    nombre_bloque VARCHAR(10) NOT NULL,

    FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE,
    UNIQUE(ensayo_id_fk, nombre_bloque)
);

-- Tabla de Parcela (Unidad Experimental)
CREATE TABLE Parcela (
    parcela_id INT AUTO_INCREMENT PRIMARY KEY,
    ensayo_id_fk INT NOT NULL,
    bloque_id_fk INT NOT NULL,
    tratamiento_id_fk INT NOT NULL,
    pos_x_grid INT,
    pos_y_grid INT,

    FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE,
    FOREIGN KEY (bloque_id_fk) REFERENCES Bloque(bloque_id) ON DELETE CASCADE,
    FOREIGN KEY (tratamiento_id_fk) REFERENCES Tratamiento(tratamiento_id) ON DELETE CASCADE,

    UNIQUE(bloque_id_fk, tratamiento_id_fk)
);

/*
 * ===============================================
 * 4. TABLAS DE RECOLECCIÓN DE DATOS
 * ===============================================
 */

-- Momentos de evaluación (3DDA, 7DDA, etc.)
CREATE TABLE Momento_Evaluacion (
    momento_id INT AUTO_INCREMENT PRIMARY KEY,
    aplicacion_id_fk INT NOT NULL,
    nombre_momento VARCHAR(50) NOT NULL,
    dias_despues_aplicacion INT,
    fecha_evaluacion DATE,

    FOREIGN KEY (aplicacion_id_fk) REFERENCES Aplicacion(aplicacion_id) ON DELETE CASCADE,
    UNIQUE(aplicacion_id_fk, nombre_momento)
);

-- Datos de Campo (Mediciones en el tiempo)
CREATE TABLE Datos_Campo (
    dato_campo_id INT AUTO_INCREMENT PRIMARY KEY,
    parcela_id_fk INT NOT NULL,
    momento_id_fk INT NOT NULL,
    observaciones TEXT,

    FOREIGN KEY (parcela_id_fk) REFERENCES Parcela(parcela_id) ON DELETE CASCADE,
    FOREIGN KEY (momento_id_fk) REFERENCES Momento_Evaluacion(momento_id),

    UNIQUE(parcela_id_fk, momento_id_fk)
);

-- Tabla de mediciones por visita (EAV)
CREATE TABLE Datos_Campo_Medicion (
    medicion_id INT AUTO_INCREMENT PRIMARY KEY,
    dato_campo_id_fk INT NOT NULL,
    variable_id_fk INT NOT NULL,
    valor VARCHAR(255) NOT NULL,

    FOREIGN KEY (dato_campo_id_fk) REFERENCES Datos_Campo(dato_campo_id) ON DELETE CASCADE,
    FOREIGN KEY (variable_id_fk) REFERENCES Protocolo_Variable(variable_id),
    UNIQUE(dato_campo_id_fk, variable_id_fk)
);

-- Datos de Cosecha (Trilla)
CREATE TABLE Datos_Cosecha (
    cosecha_id INT AUTO_INCREMENT PRIMARY KEY,
    parcela_id_fk INT NOT NULL,

    fecha_cosecha DATE,
    humedad_pct DECIMAL(5, 2),
    kg_ha_corregido DECIMAL(10, 2),
    gie DECIMAL(10, 2),

    observaciones TEXT,

    FOREIGN KEY (parcela_id_fk) REFERENCES Parcela(parcela_id) ON DELETE CASCADE,
    UNIQUE(parcela_id_fk)
);

/*
 * ===============================================
 * 5. ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
 * ===============================================
 */

CREATE INDEX idx_producto_lab ON Producto(lab_id_fk);
CREATE INDEX idx_aplicacion_ensayo ON Aplicacion(ensayo_id_fk);
CREATE INDEX idx_tratamiento_ensayo ON Tratamiento(ensayo_id_fk);
CREATE INDEX idx_tratprod_trat ON Tratamiento_Producto(tratamiento_id_fk);
CREATE INDEX idx_tratprod_prod ON Tratamiento_Producto(producto_id_fk);
CREATE INDEX idx_bloque_ensayo ON Bloque(ensayo_id_fk);
CREATE INDEX idx_parcela_ensayo ON Parcela(ensayo_id_fk);
CREATE INDEX idx_parcela_bloque ON Parcela(bloque_id_fk);
CREATE INDEX idx_parcela_trat ON Parcela(tratamiento_id_fk);
CREATE INDEX idx_momento_app ON Momento_Evaluacion(aplicacion_id_fk);
CREATE INDEX idx_datocampo_parcela ON Datos_Campo(parcela_id_fk);
CREATE INDEX idx_datocampo_momento ON Datos_Campo(momento_id_fk);
CREATE INDEX idx_cosecha_parcela ON Datos_Cosecha(parcela_id_fk);
CREATE INDEX idx_medicion_visita ON Datos_Campo_Medicion(dato_campo_id_fk);
CREATE INDEX idx_medicion_variable ON Datos_Campo_Medicion(variable_id_fk);

-- ===============================================
-- PASO 2: SEED DE AUTENTICACIÓN (Roles + Usuario)
-- ===============================================

INSERT INTO Rol (nombre_rol, descripcion)
SELECT 'Superadministrador', 'Acceso total. Puede gestionar Administradores.'
    WHERE NOT EXISTS (SELECT 1 FROM Rol WHERE nombre_rol = 'Superadministrador');

INSERT INTO Rol (nombre_rol, descripcion)
SELECT 'Administrador', 'Puede gestionar Usuarios y asignar roles. Acceso a todo.'
    WHERE NOT EXISTS (SELECT 1 FROM Rol WHERE nombre_rol = 'Administrador');

INSERT INTO Rol (nombre_rol, descripcion)
SELECT 'Manager', 'Puede crear Labs/Productos, ver Ensayos y Reportes.'
    WHERE NOT EXISTS (SELECT 1 FROM Rol WHERE nombre_rol = 'Manager');

INSERT INTO Rol (nombre_rol, descripcion)
SELECT 'Tecnico', 'Puede cargar datos de campo (Ensayos, Mediciones).'
    WHERE NOT EXISTS (SELECT 1 FROM Rol WHERE nombre_rol = 'Tecnico');

INSERT INTO Rol (nombre_rol, descripcion)
SELECT 'Invitado', 'Acceso de solo lectura a laboratorios y ensayos asignados.'
    WHERE NOT EXISTS (SELECT 1 FROM Rol WHERE nombre_rol = 'Invitado');

-- Usuario Superadministrador inicial
-- Contraseña en texto plano (se hashea con POST /api/v1/auth/bootstrap-hash)
INSERT INTO Usuario (
    rol_id_fk,
    username,
    password_hash,
    nombre,
    apellido,
    telefono,
    fecha_nacimiento,
    esta_activo
)
SELECT
    r.rol_id,
    'dariassoft@gmail.com',
    '123456',
    'Dario',
    'Assoft',
    '3875789133',
    NULL,
    TRUE
FROM Rol r
WHERE r.nombre_rol = 'Superadministrador'
  AND NOT EXISTS (
    SELECT 1 FROM Usuario WHERE username = 'dariassoft@gmail.com'
);

-- ===============================================
-- PASO 3: CATÁLOGOS INICIALES (Cultivos)
-- ===============================================

INSERT INTO Cultivo (nombre) VALUES
    ('Soja'),
    ('Maiz'),
    ('Barbecho'),
    ('Poroto'),
    ('Mani'),
    ('Otros')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- ===============================================
-- PASO 4: SEED DE TIPOS DE ENSAYO Y VARIABLES
-- ===============================================

-- Inserta variables del diccionario global (Protocolo_Variable)
INSERT INTO Protocolo_Variable (nombre_variable, unidad_medida, descripcion) VALUES
    ('PLANTULAS NORMALES', '%', NULL),
    ('PLANTULAS ANORMALES', '%', NULL),
    ('SEMILLAS MUERTAS', '%', NULL),
    ('LONGITUD DE TALLO', 'CM', NULL),
    ('LONGITUD DE RAICES', 'CM', NULL),
    ('PESO SECO TALLO', 'GR', NULL),
    ('PESO SECO RAICES', 'GR', NULL),
    ('SANIDAD GENERAL', '%', NULL),
    ('PORCENTAJE DE CONTROL GENERAL', '%', NULL),
    ('FITOTOXICIDAD', 'ESCALA', 'Escala 1-9'),
    ('PORCENTAJE DE CONTROL PARA DISTINTAS MALEZAS', 'ESCALA', 'Escala 1-9'),
    ('N° DE PLANTAS POR METROS LINEAL', 'N°/METRO', NULL),
    ('VIGOR PLANTAS', 'ESCALA', 'Escala 1-5'),
    ('ESTADO SANITARIO GENERAL', '%', NULL),
    ('LONGITUD DE PLANTAS', 'CM', NULL),
    ('LONGITUD DE RAICES (CAMPO)', 'CM', NULL),
    ('VIGOR DE RAICES', 'ESCALA', 'Escala 1-5'),
    ('NUMERO DE NODULO/PLANTULAS', 'N°', NULL),
    ('VIGOR AEREO', 'ESCALA', 'Escala 1-5'),
    ('NVI', 'ESCALA', 'Escala 0-1'),
    ('ENFERMEDAD ESCLEROTINIA', NULL, 'Contexto de variables de enfermedad'),
    ('INCIDENCIA', '%', NULL),
    ('SEVERIDAD', '%', NULL),
    ('N° DE ACAROS POR FOLIOLO', 'N°', NULL),
    ('N° DE TIPS ADULTOS POR FOLIOLO', 'N°', NULL),
    ('N° DE TRIPS NINFA POR FOLIOLO', 'N°', NULL),
    ('N° DE MOSCA BLANCA ADULTA', 'N°', NULL),
    ('N° DE NINFA DE MOSCA  BLANCA', 'N°', NULL),
    ('N° DE HUEVOS DE MOSCA BLANCA', 'N°', NULL),
    ('PORCENTAJE DE DESFOLIACIÓN', '%', NULL),
    ('OTROS', NULL, NULL),
    ('N° DE MEDIDORA POR METROS  MENORES A 1,5 CM', 'N°/METRO', NULL),
    ('N° DE MEDIDORA POR METROS  MAYORES A 1,5 CM', 'N°/METRO', NULL),
    ('N° DE ANTICARCIA POR METRO MENORES A 1,5 CM', 'N°/METRO', NULL),
    ('N° DE ANTICARCIA POR METRO MAYORES A 1,5 CM', 'N°/METRO', NULL),
    ('N° DE SPODOPTERA POR METROS MENORES A 1,5 CM', 'N°/METRO', NULL),
    ('N° DE SPODOPTERA POR METROS MAYORES A 1,5 CM', 'N°/METRO', NULL),
    ('PORCENTAJE SECADO TALLO', '%', NULL),
    ('PORCENTAJE SECADO HOJAS', '%', NULL),
    ('PORCENTAJE SECADO CHAUCHA', '%', NULL)
ON DUPLICATE KEY UPDATE unidad_medida = VALUES(unidad_medida), descripcion = VALUES(descripcion);

-- Inserta Tipos de Ensayo
INSERT INTO Tipo_Ensayo (nombre, evaluacion_csv, activo) VALUES
    ('LABORATORIO (TRATAMIENTO DE SEMILLA)', '3,7,14', TRUE),
    ('BARBECHO', '3,7,14,21,28,35', TRUE),
    ('PREEMERGENTES', '3,7,14,21,28,35', TRUE),
    ('TRATAMIENTOS DE SEMILLAS CAMPO', '3,7,14,21,28,35', TRUE),
    ('FOLIARES Y RECUPERADORES', '3,7,14,21,28,35', TRUE),
    ('FUNGICIDA', '3,7,14,21,28,35', TRUE),
    ('INSECTICIDA', '3,7,14,21,28', TRUE),
    ('BACTERICIDA', '3,7,14,21,28', TRUE),
    ('DESECANTES', '3,7,14,21,28', TRUE)
ON DUPLICATE KEY UPDATE evaluacion_csv = VALUES(evaluacion_csv), activo = VALUES(activo);

-- Vincula variables a Tipo: LABORATORIO (TRATAMIENTO DE SEMILLA)
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, pv.unidad_medida, NULL
FROM Tipo_Ensayo te
JOIN (
    SELECT 'PLANTULAS NORMALES' n, 1 orden, TRUE requerido UNION ALL
    SELECT 'PLANTULAS ANORMALES', 2, TRUE UNION ALL
    SELECT 'SEMILLAS MUERTAS', 3, TRUE UNION ALL
    SELECT 'LONGITUD DE TALLO', 4, FALSE UNION ALL
    SELECT 'LONGITUD DE RAICES', 5, FALSE UNION ALL
    SELECT 'PESO SECO TALLO', 6, FALSE UNION ALL
    SELECT 'PESO SECO RAICES', 7, FALSE UNION ALL
    SELECT 'SANIDAD GENERAL', 8, FALSE
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'LABORATORIO (TRATAMIENTO DE SEMILLA)'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), unidad_override = VALUES(unidad_override), escala = VALUES(escala);

-- Vincula variables a Tipo: BARBECHO
INSERT INTO Tipo_Ensayo_Variable (tipo_ensayo_id_fk, variable_id_fk, orden, requerido, unidad_override, escala)
SELECT te.tipo_ensayo_id, pv.variable_id, ord.orden, ord.requerido, NULL, ord.escala
FROM Tipo_Ensayo te
JOIN (
    SELECT 'PORCENTAJE DE CONTROL GENERAL' n, 1 orden, TRUE requerido, NULL escala UNION ALL
    SELECT 'FITOTOXICIDAD', 2, FALSE, '1-9' UNION ALL
    SELECT 'PORCENTAJE DE CONTROL PARA DISTINTAS MALEZAS', 3, FALSE, '1-9'
) ord ON 1=1
JOIN Protocolo_Variable pv ON pv.nombre_variable = ord.n
WHERE te.nombre = 'BARBECHO'
ON DUPLICATE KEY UPDATE orden = VALUES(orden), requerido = VALUES(requerido), escala = VALUES(escala);

-- ===============================================
-- PASO 5: ALTERAR ENSAYO (Agregar columnas)
-- ===============================================

ALTER TABLE Ensayo
  ADD COLUMN IF NOT EXISTS lab_id_fk INT NULL AFTER ensayo_id,
  ADD COLUMN IF NOT EXISTS codigo_labor VARCHAR(50) NULL AFTER nombre_ensayo,
  ADD COLUMN IF NOT EXISTS tipo_ensayo_id_fk INT NULL AFTER version_protocolo;

CREATE INDEX IF NOT EXISTS idx_ensayo_lab ON Ensayo(lab_id_fk);
CREATE INDEX IF NOT EXISTS idx_ensayo_codigo ON Ensayo(codigo_labor);
CREATE INDEX IF NOT EXISTS idx_ensayo_tipo ON Ensayo(tipo_ensayo_id_fk);

ALTER TABLE Ensayo
  ADD CONSTRAINT IF NOT EXISTS fk_ensayo_lab FOREIGN KEY (lab_id_fk) REFERENCES Laboratorio(lab_id),
  ADD CONSTRAINT IF NOT EXISTS fk_ensayo_tipo FOREIGN KEY (tipo_ensayo_id_fk) REFERENCES Tipo_Ensayo(tipo_ensayo_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_ensayo_lab_codigo ON Ensayo(lab_id_fk, codigo_labor);

-- ===============================================
-- PASO 6: ALTERAR PARCELA (Agregar columnas)
-- ===============================================

ALTER TABLE Parcela
  ADD COLUMN IF NOT EXISTS nombre_parcela VARCHAR(50) NULL AFTER tratamiento_id_fk;

CREATE UNIQUE INDEX IF NOT EXISTS uq_parcela_ensayo_nombre ON Parcela(ensayo_id_fk, nombre_parcela);
CREATE INDEX IF NOT EXISTS idx_parcela_nombre ON Parcela(nombre_parcela);

-- ===============================================
-- ✅ SETUP COMPLETO
-- ===============================================
-- La base de datos está lista para usar.
--
-- PRÓXIMO PASO: Hashear la contraseña del usuario
-- Ejecutar: POST /api/v1/auth/bootstrap-hash con { "username": "dariassoft@gmail.com" }
--
-- Luego puedes hacer login en /api/v1/auth/login con:
--   username: dariassoft@gmail.com
--   password: 123456
-- ===============================================

