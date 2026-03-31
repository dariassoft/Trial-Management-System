-- ================================================================
--  TMS — PRUEBA COMPLETA DESDE CERO
--  Ensayo: Fungicida Soja · Sclerotinia · Campo San Martín 2026
-- ================================================================
--  Qué crea este script:
--    1. Productos (4 fungicidas)  — Laboratorio ya existe (lab_id=1)
--    2. Protocolo con 5 Tratamientos + Tratamiento_Producto
--    3. Tipo de Ensayo FUNGICIDA (reutiliza id=6 existente) con días de
--       evaluación y variables (ids 66-70 ya cargados en la BD)
--    4. Ensayo + 4 Bloques (diseño DBCA)
--    5. 20 Parcelas  (4 bloques × 5 tratamientos, randomizadas por bloque)
--    6. Datos_Siembra para cada parcela
--    7. Aplicación foliar + 3 Momentos de evaluación (D0, 14DAA, 28DAA)
--    8. Datos_Campo + Mediciones (60 registros · 5 variables c/u = 300)
--    9. Datos_Cosecha completos (20 parcelas, todos los campos)
-- ----------------------------------------------------------------
--  EJECUTAR:
--    docker exec -i tms-backend-mysql-1 \
--      mysql -umyuser -pmypassword nest_db < test_ensayo_completo.sql
--  Idempotente: la sección 0 elimina los datos previos del script.
-- ================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ================================================================
-- SECCIÓN 0 · LIMPIEZA PREVIA (idempotente)
-- ================================================================
DELETE dcm FROM Datos_Campo_Medicion dcm
  JOIN Datos_Campo dc ON dc.dato_campo_id = dcm.dato_campo_id_fk
  JOIN Parcela p      ON p.parcela_id     = dc.parcela_id_fk
  JOIN Ensayo  e      ON e.ensayo_id      = p.ensayo_id_fk
 WHERE e.codigo_labor = 'PC-2026-001';

DELETE dc FROM Datos_Campo dc
  JOIN Parcela p ON p.parcela_id = dc.parcela_id_fk
  JOIN Ensayo  e ON e.ensayo_id  = p.ensayo_id_fk
 WHERE e.codigo_labor = 'PC-2026-001';

DELETE dcos FROM Datos_Cosecha dcos
  JOIN Parcela p ON p.parcela_id = dcos.parcela_id_fk
  JOIN Ensayo  e ON e.ensayo_id  = p.ensayo_id_fk
 WHERE e.codigo_labor = 'PC-2026-001';

DELETE ds FROM Datos_Siembra ds
  JOIN Parcela p ON p.parcela_id = ds.parcela_id_fk
  JOIN Ensayo  e ON e.ensayo_id  = p.ensayo_id_fk
 WHERE e.codigo_labor = 'PC-2026-001';

DELETE me FROM Momento_Evaluacion me
  JOIN Aplicacion a ON a.aplicacion_id = me.aplicacion_id_fk
  JOIN Ensayo     e ON e.ensayo_id     = a.ensayo_id_fk
 WHERE e.codigo_labor = 'PC-2026-001';

DELETE FROM Aplicacion WHERE ensayo_id_fk IN (
  SELECT ensayo_id FROM Ensayo WHERE codigo_labor = 'PC-2026-001');

DELETE FROM Parcela WHERE ensayo_id_fk IN (
  SELECT ensayo_id FROM Ensayo WHERE codigo_labor = 'PC-2026-001');

DELETE FROM Bloque WHERE ensayo_id_fk IN (
  SELECT ensayo_id FROM Ensayo WHERE codigo_labor = 'PC-2026-001');

DELETE FROM Ensayo WHERE codigo_labor = 'PC-2026-001';

DELETE tp FROM Tratamiento_Producto tp
  JOIN Tratamiento t ON t.tratamiento_id = tp.tratamiento_id_fk
  JOIN Protocolo   p ON p.protocolo_id   = t.protocolo_id_fk
 WHERE p.nombre = 'Protocolo Fungicida Soja - PRUEBA COMPLETA 2026';

DELETE FROM Tratamiento WHERE protocolo_id_fk IN (
  SELECT protocolo_id FROM Protocolo
   WHERE nombre = 'Protocolo Fungicida Soja - PRUEBA COMPLETA 2026');

DELETE FROM Protocolo
 WHERE nombre = 'Protocolo Fungicida Soja - PRUEBA COMPLETA 2026';

DELETE FROM Producto
 WHERE nombre_comercial IN
   ('Amistar Xtra TEST','Nativo TEST','Opera TEST','Comet TEST');

SET FOREIGN_KEY_CHECKS = 1;

-- ================================================================
-- SECCIÓN 1 · PRODUCTOS  (4 fungicidas de 3 laboratorios distintos)
-- ================================================================
INSERT INTO Producto
  (lab_id_fk, nombre_comercial,    principio_activo,
   formulacion, tipo,       unidad, descripcion)
VALUES
  (3, 'Amistar Xtra TEST',
      'Azoxistrobina 20% + Ciproconazol 8%',
      'SC', 'Fungicida', 'cc/ha',
      'Estrobilurina + triazol amplio espectro. Ref. Bayer.'),
  (4, 'Nativo TEST',
      'Trifloxistrobina 15% + Tebuconazol 20%',
      'SC', 'Fungicida', 'cc/ha',
      'Mezcla estrobilurina-triazol alta eficiencia. Ref. Syngenta.'),
  (1, 'Opera TEST',
      'Piraclostrobina 12.8% + Epoxiconazol 4.8%',
      'SE', 'Fungicida', 'cc/ha',
      'Formulación SE para mayor penetración foliar.'),
  (3, 'Comet TEST',
      'Piraclostrobina 25%',
      'EC', 'Fungicida', 'cc/ha',
      'Estrobilurina pura. Complemento en mezcla de tanque.');

SET @id_amistar = LAST_INSERT_ID();
SET @id_nativo  = @id_amistar + 1;
SET @id_opera   = @id_amistar + 2;
SET @id_comet   = @id_amistar + 3;

-- ================================================================
-- SECCIÓN 2 · PROTOCOLO
-- ================================================================
INSERT INTO Protocolo (nombre, descripcion)
VALUES (
  'Protocolo Fungicida Soja - PRUEBA COMPLETA 2026',
  'Evaluación de fungicidas para control de Sclerotinia sclerotiorum '
  'y Phakopsora pachyrhizi en soja de 1.ª. Diseño DBCA 4 bloques, '
  '5 tratamientos. Parcela bruta 5 surcos × 10 m (52 cm entre surcos), '
  'parcela neta 3 surcos × 8 m. Aplicación única estadio R1.'
);

SET @id_proto = LAST_INSERT_ID();

-- ================================================================
-- SECCIÓN 3 · TRATAMIENTOS  (T0 testigo sin aplicación + T1-T4)
-- ================================================================
INSERT INTO Tratamiento
  (protocolo_id_fk, numero_trat, descripcion, es_testigo)
