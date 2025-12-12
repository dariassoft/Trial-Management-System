/*
 * ===============================================
 * 8. TABLAS DE CATÁLOGO DE CULTIVOS
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

    -- No permitir la misma variedad dos veces en el mismo cultivo
                                  UNIQUE(cultivo_id_fk, nombre)
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_variedad_cultivo ON Cultivo_Variedad(cultivo_id_fk);

/*
 * ===============================================
 * 9. DATOS INICIALES DE CULTIVOS
 * ===============================================
 */
INSERT INTO Cultivo (nombre) VALUES
                                 ('Soja'),
                                 ('Maiz'),
                                 ('Barbecho'),
                                 ('Poroto'),
                                 ('Mani'),
                                 ('Otros');