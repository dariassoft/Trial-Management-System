/*
 * Seed de autenticación y autorización (Roles + Usuario Superadmin)
 * - Idempotente: usa INSERT ... SELECT ... WHERE NOT EXISTS
 * - Compatible con MySQL 8+
 */

-- =========================
-- Roles base (si no existen)
-- =========================
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

-- ==================================================
-- Usuario Superadministrador inicial (si no existe)
-- Contraseña en texto plano: 123456 (se hashea luego
-- con POST /api/v1/auth/bootstrap-hash)
-- ==================================================
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
    '123456',              -- será hasheada por el endpoint bootstrap-hash
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