VALUES
  (@id_proto, 1, 'T0 - Testigo sin aplicacion',                            1),
  (@id_proto, 2, 'T1 - Amistar Xtra TEST 500 cc/ha (R1)',                  0),
  (@id_proto, 3, 'T2 - Nativo TEST 400 cc/ha (R1)',                        0),
  (@id_proto, 4, 'T3 - Opera TEST 750 cc/ha (R1)',                         0),
  (@id_proto, 5, 'T4 - Amistar Xtra TEST 500 + Comet TEST 300 cc/ha (R1)', 0);

SET @id_t0 = LAST_INSERT_ID();
SET @id_t1 = @id_t0 + 1;
SET @id_t2 = @id_t0 + 2;
SET @id_t3 = @id_t0 + 3;
SET @id_t4 = @id_t0 + 4;

-- ================================================================
-- SECCIÓN 4 · TRATAMIENTO_PRODUCTO
-- ================================================================
INSERT INTO Tratamiento_Producto
  (tratamiento_id_fk, producto_id_fk, dosis, unidad_dosis, estadio)
VALUES
  (@id_t1, @id_amistar, '500', 'cc/ha', 'R1'),
  (@id_t2, @id_nativo,  '400', 'cc/ha', 'R1'),
  (@id_t3, @id_opera,   '750', 'cc/ha', 'R1'),
  (@id_t4, @id_amistar, '500', 'cc/ha', 'R1'),
  (@id_t4, @id_comet,   '300', 'cc/ha', 'R1');

-- ================================================================
-- SECCIÓN 5 · ENSAYO
--  Reutiliza datos existentes en la BD:
--    lab_id=1          Laboratorio Principal
--    cultivo_id=1      Soja
--    variedad_id=2     DM 4.0i
--    tipo_siembra_id=1 Siembra Directa
--    tipo_ensayo_id=6  FUNGICIDA
--    status_id=4       Completado
--    responsable_id=1  usuario dariassoft
-- ================================================================
INSERT INTO Ensayo (
  lab_id_fk, codigo_labor,   nombre_ensayo,
  protocolo_id_fk, tipo_ensayo_id_fk, responsable_id,
  provincia, departamento, establecimiento, lote,
  latitud, longitud, dist_surcos_cm,
  filas, columnas,
  fecha_inicio, fecha_siembra, fecha_cosecha,
  cultivo_id, variedad_id, tipo_siembra_id,
  status_id_fk
) VALUES (
  1, 'PC-2026-001',
  'PRUEBA COMPLETA 2026 | Fungicida Soja - Campo San Martin',
  @id_proto, 6, 1,
  'Cordoba', 'General San Martin', 'Estancia San Martin', 'Lote Norte 3',
  -32.71234567, -63.38765432, 52.00,
  4, 5,
  '2026-10-20', '2026-11-05', '2027-04-15',
  1, 2, 1,
  4
);

SET @id_ensayo = LAST_INSERT_ID();

-- ================================================================
-- SECCIÓN 6 · BLOQUES  (4 bloques — diseño DBCA)
-- ================================================================
INSERT INTO Bloque (ensayo_id_fk, nombre_bloque) VALUES
  (@id_ensayo, 'I'),
  (@id_ensayo, 'II'),
  (@id_ensayo, 'III'),
  (@id_ensayo, 'IV');

SET @id_b1 = LAST_INSERT_ID();
SET @id_b2 = @id_b1 + 1;
SET @id_b3 = @id_b1 + 2;
SET @id_b4 = @id_b1 + 3;

-- ================================================================
-- SECCIÓN 7 · PARCELAS
--  Randomización real por bloque:
--    Bloque I:   T0 T1 T2 T3 T4
--    Bloque II:  T2 T0 T4 T1 T3
--    Bloque III: T3 T4 T0 T2 T1
--    Bloque IV:  T1 T3 T2 T4 T0
--  pos_x = columna (1-5),  pos_y = fila (1-4)
-- ================================================================

-- Bloque I
INSERT INTO Parcela (ensayo_id_fk, bloque_id_fk, tratamiento_id_fk, nombre_parcela, pos_x_grid, pos_y_grid)
VALUES
  (@id_ensayo,@id_b1,@id_t0,'PC2026-I-1.1',  1,1),
  (@id_ensayo,@id_b1,@id_t1,'PC2026-I-2.1',  2,1),
  (@id_ensayo,@id_b1,@id_t2,'PC2026-I-3.1',  3,1),
  (@id_ensayo,@id_b1,@id_t3,'PC2026-I-4.1',  4,1),
  (@id_ensayo,@id_b1,@id_t4,'PC2026-I-5.1',  5,1);
SET @p1_t0=LAST_INSERT_ID();
SET @p1_t1=@p1_t0+1; SET @p1_t2=@p1_t0+2; SET @p1_t3=@p1_t0+3; SET @p1_t4=@p1_t0+4;

-- Bloque II
INSERT INTO Parcela (ensayo_id_fk, bloque_id_fk, tratamiento_id_fk, nombre_parcela, pos_x_grid, pos_y_grid)
VALUES
  (@id_ensayo,@id_b2,@id_t2,'PC2026-II-1.2', 1,2),
  (@id_ensayo,@id_b2,@id_t0,'PC2026-II-2.2', 2,2),
  (@id_ensayo,@id_b2,@id_t4,'PC2026-II-3.2', 3,2),
  (@id_ensayo,@id_b2,@id_t1,'PC2026-II-4.2', 4,2),
  (@id_ensayo,@id_b2,@id_t3,'PC2026-II-5.2', 5,2);
SET @p2_t2=LAST_INSERT_ID();
SET @p2_t0=@p2_t2+1; SET @p2_t4=@p2_t2+2; SET @p2_t1=@p2_t2+3; SET @p2_t3=@p2_t2+4;

-- Bloque III
INSERT INTO Parcela (ensayo_id_fk, bloque_id_fk, tratamiento_id_fk, nombre_parcela, pos_x_grid, pos_y_grid)
VALUES
  (@id_ensayo,@id_b3,@id_t3,'PC2026-III-1.3',1,3),
  (@id_ensayo,@id_b3,@id_t4,'PC2026-III-2.3',2,3),
  (@id_ensayo,@id_b3,@id_t0,'PC2026-III-3.3',3,3),
  (@id_ensayo,@id_b3,@id_t2,'PC2026-III-4.3',4,3),
  (@id_ensayo,@id_b3,@id_t1,'PC2026-III-5.3',5,3);
SET @p3_t3=LAST_INSERT_ID();
SET @p3_t4=@p3_t3+1; SET @p3_t0=@p3_t3+2; SET @p3_t2=@p3_t3+3; SET @p3_t1=@p3_t3+4;

