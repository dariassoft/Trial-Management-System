-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: nest_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Aplicacion`
--

DROP TABLE IF EXISTS `Aplicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Aplicacion` (
  `aplicacion_id` int NOT NULL AUTO_INCREMENT,
  `ensayo_id_fk` int NOT NULL,
  `nombre_aplicacion` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Primera aplicación',
  `fecha_hora` datetime DEFAULT NULL,
  `estadio_cultivo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `temp_c` decimal(4,1) DEFAULT NULL,
  `humedad_pct` decimal(4,1) DEFAULT NULL,
  `viento_kmh` decimal(4,1) DEFAULT NULL,
  `equipo_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pico_info` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presion_bar` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`aplicacion_id`),
  KEY `FK_86cf6177a74cbd052ec6d18afb5` (`ensayo_id_fk`),
  CONSTRAINT `FK_86cf6177a74cbd052ec6d18afb5` FOREIGN KEY (`ensayo_id_fk`) REFERENCES `Ensayo` (`ensayo_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Aplicacion`
--

LOCK TABLES `Aplicacion` WRITE;
/*!40000 ALTER TABLE `Aplicacion` DISABLE KEYS */;
INSERT INTO `Aplicacion` VALUES (1,63,'Primera aplicación','2026-01-29 10:30:00','v1',2.6,1.5,1.6,NULL,NULL,NULL),(2,64,'Primera aplicación','2026-01-29 22:29:00','c1',0.1,0.1,0.1,NULL,NULL,NULL),(3,74,'Primera aplicación1','2026-01-02 07:02:00','v11',19.1,30.1,20.1,NULL,NULL,NULL),(4,66,'Primera aplicación','2026-01-30 02:00:00','v1',-0.1,1.0,1.0,NULL,NULL,NULL),(5,69,'Primera aplicación1','2026-02-19 20:30:00','v1',16.0,30.0,20.0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Aplicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bloque`
--

