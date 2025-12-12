/*
 * ===============================================
 * SCRIPT DE CREACIÓN DE BASE DE DATOS
 * PARA GESTIÓN DE ENSAYOS AGRONÓMICOS
 * ===============================================
 */

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
                            nombre_aplicacion VARCHAR(100) DEFAULT 'Primera aplicación', -- Ej. "Primera aplicación", "Post-emergencia"
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
                             numero_trat INT NOT NULL, -- El 1, 2, 3, 4 de tu planilla
                             descripcion TEXT,
                             es_testigo BOOLEAN DEFAULT FALSE,

                             FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE,
                             UNIQUE(ensayo_id_fk, numero_trat) -- No puede haber dos "Tratamiento 1" en el mismo ensayo
);

-- Tabla de unión Tratamiento <-> Producto (Muchos a Muchos)
-- Responde a: "Los producto pueden ser mas de 1 a la vez?" -> SÍ
CREATE TABLE Tratamiento_Producto (
                                      trat_prod_id INT AUTO_INCREMENT PRIMARY KEY,
                                      tratamiento_id_fk INT NOT NULL,
                                      producto_id_fk INT NOT NULL,
                                      dosis VARCHAR(50), -- Se usa VARCHAR para flexibilidad (ej. "800", "800 + 500")
                                      unidad_dosis VARCHAR(20) DEFAULT 'cc/ha', -- ej. cc/ha, gr/ha

                                      FOREIGN KEY (tratamiento_id_fk) REFERENCES Tratamiento(tratamiento_id) ON DELETE CASCADE,
                                      FOREIGN KEY (producto_id_fk) REFERENCES Producto(producto_id),
                                      UNIQUE(tratamiento_id_fk, producto_id_fk) -- No repetir el mismo producto en el mismo tratamiento
);

-- Tabla de Bloques (Grupos de parcelas)
CREATE TABLE Bloque (
                        bloque_id INT AUTO_INCREMENT PRIMARY KEY,
                        ensayo_id_fk INT NOT NULL,
                        nombre_bloque VARCHAR(10) NOT NULL, -- Ej. 'A', 'B', 'C', 'D' o '1', '2', '3', '4'

                        FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE,
                        UNIQUE(ensayo_id_fk, nombre_bloque)
);

-- Tabla de Parcela (Unidad Experimental)
-- Esta es la tabla central que une el DISEÑO
CREATE TABLE Parcela (
                         parcela_id INT AUTO_INCREMENT PRIMARY KEY,
                         ensayo_id_fk INT NOT NULL,
                         bloque_id_fk INT NOT NULL,
                         tratamiento_id_fk INT NOT NULL,
                         pos_x_grid INT, -- Para el mapa de distribución (opcional)
                         pos_y_grid INT, -- Para el mapa de distribución (opcional)

                         FOREIGN KEY (ensayo_id_fk) REFERENCES Ensayo(ensayo_id) ON DELETE CASCADE,
                         FOREIGN KEY (bloque_id_fk) REFERENCES Bloque(bloque_id) ON DELETE CASCADE,
                         FOREIGN KEY (tratamiento_id_fk) REFERENCES Tratamiento(tratamiento_id) ON DELETE CASCADE,

    -- Un tratamiento solo puede estar una vez en cada bloque (Diseño de Bloques Aleatorizados)
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
                                    aplicacion_id_fk INT NOT NULL, -- A qué aplicación se refieren los DDA
                                    nombre_momento VARCHAR(50) NOT NULL, -- Ej. '3DDA', '7DDA', 'Pre-cosecha'
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

    -- Una sola medición por parcela en un momento dado
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
                               gie DECIMAL(10, 2), -- Asumo Gasto de Insumos (o Granos por Espiga?)

                               observaciones TEXT,

    -- Una sola cosecha por parcela
                               FOREIGN KEY (parcela_id_fk) REFERENCES Parcela(parcela_id) ON DELETE CASCADE,
                               UNIQUE(parcela_id_fk)
);


/*
 * ===============================================
 * 5. ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
 * ===============================================
 */

-- Índices en claves foráneas para acelerar los JOINs
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
-- Índices para EAV de Datos_Campo_Medicion
CREATE INDEX idx_medicion_visita ON Datos_Campo_Medicion(dato_campo_id_fk);
CREATE INDEX idx_medicion_variable ON Datos_Campo_Medicion(variable_id_fk);