-- Bloque IV
INSERT INTO Parcela (ensayo_id_fk, bloque_id_fk, tratamiento_id_fk, nombre_parcela, pos_x_grid, pos_y_grid)
VALUES
  (@id_ensayo,@id_b4,@id_t1,'PC2026-IV-1.4', 1,4),
  (@id_ensayo,@id_b4,@id_t3,'PC2026-IV-2.4', 2,4),
  (@id_ensayo,@id_b4,@id_t2,'PC2026-IV-3.4', 3,4),
  (@id_ensayo,@id_b4,@id_t4,'PC2026-IV-4.4', 4,4),
  (@id_ensayo,@id_b4,@id_t0,'PC2026-IV-5.4', 5,4);
SET @p4_t1=LAST_INSERT_ID();
SET @p4_t3=@p4_t1+1; SET @p4_t2=@p4_t1+2; SET @p4_t4=@p4_t1+3; SET @p4_t0=@p4_t1+4;

-- ================================================================
-- SECCIÓN 8 · DATOS DE SIEMBRA (una fila por parcela)
-- ================================================================
INSERT INTO Datos_Siembra
  (parcela_id_fk, fecha_siembra, semillas_por_metro,
   densidad_siembra, germinacion_pct, vigor_plantas_escala, observaciones)
VALUES
-- Bloque I
(@p1_t0,'2026-11-05',16.5,330000,92.5,4,'SD sobre rastrojo maiz. Temp suelo 22C, hum 60%.'),
(@p1_t1,'2026-11-05',16.5,330000,93.0,4,'SD sobre rastrojo maiz. Prof. siembra 3 cm.'),
(@p1_t2,'2026-11-05',16.5,330000,91.8,4,'SD sobre rastrojo maiz. Prof. siembra 3 cm.'),
(@p1_t3,'2026-11-05',16.5,330000,92.2,4,'SD sobre rastrojo maiz. Densidad uniforme.'),
(@p1_t4,'2026-11-05',16.5,330000,93.5,5,'SD sobre rastrojo maiz. Excelente germinacion.'),
-- Bloque II
(@p2_t2,'2026-11-05',16.5,330000,91.0,4,'SD. Hum. suelo 65%. Lluvias previas 48 hs.'),
(@p2_t0,'2026-11-05',16.5,330000,90.5,3,'SD. Sector con mayor hum. por microtopografia.'),
(@p2_t4,'2026-11-05',16.5,330000,92.8,4,'SD. Sector con mayor hum. por microtopografia.'),
(@p2_t1,'2026-11-05',16.5,330000,93.2,4,'SD. Excelente cama de siembra.'),
(@p2_t3,'2026-11-05',16.5,330000,91.5,4,'SD. Buena germinacion. Sin baches.'),
-- Bloque III
(@p3_t3,'2026-11-05',16.5,330000,92.0,4,'SD. Leve pendiente hacia el norte.'),
(@p3_t4,'2026-11-05',16.5,330000,93.8,5,'SD. Mejor emergencia del ensayo.'),
(@p3_t0,'2026-11-05',16.5,330000,89.5,3,'SD. Sector con algo de tosca superficial.'),
(@p3_t2,'2026-11-05',16.5,330000,91.2,4,'SD. Normal. Sin observaciones especiales.'),
(@p3_t1,'2026-11-05',16.5,330000,94.0,5,'SD. Excelente germinacion y vigor.'),
-- Bloque IV
(@p4_t1,'2026-11-05',16.5,330000,92.5,4,'SD. Viento leve SO al momento de siembra.'),
(@p4_t3,'2026-11-05',16.5,330000,91.8,4,'SD. Sin observaciones especiales.'),
(@p4_t2,'2026-11-05',16.5,330000,90.8,3,'SD. Pequenio sector compactado corregido.'),
(@p4_t4,'2026-11-05',16.5,330000,93.0,4,'SD. Muy buena germinacion.'),
(@p4_t0,'2026-11-05',16.5,330000,88.5,3,'SD. Sector con menos vigor por densidad alta.');

-- ================================================================
-- SECCIÓN 9 · APLICACIÓN FOLIAR
-- ================================================================
INSERT INTO Aplicacion
  (ensayo_id_fk, nombre_aplicacion, fecha_hora,
   estadio_cultivo, temp_c, humedad_pct, viento_kmh,
   equipo_info, pico_info, presion_bar)
VALUES (
  @id_ensayo,
  'Aplicacion foliar R1 - inicio floracion soja',
  '2027-01-08 08:30:00',
  'R1', 22.5, 68.0, 8.5,
  'Pulverizadora Jacto Uniport 2500 - 28 m de ancho',
  'TeeJet AIXR 11002 - doble abanico plano antideriva',
  2.80
);

SET @id_aplic = LAST_INSERT_ID();

-- ================================================================
-- SECCIÓN 10 · MOMENTOS DE EVALUACIÓN  (3 momentos)
-- ================================================================
INSERT INTO Momento_Evaluacion
  (aplicacion_id_fk, nombre_momento, dias_despues_aplicacion, fecha_evaluacion)
VALUES
  (@id_aplic, 'Pre-Aplicacion (D0)',  0,  '2027-01-08'),
  (@id_aplic, '14 DAA',              14, '2027-01-22'),
  (@id_aplic, '28 DAA',              28, '2027-02-05');

SET @id_m0  = LAST_INSERT_ID();
SET @id_m14 = @id_m0 + 1;
SET @id_m28 = @id_m0 + 2;

