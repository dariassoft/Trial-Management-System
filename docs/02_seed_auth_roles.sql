-- ==================================================
-- 02_seed_auth_roles.sql
-- ==================================================
-- Seed de Autenticación: Roles + Usuario Superadmin

-- ==================================================
-- INSERTAR ROLES BASE
-- ==================================================

INSERT INTO Rol (nombre_rol, descripcion) VALUES
('Superadministrador', 'Acceso total. Puede gestionar Administradores.');

INSERT INTO Rol (nombre_rol, descripcion) VALUES
('Administrador', 'Puede gestionar Usuarios y asignar roles. Acceso a todo.');

INSERT INTO Rol (nombre_rol, descripcion) VALUES
('Manager', 'Puede crear Labs/Productos, ver Ensayos y Reportes.');

INSERT INTO Rol (nombre_rol, descripcion) VALUES
('Tecnico', 'Puede cargar datos de campo (Ensayos, Mediciones).');

INSERT INTO Rol (nombre_rol, descripcion) VALUES
('Invitado', 'Acceso de solo lectura a laboratorios y ensayos asignados.');

-- ==================================================
-- INSERTAR USUARIO SUPERADMIN INICIAL
-- ==================================================

INSERT INTO Usuario (rol_id_fk, username, password_hash, nombre, apellido, telefono, esta_activo)
SELECT r.rol_id, 'dariassoft@gmail.com', '123456', 'Dario', 'Assoft', '3875789133', TRUE
FROM Rol r
WHERE r.nombre_rol = 'Superadministrador'
AND NOT EXISTS (SELECT 1 FROM Usuario WHERE username = 'dariassoft@gmail.com')
LIMIT 1;