DROP TABLE IF EXISTS `Bloque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bloque` (
  `bloque_id` int NOT NULL AUTO_INCREMENT,
  `nombre_bloque` varchar(10) NOT NULL,
  `ensayo_id_fk` int NOT NULL,
  PRIMARY KEY (`bloque_id`),
  UNIQUE KEY `IDX_a3fb0abd61cbbadd7ba265b932` (`ensayo_id_fk`,`nombre_bloque`),
  CONSTRAINT `FK_2631f8051dfe41bcdc93cdf3e4b` FOREIGN KEY (`ensayo_id_fk`) REFERENCES `Ensayo` (`ensayo_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bloque`
--

LOCK TABLES `Bloque` WRITE;
/*!40000 ALTER TABLE `Bloque` DISABLE KEYS */;
INSERT INTO `Bloque` VALUES (10,'A',69),(11,'B',69),(1,'A',71),(2,'B',71),(3,'C',71),(6,'A',74),(7,'B',74),(8,'C',74),(9,'D',74);
/*!40000 ALTER TABLE `Bloque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cultivo`
--

DROP TABLE IF EXISTS `Cultivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cultivo` (
  `cultivo_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cultivo_id`),
  UNIQUE KEY `IDX_41324640dfaa4fdc7350743f28` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cultivo`
--

LOCK TABLES `Cultivo` WRITE;
/*!40000 ALTER TABLE `Cultivo` DISABLE KEYS */;
INSERT INTO `Cultivo` VALUES (3,'Barbecho'),(7,'Cebada'),(2,'Maiz'),(5,'Mani'),(8,'Otros'),(4,'Poroto'),(1,'Soja'),(6,'Trigo');
/*!40000 ALTER TABLE `Cultivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cultivo_Variedad`
--

DROP TABLE IF EXISTS `Cultivo_Variedad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cultivo_Variedad` (
  `variedad_id` int NOT NULL AUTO_INCREMENT,
  `cultivo_id_fk` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`variedad_id`),
  KEY `FK_7ee65ed9e0d154f63ec95a62a9d` (`cultivo_id_fk`),
  CONSTRAINT `FK_7ee65ed9e0d154f63ec95a62a9d` FOREIGN KEY (`cultivo_id_fk`) REFERENCES `Cultivo` (`cultivo_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cultivo_Variedad`
--

LOCK TABLES `Cultivo_Variedad` WRITE;
/*!40000 ALTER TABLE `Cultivo_Variedad` DISABLE KEYS */;
INSERT INTO `Cultivo_Variedad` VALUES (1,1,'Asgrow MG4.2'),(2,1,'DM 4.0i'),(3,1,'Desoy 3810'),(4,2,'DK 7710'),(5,2,'SK 7333'),(6,2,'P1198W'),(7,6,'Baguette 620'),(8,6,'Klein Proteo'),(9,6,'Baguette 250'),(10,7,'Scarlett'),(11,7,'Rainbow');
/*!40000 ALTER TABLE `Cultivo_Variedad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Datos_Campo`
--

DROP TABLE IF EXISTS `Datos_Campo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Datos_Campo` (
  `dato_campo_id` int NOT NULL AUTO_INCREMENT,
  `observaciones` text,
  `parcela_id_fk` int NOT NULL,
  `momento_id_fk` int NOT NULL,
  PRIMARY KEY (`dato_campo_id`),
  UNIQUE KEY `IDX_dc58e8916f0207522b432b8ea0` (`parcela_id_fk`,`momento_id_fk`),
  KEY `FK_c0a33101c8dc1ee94dc23b5e408` (`momento_id_fk`),
  CONSTRAINT `FK_8078c847a3e707359fade7a44f0` FOREIGN KEY (`parcela_id_fk`) REFERENCES `Parcela` (`parcela_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_c0a33101c8dc1ee94dc23b5e408` FOREIGN KEY (`momento_id_fk`) REFERENCES `Momento_Evaluacion` (`momento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Datos_Campo`
--

LOCK TABLES `Datos_Campo` WRITE;
/*!40000 ALTER TABLE `Datos_Campo` DISABLE KEYS */;
INSERT INTO `Datos_Campo` VALUES (1,'hgfjhkgfkju 687676',2,14),(3,' 5435435',21,14),(4,NULL,19,14),(5,'ERRVG GFSG FD GFDS GFD GD FD',26,25);
/*!40000 ALTER TABLE `Datos_Campo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Datos_Campo_Medicion`
--

DROP TABLE IF EXISTS `Datos_Campo_Medicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Datos_Campo_Medicion` (
  `medicion_id` int NOT NULL AUTO_INCREMENT,
  `valor` varchar(255) NOT NULL,
  `dato_campo_id_fk` int DEFAULT NULL,
  `variable_id_fk` int DEFAULT NULL,
  PRIMARY KEY (`medicion_id`),
  KEY `FK_ea16292e9186c1d9b7a30ffab62` (`dato_campo_id_fk`),
  KEY `FK_b3bab1e265aeec46ba0fb59aed4` (`variable_id_fk`),
  CONSTRAINT `FK_b3bab1e265aeec46ba0fb59aed4` FOREIGN KEY (`variable_id_fk`) REFERENCES `Protocolo_Variable` (`variable_id`),
  CONSTRAINT `FK_ea16292e9186c1d9b7a30ffab62` FOREIGN KEY (`dato_campo_id_fk`) REFERENCES `Datos_Campo` (`dato_campo_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Datos_Campo_Medicion`
--

LOCK TABLES `Datos_Campo_Medicion` WRITE;
/*!40000 ALTER TABLE `Datos_Campo_Medicion` DISABLE KEYS */;
INSERT INTO `Datos_Campo_Medicion` VALUES (5,'2',3,62),(6,'4',3,63),(7,'0',3,64),(8,'fds a43 54',3,65),(61,'30',5,91),(62,'4',5,92),(63,'67',5,93),(64,'54',5,94),(65,'34',5,95),(66,'3',5,98),(67,'2',1,62),(68,'3',1,63),(69,'1',1,64),(70,'22',1,65);
/*!40000 ALTER TABLE `Datos_Campo_Medicion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Datos_Cosecha`
--

DROP TABLE IF EXISTS `Datos_Cosecha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Datos_Cosecha` (
  `cosecha_id` int NOT NULL AUTO_INCREMENT,
  `fecha_cosecha` date DEFAULT NULL,
  `humedad_pct` decimal(5,2) DEFAULT NULL,
  `kg_ha_corregido` decimal(10,2) DEFAULT NULL,
  `gie` decimal(10,2) DEFAULT NULL,
  `observaciones` text,
  `parcela_id_fk` int DEFAULT NULL,
  PRIMARY KEY (`cosecha_id`),
  UNIQUE KEY `REL_193e0b95d747e97fa9c10a3042` (`parcela_id_fk`),
  CONSTRAINT `FK_193e0b95d747e97fa9c10a30422` FOREIGN KEY (`parcela_id_fk`) REFERENCES `Parcela` (`parcela_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Datos_Cosecha`
--

LOCK TABLES `Datos_Cosecha` WRITE;
/*!40000 ALTER TABLE `Datos_Cosecha` DISABLE KEYS */;
/*!40000 ALTER TABLE `Datos_Cosecha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ensayo`
--

DROP TABLE IF EXISTS `Ensayo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ensayo` (
  `ensayo_id` int NOT NULL AUTO_INCREMENT,
  `lab_id_fk` int DEFAULT NULL,
  `nombre_ensayo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `protocolo_id_fk` int DEFAULT NULL,
  `codigo_labor` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_ensayo_id_fk` int DEFAULT NULL,
  `provincia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departamento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `establecimiento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lote` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `dist_surcos_cm` decimal(5,2) DEFAULT NULL,
  `fecha_siembra` date DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Activo',
  `responsable_id` int DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_cosecha` date DEFAULT NULL,
  `cultivo_id` int DEFAULT NULL,
  `variedad_id` int DEFAULT NULL,
  `tipo_siembra_id` int DEFAULT NULL,
  `status_id_fk` int DEFAULT NULL COMMENT 'FK a StatusEnsayo',
  PRIMARY KEY (`ensayo_id`),
  UNIQUE KEY `uq_ensayo_lab_codigo` (`lab_id_fk`,`codigo_labor`),
  UNIQUE KEY `IDX_85a4c4555815d27ae2067f9759` (`nombre_ensayo`,`protocolo_id_fk`),
  KEY `FK_569fc4521722eccdffd841bc0d1` (`tipo_ensayo_id_fk`),
  KEY `FK_984fd9df9512d2b06fc9044284b` (`protocolo_id_fk`),
  KEY `FK_14b312a6d1bb11c486721835ba4` (`responsable_id`),
  KEY `FK_a3cd2008ba8bd551d193d2a1084` (`cultivo_id`),
  KEY `FK_c7cd836a6083e36e6f95897032a` (`variedad_id`),
  KEY `FK_465471de8f42aee0d3778c2429e` (`tipo_siembra_id`),
  KEY `idx_ensayo_status_fk` (`status_id_fk`),
  CONSTRAINT `FK_14b312a6d1bb11c486721835ba4` FOREIGN KEY (`responsable_id`) REFERENCES `Usuario` (`usuario_id`),
  CONSTRAINT `FK_465471de8f42aee0d3778c2429e` FOREIGN KEY (`tipo_siembra_id`) REFERENCES `TipoSiembra` (`id`),
  CONSTRAINT `FK_569fc4521722eccdffd841bc0d1` FOREIGN KEY (`tipo_ensayo_id_fk`) REFERENCES `Tipo_Ensayo` (`tipo_ensayo_id`),
  CONSTRAINT `FK_7d3c18d9e83dfc76ad17571f0f3` FOREIGN KEY (`lab_id_fk`) REFERENCES `Laboratorio` (`lab_id`),
  CONSTRAINT `FK_984fd9df9512d2b06fc9044284b` FOREIGN KEY (`protocolo_id_fk`) REFERENCES `Protocolo` (`protocolo_id`),
  CONSTRAINT `FK_a3cd2008ba8bd551d193d2a1084` FOREIGN KEY (`cultivo_id`) REFERENCES `Cultivo` (`cultivo_id`),
  CONSTRAINT `FK_c7cd836a6083e36e6f95897032a` FOREIGN KEY (`variedad_id`) REFERENCES `Cultivo_Variedad` (`variedad_id`),
  CONSTRAINT `fk_ensayo_status` FOREIGN KEY (`status_id_fk`) REFERENCES `StatusEnsayo` (`status_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ensayo`
--

LOCK TABLES `Ensayo` WRITE;
/*!40000 ALTER TABLE `Ensayo` DISABLE KEYS */;
INSERT INTO `Ensayo` VALUES (63,4,'Ensayo Soja Temprana 2024',1,'123-BASFG-3213-21',5,'Salta','Cachi','top4','ert3',-24.82946750,-65.51138830,20.00,'2024-11-01','En Ejecución',1,NULL,NULL,NULL,NULL,NULL,1),(64,3,'Ensayo Maíz Híbrido Temprano',3,NULL,5,'Salta','Cerrillos',NULL,NULL,NULL,NULL,20.00,'2024-10-15','En Ejecución',1,NULL,NULL,NULL,NULL,NULL,5),(66,1,'Ensayo Soja tardía con Fungicidas',2,NULL,9,'Santa Fe','Rosario',NULL,NULL,-24.82946750,-65.51138830,NULL,'2024-12-01','Completado',1,'2025-12-13','2025-12-13',2,4,5,3),(68,1,'Ensayo Piloto - Barbecho y cobertura',NULL,NULL,NULL,'La Pampa','Caleu Caleu',NULL,NULL,NULL,NULL,NULL,'2024-08-15','Por Iniciar',NULL,NULL,NULL,NULL,NULL,NULL,6),(69,1,'Ensayo Poroto - Densidad de siembra',1,'25-EWRT-523D-WE',9,'Salta','Cachi',NULL,NULL,-24.82946750,-65.51138830,NULL,'2024-11-10','Por Iniciar',1,NULL,NULL,1,3,5,7),(70,1,'Ensayo Maní - Ciclo largo',NULL,NULL,NULL,'Buenos Aires','Bragado',NULL,NULL,NULL,NULL,NULL,'2024-10-01','Por Iniciar',NULL,NULL,NULL,NULL,NULL,NULL,4),(71,4,'Ensayo Cebada cervecera',2,'',7,'Salta','Rosario de la Frontera','aaaaaaaaaaaaaa','bbbbbbbbbbbbb',-24.82950000,-65.51130000,24.00,'2026-01-01','Por Iniciar',1,'2025-12-25','2026-01-31',7,11,5,1),(72,1,'Ensayo Soja - Manejo de malezas',NULL,NULL,NULL,'Córdoba','Río Segundo',NULL,NULL,NULL,NULL,NULL,'2024-11-15','Por Iniciar',NULL,NULL,NULL,NULL,NULL,NULL,1),(73,3,'Ensayo de prueba 1',1,'58-ENTD-43523-A1',8,'Salta','Rosario de la Frontera','THN3','KDJH45',-24.82946750,-65.51138830,15.00,'2025-12-11','Por Iniciar',1,'2025-12-11','2026-01-11',7,10,2,2),(74,3,'asdasd',2,'23-3213-2131-2321adsqw-eq',5,'Salta','Rivadavia','qweqwe','123',-24.85168320,-65.51138840,40.00,'2026-01-10','Activo',1,'2026-01-05','2026-03-01',7,11,4,1);
/*!40000 ALTER TABLE `Ensayo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Foto_Registro`
--

DROP TABLE IF EXISTS `Foto_Registro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Foto_Registro` (
  `foto_id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dato_campo_id_fk` int DEFAULT NULL,
  PRIMARY KEY (`foto_id`),
  KEY `FK_ab51cc3b3f31a25f52f9d482210` (`dato_campo_id_fk`),
  CONSTRAINT `FK_ab51cc3b3f31a25f52f9d482210` FOREIGN KEY (`dato_campo_id_fk`) REFERENCES `Datos_Campo` (`dato_campo_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Foto_Registro`
--

LOCK TABLES `Foto_Registro` WRITE;
/*!40000 ALTER TABLE `Foto_Registro` DISABLE KEYS */;
INSERT INTO `Foto_Registro` VALUES (2,'video_1769745749726.webm','/uploads/visita_1/visita_1_1769745753613_c0d933f6c74fcf46.webm','video/webm','2026-01-30 04:02:33',1),(3,'foto_E74_BA_23-3213-2131-2321adsqw-eq-A-1.1_DDA7_1769746638728.jpg','/uploads/ensayo_74/bloque_A/foto_E74_BA_23-3213-2131-2321adsqw-eq-A-1.1_DDA7_1769746638728.jpg','image/jpeg','2026-01-30 04:17:18',1),(4,'foto_E74_BA_23-3213-2131-2321adsqw-eq-A-1.1_DDA7_1769746940065.jpg','/uploads/ensayo_74/bloque_A/foto_E74_BA_23-3213-2131-2321adsqw-eq-A-1.1_DDA7_1769746940065.jpg','image/jpeg','2026-01-30 04:22:20',1),(7,'foto_E74_BA_23-3213-2131-2321adsqw-eq-A-1.1_DDA7_1769747465880.jpg','/uploads/ensayo_74/bloque_A/foto_E74_BA_23-3213-2131-2321adsqw-eq-A-1.1_DDA7_1769747465880.jpg','image/jpeg','2026-01-30 04:31:05',1),(8,'foto_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253813.jpg','/uploads/ensayo_69/bloque_A/foto_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253813.jpg','image/jpeg','2026-02-02 19:40:53',5),(9,'foto_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253871.jpg','/uploads/ensayo_69/bloque_A/foto_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253871.jpg','image/jpeg','2026-02-02 19:40:53',5),(10,'video_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253934.webm','/uploads/ensayo_69/bloque_A/video_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253934.webm','video/webm','2026-02-02 19:40:53',5),(11,'foto_E74_BA_23-3213-2131-2321adsqw-eq-A-1.1_DDA7_1770062763203.png','/uploads/ensayo_74/bloque_A/foto_E74_BA_23-3213-2131-2321adsqw-eq-A-1.1_DDA7_1770062763203.png','image/png','2026-02-02 20:06:03',1);
/*!40000 ALTER TABLE `Foto_Registro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Laboratorio`
--

DROP TABLE IF EXISTS `Laboratorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Laboratorio` (
  `lab_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`lab_id`),
  UNIQUE KEY `IDX_0651ebd5d4a98a575551de3857` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Laboratorio`
--

LOCK TABLES `Laboratorio` WRITE;
/*!40000 ALTER TABLE `Laboratorio` DISABLE KEYS */;
INSERT INTO `Laboratorio` VALUES (2,'ADAMA'),(3,'Bayer'),(5,'Corteva'),(1,'Laboratorio Principal'),(6,'Nufarm'),(4,'Syngenta');
/*!40000 ALTER TABLE `Laboratorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Momento_Evaluacion`
--

DROP TABLE IF EXISTS `Momento_Evaluacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Momento_Evaluacion` (
  `momento_id` int NOT NULL AUTO_INCREMENT,
  `nombre_momento` varchar(50) NOT NULL,
  `dias_despues_aplicacion` int DEFAULT NULL,
  `fecha_evaluacion` date DEFAULT NULL,
  `aplicacion_id_fk` int NOT NULL,
  PRIMARY KEY (`momento_id`),
  UNIQUE KEY `IDX_6e1b8e13b72dad3c68a2ebeaa1` (`aplicacion_id_fk`,`nombre_momento`),
  CONSTRAINT `FK_02ba55c901de478a69d0ffcd8eb` FOREIGN KEY (`aplicacion_id_fk`) REFERENCES `Aplicacion` (`aplicacion_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Momento_Evaluacion`
--

LOCK TABLES `Momento_Evaluacion` WRITE;
/*!40000 ALTER TABLE `Momento_Evaluacion` DISABLE KEYS */;
INSERT INTO `Momento_Evaluacion` VALUES (1,'3 DDA',3,'2026-02-01',1),(2,'7 DDA',7,'2026-02-05',1),(3,'14 DDA',14,'2026-02-12',1),(4,'21 DDA',21,'2026-02-19',1),(5,'28 DDA',28,'2026-02-26',1),(6,'35 DDA',35,'2026-03-05',1),(7,'3 DDA',3,'2026-02-01',2),(8,'7 DDA',7,'2026-02-05',2),(9,'14 DDA',14,'2026-02-12',2),(10,'21 DDA',21,'2026-02-19',2),(11,'28 DDA',28,'2026-02-26',2),(12,'35 DDA',35,'2026-03-05',2),(13,'3 DDA',3,'2026-01-04',3),(14,'7 DDA',7,'2026-01-08',3),(15,'14 DDA',14,'2026-01-15',3),(16,'21 DDA',21,'2026-01-22',3),(17,'28 DDA',28,'2026-01-29',3),(18,'35 DDA',35,'2026-02-05',3),(19,'3 DDA',3,'2026-02-02',4),(20,'7 DDA',7,'2026-02-06',4),(21,'14 DDA',14,'2026-02-13',4),(22,'21 DDA',21,'2026-02-20',4),(23,'28 DDA',28,'2026-02-27',4),(24,'3 DDA',3,'2026-02-22',5),(25,'7 DDA',7,'2026-02-26',5),(26,'14 DDA',14,'2026-03-05',5),(27,'21 DDA',21,'2026-03-12',5),(28,'28 DDA',28,'2026-03-19',5);
/*!40000 ALTER TABLE `Momento_Evaluacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Parcela`
--

DROP TABLE IF EXISTS `Parcela`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Parcela` (
  `parcela_id` int NOT NULL AUTO_INCREMENT,
  `nombre_parcela` varchar(50) DEFAULT NULL,
  `pos_x_grid` int DEFAULT NULL,
  `pos_y_grid` int DEFAULT NULL,
  `ensayo_id_fk` int NOT NULL,
  `bloque_id_fk` int NOT NULL,
  `tratamiento_id_fk` int NOT NULL,
  PRIMARY KEY (`parcela_id`),
  UNIQUE KEY `uq_parcela_ensayo_nombre` (`ensayo_id_fk`,`nombre_parcela`),
  KEY `idx_parcela_nombre` (`nombre_parcela`),
  KEY `FK_49db3de05a1423b311ea9a63a57` (`tratamiento_id_fk`),
  KEY `idx_parcela_bloque` (`bloque_id_fk`),
  CONSTRAINT `FK_03b04681fea9dec5dbaac05b6fe` FOREIGN KEY (`ensayo_id_fk`) REFERENCES `Ensayo` (`ensayo_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_2d408a6c796833102dded79d1e8` FOREIGN KEY (`bloque_id_fk`) REFERENCES `Bloque` (`bloque_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_49db3de05a1423b311ea9a63a57` FOREIGN KEY (`tratamiento_id_fk`) REFERENCES `Tratamiento` (`tratamiento_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Parcela`
--

LOCK TABLES `Parcela` WRITE;
/*!40000 ALTER TABLE `Parcela` DISABLE KEYS */;
INSERT INTO `Parcela` VALUES (2,'23-3213-2131-2321adsqw-eq-A-1.1',1,1,74,6,17),(4,'23-3213-2131-2321adsqw-eq-B',1,1,74,7,2),(5,'23-3213-2131-2321adsqw-eq-A-5.1',5,1,74,6,22),(9,'A',1,1,71,1,5),(12,'23-3213-2131-2321adsqw-eq-B-2.2',2,2,74,7,22),(19,'23-3213-2131-2321adsqw-eq-A-1.4',1,4,74,6,22),(20,'23-3213-2131-2321adsqw-eq-A-2.5',2,5,74,6,18),(21,'23-3213-2131-2321adsqw-eq-C-4.5',4,5,74,8,17),(22,'23-3213-2131-2321adsqw-eq-D-2.4',2,4,74,9,18),(23,'23-3213-2131-2321adsqw-eq-A-4.3',4,3,74,6,18),(24,'23-3213-2131-2321adsqw-eq-A-2.1',2,1,74,6,23),(26,'25-EWRT-523D-WE-A-1.1',1,1,69,10,2);
/*!40000 ALTER TABLE `Parcela` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Producto`
--

DROP TABLE IF EXISTS `Producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Producto` (
  `producto_id` int NOT NULL AUTO_INCREMENT,
  `lab_id_fk` int DEFAULT NULL,
  `nombre_comercial` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `principio_activo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formulacion` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`producto_id`),
  KEY `FK_7469d916b91aed59b9366b577a4` (`lab_id_fk`),
  CONSTRAINT `FK_7469d916b91aed59b9366b577a4` FOREIGN KEY (`lab_id_fk`) REFERENCES `Laboratorio` (`lab_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Producto`
--

LOCK TABLES `Producto` WRITE;
/*!40000 ALTER TABLE `Producto` DISABLE KEYS */;
INSERT INTO `Producto` VALUES (1,1,'Glifosato Ultra','Glifosato','SL'),(2,1,'Atrazina Max','Glifosato','SL'),(3,1,'Fungicid Total','Atrazina','PM'),(4,2,'Insecticid Pro','Glifosato','SL'),(5,2,'Fertilizante NPK','2,4-D','EE'),(6,3,'Roundup','Glifosato','SL'),(7,3,'Tempo','Cipermetrina','EW'),(8,4,'Gramoxone','Paraquat','SL'),(9,4,'Actara','Tiametoxam','WG'),(10,5,'Engeo Plata','Tiametoxam + Lambda','SC'),(11,5,'Lorsban','ClorpirifÃ³s','EC'),(12,6,'Foley','Glifosato','SL'),(13,6,'Cartap','Cartap','SL');
/*!40000 ALTER TABLE `Producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Protocolo`
--

DROP TABLE IF EXISTS `Protocolo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Protocolo` (
  `protocolo_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`protocolo_id`),
  UNIQUE KEY `IDX_b885f1923783bb300a49b72d34` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Protocolo`
--

LOCK TABLES `Protocolo` WRITE;
/*!40000 ALTER TABLE `Protocolo` DISABLE KEYS */;
INSERT INTO `Protocolo` VALUES (1,'Protocolo Herbicida Maíz Post-Emergencia','Control de malezas de hoja ancha y gramíneas en maíz.'),(2,'Protocolo Fungicida Trigo Espiga 2025','Control de enfermedades foliares y de espiga en trigo.'),(3,'Protocolo Insecticida Soja V3','Control de orugas y chinches en soja en estado V3.'),(5,'Protocolo de prueba','test test test');
/*!40000 ALTER TABLE `Protocolo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Protocolo_Variable`
--

DROP TABLE IF EXISTS `Protocolo_Variable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Protocolo_Variable` (
  `variable_id` int NOT NULL AUTO_INCREMENT,
  `nombre_variable` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unidad_medida` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `tipo_ensayo_id_fk` int NOT NULL,
  PRIMARY KEY (`variable_id`),
  UNIQUE KEY `IDX_d38369a9469f88193a26d2ff0e` (`nombre_variable`),
  KEY `FK_b9c188d6dc0a1dcddfc033cc6f2` (`tipo_ensayo_id_fk`),
  CONSTRAINT `FK_b9c188d6dc0a1dcddfc033cc6f2` FOREIGN KEY (`tipo_ensayo_id_fk`) REFERENCES `Tipo_Ensayo` (`tipo_ensayo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Protocolo_Variable`
--

LOCK TABLES `Protocolo_Variable` WRITE;
/*!40000 ALTER TABLE `Protocolo_Variable` DISABLE KEYS */;
INSERT INTO `Protocolo_Variable` VALUES (42,'PLANTULAS NORMALES','%',NULL,1),(43,'PLANTULAS ANORMALES','%',NULL,1),(44,'SEMILLAS MUERTAS','%',NULL,1),(45,'LONGITUD DE TALLO','CM',NULL,1),(46,'LONGITUD DE RAICES','CM',NULL,1),(47,'PESO SECO TALLO','g',NULL,1),(48,'PESO SECO RAICES','g',NULL,1),(49,'SANIDAD GENERAL (LAB)','%',NULL,1),(50,'PORCENTAJE DE CONTROL GENERAL (BARBECHO)','%',NULL,2),(51,'FITOTOXICIDAD (BARBECHO)','ESCALA 1-9',NULL,2),(52,'PORCENTAJE DE CONTROL GENERAL (PREEMERGENTES)','%',NULL,3),(53,'FITOTOXICIDAD (PREEMERGENTES)','ESCALA 1-9',NULL,3),(54,'PORCENTAJE DE CONTROL PARA DISTINTAS MALEZAS','ESCALA 1-9',NULL,3),(55,'N° DE PLANTAS POR METROS LINEAL','N°/METRO',NULL,4),(56,'VIGOR PLANTAS','ESCALA 1-5',NULL,4),(57,'ESTADO SANITARIO GENERAL (CAMPO)','0-100%',NULL,4),(58,'LONGITUD DE PLANTAS','CM',NULL,4),(59,'LONGITUD DE RAICES (CAMPO)','CM',NULL,4),(60,'VIGOR DE RAICES','ESCALA 1-5',NULL,4),(61,'NUMERO DE NODULO/PLANTULAS','N°',NULL,4),(62,'VIGOR AEREO','ESCALA 1-5',NULL,5),(63,'FITOTOXICIDAD (FOLIARES)','ESCALA 1-9',NULL,5),(64,'NVI (FOLIARES)','ESCALA 0-1',NULL,5),(65,'OBSERVACIONES (FOLIARES)','TEXTO',NULL,5),(66,'ENFERMEDAD ESCLEROTINIA - INCIDENCIA','%',NULL,6),(67,'ENFERMEDAD ESCLEROTINIA - SEVERIDAD','%',NULL,6),(68,'FITOTOXICIDAD (FUNGICIDA)','ESCALA 1-9',NULL,6),(69,'NVI (FUNGICIDA)','ESCALA 0-1',NULL,6),(70,'SANIDAD GENERAL (FUNGICIDA)','ESCALA 0-100',NULL,6),(71,'N° DE ACAROS POR FOLIOLO','N°',NULL,7),(72,'N° DE TRIPS ADULTOS POR FOLIOLO','N°',NULL,7),(73,'N° DE TRIPS NINFA POR FOLIOLO','N°',NULL,7),(74,'N° DE MOSCA BLANCA ADULTA','N°',NULL,7),(75,'N° DE NINFA DE MOSCA BLANCA','N°',NULL,7),(76,'N° DE HUEVOS DE MOSCA BLANCA','N°',NULL,7),(77,'N° DE MEDIDORA POR METROS MENORES A 1,5 CM','N°',NULL,7),(78,'N° DE MEDIDORA POR METROS MAYORES A 1,5 CM','N°',NULL,7),(79,'N° DE ANTICARCIA POR METRO MENORES A 1,5 CM','N°',NULL,7),(80,'N° DE ANTICARCIA POR METRO MAYORES A 1,5 CM','N°',NULL,7),(81,'N° DE SPODOPTERA POR METROS MENORES A 1,5 CM','N°',NULL,7),(82,'N° DE SPODOPTERA POR METROS MAYORES A 1,5 CM','N°',NULL,7),(83,'PORCENTAJE DE DESFOLIACIÓN','ESCALA 0-100',NULL,7),(84,'SANIDAD GENERAL (INSECTICIDA)','ESCALA 0-100',NULL,7),(85,'OTROS (INSECTICIDA)','TEXTO',NULL,7),(86,'ENFERMEDAD BACTERIA - INCIDENCIA','%',NULL,8),(87,'ENFERMEDAD BACTERIA - SEVERIDAD','%',NULL,8),(88,'FITOTOXICIDAD (BACTERICIDA)','ESCALA 1-9',NULL,8),(89,'NVI (BACTERICIDA)','ESCALA 0-1',NULL,8),(90,'SANIDAD GENERAL (BACTERICIDA)','ESCALA 0-100',NULL,8),(91,'PORCENTAJE DE CONTROL GENERAL (DESECANTES)','%',NULL,9),(92,'FITOTOXICIDAD (DESECANTES)','ESCALA 1-9',NULL,9),(93,'PORCENTAJE SECADO TALLO','ESCALA 0-100',NULL,9),(94,'PORCENTAJE SECADO HOJAS','ESCALA 0-100',NULL,9),(95,'PORCENTAJE SECADO CHAUCHA','ESCALA 0-100',NULL,9),(98,'dsfadsfds','sadfdsf','sdfasdfasf',9),(100,'fito','%','aaa',12);
/*!40000 ALTER TABLE `Protocolo_Variable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rol`
--

DROP TABLE IF EXISTS `Rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rol` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`rol_id`),
  UNIQUE KEY `IDX_eab126756b3c321c11c2e0a331` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rol`
--

LOCK TABLES `Rol` WRITE;
/*!40000 ALTER TABLE `Rol` DISABLE KEYS */;
INSERT INTO `Rol` VALUES (1,'Test','test'),(2,'Superadministrador','Acceso total. Puede gestionar Administradores.'),(3,'Administrador','Puede gestionar Usuarios y asignar roles. Acceso a todo.'),(4,'Manager','Puede crear Labs/Productos, ver Ensayos y Reportes.'),(5,'Tecnico','Puede cargar datos de campo (Ensayos, Mediciones).'),(6,'Invitado','Acceso de solo lectura a laboratorios y ensayos asignados.');
/*!40000 ALTER TABLE `Rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StatusEnsayo`
--

DROP TABLE IF EXISTS `StatusEnsayo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StatusEnsayo` (
  `status_id` int NOT NULL AUTO_INCREMENT COMMENT 'ID único del estado',
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre del estado (ej: Por Iniciar, En Ejecución)',
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Descripción del estado',
  `activo` tinyint(1) DEFAULT '1' COMMENT 'Indica si el estado está disponible',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última actualización',
  PRIMARY KEY (`status_id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `idx_status_nombre` (`nombre`),
  KEY `idx_status_activo` (`activo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de estados para ensayos';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StatusEnsayo`
--

LOCK TABLES `StatusEnsayo` WRITE;
/*!40000 ALTER TABLE `StatusEnsayo` DISABLE KEYS */;
INSERT INTO `StatusEnsayo` VALUES (1,'Por Iniciar','Ensayo creado pero aún no ha comenzado',1,'2025-12-13 15:59:20','2025-12-13 15:59:20'),(2,'En Ejecución','Ensayo actualmente en ejecución en campo',1,'2025-12-13 15:59:20','2025-12-13 15:59:20'),(3,'En Análisis','Ensayo completado, datos en análisis de laboratorio',1,'2025-12-13 15:59:20','2025-12-13 15:59:20'),(4,'Completado','Ensayo completado con análisis finalizado',1,'2025-12-13 15:59:20','2025-12-13 15:59:20'),(5,'Cancelado','Ensayo cancelado durante su ejecución',1,'2025-12-13 15:59:20','2025-12-13 15:59:20'),(6,'Suspendido','Ensayo suspendido temporalmente, puede reanudarse',1,'2025-12-13 15:59:20','2025-12-13 15:59:20'),(7,'Archivado','Ensayo archivado, sin posibilidad de modificación',1,'2025-12-13 15:59:20','2025-12-13 15:59:20');
/*!40000 ALTER TABLE `StatusEnsayo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TipoSiembra`
--

DROP TABLE IF EXISTS `TipoSiembra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TipoSiembra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_416261df52165aa9c7ef8ef788` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoSiembra`
--

LOCK TABLES `TipoSiembra` WRITE;
/*!40000 ALTER TABLE `TipoSiembra` DISABLE KEYS */;
INSERT INTO `TipoSiembra` VALUES (2,'Labranza Convencional'),(3,'Labranza Mínima'),(5,'Siembra al Voleo'),(6,'Siembra de Precisión'),(1,'Siembra Directa'),(4,'Siembra en Surcos');
/*!40000 ALTER TABLE `TipoSiembra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tipo_Ensayo`
--

DROP TABLE IF EXISTS `Tipo_Ensayo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tipo_Ensayo` (
  `tipo_ensayo_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `evaluacion_csv` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tipo_ensayo_id`),
  UNIQUE KEY `IDX_3796314b3911f1617134a14941` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipo_Ensayo`
--

LOCK TABLES `Tipo_Ensayo` WRITE;
/*!40000 ALTER TABLE `Tipo_Ensayo` DISABLE KEYS */;
INSERT INTO `Tipo_Ensayo` VALUES (1,'LABORATORIO (TRATAMIENTO DE SEMILLA)','3,7,14',1,'2025-11-27 04:38:29','2025-11-27 04:38:29'),(2,'BARBECHO','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29'),(3,'PREEMERGENTES','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29'),(4,'TRATAMIENTOS DE SEMILLAS CAMPO','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29'),(5,'FOLIARES Y RECUPERADORES','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29'),(6,'FUNGICIDA','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29'),(7,'INSECTICIDA','3,7,14,21,28',1,'2025-11-27 04:38:29','2025-11-27 04:38:29'),(8,'BACTERICIDA','3,7,14,21,28',1,'2025-11-27 04:38:29','2025-12-13 20:48:29'),(9,'DESECANTES','3,7,14,21,28',1,'2025-11-27 04:38:29','2025-11-27 04:38:29'),(10,'OTRO','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29'),(12,'tipo nuevo 20',NULL,1,'2026-01-05 18:44:57','2026-01-05 18:44:57');
/*!40000 ALTER TABLE `Tipo_Ensayo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tipo_Ensayo_EvaluacionDia`
--

DROP TABLE IF EXISTS `Tipo_Ensayo_EvaluacionDia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tipo_Ensayo_EvaluacionDia` (
  `tipo_eval_dia_id` int NOT NULL AUTO_INCREMENT,
  `dia` int NOT NULL,
  `tipo_ensayo_id_fk` int DEFAULT NULL,
  PRIMARY KEY (`tipo_eval_dia_id`),
  KEY `FK_4dfe65b5937762f2e8a7adaa211` (`tipo_ensayo_id_fk`),
  CONSTRAINT `FK_4dfe65b5937762f2e8a7adaa211` FOREIGN KEY (`tipo_ensayo_id_fk`) REFERENCES `Tipo_Ensayo` (`tipo_ensayo_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipo_Ensayo_EvaluacionDia`
--

LOCK TABLES `Tipo_Ensayo_EvaluacionDia` WRITE;
/*!40000 ALTER TABLE `Tipo_Ensayo_EvaluacionDia` DISABLE KEYS */;
INSERT INTO `Tipo_Ensayo_EvaluacionDia` VALUES (1,3,1),(2,7,1),(3,14,1),(4,3,2),(5,3,5),(6,3,6),(7,3,10),(8,3,3),(9,3,4),(11,7,2),(12,7,5),(13,7,6),(14,7,10),(15,7,3),(16,7,4),(18,14,2),(19,14,5),(20,14,6),(21,14,10),(22,14,3),(23,14,4),(25,21,2),(26,21,5),(27,21,6),(28,21,10),(29,21,3),(30,21,4),(32,28,2),(33,28,5),(34,28,6),(35,28,10),(36,28,3),(37,28,4),(39,35,2),(40,35,5),(41,35,6),(42,35,10),(43,35,3),(44,35,4),(47,3,9),(48,3,7),(50,7,9),(51,7,7),(53,14,9),(54,14,7),(56,21,9),(57,21,7),(59,28,9),(60,28,7),(67,3,8),(68,7,8),(69,14,8),(70,21,8),(71,28,8);
/*!40000 ALTER TABLE `Tipo_Ensayo_EvaluacionDia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tipo_Ensayo_Variable`
--

DROP TABLE IF EXISTS `Tipo_Ensayo_Variable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tipo_Ensayo_Variable` (
  `tipo_ensayo_variable_id` int NOT NULL AUTO_INCREMENT,
  `orden` int DEFAULT NULL,
  `requerido` tinyint NOT NULL DEFAULT '0',
  `unidad_override` varchar(30) DEFAULT NULL,
  `escala` varchar(50) DEFAULT NULL,
  `rango_min` decimal(10,2) DEFAULT NULL,
  `rango_max` decimal(10,2) DEFAULT NULL,
  `tipo_ensayo_id_fk` int DEFAULT NULL,
  `variable_id_fk` int DEFAULT NULL,
  PRIMARY KEY (`tipo_ensayo_variable_id`),
  KEY `FK_fdf0cf54cf82d8d82ce2aff53ab` (`tipo_ensayo_id_fk`),
  KEY `FK_2074b85033b4ccad99570f63f9a` (`variable_id_fk`),
  CONSTRAINT `FK_2074b85033b4ccad99570f63f9a` FOREIGN KEY (`variable_id_fk`) REFERENCES `Protocolo_Variable` (`variable_id`),
  CONSTRAINT `FK_fdf0cf54cf82d8d82ce2aff53ab` FOREIGN KEY (`tipo_ensayo_id_fk`) REFERENCES `Tipo_Ensayo` (`tipo_ensayo_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipo_Ensayo_Variable`
--

LOCK TABLES `Tipo_Ensayo_Variable` WRITE;
/*!40000 ALTER TABLE `Tipo_Ensayo_Variable` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tipo_Ensayo_Variable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tratamiento`
--

DROP TABLE IF EXISTS `Tratamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tratamiento` (
  `tratamiento_id` int NOT NULL AUTO_INCREMENT,
  `protocolo_id_fk` int NOT NULL,
  `numero_trat` int NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `es_testigo` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`tratamiento_id`),
  UNIQUE KEY `IDX_9c687c902b8a901c10a558799e` (`protocolo_id_fk`,`numero_trat`),
  CONSTRAINT `FK_2228129acf36f8f9d5d6bdc9203` FOREIGN KEY (`protocolo_id_fk`) REFERENCES `Protocolo` (`protocolo_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tratamiento`
--

LOCK TABLES `Tratamiento` WRITE;
/*!40000 ALTER TABLE `Tratamiento` DISABLE KEYS */;
INSERT INTO `Tratamiento` VALUES (1,1,1,'Tratamiento 1 (P1): Glifosato Ultra (1.5 L/ha) + Atrazina Max (2 L/ha)',0),(2,1,2,'Tratamiento 2 (P1): Testigo (Sin aplicación)',1),(5,3,1,'Tratamiento 1 (P3): Insecticid Pro (0.2 L/ha) + Fertilizante NPK (100 kg/ha)',0),(6,3,2,'Tratamiento 2 (P3): Testigo (Sin aplicación)',1),(16,3,3,'wqewqewq',0),(17,2,1,'Testigo',1),(18,2,2,'Insecticid Pro 500 + Roundup 100',0),(22,2,3,'Gramoxone + actara',0),(23,2,4,'aaaaaa',0);
/*!40000 ALTER TABLE `Tratamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tratamiento_Producto`
--

DROP TABLE IF EXISTS `Tratamiento_Producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tratamiento_Producto` (
  `trat_prod_id` int NOT NULL AUTO_INCREMENT,
  `tratamiento_id_fk` int NOT NULL,
  `producto_id_fk` int NOT NULL,
  `dosis` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unidad_dosis` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cc/ha',
  `estadio` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Estadio de aplicación (V2, V3, V4, etc.)',
  PRIMARY KEY (`trat_prod_id`),
  UNIQUE KEY `IDX_0fc6b7b1cf272aaf2037f28c85` (`tratamiento_id_fk`,`producto_id_fk`),
  KEY `FK_a63fd88c9f0bbcb8518ce2a12ab` (`producto_id_fk`),
  CONSTRAINT `FK_34827fc42da4bbc11e329d83287` FOREIGN KEY (`tratamiento_id_fk`) REFERENCES `Tratamiento` (`tratamiento_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_a63fd88c9f0bbcb8518ce2a12ab` FOREIGN KEY (`producto_id_fk`) REFERENCES `Producto` (`producto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tratamiento_Producto`
--

LOCK TABLES `Tratamiento_Producto` WRITE;
/*!40000 ALTER TABLE `Tratamiento_Producto` DISABLE KEYS */;
INSERT INTO `Tratamiento_Producto` VALUES (1,1,1,'1.5','L/ha',NULL),(2,1,2,'2','L/ha',NULL),(4,5,4,'0.2','L/ha',NULL),(5,5,5,'100','kg/ha',NULL),(10,16,6,'12332121','cc/ha',NULL),(12,1,9,'250','cc/ha','v1'),(13,18,4,'500','cc/ha','v1'),(14,18,6,'100','cc/ha','v1'),(15,22,8,'200','cc/ha',NULL),(16,22,9,'200','cc/ha',NULL),(17,23,5,'250','cc/ha','v1');
/*!40000 ALTER TABLE `Tratamiento_Producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `rol_id_fk` int DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `esta_activo` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `IDX_fc2564b581e02a535b31470a00` (`username`),
  KEY `FK_d0b0f6000bbbe6950ca3faa26af` (`rol_id_fk`),
  CONSTRAINT `FK_d0b0f6000bbbe6950ca3faa26af` FOREIGN KEY (`rol_id_fk`) REFERENCES `Rol` (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES (1,2,'dariassoft@gmail.com','$2b$10$pMnYNGT5VPqbTcTBLEjNT.5r5NM6teNrDgMsB42eqDVJJ7qFQq.CG','Daniel','Arias','3875789133',NULL,1);
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario_Laboratorio`
--

DROP TABLE IF EXISTS `Usuario_Laboratorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario_Laboratorio` (
  `usuario_lab_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id_fk` int DEFAULT NULL,
  `lab_id_fk` int DEFAULT NULL,
  PRIMARY KEY (`usuario_lab_id`),
  UNIQUE KEY `IDX_7a344f100d9b96f6be5cced7e2` (`usuario_id_fk`,`lab_id_fk`),
  KEY `FK_f1c9f1825b867b7d8dc7b2d0a61` (`lab_id_fk`),
  CONSTRAINT `FK_d974c5f526a5427380240bd0164` FOREIGN KEY (`usuario_id_fk`) REFERENCES `Usuario` (`usuario_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_f1c9f1825b867b7d8dc7b2d0a61` FOREIGN KEY (`lab_id_fk`) REFERENCES `Laboratorio` (`lab_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario_Laboratorio`
--

LOCK TABLES `Usuario_Laboratorio` WRITE;
/*!40000 ALTER TABLE `Usuario_Laboratorio` DISABLE KEYS */;
INSERT INTO `Usuario_Laboratorio` VALUES (1,1,1);
/*!40000 ALTER TABLE `Usuario_Laboratorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1765461926925,'AddResponsableToEnsayo1765461926925'),(2,1765474065022,'RefactorEnsayoCultivoAndDates1765474065022');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-05 17:25:16