-- ================================================================
-- SECCIÓN 11 · DATOS_CAMPO
--  60 registros = 20 parcelas × 3 momentos
--  Orden del INSERT (determina offsets para mediciones):
--    B1-T0:off0-2  B1-T1:off3-5   B1-T2:off6-8   B1-T3:off9-11  B1-T4:off12-14
--    B2-T2:off15-17 B2-T0:off18-20 B2-T4:off21-23 B2-T1:off24-26 B2-T3:off27-29
--    B3-T3:off30-32 B3-T4:off33-35 B3-T0:off36-38 B3-T2:off39-41 B3-T1:off42-44
--    B4-T1:off45-47 B4-T3:off48-50 B4-T2:off51-53 B4-T4:off54-56 B4-T0:off57-59
--  Dentro de cada parcela: D0 (+0), D14 (+1), D28 (+2)
-- ================================================================
INSERT INTO Datos_Campo (parcela_id_fk, momento_id_fk, observaciones) VALUES
-- B1-T0
(@p1_t0,@id_m0, 'Pre-app. Incidencia esporadica inicial. Sin danos.'),
(@p1_t0,@id_m14,'14 DAA testigo. Avance importante esclerotinia.'),
(@p1_t0,@id_m28,'28 DAA testigo. Alta incidencia. Planta deteriorada.'),
-- B1-T1
(@p1_t1,@id_m0, 'Pre-app. Inicio sintomas similar a testigo.'),
(@p1_t1,@id_m14,'14 DAA T1. Buen control. Leve fitotoxicidad inicial.'),
(@p1_t1,@id_m28,'28 DAA T1. Control sostenido Amistar Xtra.'),
-- B1-T2
(@p1_t2,@id_m0, 'Pre-app. Condicion sanitaria normal.'),
(@p1_t2,@id_m14,'14 DAA T2. Control aceptable Nativo.'),
(@p1_t2,@id_m28,'28 DAA T2. Ligero incremento enfermedad.'),
-- B1-T3
(@p1_t3,@id_m0, 'Pre-app. Sin sintomas evidentes.'),
(@p1_t3,@id_m14,'14 DAA T3. Control moderado Opera.'),
(@p1_t3,@id_m28,'28 DAA T3. Menor residualidad que T1 y T4.'),
-- B1-T4
(@p1_t4,@id_m0, 'Pre-app. Condicion inicial optima.'),
(@p1_t4,@id_m14,'14 DAA T4. Mejor control del ensayo. Mezcla en tanque.'),
(@p1_t4,@id_m28,'28 DAA T4. Menor incidencia registrada.'),
-- B2-T2
(@p2_t2,@id_m0, 'Pre-app. Alta humedad ambiental. Favorece infeccion.'),
(@p2_t2,@id_m14,'14 DAA T2. Control similar a bloque I.'),
(@p2_t2,@id_m28,'28 DAA T2. Mayor presion por humedad en B2.'),
-- B2-T0
(@p2_t0,@id_m0, 'Pre-app. Signos tempranos por alta humedad.'),
(@p2_t0,@id_m14,'14 DAA testigo B2. Alta progresion enfermedad.'),
(@p2_t0,@id_m28,'28 DAA testigo B2. Mayor severidad del ensayo.'),
-- B2-T4
(@p2_t4,@id_m0, 'Pre-app. Condicion normal.'),
(@p2_t4,@id_m14,'14 DAA T4. Excelente control pese a presion.'),
(@p2_t4,@id_m28,'28 DAA T4 B2. Mejor trat incluso en zona humeda.'),
-- B2-T1
(@p2_t1,@id_m0, 'Pre-app. Sin sintomas.'),
(@p2_t1,@id_m14,'14 DAA T1 B2. Buen control.'),
(@p2_t1,@id_m28,'28 DAA T1 B2. Control consistente.'),
-- B2-T3
(@p2_t3,@id_m0, 'Pre-app. Lesiones incipientes.'),
(@p2_t3,@id_m14,'14 DAA T3 B2. Control moderado.'),
(@p2_t3,@id_m28,'28 DAA T3 B2. Incremento moderado de enfermedad.'),
-- B3-T3
(@p3_t3,@id_m0, 'Pre-app. Condicion normal B3.'),
(@p3_t3,@id_m14,'14 DAA T3 B3. Control similar a bloques anteriores.'),
(@p3_t3,@id_m28,'28 DAA T3 B3. Moderado. Consistente con B1.'),
-- B3-T4
(@p3_t4,@id_m0, 'Pre-app. Sin sintomas.'),
(@p3_t4,@id_m14,'14 DAA T4 B3. Control excelente reafirmado.'),
(@p3_t4,@id_m28,'28 DAA T4 B3. Consistencia del tratamiento doble.'),
-- B3-T0
(@p3_t0,@id_m0, 'Pre-app. Incidencia inicial algo menor a B1-B2.'),
(@p3_t0,@id_m14,'14 DAA testigo B3. Progresion fuerte.'),
(@p3_t0,@id_m28,'28 DAA testigo B3. Dano severo sin tratamiento.'),
-- B3-T2
(@p3_t2,@id_m0, 'Pre-app. Normal.'),
(@p3_t2,@id_m14,'14 DAA T2 B3. Buen control inicial.'),
(@p3_t2,@id_m28,'28 DAA T2 B3. Mantiene nivel de control.'),
-- B3-T1
(@p3_t1,@id_m0, 'Pre-app. Sin sintomas.'),
(@p3_t1,@id_m14,'14 DAA T1 B3. Control sostenido.'),
(@p3_t1,@id_m28,'28 DAA T1 B3. Consistencia de Amistar Xtra.'),
-- B4-T1
(@p4_t1,@id_m0, 'Pre-app. Condicion normal B4.'),
(@p4_t1,@id_m14,'14 DAA T1 B4. Buen control.'),
(@p4_t1,@id_m28,'28 DAA T1 B4. Control consistente ultimo bloque.'),
-- B4-T3
(@p4_t3,@id_m0, 'Pre-app. Sin sintomas.'),
(@p4_t3,@id_m14,'14 DAA T3 B4. Control moderado.'),
(@p4_t3,@id_m28,'28 DAA T3 B4. Residualidad menor, ligero avance.'),
-- B4-T2
(@p4_t2,@id_m0, 'Pre-app. Zona algo compactada. Normal.'),
(@p4_t2,@id_m14,'14 DAA T2 B4. Control aceptable.'),
(@p4_t2,@id_m28,'28 DAA T2 B4. Nivel de control esperado.'),
-- B4-T4
(@p4_t4,@id_m0, 'Pre-app. Condicion optima.'),
(@p4_t4,@id_m14,'14 DAA T4 B4. Maximo control bloque 4.'),
(@p4_t4,@id_m28,'28 DAA T4 B4. Resultados consistentes con otros bloques.'),
-- B4-T0
(@p4_t0,@id_m0, 'Pre-app. Incidencia inicial baja en B4.'),
(@p4_t0,@id_m14,'14 DAA testigo B4. Avance importante.'),
(@p4_t0,@id_m28,'28 DAA testigo B4. Alta incidencia sin tratamiento.');

SET @dc_base = LAST_INSERT_ID();

-- ================================================================
-- SECCIÓN 12 · DATOS_CAMPO_MEDICION  (300 filas: 60 DC × 5 variables)
--
--  Variables (tipo_ensayo_id=6, ya existentes en la BD):
--    66  ENFERMEDAD ESCLEROTINIA - INCIDENCIA   (%)
--    67  ENFERMEDAD ESCLEROTINIA - SEVERIDAD    (%)
--    68  FITOTOXICIDAD (FUNGICIDA)               (ESCALA 1-9; 1=sin daño)
--    69  NVI (FUNGICIDA)                         (0=sin injuria / 1=con injuria)
--    70  SANIDAD GENERAL (FUNGICIDA)             (ESCALA 0-100)
--
--  Eficacia relativa al testigo:
--    T4 (Amistar+Comet) ≈ 80%  ← mejor
--    T1 (Amistar Xtra)  ≈ 70%
--    T2 (Nativo)        ≈ 62%
--    T3 (Opera)         ≈ 58%
--    T0 (Testigo)        0%  ← referencia negativa
--
--  Variación por bloque:
--    B2: +1.5% incidencia (mayor humedad)
--    B3: -1.0% incidencia (menor presión inicial)
--    B4: +1.0% incidencia (fin de ciclo)
-- ================================================================
INSERT INTO Datos_Campo_Medicion (dato_campo_id_fk, variable_id_fk, valor) VALUES
-- ==  BLOQUE I  ==
-- B1-T0 D0
(@dc_base+0, 66,'8.5'),  (@dc_base+0, 67,'4.2'),  (@dc_base+0, 68,'1'), (@dc_base+0, 69,'0'), (@dc_base+0, 70,'72'),
-- B1-T0 D14
(@dc_base+1, 66,'42.0'), (@dc_base+1, 67,'25.5'), (@dc_base+1, 68,'1'), (@dc_base+1, 69,'0'), (@dc_base+1, 70,'45'),
-- B1-T0 D28
(@dc_base+2, 66,'71.5'), (@dc_base+2, 67,'51.2'), (@dc_base+2, 68,'1'), (@dc_base+2, 69,'1'), (@dc_base+2, 70,'28'),
-- B1-T1 D0
(@dc_base+3, 66,'9.0'),  (@dc_base+3, 67,'5.0'),  (@dc_base+3, 68,'1'), (@dc_base+3, 69,'0'), (@dc_base+3, 70,'71'),
-- B1-T1 D14
(@dc_base+4, 66,'14.0'), (@dc_base+4, 67,'8.0'),  (@dc_base+4, 68,'2'), (@dc_base+4, 69,'0'), (@dc_base+4, 70,'78'),
-- B1-T1 D28
(@dc_base+5, 66,'22.0'), (@dc_base+5, 67,'14.0'), (@dc_base+5, 68,'1'), (@dc_base+5, 69,'0'), (@dc_base+5, 70,'82'),
-- B1-T2 D0
(@dc_base+6, 66,'8.0'),  (@dc_base+6, 67,'4.0'),  (@dc_base+6, 68,'1'), (@dc_base+6, 69,'0'), (@dc_base+6, 70,'73'),
-- B1-T2 D14
(@dc_base+7, 66,'16.0'), (@dc_base+7, 67,'9.5'),  (@dc_base+7, 68,'2'), (@dc_base+7, 69,'0'), (@dc_base+7, 70,'76'),
-- B1-T2 D28
(@dc_base+8, 66,'26.0'), (@dc_base+8, 67,'18.0'), (@dc_base+8, 68,'2'), (@dc_base+8, 69,'0'), (@dc_base+8, 70,'78'),
-- B1-T3 D0
(@dc_base+9, 66,'9.0'),  (@dc_base+9, 67,'5.0'),  (@dc_base+9, 68,'1'), (@dc_base+9, 69,'0'), (@dc_base+9, 70,'71'),
-- B1-T3 D14
(@dc_base+10,66,'18.0'), (@dc_base+10,67,'11.0'), (@dc_base+10,68,'2'), (@dc_base+10,69,'0'), (@dc_base+10,70,'74'),
-- B1-T3 D28
(@dc_base+11,66,'30.0'), (@dc_base+11, 67,'21.0'), (@dc_base+11,68,'2'), (@dc_base+11,69,'0'), (@dc_base+11,70,'75'),
-- B1-T4 D0
(@dc_base+12,66,'8.0'),  (@dc_base+12,67,'4.0'),  (@dc_base+12,68,'1'), (@dc_base+12,69,'0'), (@dc_base+12,70,'72'),
-- B1-T4 D14
(@dc_base+13,66,'11.0'), (@dc_base+13,67,'6.0'),  (@dc_base+13,68,'2'), (@dc_base+13,69,'0'), (@dc_base+13,70,'82'),
-- B1-T4 D28
(@dc_base+14,66,'15.0'), (@dc_base+14,67,'10.0'), (@dc_base+14,68,'1'), (@dc_base+14,69,'0'), (@dc_base+14,70,'87'),
-- ==  BLOQUE II  (+1.5% inc por mayor humedad)  ==
-- B2-T2 D0
(@dc_base+15,66,'9.2'),  (@dc_base+15,67,'5.2'),  (@dc_base+15,68,'1'), (@dc_base+15,69,'0'), (@dc_base+15,70,'71'),
-- B2-T2 D14
(@dc_base+16,66,'17.5'), (@dc_base+16,67,'10.8'), (@dc_base+16,68,'2'), (@dc_base+16,69,'0'), (@dc_base+16,70,'74'),
-- B2-T2 D28
(@dc_base+17,66,'27.5'), (@dc_base+17,67,'19.5'), (@dc_base+17,68,'2'), (@dc_base+17,69,'0'), (@dc_base+17,70,'76'),
-- B2-T0 D0
(@dc_base+18,66,'9.8'),  (@dc_base+18,67,'5.5'),  (@dc_base+18,68,'1'), (@dc_base+18,69,'0'), (@dc_base+18,70,'70'),
-- B2-T0 D14
(@dc_base+19,66,'44.5'), (@dc_base+19,67,'27.5'), (@dc_base+19,68,'1'), (@dc_base+19,69,'0'), (@dc_base+19,70,'42'),
-- B2-T0 D28
(@dc_base+20,66,'73.0'), (@dc_base+20,67,'53.5'), (@dc_base+20,68,'1'), (@dc_base+20,69,'1'), (@dc_base+20,70,'25'),
-- B2-T4 D0
(@dc_base+21,66,'9.0'),  (@dc_base+21,67,'5.0'),  (@dc_base+21,68,'1'), (@dc_base+21,69,'0'), (@dc_base+21,70,'70'),
-- B2-T4 D14
(@dc_base+22,66,'12.0'), (@dc_base+22,67,'7.0'),  (@dc_base+22,68,'2'), (@dc_base+22,69,'0'), (@dc_base+22,70,'80'),
-- B2-T4 D28
(@dc_base+23,66,'16.2'), (@dc_base+23,67,'11.0'), (@dc_base+23,68,'1'), (@dc_base+23,69,'0'), (@dc_base+23,70,'85'),
-- B2-T1 D0
(@dc_base+24,66,'9.5'),  (@dc_base+24,67,'5.8'),  (@dc_base+24,68,'1'), (@dc_base+24,69,'0'), (@dc_base+24,70,'69'),
-- B2-T1 D14
(@dc_base+25,66,'15.5'), (@dc_base+25,67,'9.0'),  (@dc_base+25,68,'2'), (@dc_base+25,69,'0'), (@dc_base+25,70,'76'),
-- B2-T1 D28
(@dc_base+26,66,'23.5'), (@dc_base+26,67,'15.5'), (@dc_base+26,68,'1'), (@dc_base+26,69,'0'), (@dc_base+26,70,'80'),
-- B2-T3 D0
(@dc_base+27,66,'10.2'), (@dc_base+27,67,'6.0'),  (@dc_base+27,68,'1'), (@dc_base+27,69,'0'), (@dc_base+27,70,'69'),
-- B2-T3 D14
(@dc_base+28,66,'19.5'), (@dc_base+28,67,'12.2'), (@dc_base+28,68,'2'), (@dc_base+28,69,'0'), (@dc_base+28,70,'72'),
-- B2-T3 D28
(@dc_base+29,66,'31.5'), (@dc_base+29,67,'22.5'), (@dc_base+29,68,'2'), (@dc_base+29,69,'0'), (@dc_base+29,70,'73'),
-- ==  BLOQUE III  (-1% inc — menor presion inicial)  ==
-- B3-T3 D0
(@dc_base+30,66,'8.5'),  (@dc_base+30,67,'4.5'),  (@dc_base+30,68,'1'), (@dc_base+30,69,'0'), (@dc_base+30,70,'73'),
-- B3-T3 D14
(@dc_base+31,66,'17.2'), (@dc_base+31,67,'10.5'), (@dc_base+31,68,'2'), (@dc_base+31,69,'0'), (@dc_base+31,70,'76'),
-- B3-T3 D28
(@dc_base+32,66,'29.0'), (@dc_base+32,67,'20.0'), (@dc_base+32,68,'2'), (@dc_base+32,69,'0'), (@dc_base+32,70,'77'),
-- B3-T4 D0
(@dc_base+33,66,'7.5'),  (@dc_base+33,67,'3.5'),  (@dc_base+33,68,'1'), (@dc_base+33,69,'0'), (@dc_base+33,70,'74'),
-- B3-T4 D14
(@dc_base+34,66,'10.2'), (@dc_base+34,67,'5.5'),  (@dc_base+34,68,'2'), (@dc_base+34,69,'0'), (@dc_base+34,70,'84'),
-- B3-T4 D28
(@dc_base+35,66,'14.0'), (@dc_base+35,67,'9.2'),  (@dc_base+35,68,'1'), (@dc_base+35,69,'0'), (@dc_base+35,70,'89'),
-- B3-T0 D0
(@dc_base+36,66,'7.5'),  (@dc_base+36,67,'3.8'),  (@dc_base+36,68,'1'), (@dc_base+36,69,'0'), (@dc_base+36,70,'74'),
-- B3-T0 D14
(@dc_base+37,66,'40.8'), (@dc_base+37,67,'24.0'), (@dc_base+37,68,'1'), (@dc_base+37,69,'0'), (@dc_base+37,70,'47'),
-- B3-T0 D28
(@dc_base+38,66,'69.8'), (@dc_base+38,67,'49.8'), (@dc_base+38,68,'1'), (@dc_base+38,69,'1'), (@dc_base+38,70,'30'),
-- B3-T2 D0
(@dc_base+39,66,'7.8'),  (@dc_base+39,67,'3.5'),  (@dc_base+39,68,'1'), (@dc_base+39,69,'0'), (@dc_base+39,70,'75'),
-- B3-T2 D14
(@dc_base+40,66,'15.2'), (@dc_base+40,67,'9.0'),  (@dc_base+40,68,'2'), (@dc_base+40,69,'0'), (@dc_base+40,70,'78'),
-- B3-T2 D28
(@dc_base+41,66,'25.0'), (@dc_base+41,67,'17.0'), (@dc_base+41,68,'2'), (@dc_base+41,69,'0'), (@dc_base+41,70,'80'),
-- B3-T1 D0
(@dc_base+42,66,'8.2'),  (@dc_base+42,67,'4.5'),  (@dc_base+42,68,'1'), (@dc_base+42,69,'0'), (@dc_base+42,70,'73'),
-- B3-T1 D14
(@dc_base+43,66,'13.2'), (@dc_base+43,67,'7.5'),  (@dc_base+43,68,'2'), (@dc_base+43,69,'0'), (@dc_base+43,70,'80'),
-- B3-T1 D28
(@dc_base+44,66,'21.0'), (@dc_base+44,67,'13.0'), (@dc_base+44,68,'1'), (@dc_base+44,69,'0'), (@dc_base+44,70,'84'),
-- ==  BLOQUE IV  (+1% inc — fin de ciclo)  ==
-- B4-T1 D0
(@dc_base+45,66,'10.2'), (@dc_base+45,67,'6.0'),  (@dc_base+45,68,'1'), (@dc_base+45,69,'0'), (@dc_base+45,70,'70'),
-- B4-T1 D14
(@dc_base+46,66,'15.0'), (@dc_base+46,67,'8.8'),  (@dc_base+46,68,'2'), (@dc_base+46,69,'0'), (@dc_base+46,70,'77'),
-- B4-T1 D28
(@dc_base+47,66,'24.0'), (@dc_base+47,67,'15.8'), (@dc_base+47,68,'1'), (@dc_base+47,69,'0'), (@dc_base+47,70,'81'),
-- B4-T3 D0
(@dc_base+48,66,'10.5'), (@dc_base+48,67,'6.2'),  (@dc_base+48,68,'1'), (@dc_base+48,69,'0'), (@dc_base+48,70,'70'),
-- B4-T3 D14
(@dc_base+49,66,'19.8'), (@dc_base+49,67,'12.5'), (@dc_base+49,68,'2'), (@dc_base+49,69,'0'), (@dc_base+49,70,'73'),
-- B4-T3 D28
(@dc_base+50,66,'32.0'), (@dc_base+50,67,'23.0'), (@dc_base+50,68,'2'), (@dc_base+50,69,'0'), (@dc_base+50,70,'74'),
-- B4-T2 D0
(@dc_base+51,66,'9.5'),  (@dc_base+51,67,'5.5'),  (@dc_base+51,68,'1'), (@dc_base+51,69,'0'), (@dc_base+51,70,'70'),
-- B4-T2 D14
(@dc_base+52,66,'17.8'), (@dc_base+52,67,'11.0'), (@dc_base+52,68,'2'), (@dc_base+52,69,'0'), (@dc_base+52,70,'75'),
-- B4-T2 D28
(@dc_base+53,66,'28.0'), (@dc_base+53,67,'19.8'), (@dc_base+53,68,'2'), (@dc_base+53,69,'0'), (@dc_base+53,70,'77'),
-- B4-T4 D0
(@dc_base+54,66,'9.5'),  (@dc_base+54,67,'5.2'),  (@dc_base+54,68,'1'), (@dc_base+54,69,'0'), (@dc_base+54,70,'71'),
-- B4-T4 D14
(@dc_base+55,66,'12.5'), (@dc_base+55,67,'7.2'),  (@dc_base+55,68,'2'), (@dc_base+55,69,'0'), (@dc_base+55,70,'81'),
-- B4-T4 D28
(@dc_base+56,66,'16.8'), (@dc_base+56,67,'11.5'), (@dc_base+56,68,'1'), (@dc_base+56,69,'0'), (@dc_base+56,70,'86'),
-- B4-T0 D0
(@dc_base+57,66,'10.0'), (@dc_base+57,67,'5.8'),  (@dc_base+57,68,'1'), (@dc_base+57,69,'0'), (@dc_base+57,70,'71'),
-- B4-T0 D14
(@dc_base+58,66,'45.0'), (@dc_base+58,67,'28.0'), (@dc_base+58,68,'1'), (@dc_base+58,69,'0'), (@dc_base+58,70,'43'),
-- B4-T0 D28
(@dc_base+59,66,'74.5'), (@dc_base+59,67,'54.0'), (@dc_base+59,68,'1'), (@dc_base+59,69,'1'), (@dc_base+59,70,'26');

-- ================================================================
-- SECCIÓN 13 · DATOS_COSECHA  (20 parcelas, todos los campos)
--  kg_ha_corregido corregido a 13.5% humedad
--  gie = kg_ha × 0.98  (2% pérdida cosechadora)
--  Ranking: T4 > T1 > T2 > T3 >> T0
-- ================================================================
INSERT INTO Datos_Cosecha (
  parcela_id_fk, fecha_cosecha,
  humedad_pct, kg_ha_corregido, gie,
  gramaje_por_grano, granos_porurf, peso_granos_porurf,
  granos_danados, granos_verdes, granos_vanos,
  hojas_porurf, larvas_porurf, insectos_beneficios_porurf,
  diametro_espiga, altura_parcela, densidad_plantas_final, observaciones
) VALUES
-- BLOQUE I
(@p1_t0,'2027-04-15',13.2,2580.0,2528.4, 0.188500,1380.0,259.5, 18.5,4.2,3.8, 42.0,1.8,3.5, NULL,90.5,27.5,
 'Testigo B1: alta incidencia esclerotinia, perdida rinde 32% vs T4.'),
(@p1_t1,'2027-04-15',13.5,3420.0,3351.6, 0.210200,1620.0,340.5,  6.2,1.5,1.2, 48.0,0.8,5.8, NULL,95.0,29.8,
 'T1 B1: excelente control, rinde 32% superior al testigo.'),
(@p1_t2,'2027-04-15',13.3,3290.0,3224.2, 0.205800,1580.0,325.0,  8.5,2.1,1.8, 46.5,1.0,5.2, NULL,93.5,29.0,
 'T2 B1: buen control, rinde 27% superior al testigo.'),
(@p1_t3,'2027-04-15',13.4,3180.0,3116.4, 0.202000,1555.0,314.1, 10.2,2.5,2.0, 45.5,1.2,4.9, NULL,92.0,28.5,
 'T3 B1: control moderado, rinde 23% superior al testigo.'),
(@p1_t4,'2027-04-15',13.1,3580.0,3508.4, 0.218000,1648.0,359.3,  4.5,1.0,0.9, 50.0,0.5,6.5, NULL,97.0,30.2,
 'T4 B1: mejor tratamiento, rinde 39% superior al testigo.'),
-- BLOQUE II
(@p2_t2,'2027-04-15',13.5,3250.0,3185.0, 0.204000,1565.0,319.3,  9.0,2.3,2.0, 46.0,1.1,5.0, NULL,93.0,28.8,
 'T2 B2: resultado consistente con B1.'),
(@p2_t0,'2027-04-15',13.4,2540.0,2489.2, 0.185000,1360.0,251.6, 20.2,4.8,4.1, 41.5,2.0,3.2, NULL,89.0,27.0,
 'T0 B2: mayor perdida por alta humedad en bloque 2.'),
(@p2_t4,'2027-04-15',13.3,3540.0,3469.2, 0.215000,1632.0,350.9,  5.0,1.1,1.0, 49.5,0.6,6.2, NULL,96.5,30.0,
 'T4 B2: control sostenido pese a alta presion de enfermedad.'),
(@p2_t1,'2027-04-15',13.3,3380.0,3312.4, 0.208000,1605.0,333.8,  6.8,1.7,1.4, 47.5,0.9,5.5, NULL,94.5,29.5,
 'T1 B2: buen control en zona de alta humedad.'),
(@p2_t3,'2027-04-15',13.6,3140.0,3077.2, 0.200000,1540.0,308.0, 11.5,2.8,2.3, 45.0,1.3,4.7, NULL,91.5,28.2,
 'T3 B2: similar a B1. Consistencia del tratamiento.'),
-- BLOQUE III
(@p3_t3,'2027-04-15',13.2,3210.0,3145.8, 0.204000,1568.0,320.0, 10.0,2.4,1.9, 46.0,1.2,4.9, NULL,92.5,28.6,
 'T3 B3: menor presion inicial, rinde superior vs B1-B2.'),
(@p3_t4,'2027-04-15',13.0,3620.0,3547.6, 0.220000,1662.0,365.6,  4.2,0.9,0.8, 50.5,0.5,6.8, NULL,97.5,30.5,
 'T4 B3: maximo rinde del ensayo.'),
(@p3_t0,'2027-04-15',13.0,2620.0,2567.6, 0.192000,1400.0,268.8, 17.8,4.0,3.5, 43.0,1.7,3.7, NULL,91.0,27.8,
 'T0 B3: algo mejor que otros testigos por menor presion inicial.'),
(@p3_t2,'2027-04-15',13.1,3320.0,3253.6, 0.207800,1595.0,331.5,  8.0,1.9,1.6, 47.0,1.0,5.4, NULL,94.0,29.2,
 'T2 B3: resultados consistentes con demas bloques.'),
(@p3_t1,'2027-04-15',13.2,3460.0,3390.8, 0.212000,1635.0,346.6,  5.8,1.4,1.1, 48.5,0.8,5.9, NULL,95.5,30.0,
 'T1 B3: excelente control en condiciones de menor presion.'),
-- BLOQUE IV
(@p4_t1,'2027-04-15',13.4,3400.0,3332.0, 0.209000,1610.0,336.5,  6.5,1.6,1.3, 47.8,0.9,5.6, NULL,94.8,29.6,
 'T1 B4: cierre del ensayo consistente.'),
(@p4_t3,'2027-04-15',13.5,3160.0,3096.8, 0.201000,1548.0,311.1, 11.0,2.6,2.1, 45.2,1.3,4.8, NULL,91.8,28.3,
 'T3 B4: menor residualidad confirmada en cierre de ciclo.'),
(@p4_t2,'2027-04-15',13.4,3270.0,3204.6, 0.205000,1572.0,322.3,  8.8,2.2,1.9, 46.2,1.1,5.1, NULL,93.2,28.9,
 'T2 B4: buen control, rinde en linea con otros bloques.'),
(@p4_t4,'2027-04-15',13.2,3560.0,3488.8, 0.217000,1640.0,355.9,  4.8,1.0,0.9, 49.8,0.6,6.3, NULL,96.8,30.1,
 'T4 B4: confirma superioridad de la mezcla en tanque.'),
(@p4_t0,'2027-04-15',13.5,2510.0,2459.8, 0.183000,1350.0,247.1, 21.0,5.0,4.3, 41.0,2.1,3.0, NULL,88.5,26.8,
 'T0 B4: peor rendimiento del ensayo. Alta perdida por enfermedad.');

-- ================================================================
-- VERIFICACIÓN FINAL
-- ================================================================
SELECT '====== VERIFICACION DEL ENSAYO INSERTADO ======' AS '';

SELECT
  e.ensayo_id, e.codigo_labor, e.nombre_ensayo,
  c.nombre  AS cultivo,  v.nombre  AS variedad,
  ts.nombre AS tipo_siembra, te.nombre AS tipo_ensayo,
  l.nombre  AS laboratorio, p.nombre  AS protocolo,
  se.nombre AS status,
  e.fecha_siembra, e.fecha_cosecha,
  e.filas, e.columnas
FROM Ensayo e
  JOIN Cultivo          c  ON c.cultivo_id     = e.cultivo_id
  JOIN Cultivo_Variedad v  ON v.variedad_id    = e.variedad_id
  JOIN TipoSiembra      ts ON ts.id             = e.tipo_siembra_id
  JOIN Tipo_Ensayo      te ON te.tipo_ensayo_id = e.tipo_ensayo_id_fk
  JOIN Laboratorio      l  ON l.lab_id          = e.lab_id_fk
  JOIN Protocolo        p  ON p.protocolo_id    = e.protocolo_id_fk
  JOIN StatusEnsayo     se ON se.status_id      = e.status_id_fk
WHERE e.codigo_labor = 'PC-2026-001';

SELECT '--- Tratamientos del protocolo ---' AS '';
SELECT
  t.numero_trat, t.es_testigo,
  LEFT(t.descripcion,45) AS descripcion,
  GROUP_CONCAT(
    CONCAT(pr.nombre_comercial,' ',tp.dosis,' ',tp.unidad_dosis,
           ' @',IFNULL(tp.estadio,''))
    ORDER BY pr.nombre_comercial SEPARATOR '  +  '
  ) AS productos_dosis
FROM Tratamiento t
  LEFT JOIN Tratamiento_Producto tp ON tp.tratamiento_id_fk = t.tratamiento_id
  LEFT JOIN Producto pr              ON pr.producto_id       = tp.producto_id_fk
WHERE t.protocolo_id_fk = @id_proto
GROUP BY t.tratamiento_id ORDER BY t.numero_trat;

SELECT '--- Promedios de medicion por tratamiento y momento (variables clave) ---' AS '';
SELECT
  t.numero_trat     AS trat,
  me.nombre_momento AS momento,
  pv.nombre_variable,
  ROUND(AVG(CAST(dcm.valor AS DECIMAL(10,2))),2) AS promedio,
  ROUND(MIN(CAST(dcm.valor AS DECIMAL(10,2))),2) AS min,
  ROUND(MAX(CAST(dcm.valor AS DECIMAL(10,2))),2) AS max
FROM Datos_Campo_Medicion dcm
  JOIN Datos_Campo        dc  ON dc.dato_campo_id    = dcm.dato_campo_id_fk
  JOIN Parcela            p   ON p.parcela_id         = dc.parcela_id_fk
  JOIN Tratamiento        t   ON t.tratamiento_id     = p.tratamiento_id_fk
  JOIN Momento_Evaluacion me  ON me.momento_id        = dc.momento_id_fk
  JOIN Protocolo_Variable pv  ON pv.variable_id       = dcm.variable_id_fk
  JOIN Aplicacion         a   ON a.aplicacion_id      = me.aplicacion_id_fk
WHERE a.ensayo_id_fk = @id_ensayo AND pv.variable_id IN (66,67,70)
GROUP BY t.numero_trat, me.momento_id, pv.variable_id
ORDER BY pv.variable_id, t.numero_trat, me.momento_id;

SELECT '--- Resumen de cosecha por tratamiento ---' AS '';
SELECT
  t.numero_trat,
  LEFT(t.descripcion,40) AS tratamiento,
  ROUND(AVG(dc.kg_ha_corregido),1)   AS kg_ha_prom,
  ROUND(AVG(dc.humedad_pct),1)       AS hum_pct,
  ROUND(AVG(dc.gie),1)               AS gie_prom,
  ROUND(AVG(dc.gramaje_por_grano)*1000,3) AS gramaje_mg,
  ROUND(AVG(dc.granos_danados),1)    AS danados_pct,
  ROUND(
    (AVG(dc.kg_ha_corregido) /
     (SELECT AVG(k.kg_ha_corregido)
        FROM Datos_Cosecha k
        JOIN Parcela q ON q.parcela_id = k.parcela_id_fk
        JOIN Tratamiento r ON r.tratamiento_id = q.tratamiento_id_fk
       WHERE r.protocolo_id_fk = @id_proto AND r.es_testigo = 1) - 1) * 100
  , 1) AS incremento_vs_testigo_pct
FROM Datos_Cosecha dc
  JOIN Parcela     p ON p.parcela_id     = dc.parcela_id_fk
  JOIN Tratamiento t ON t.tratamiento_id = p.tratamiento_id_fk
WHERE t.protocolo_id_fk = @id_proto
GROUP BY t.numero_trat ORDER BY t.numero_trat;

SELECT '--- Conteos de registros ---' AS '';
SELECT
  (SELECT COUNT(*) FROM Bloque WHERE ensayo_id_fk=@id_ensayo)   AS bloques,
  (SELECT COUNT(*) FROM Parcela WHERE ensayo_id_fk=@id_ensayo)  AS parcelas,
  (SELECT COUNT(*) FROM Datos_Siembra ds
     JOIN Parcela p ON p.parcela_id=ds.parcela_id_fk
     WHERE p.ensayo_id_fk=@id_ensayo)                           AS siembras,
  (SELECT COUNT(*) FROM Datos_Campo dc
     JOIN Parcela p ON p.parcela_id=dc.parcela_id_fk
     WHERE p.ensayo_id_fk=@id_ensayo)                           AS registros_campo,
  (SELECT COUNT(*) FROM Datos_Campo_Medicion dcm
     JOIN Datos_Campo dc ON dc.dato_campo_id=dcm.dato_campo_id_fk
     JOIN Parcela p ON p.parcela_id=dc.parcela_id_fk
     WHERE p.ensayo_id_fk=@id_ensayo)                           AS mediciones,
  (SELECT COUNT(*) FROM Datos_Cosecha dcos
     JOIN Parcela p ON p.parcela_id=dcos.parcela_id_fk
     WHERE p.ensayo_id_fk=@id_ensayo)                           AS cosechas;

SELECT CONCAT(
  'OK  ensayo_id = ', @id_ensayo,
  '   Reportes:  /api/v1/reportes/pdf/',   @id_ensayo,
  '   y   /api/v1/reportes/excel/', @id_ensayo
) AS RESULTADO_FINAL;
