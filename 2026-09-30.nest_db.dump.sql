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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Aplicacion`
--

LOCK TABLES `Aplicacion` WRITE;
/*!40000 ALTER TABLE `Aplicacion` DISABLE KEYS */;
INSERT INTO `Aplicacion` VALUES (2,64,'Primera aplicación','2026-01-29 22:29:00','c1',0.1,0.1,0.1,NULL,NULL,NULL),(3,74,'Primera aplicación1','2026-01-02 07:02:00','v11',19.1,30.1,20.1,NULL,NULL,NULL),(4,66,'Primera aplicación','2026-01-30 02:00:00','v1',-0.1,1.0,1.0,NULL,NULL,NULL),(5,69,'Primera aplicación1','2026-02-19 20:30:00','v1',16.0,30.0,20.0,NULL,NULL,NULL),(6,75,'siembra','2026-03-02 20:01:00','v1',19.0,60.0,20.0,NULL,NULL,NULL),(15,63,'AplicaciÃ³n Herbicida Principal','2026-05-15 10:30:00','V6',24.5,65.0,8.2,'Pulverizador de barral 500L','Pico 110-04',2.50),(16,76,'Aplicacion foliar R1 - inicio floracion soja','2027-01-08 08:30:00','R1',22.5,68.0,8.5,'Pulverizadora Jacto Uniport 2500 - 28 m de ancho','TeeJet AIXR 11002 - doble abanico plano antideriva',2.80);
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bloque`
--

LOCK TABLES `Bloque` WRITE;
/*!40000 ALTER TABLE `Bloque` DISABLE KEYS */;
INSERT INTO `Bloque` VALUES (16,'B',63),(17,'C',63),(10,'A',69),(11,'B',69),(1,'A',71),(2,'B',71),(3,'C',71),(12,'A',74),(13,'B',74),(14,'C',74),(27,'D',74),(18,'A',75),(19,'B',75),(23,'I',76),(24,'II',76),(25,'III',76),(26,'IV',76);
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
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `ciclo_vegetativo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `esta_activo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cultivo_id`),
  UNIQUE KEY `IDX_41324640dfaa4fdc7350743f28` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cultivo`
--

LOCK TABLES `Cultivo` WRITE;
/*!40000 ALTER TABLE `Cultivo` DISABLE KEYS */;
INSERT INTO `Cultivo` VALUES (1,'Soja',NULL,NULL,1,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(2,'Maiz',NULL,NULL,1,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(3,'Barbecho',NULL,NULL,1,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(4,'Poroto',NULL,NULL,1,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(5,'Mani',NULL,NULL,1,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(6,'Trigo',NULL,NULL,1,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(7,'Cebada',NULL,NULL,1,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(8,'Otros',NULL,NULL,1,'2026-02-11 23:40:30','2026-02-11 23:40:30');
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
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `caracteristicas` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `esta_activo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
INSERT INTO `Cultivo_Variedad` VALUES (1,1,'Asgrow MG4.2',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45'),(2,1,'DM 4.0i',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45'),(3,1,'Desoy 3810',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45'),(4,2,'DK 7710',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45'),(5,2,'SK 7333',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45'),(6,2,'P1198W',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45'),(7,6,'Baguette 620',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45'),(8,6,'Klein Proteo',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45'),(9,6,'Baguette 250',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45'),(10,7,'Scarlett',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45'),(11,7,'Rainbow',NULL,NULL,1,'2026-02-11 23:46:45','2026-02-11 23:46:45');
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
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Datos_Campo`
--

LOCK TABLES `Datos_Campo` WRITE;
/*!40000 ALTER TABLE `Datos_Campo` DISABLE KEYS */;
INSERT INTO `Datos_Campo` VALUES (5,'ERRVG GFSG FD GFDS GFD GD FD',26,25),(59,'EvaluaciÃ³n - 123-BASFG-3213-21-B-1.1',31,62),(60,'asda asd asd asljg fsdf',44,62),(61,'tyruyu',43,62),(62,NULL,42,62),(63,NULL,48,62),(64,NULL,46,62),(65,NULL,47,62),(66,NULL,45,62),(71,NULL,31,65),(72,NULL,44,65),(73,NULL,43,65),(74,NULL,42,65),(75,NULL,48,65),(76,NULL,46,65),(77,NULL,47,65),(78,NULL,45,65),(79,'Pre-app. Incidencia esporadica inicial. Sin danos.',49,66),(80,'14 DAA testigo. Avance importante esclerotinia.',49,67),(81,'28 DAA testigo. Alta incidencia. Planta deteriorada.',49,68),(82,'Pre-app. Inicio sintomas similar a testigo.',50,66),(83,'14 DAA T1. Buen control. Leve fitotoxicidad inicial.',50,67),(84,'28 DAA T1. Control sostenido Amistar Xtra.',50,68),(85,'Pre-app. Condicion sanitaria normal.',51,66),(86,'14 DAA T2. Control aceptable Nativo.',51,67),(87,'28 DAA T2. Ligero incremento enfermedad.',51,68),(88,'Pre-app. Sin sintomas evidentes.',52,66),(89,'14 DAA T3. Control moderado Opera.',52,67),(90,'28 DAA T3. Menor residualidad que T1 y T4.',52,68),(91,'Pre-app. Condicion inicial optima.',53,66),(92,'14 DAA T4. Mejor control del ensayo. Mezcla en tanque.',53,67),(93,'28 DAA T4. Menor incidencia registrada.',53,68),(94,'Pre-app. Alta humedad ambiental. Favorece infeccion.',54,66),(95,'14 DAA T2. Control similar a bloque I.',54,67),(96,'28 DAA T2. Mayor presion por humedad en B2.',54,68),(97,'Pre-app. Signos tempranos por alta humedad.',55,66),(98,'14 DAA testigo B2. Alta progresion enfermedad.',55,67),(99,'28 DAA testigo B2. Mayor severidad del ensayo.',55,68),(100,'Pre-app. Condicion normal.',56,66),(101,'14 DAA T4. Excelente control pese a presion.',56,67),(102,'28 DAA T4 B2. Mejor trat incluso en zona humeda.',56,68),(103,'Pre-app. Sin sintomas.',57,66),(104,'14 DAA T1 B2. Buen control.',57,67),(105,'28 DAA T1 B2. Control consistente.',57,68),(106,'Pre-app. Lesiones incipientes.',58,66),(107,'14 DAA T3 B2. Control moderado.',58,67),(108,'28 DAA T3 B2. Incremento moderado de enfermedad.',58,68),(109,'Pre-app. Condicion normal B3.',59,66),(110,'14 DAA T3 B3. Control similar a bloques anteriores.',59,67),(111,'28 DAA T3 B3. Moderado. Consistente con B1.',59,68),(112,'Pre-app. Sin sintomas.',60,66),(113,'14 DAA T4 B3. Control excelente reafirmado.',60,67),(114,'28 DAA T4 B3. Consistencia del tratamiento doble.',60,68),(115,'Pre-app. Incidencia inicial algo menor a B1-B2.',61,66),(116,'14 DAA testigo B3. Progresion fuerte.',61,67),(117,'28 DAA testigo B3. Dano severo sin tratamiento.',61,68),(118,'Pre-app. Normal.',62,66),(119,'14 DAA T2 B3. Buen control inicial.',62,67),(120,'28 DAA T2 B3. Mantiene nivel de control.',62,68),(121,'Pre-app. Sin sintomas.',63,66),(122,'14 DAA T1 B3. Control sostenido.',63,67),(123,'28 DAA T1 B3. Consistencia de Amistar Xtra.',63,68),(124,'Pre-app. Condicion normal B4.',64,66),(125,'14 DAA T1 B4. Buen control.',64,67),(126,'28 DAA T1 B4. Control consistente ultimo bloque.',64,68),(127,'Pre-app. Sin sintomas.',65,66),(128,'14 DAA T3 B4. Control moderado.',65,67),(129,'28 DAA T3 B4. Residualidad menor, ligero avance.',65,68),(130,'Pre-app. Zona algo compactada. Normal.',66,66),(131,'14 DAA T2 B4. Control aceptable.',66,67),(132,'28 DAA T2 B4. Nivel de control esperado.',66,68),(133,'Pre-app. Condicion optima.',67,66),(134,'14 DAA T4 B4. Maximo control bloque 4.',67,67),(135,'28 DAA T4 B4. Resultados consistentes con otros bloques.',67,68),(136,'Pre-app. Incidencia inicial baja en B4.',68,66),(137,'14 DAA testigo B4. Avance importante.',68,67),(138,'28 DAA testigo B4. Alta incidencia sin tratamiento.',68,68);
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
) ENGINE=InnoDB AUTO_INCREMENT=514 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Datos_Campo_Medicion`
--

LOCK TABLES `Datos_Campo_Medicion` WRITE;
/*!40000 ALTER TABLE `Datos_Campo_Medicion` DISABLE KEYS */;
INSERT INTO `Datos_Campo_Medicion` VALUES (61,'30',5,91),(62,'4',5,92),(63,'67',5,93),(64,'54',5,94),(65,'34',5,95),(66,'3',5,98),(150,'62.2',59,62),(151,'86.6',59,63),(152,'23.6',59,64),(153,'77.1',59,65),(154,'3',60,62),(155,'6',60,63),(156,'1',60,64),(157,'fd dfakljfd .dsf fdsa ',60,65),(158,'3',61,62),(159,'7',61,63),(160,'1',61,64),(161,'htyuyu ',61,65),(162,'4',62,62),(163,'8',62,63),(164,'1',62,64),(165,'5',63,62),(166,'9',63,63),(167,'1',63,64),(168,'hohjk',63,65),(169,'5',64,62),(170,'3',64,63),(171,'1',64,64),(172,'5',65,62),(173,'2',65,63),(174,'1',65,64),(175,'5',66,62),(176,'1',66,63),(177,'1',66,64),(190,'5',71,62),(191,'8',71,63),(192,'1',71,64),(193,'4',72,62),(194,'7',72,63),(195,'1',72,64),(196,'3',73,62),(197,'4',73,63),(198,'1',73,64),(199,'4',74,62),(200,'6',74,63),(201,'1',74,64),(202,'2',75,62),(203,'3',75,63),(204,'1',75,64),(205,'2',76,62),(206,'3',76,63),(207,'1',76,64),(208,'2',77,62),(209,'3',77,63),(210,'1',77,64),(211,'2',78,62),(212,'3',78,63),(213,'0',78,64),(214,'8.5',79,66),(215,'4.2',79,67),(216,'1.0',79,68),(217,'0.0',79,69),(218,'72.0',79,70),(219,'42.0',80,66),(220,'25.5',80,67),(221,'1.0',80,68),(222,'0.0',80,69),(223,'45.0',80,70),(224,'71.5',81,66),(225,'51.2',81,67),(226,'1.0',81,68),(227,'1.0',81,69),(228,'28.0',81,70),(229,'9.0',82,66),(230,'5.0',82,67),(231,'1.0',82,68),(232,'0.0',82,69),(233,'71.0',82,70),(234,'14.0',83,66),(235,'8.0',83,67),(236,'2.0',83,68),(237,'0.0',83,69),(238,'78.0',83,70),(239,'22.0',84,66),(240,'14.0',84,67),(241,'1.0',84,68),(242,'0.0',84,69),(243,'82.0',84,70),(244,'8.0',85,66),(245,'4.0',85,67),(246,'1.0',85,68),(247,'0.0',85,69),(248,'73.0',85,70),(249,'16.0',86,66),(250,'9.5',86,67),(251,'2.0',86,68),(252,'0.0',86,69),(253,'76.0',86,70),(254,'26.0',87,66),(255,'18.0',87,67),(256,'2.0',87,68),(257,'0.0',87,69),(258,'78.0',87,70),(259,'9.0',88,66),(260,'5.0',88,67),(261,'1.0',88,68),(262,'0.0',88,69),(263,'71.0',88,70),(264,'18.0',89,66),(265,'11.0',89,67),(266,'2.0',89,68),(267,'0.0',89,69),(268,'74.0',89,70),(269,'30.0',90,66),(270,'21.0',90,67),(271,'2.0',90,68),(272,'0.0',90,69),(273,'75.0',90,70),(274,'8.0',91,66),(275,'4.0',91,67),(276,'1.0',91,68),(277,'0.0',91,69),(278,'72.0',91,70),(279,'11.0',92,66),(280,'6.0',92,67),(281,'2.0',92,68),(282,'0.0',92,69),(283,'82.0',92,70),(284,'15.0',93,66),(285,'10.0',93,67),(286,'1.0',93,68),(287,'0.0',93,69),(288,'87.0',93,70),(289,'9.2',94,66),(290,'5.2',94,67),(291,'1.0',94,68),(292,'0.0',94,69),(293,'71.0',94,70),(294,'17.5',95,66),(295,'10.8',95,67),(296,'2.0',95,68),(297,'0.0',95,69),(298,'74.0',95,70),(299,'27.5',96,66),(300,'19.5',96,67),(301,'2.0',96,68),(302,'0.0',96,69),(303,'76.0',96,70),(304,'9.8',97,66),(305,'5.5',97,67),(306,'1.0',97,68),(307,'0.0',97,69),(308,'70.0',97,70),(309,'44.5',98,66),(310,'27.5',98,67),(311,'1.0',98,68),(312,'0.0',98,69),(313,'42.0',98,70),(314,'73.0',99,66),(315,'53.5',99,67),(316,'1.0',99,68),(317,'1.0',99,69),(318,'25.0',99,70),(319,'9.0',100,66),(320,'5.0',100,67),(321,'1.0',100,68),(322,'0.0',100,69),(323,'70.0',100,70),(324,'12.0',101,66),(325,'7.0',101,67),(326,'2.0',101,68),(327,'0.0',101,69),(328,'80.0',101,70),(329,'16.2',102,66),(330,'11.0',102,67),(331,'1.0',102,68),(332,'0.0',102,69),(333,'85.0',102,70),(334,'9.5',103,66),(335,'5.8',103,67),(336,'1.0',103,68),(337,'0.0',103,69),(338,'69.0',103,70),(339,'15.5',104,66),(340,'9.0',104,67),(341,'2.0',104,68),(342,'0.0',104,69),(343,'76.0',104,70),(344,'23.5',105,66),(345,'15.5',105,67),(346,'1.0',105,68),(347,'0.0',105,69),(348,'80.0',105,70),(349,'10.2',106,66),(350,'6.0',106,67),(351,'1.0',106,68),(352,'0.0',106,69),(353,'69.0',106,70),(354,'19.5',107,66),(355,'12.2',107,67),(356,'2.0',107,68),(357,'0.0',107,69),(358,'72.0',107,70),(359,'31.5',108,66),(360,'22.5',108,67),(361,'2.0',108,68),(362,'0.0',108,69),(363,'73.0',108,70),(364,'8.5',109,66),(365,'4.5',109,67),(366,'1.0',109,68),(367,'0.0',109,69),(368,'73.0',109,70),(369,'17.2',110,66),(370,'10.5',110,67),(371,'2.0',110,68),(372,'0.0',110,69),(373,'76.0',110,70),(374,'29.0',111,66),(375,'20.0',111,67),(376,'2.0',111,68),(377,'0.0',111,69),(378,'77.0',111,70),(379,'7.5',112,66),(380,'3.5',112,67),(381,'1.0',112,68),(382,'0.0',112,69),(383,'74.0',112,70),(384,'10.2',113,66),(385,'5.5',113,67),(386,'2.0',113,68),(387,'0.0',113,69),(388,'84.0',113,70),(389,'14.0',114,66),(390,'9.2',114,67),(391,'1.0',114,68),(392,'0.0',114,69),(393,'89.0',114,70),(394,'7.5',115,66),(395,'3.8',115,67),(396,'1.0',115,68),(397,'0.0',115,69),(398,'74.0',115,70),(399,'40.8',116,66),(400,'24.0',116,67),(401,'1.0',116,68),(402,'0.0',116,69),(403,'47.0',116,70),(404,'69.8',117,66),(405,'49.8',117,67),(406,'1.0',117,68),(407,'1.0',117,69),(408,'30.0',117,70),(409,'7.8',118,66),(410,'3.5',118,67),(411,'1.0',118,68),(412,'0.0',118,69),(413,'75.0',118,70),(414,'15.2',119,66),(415,'9.0',119,67),(416,'2.0',119,68),(417,'0.0',119,69),(418,'78.0',119,70),(419,'25.0',120,66),(420,'17.0',120,67),(421,'2.0',120,68),(422,'0.0',120,69),(423,'80.0',120,70),(424,'8.2',121,66),(425,'4.5',121,67),(426,'1.0',121,68),(427,'0.0',121,69),(428,'73.0',121,70),(429,'13.2',122,66),(430,'7.5',122,67),(431,'2.0',122,68),(432,'0.0',122,69),(433,'80.0',122,70),(434,'21.0',123,66),(435,'13.0',123,67),(436,'1.0',123,68),(437,'0.0',123,69),(438,'84.0',123,70),(439,'10.2',124,66),(440,'6.0',124,67),(441,'1.0',124,68),(442,'0.0',124,69),(443,'70.0',124,70),(444,'15.0',125,66),(445,'8.8',125,67),(446,'2.0',125,68),(447,'0.0',125,69),(448,'77.0',125,70),(449,'24.0',126,66),(450,'15.8',126,67),(451,'1.0',126,68),(452,'0.0',126,69),(453,'81.0',126,70),(454,'10.5',127,66),(455,'6.2',127,67),(456,'1.0',127,68),(457,'0.0',127,69),(458,'70.0',127,70),(459,'19.8',128,66),(460,'12.5',128,67),(461,'2.0',128,68),(462,'0.0',128,69),(463,'73.0',128,70),(464,'32.0',129,66),(465,'23.0',129,67),(466,'2.0',129,68),(467,'0.0',129,69),(468,'74.0',129,70),(469,'9.5',130,66),(470,'5.5',130,67),(471,'1.0',130,68),(472,'0.0',130,69),(473,'70.0',130,70),(474,'17.8',131,66),(475,'11.0',131,67),(476,'2.0',131,68),(477,'0.0',131,69),(478,'75.0',131,70),(479,'28.0',132,66),(480,'19.8',132,67),(481,'2.0',132,68),(482,'0.0',132,69),(483,'77.0',132,70),(484,'9.5',133,66),(485,'5.2',133,67),(486,'1.0',133,68),(487,'0.0',133,69),(488,'71.0',133,70),(489,'12.5',134,66),(490,'7.2',134,67),(491,'2.0',134,68),(492,'0.0',134,69),(493,'81.0',134,70),(494,'16.8',135,66),(495,'11.5',135,67),(496,'1.0',135,68),(497,'0.0',135,69),(498,'86.0',135,70),(499,'10.0',136,66),(500,'5.8',136,67),(501,'1.0',136,68),(502,'0.0',136,69),(503,'71.0',136,70),(504,'45.0',137,66),(505,'28.0',137,67),(506,'1.0',137,68),(507,'0.0',137,69),(508,'43.0',137,70),(509,'74.5',138,66),(510,'54.0',138,67),(511,'1.0',138,68),(512,'1.0',138,69),(513,'26.0',138,70);
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
  `gramaje_por_grano` decimal(8,6) DEFAULT NULL COMMENT 'Peso individual del grano en gramos',
  `granos_porurf` decimal(10,1) DEFAULT NULL COMMENT 'Cantidad de granos por metro cuadrado',
  `peso_granos_porurf` decimal(8,2) DEFAULT NULL COMMENT 'Peso total de granos por m² en gramos',
  `granos_danados` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje de granos dañados',
  `granos_verdes` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje de granos verdes',
  `granos_vanos` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje de granos vanos',
  `hojas_porurf` decimal(10,1) DEFAULT NULL COMMENT 'Cantidad de hojas por metro cuadrado',
  `larvas_porurf` decimal(8,2) DEFAULT NULL COMMENT 'Cantidad de larvas/plagas por m²',
  `insectos_beneficios_porurf` decimal(8,2) DEFAULT NULL COMMENT 'Cantidad de insectos benéficos por m²',
  `diametro_espiga` decimal(5,2) DEFAULT NULL COMMENT 'Diámetro de la espiga en mm',
  `altura_parcela` decimal(5,1) DEFAULT NULL COMMENT 'Altura de las plantas en cm',
  `densidad_plantas_final` decimal(6,2) DEFAULT NULL COMMENT 'Densidad final de plantas por m²',
  `peso_grano_cosechado` decimal(10,2) DEFAULT NULL COMMENT 'Peso total del grano cosechado por parcela en gramos',
  `humedad_grano_cosechado` decimal(5,2) DEFAULT NULL COMMENT 'Humedad del grano al momento de cosecha (%)',
  `superficie_cosechada_m2` decimal(8,2) DEFAULT NULL COMMENT 'Superficie cosechada en m² (para extrapolación de peso a kg/ha)',
  `peso_mil_semillas` decimal(8,2) DEFAULT NULL COMMENT 'Peso por 1000 semillas en gramos',
  PRIMARY KEY (`cosecha_id`),
  UNIQUE KEY `REL_193e0b95d747e97fa9c10a3042` (`parcela_id_fk`),
  CONSTRAINT `FK_193e0b95d747e97fa9c10a30422` FOREIGN KEY (`parcela_id_fk`) REFERENCES `Parcela` (`parcela_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Datos_Cosecha`
--

LOCK TABLES `Datos_Cosecha` WRITE;
/*!40000 ALTER TABLE `Datos_Cosecha` DISABLE KEYS */;
INSERT INTO `Datos_Cosecha` VALUES (45,'2026-03-05',13.50,5636.25,96.80,'Cosecha - 123-BASFG-3213-21-B-1.1',31,0.034900,1025.0,2124.96,3.25,1.74,4.03,8.8,14.72,36.61,49.18,195.5,66.15,NULL,NULL,NULL,NULL),(46,'2027-04-15',13.20,2580.00,2528.40,'Testigo B1: alta incidencia esclerotinia, perdida rinde 32% vs T4.',49,0.188500,1380.0,259.50,18.50,4.20,3.80,42.0,1.80,3.50,NULL,90.5,27.50,NULL,NULL,NULL,NULL),(47,'2027-04-15',13.50,3420.00,3351.60,'T1 B1: excelente control, rinde 32% superior al testigo.',50,0.210200,1620.0,340.50,6.20,1.50,1.20,48.0,0.80,5.80,NULL,95.0,29.80,NULL,NULL,NULL,NULL),(48,'2027-04-15',13.30,3290.00,3224.20,'T2 B1: buen control, rinde 27% superior al testigo.',51,0.205800,1580.0,325.00,8.50,2.10,1.80,46.5,1.00,5.20,NULL,93.5,29.00,NULL,NULL,NULL,NULL),(49,'2027-04-15',13.40,3180.00,3116.40,'T3 B1: control moderado, rinde 23% superior al testigo.',52,0.202000,1555.0,314.10,10.20,2.50,2.00,45.5,1.20,4.90,NULL,92.0,28.50,NULL,NULL,NULL,NULL),(50,'2027-04-15',13.10,3580.00,3508.40,'T4 B1: mejor tratamiento, rinde 39% superior al testigo.',53,0.218000,1648.0,359.30,4.50,1.00,0.90,50.0,0.50,6.50,NULL,97.0,30.20,NULL,NULL,NULL,NULL),(51,'2027-04-15',13.50,3250.00,3185.00,'T2 B2: resultado consistente con B1.',54,0.204000,1565.0,319.30,9.00,2.30,2.00,46.0,1.10,5.00,NULL,93.0,28.80,NULL,NULL,NULL,NULL),(52,'2027-04-15',13.40,2540.00,2489.20,'T0 B2: mayor perdida por alta humedad en bloque 2.',55,0.185000,1360.0,251.60,20.20,4.80,4.10,41.5,2.00,3.20,NULL,89.0,27.00,NULL,NULL,NULL,NULL),(53,'2027-04-15',13.30,3540.00,3469.20,'T4 B2: control sostenido pese a alta presion de enfermedad.',56,0.215000,1632.0,350.90,5.00,1.10,1.00,49.5,0.60,6.20,NULL,96.5,30.00,NULL,NULL,NULL,NULL),(54,'2027-04-15',13.30,3380.00,3312.40,'T1 B2: buen control en zona de alta humedad.',57,0.208000,1605.0,333.80,6.80,1.70,1.40,47.5,0.90,5.50,NULL,94.5,29.50,NULL,NULL,NULL,NULL),(55,'2027-04-15',13.60,3140.00,3077.20,'T3 B2: similar a B1. Consistencia del tratamiento.',58,0.200000,1540.0,308.00,11.50,2.80,2.30,45.0,1.30,4.70,NULL,91.5,28.20,NULL,NULL,NULL,NULL),(56,'2027-04-15',13.20,3210.00,3145.80,'T3 B3: menor presion inicial, rinde superior vs B1-B2.',59,0.204000,1568.0,320.00,10.00,2.40,1.90,46.0,1.20,4.90,NULL,92.5,28.60,NULL,NULL,NULL,NULL),(57,'2027-04-15',13.00,3620.00,3547.60,'T4 B3: maximo rinde del ensayo.',60,0.220000,1662.0,365.60,4.20,0.90,0.80,50.5,0.50,6.80,NULL,97.5,30.50,NULL,NULL,NULL,NULL),(58,'2027-04-15',13.00,2620.00,2567.60,'T0 B3: algo mejor que otros testigos por menor presion inicial.',61,0.192000,1400.0,268.80,17.80,4.00,3.50,43.0,1.70,3.70,NULL,91.0,27.80,NULL,NULL,NULL,NULL),(59,'2027-04-15',13.10,3320.00,3253.60,'T2 B3: resultados consistentes con demas bloques.',62,0.207800,1595.0,331.50,8.00,1.90,1.60,47.0,1.00,5.40,NULL,94.0,29.20,NULL,NULL,NULL,NULL),(60,'2027-04-15',13.20,3460.00,3390.80,'T1 B3: excelente control en condiciones de menor presion.',63,0.212000,1635.0,346.60,5.80,1.40,1.10,48.5,0.80,5.90,NULL,95.5,30.00,NULL,NULL,NULL,NULL),(61,'2027-04-15',13.40,3400.00,3332.00,'T1 B4: cierre del ensayo consistente.',64,0.209000,1610.0,336.50,6.50,1.60,1.30,47.8,0.90,5.60,NULL,94.8,29.60,NULL,NULL,NULL,NULL),(62,'2027-04-15',13.50,3160.00,3096.80,'T3 B4: menor residualidad confirmada en cierre de ciclo.',65,0.201000,1548.0,311.10,11.00,2.60,2.10,45.2,1.30,4.80,NULL,91.8,28.30,NULL,NULL,NULL,NULL),(63,'2027-04-15',13.40,3270.00,3204.60,'T2 B4: buen control, rinde en linea con otros bloques.',66,0.205000,1572.0,322.30,8.80,2.20,1.90,46.2,1.10,5.10,NULL,93.2,28.90,NULL,NULL,NULL,NULL),(64,'2027-04-15',13.20,3560.00,3488.80,'T4 B4: confirma superioridad de la mezcla en tanque.',67,0.217000,1640.0,355.90,4.80,1.00,0.90,49.8,0.60,6.30,NULL,96.8,30.10,NULL,NULL,NULL,NULL),(65,'2027-04-15',13.50,2510.00,2459.80,'T0 B4: peor rendimiento del ensayo. Alta perdida por enfermedad.',68,0.183000,1350.0,247.10,21.00,5.00,4.30,41.0,2.10,3.00,NULL,88.5,26.80,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Datos_Cosecha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Datos_Siembra`
--

DROP TABLE IF EXISTS `Datos_Siembra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Datos_Siembra` (
  `siembra_id` int NOT NULL AUTO_INCREMENT,
  `parcela_id_fk` int NOT NULL,
  `fecha_siembra` date DEFAULT NULL,
  `semillas_por_metro` decimal(10,2) DEFAULT NULL,
  `densidad_siembra` decimal(10,2) DEFAULT NULL,
  `germinacion_pct` decimal(5,2) DEFAULT NULL,
  `vigor_plantas_escala` int DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`siembra_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Datos_Siembra`
--

LOCK TABLES `Datos_Siembra` WRITE;
/*!40000 ALTER TABLE `Datos_Siembra` DISABLE KEYS */;
INSERT INTO `Datos_Siembra` VALUES (1,30,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(2,31,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(3,32,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(4,33,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(5,34,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(6,42,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(7,43,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(8,44,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(9,45,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(10,46,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(11,47,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(12,48,'2026-01-01',140.00,20000.00,80.00,8,'-dfg-'),(15,49,'2026-11-05',16.50,330000.00,92.50,4,'SD sobre rastrojo maiz. Temp suelo 22C, hum 60%.'),(16,50,'2026-11-05',16.50,330000.00,93.00,4,'SD sobre rastrojo maiz. Prof. siembra 3 cm.'),(17,51,'2026-11-05',16.50,330000.00,91.80,4,'SD sobre rastrojo maiz. Prof. siembra 3 cm.'),(18,52,'2026-11-05',16.50,330000.00,92.20,4,'SD sobre rastrojo maiz. Densidad uniforme.'),(19,53,'2026-11-05',16.50,330000.00,93.50,5,'SD sobre rastrojo maiz. Excelente germinacion.'),(20,54,'2026-11-05',16.50,330000.00,91.00,4,'SD. Hum. suelo 65%. Lluvias previas 48 hs.'),(21,55,'2026-11-05',16.50,330000.00,90.50,3,'SD. Sector con mayor hum. por microtopografia.'),(22,56,'2026-11-05',16.50,330000.00,92.80,4,'SD. Sector con mayor hum. por microtopografia.'),(23,57,'2026-11-05',16.50,330000.00,93.20,4,'SD. Excelente cama de siembra.'),(24,58,'2026-11-05',16.50,330000.00,91.50,4,'SD. Buena germinacion. Sin baches.'),(25,59,'2026-11-05',16.50,330000.00,92.00,4,'SD. Leve pendiente hacia el norte.'),(26,60,'2026-11-05',16.50,330000.00,93.80,5,'SD. Mejor emergencia del ensayo.'),(27,61,'2026-11-05',16.50,330000.00,89.50,3,'SD. Sector con algo de tosca superficial.'),(28,62,'2026-11-05',16.50,330000.00,91.20,4,'SD. Normal. Sin observaciones especiales.'),(29,63,'2026-11-05',16.50,330000.00,94.00,5,'SD. Excelente germinacion y vigor.'),(30,64,'2026-11-05',16.50,330000.00,92.50,4,'SD. Viento leve SO al momento de siembra.'),(31,65,'2026-11-05',16.50,330000.00,91.80,4,'SD. Sin observaciones especiales.'),(32,66,'2026-11-05',16.50,330000.00,90.80,3,'SD. Pequenio sector compactado corregido.'),(33,67,'2026-11-05',16.50,330000.00,93.00,4,'SD. Muy buena germinacion.'),(34,68,'2026-11-05',16.50,330000.00,88.50,3,'SD. Sector con menos vigor por densidad alta.');
/*!40000 ALTER TABLE `Datos_Siembra` ENABLE KEYS */;
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
  `status_id_fk` int DEFAULT NULL COMMENT 'FK a StatusEnsayo',
  `filas` int unsigned DEFAULT NULL COMMENT 'Número de filas en la matriz de parcelas',
  `columnas` int unsigned DEFAULT NULL COMMENT 'Número de columnas en la matriz de parcelas',
  `fecha_inicio` date DEFAULT NULL,
  `fecha_cosecha` date DEFAULT NULL,
  `cultivo_id` int DEFAULT NULL,
  `variedad_id` int DEFAULT NULL,
  `tipo_siembra_id` int DEFAULT NULL,
  `cant_bloques` int unsigned DEFAULT NULL COMMENT 'Cantidad de bloques planificados a crear en el ensayo',
  PRIMARY KEY (`ensayo_id`),
  UNIQUE KEY `uq_ensayo_lab_codigo` (`lab_id_fk`,`codigo_labor`),
  UNIQUE KEY `IDX_85a4c4555815d27ae2067f9759` (`nombre_ensayo`,`protocolo_id_fk`),
  KEY `FK_569fc4521722eccdffd841bc0d1` (`tipo_ensayo_id_fk`),
  KEY `FK_984fd9df9512d2b06fc9044284b` (`protocolo_id_fk`),
  KEY `FK_14b312a6d1bb11c486721835ba4` (`responsable_id`),
  KEY `idx_ensayo_status_fk` (`status_id_fk`),
  KEY `FK_a3cd2008ba8bd551d193d2a1084` (`cultivo_id`),
  KEY `FK_c7cd836a6083e36e6f95897032a` (`variedad_id`),
  KEY `FK_465471de8f42aee0d3778c2429e` (`tipo_siembra_id`),
  CONSTRAINT `FK_14b312a6d1bb11c486721835ba4` FOREIGN KEY (`responsable_id`) REFERENCES `Usuario` (`usuario_id`),
  CONSTRAINT `FK_465471de8f42aee0d3778c2429e` FOREIGN KEY (`tipo_siembra_id`) REFERENCES `TipoSiembra` (`id`),
  CONSTRAINT `FK_569fc4521722eccdffd841bc0d1` FOREIGN KEY (`tipo_ensayo_id_fk`) REFERENCES `Tipo_Ensayo` (`tipo_ensayo_id`),
  CONSTRAINT `FK_7d3c18d9e83dfc76ad17571f0f3` FOREIGN KEY (`lab_id_fk`) REFERENCES `Laboratorio` (`lab_id`),
  CONSTRAINT `FK_984fd9df9512d2b06fc9044284b` FOREIGN KEY (`protocolo_id_fk`) REFERENCES `Protocolo` (`protocolo_id`),
  CONSTRAINT `FK_a3cd2008ba8bd551d193d2a1084` FOREIGN KEY (`cultivo_id`) REFERENCES `Cultivo` (`cultivo_id`),
  CONSTRAINT `FK_c7cd836a6083e36e6f95897032a` FOREIGN KEY (`variedad_id`) REFERENCES `Cultivo_Variedad` (`variedad_id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ensayo`
--

LOCK TABLES `Ensayo` WRITE;
/*!40000 ALTER TABLE `Ensayo` DISABLE KEYS */;
INSERT INTO `Ensayo` VALUES (63,4,'Ensayo Soja Temprana 2024',1,'123-BASFG-3213-21',5,'Salta','Cafayate','Las Tres Hermanas','TEST-001',-24.82946750,-65.51138830,52.50,'2026-04-03','En EjecuciÃ³n',1,1,2,2,NULL,'2026-03-05',7,10,1,NULL),(64,3,'Ensayo Maíz Híbrido Temprano',3,NULL,5,'Salta','Cerrillos',NULL,NULL,NULL,NULL,20.00,'2024-10-15','En Ejecución',1,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(66,1,'Ensayo Soja tardía con Fungicidas',2,NULL,9,'Santa Fe','Rosario',NULL,NULL,-24.82946750,-65.51138830,NULL,'2024-12-01','Completado',1,3,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(68,1,'Ensayo Piloto - Barbecho y cobertura',NULL,NULL,NULL,'La Pampa','Caleu Caleu',NULL,NULL,NULL,NULL,NULL,'2024-08-15','Por Iniciar',NULL,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(69,1,'Ensayo Poroto - Densidad de siembra',1,'25-EWRT-523D-WE',9,'Salta','Cachi',NULL,NULL,-24.82946750,-65.51138830,NULL,'2024-11-10','Por Iniciar',1,7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,1,'Ensayo Maní - Ciclo largo',NULL,NULL,NULL,'Buenos Aires','Bragado',NULL,NULL,NULL,NULL,NULL,'2024-10-01','Por Iniciar',NULL,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,4,'Ensayo Cebada cervecera',2,'',7,'Salta','Rosario de la Frontera','aaaaaaaaaaaaaa','bbbbbbbbbbbbb',-24.82950000,-65.51130000,24.00,'2026-01-01','Por Iniciar',1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(72,1,'Ensayo Soja - Manejo de malezas',NULL,NULL,NULL,'Córdoba','Río Segundo',NULL,NULL,NULL,NULL,NULL,'2024-11-15','Por Iniciar',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(73,3,'Ensayo de prueba 1',1,'58-ENTD-43523-A1',8,'Salta','Rosario de la Frontera','THN3','KDJH45',-24.82946750,-65.51138830,15.00,'2025-12-11','Por Iniciar',1,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(74,3,'asdasd',2,'23-3213-2131-2321adsqw-eq',5,'Salta','Rivadavia','qweqwe','123',-24.85168320,-65.51138840,40.00,'2026-01-10','Activo',1,2,4,5,NULL,NULL,7,11,5,4),(75,2,'Ensayo 02Marzo',2,'',5,'Córdoba','','dasas','21',-24.83814400,-65.50978560,23.00,NULL,'Activo',1,1,4,5,NULL,NULL,7,11,5,NULL),(76,1,'PRUEBA COMPLETA 2026 | Fungicida Soja - Campo San Martin',7,'PC-2026-001',6,'Cordoba','General San Martin','Estancia San Martin','Lote Norte 3',-32.71234567,-63.38765432,52.00,'2026-11-05','Activo',1,4,4,5,'2026-10-20','2027-04-15',1,2,1,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Foto_Registro`
--

LOCK TABLES `Foto_Registro` WRITE;
/*!40000 ALTER TABLE `Foto_Registro` DISABLE KEYS */;
INSERT INTO `Foto_Registro` VALUES (8,'foto_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253813.jpg','/uploads/ensayo_69/bloque_A/foto_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253813.jpg','image/jpeg','2026-02-02 19:40:53',5),(9,'foto_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253871.jpg','/uploads/ensayo_69/bloque_A/foto_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253871.jpg','image/jpeg','2026-02-02 19:40:53',5),(10,'video_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253934.webm','/uploads/ensayo_69/bloque_A/video_E69_BA_25-EWRT-523D-WE-A-1.1_DDA7_1770061253934.webm','video/webm','2026-02-02 19:40:53',5),(18,'foto_E63_BB_123-BASFG-3213-21-B-1.1_DDA3_1772915629396.png','/uploads/ensayo_63/bloque_B/foto_E63_BB_123-BASFG-3213-21-B-1.1_DDA3_1772915629396.png','image/png','2026-03-07 20:33:49',59),(19,'foto_E63_BB_123-BASFG-3213-21-B-1.2_DDA3_1772915636123.png','/uploads/ensayo_63/bloque_B/foto_E63_BB_123-BASFG-3213-21-B-1.2_DDA3_1772915636123.png','image/png','2026-03-07 20:33:56',60),(20,'foto_E63_BB_123-BASFG-3213-21-B-2.1_DDA3_1772915676470.png','/uploads/ensayo_63/bloque_B/foto_E63_BB_123-BASFG-3213-21-B-2.1_DDA3_1772915676470.png','image/png','2026-03-07 20:34:36',61),(21,'foto_E63_BB_123-BASFG-3213-21-B-2.2_DDA3_1772915688231.png','/uploads/ensayo_63/bloque_B/foto_E63_BB_123-BASFG-3213-21-B-2.2_DDA3_1772915688231.png','image/png','2026-03-07 20:34:48',62),(22,'foto_E63_BC_123-BASFG-3213-21-C-1.1_DDA3_1772915706846.jpeg','/uploads/ensayo_63/bloque_C/foto_E63_BC_123-BASFG-3213-21-C-1.1_DDA3_1772915706846.jpeg','image/jpeg','2026-03-07 20:35:06',63),(23,'foto_E63_BC_123-BASFG-3213-21-C-1.2_DDA3_1772915721132.png','/uploads/ensayo_63/bloque_C/foto_E63_BC_123-BASFG-3213-21-C-1.2_DDA3_1772915721132.png','image/png','2026-03-07 20:35:21',64),(24,'foto_E63_BC_123-BASFG-3213-21-C-2.1_DDA3_1772915735346.png','/uploads/ensayo_63/bloque_C/foto_E63_BC_123-BASFG-3213-21-C-2.1_DDA3_1772915735346.png','image/png','2026-03-07 20:35:35',65),(25,'foto_E63_BC_123-BASFG-3213-21-C-2.2_DDA3_1772915746398.png','/uploads/ensayo_63/bloque_C/foto_E63_BC_123-BASFG-3213-21-C-2.2_DDA3_1772915746398.png','image/png','2026-03-07 20:35:46',66);
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
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacto` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `esta_activo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`lab_id`),
  UNIQUE KEY `IDX_0651ebd5d4a98a575551de3857` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Laboratorio`
--

LOCK TABLES `Laboratorio` WRITE;
/*!40000 ALTER TABLE `Laboratorio` DISABLE KEYS */;
INSERT INTO `Laboratorio` VALUES (1,'Laboratorio Principal',NULL,NULL,NULL,NULL,NULL,1,'2026-02-11 23:28:48','2026-02-11 23:28:48'),(2,'ADAMA',NULL,NULL,NULL,NULL,NULL,1,'2026-02-11 23:28:48','2026-02-11 23:28:48'),(3,'Bayer',NULL,NULL,NULL,NULL,NULL,1,'2026-02-11 23:28:48','2026-02-11 23:28:48'),(4,'Syngenta',NULL,NULL,NULL,NULL,NULL,1,'2026-02-11 23:28:48','2026-02-11 23:28:48'),(5,'Corteva',NULL,NULL,NULL,NULL,NULL,1,'2026-02-11 23:28:48','2026-02-11 23:28:48'),(6,'Nufarm',NULL,NULL,NULL,NULL,NULL,1,'2026-02-11 23:28:48','2026-02-11 23:28:48');
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
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Momento_Evaluacion`
--

LOCK TABLES `Momento_Evaluacion` WRITE;
/*!40000 ALTER TABLE `Momento_Evaluacion` DISABLE KEYS */;
INSERT INTO `Momento_Evaluacion` VALUES (7,'3 DDA',3,'2026-02-01',2),(8,'7 DDA',7,'2026-02-05',2),(9,'14 DDA',14,'2026-02-12',2),(10,'21 DDA',21,'2026-02-19',2),(11,'28 DDA',28,'2026-02-26',2),(12,'35 DDA',35,'2026-03-05',2),(13,'3 DDA',3,'2026-01-04',3),(14,'7 DDA',7,'2026-01-08',3),(15,'14 DDA',14,'2026-01-15',3),(16,'21 DDA',21,'2026-01-22',3),(17,'28 DDA',28,'2026-01-29',3),(18,'35 DDA',35,'2026-02-05',3),(19,'3 DDA',3,'2026-02-02',4),(20,'7 DDA',7,'2026-02-06',4),(21,'14 DDA',14,'2026-02-13',4),(22,'21 DDA',21,'2026-02-20',4),(23,'28 DDA',28,'2026-02-27',4),(24,'3 DDA',3,'2026-02-22',5),(25,'7 DDA',7,'2026-02-26',5),(26,'14 DDA',14,'2026-03-05',5),(27,'21 DDA',21,'2026-03-12',5),(28,'28 DDA',28,'2026-03-19',5),(62,'3 DDA',3,'2026-05-18',15),(63,'7 DDA',7,'2026-05-22',15),(64,'14 DDA',14,'2026-05-29',15),(65,'21 DDA',21,'2026-06-05',15),(66,'Pre-Aplicacion (D0)',0,'2027-01-08',16),(67,'14 DAA',14,'2027-01-22',16),(68,'28 DAA',28,'2027-02-05',16);
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
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Parcela`
--

LOCK TABLES `Parcela` WRITE;
/*!40000 ALTER TABLE `Parcela` DISABLE KEYS */;
INSERT INTO `Parcela` VALUES (9,'A',1,1,71,1,5),(26,'25-EWRT-523D-WE-A-1.1',1,1,69,10,2),(28,'23-3213-2131-2321adsqw-eq-A-1.1',1,1,74,12,17),(31,'123-BASFG-3213-21-B-1.1',1,1,63,16,2),(35,'A-1.1',1,1,75,18,25),(36,'A-2.1',2,1,75,18,29),(37,'A-3.1',3,1,75,18,28),(38,'A-4.1',4,1,75,18,29),(39,'A',NULL,NULL,75,18,29),(40,'A-5.1',5,1,75,18,29),(41,'B-1.1',1,1,75,19,28),(42,'123-BASFG-3213-21-B-2.2',2,2,63,16,1),(43,'123-BASFG-3213-21-B-2.1',2,1,63,16,1),(44,'123-BASFG-3213-21-B-1.2',1,2,63,16,1),(45,'123-BASFG-3213-21-C-2.2',2,2,63,17,1),(46,'123-BASFG-3213-21-C-1.2',1,2,63,17,1),(47,'123-BASFG-3213-21-C-2.1',2,1,63,17,1),(48,'123-BASFG-3213-21-C-1.1',1,1,63,17,1),(49,'PC2026-I-1.1',1,1,76,23,30),(50,'PC2026-I-2.1',2,1,76,23,31),(51,'PC2026-I-3.1',3,1,76,23,32),(52,'PC2026-I-4.1',4,1,76,23,33),(53,'PC2026-I-5.1',5,1,76,23,34),(54,'PC2026-II-1.2',1,2,76,24,32),(55,'PC2026-II-2.2',2,2,76,24,30),(56,'PC2026-II-3.2',3,2,76,24,34),(57,'PC2026-II-4.2',4,2,76,24,31),(58,'PC2026-II-5.2',5,2,76,24,33),(59,'PC2026-III-1.3',1,3,76,25,33),(60,'PC2026-III-2.3',2,3,76,25,34),(61,'PC2026-III-3.3',3,3,76,25,30),(62,'PC2026-III-4.3',4,3,76,25,32),(63,'PC2026-III-5.3',5,3,76,25,31),(64,'PC2026-IV-1.4',1,4,76,26,31),(65,'PC2026-IV-2.4',2,4,76,26,33),(66,'PC2026-IV-3.4',3,4,76,26,32),(67,'PC2026-IV-4.4',4,4,76,26,34),(68,'PC2026-IV-5.4',5,4,76,26,30),(69,'23-3213-2131-2321adsqw-eq-A-2.1',2,1,74,12,17),(70,'23-3213-2131-2321adsqw-eq-A-3.1',3,1,74,12,22),(71,'23-3213-2131-2321adsqw-eq-A-4.1',4,1,74,12,43),(72,'23-3213-2131-2321adsqw-eq-B-1.2',1,2,74,13,17),(73,'23-3213-2131-2321adsqw-eq-B-2.2',2,2,74,13,42),(74,'23-3213-2131-2321adsqw-eq-B-3.2',3,2,74,13,22),(75,'23-3213-2131-2321adsqw-eq-B-4.2',4,2,74,13,23);
/*!40000 ALTER TABLE `Parcela` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permiso`
--

DROP TABLE IF EXISTS `Permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permiso` (
  `permiso_id` int NOT NULL AUTO_INCREMENT,
  `rol_id_fk` int NOT NULL,
  `recurso` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accion` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`permiso_id`),
  UNIQUE KEY `idx_permiso_rol_recurso_accion` (`rol_id_fk`,`recurso`,`accion`),
  KEY `idx_permiso_rol` (`rol_id_fk`),
  KEY `idx_permiso_recurso` (`recurso`),
  CONSTRAINT `FK_734f3cf38fc6fb41641883a03be` FOREIGN KEY (`rol_id_fk`) REFERENCES `Rol` (`rol_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permiso`
--

LOCK TABLES `Permiso` WRITE;
/*!40000 ALTER TABLE `Permiso` DISABLE KEYS */;
INSERT INTO `Permiso` VALUES (1,2,'laboratorios','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(2,2,'laboratorios','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(3,2,'laboratorios','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(4,2,'laboratorios','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(5,2,'laboratorios','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(6,2,'laboratorios','EXPORTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(7,2,'usuarios','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(8,2,'usuarios','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(9,2,'usuarios','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(10,2,'usuarios','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(11,2,'usuarios','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(12,2,'usuarios','EXPORTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(13,2,'roles','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(14,2,'roles','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(15,2,'roles','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(16,2,'roles','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(17,2,'roles','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(18,2,'permisos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(19,2,'permisos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(20,2,'permisos','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(21,2,'permisos','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(22,2,'permisos','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(23,2,'productos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(24,2,'productos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(25,2,'productos','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(26,2,'productos','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(27,2,'productos','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(28,2,'productos','EXPORTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(29,2,'cultivos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(30,2,'cultivos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(31,2,'cultivos','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(32,2,'cultivos','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(33,2,'cultivos','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(34,2,'cultivos','EXPORTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(35,2,'variedades','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(36,2,'variedades','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(37,2,'variedades','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(38,2,'variedades','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(39,2,'variedades','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(40,2,'tipos-ensayo','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(41,2,'tipos-ensayo','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(42,2,'tipos-ensayo','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(43,2,'tipos-ensayo','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(44,2,'tipos-ensayo','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(45,2,'tipos-siembra','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(46,2,'tipos-siembra','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(47,2,'tipos-siembra','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(48,2,'tipos-siembra','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(49,2,'tipos-siembra','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(50,2,'ensayos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(51,2,'ensayos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(52,2,'ensayos','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(53,2,'ensayos','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(54,2,'ensayos','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(55,2,'ensayos','EXPORTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(56,3,'laboratorios','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(57,3,'laboratorios','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(58,3,'laboratorios','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(59,3,'laboratorios','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(60,3,'laboratorios','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(61,3,'usuarios','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(62,3,'usuarios','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(63,3,'usuarios','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(64,3,'usuarios','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(65,3,'permisos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(66,3,'permisos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(67,3,'productos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(68,3,'productos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(69,3,'productos','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(70,3,'productos','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(71,3,'productos','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(72,3,'cultivos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(73,3,'cultivos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(74,3,'cultivos','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(75,3,'cultivos','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(76,3,'cultivos','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(77,3,'variedades','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(78,3,'variedades','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(79,3,'variedades','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(80,3,'variedades','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(81,3,'variedades','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(82,3,'tipos-ensayo','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(83,3,'tipos-ensayo','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(84,3,'tipos-ensayo','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(85,3,'tipos-ensayo','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(86,3,'tipos-ensayo','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(87,3,'tipos-siembra','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(88,3,'tipos-siembra','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(89,3,'tipos-siembra','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(90,3,'tipos-siembra','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(91,3,'tipos-siembra','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(92,3,'ensayos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(93,3,'ensayos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(94,3,'ensayos','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(95,3,'ensayos','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(96,3,'ensayos','ELIMINAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(97,3,'ensayos','EXPORTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(98,4,'productos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(99,4,'productos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(100,4,'productos','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(101,4,'productos','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(102,4,'ensayos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(103,4,'ensayos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(104,4,'ensayos','CREAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(105,4,'ensayos','EDITAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(106,4,'ensayos','EXPORTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(107,4,'cultivos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(108,4,'cultivos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(109,5,'ensayos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(110,5,'ensayos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(111,5,'productos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(112,5,'productos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(113,5,'cultivos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(114,5,'cultivos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(115,6,'ensayos','LISTAR',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11'),(116,6,'ensayos','VER',NULL,1,'2026-02-12 00:14:11','2026-02-12 00:14:11');
/*!40000 ALTER TABLE `Permiso` ENABLE KEYS */;
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
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `tipo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unidad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`producto_id`),
  KEY `FK_7469d916b91aed59b9366b577a4` (`lab_id_fk`),
  CONSTRAINT `FK_7469d916b91aed59b9366b577a4` FOREIGN KEY (`lab_id_fk`) REFERENCES `Laboratorio` (`lab_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Producto`
--

LOCK TABLES `Producto` WRITE;
/*!40000 ALTER TABLE `Producto` DISABLE KEYS */;
INSERT INTO `Producto` VALUES (1,1,'Glifosato Ultra','Glifosato','SL',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(2,1,'Atrazina Max','Glifosato','SL',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(3,1,'Fungicid Total','Atrazina','PM',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(4,2,'Insecticid Pro','Glifosato','SL',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(5,2,'Fertilizante NPK','2,4-D','EE',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(6,3,'Roundup','Glifosato','SL',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(7,3,'Tempo','Cipermetrina','EW',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(8,4,'Gramoxone','Paraquat','SL',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(9,4,'Actara','Tiametoxam','WG',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(10,5,'Engeo Plata','Tiametoxam + Lambda','SC',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(11,5,'Lorsban','ClorpirifÃ³s','EC',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(12,6,'Foley','Glifosato','SL',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(13,6,'Cartap','Cartap','SL',NULL,NULL,NULL,NULL,'2026-02-11 23:40:30','2026-02-11 23:40:30'),(14,3,'producto test1','21','23','dsdasd','123','12',NULL,'2026-03-02 22:36:56','2026-03-02 22:36:56'),(15,NULL,'Fomesafen 25%','Fomesafen','EC 25%',NULL,'Herbicida','cc/ha',NULL,'2026-03-06 02:49:12','2026-03-06 02:49:12'),(16,NULL,'GZ','Adyuvante','Concentrado',NULL,'Adyuvante','cc/ha',NULL,'2026-03-06 02:49:12','2026-03-06 02:49:12'),(17,NULL,'Sogix','Surfactante','LÃ­quido',NULL,'Surfactante','cc/ha',NULL,'2026-03-06 02:49:12','2026-03-06 02:49:12'),(18,NULL,'Fomesafen 25%','Fomesafen','EC 25%',NULL,'Herbicida','cc/ha',NULL,'2026-03-06 02:49:26','2026-03-06 02:49:26'),(19,NULL,'GZ','Adyuvante','Concentrado',NULL,'Adyuvante','cc/ha',NULL,'2026-03-06 02:49:26','2026-03-06 02:49:26'),(20,NULL,'Sogix','Surfactante','LÃ­quido',NULL,'Surfactante','cc/ha',NULL,'2026-03-06 02:49:26','2026-03-06 02:49:26'),(21,3,'Amistar Xtra TEST','Azoxistrobina 20% + Ciproconazol 8%','SC','Estrobilurina + triazol amplio espectro. Ref. Bayer.','Fungicida','cc/ha',NULL,'2026-03-31 18:36:03','2026-03-31 18:36:03'),(22,4,'Nativo TEST','Trifloxistrobina 15% + Tebuconazol 20%','SC','Mezcla estrobilurina-triazol alta eficiencia. Ref. Syngenta.','Fungicida','cc/ha',NULL,'2026-03-31 18:36:03','2026-03-31 18:36:03'),(23,1,'Opera TEST','Piraclostrobina 12.8% + Epoxiconazol 4.8%','SE','Formulación SE para mayor penetración foliar.','Fungicida','cc/ha',NULL,'2026-03-31 18:36:03','2026-03-31 18:36:03'),(24,3,'Comet TEST','Piraclostrobina 25%','EC','Estrobilurina pura. Complemento en mezcla de tanque.','Fungicida','cc/ha',NULL,'2026-03-31 18:36:03','2026-03-31 18:36:03');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Protocolo`
--

LOCK TABLES `Protocolo` WRITE;
/*!40000 ALTER TABLE `Protocolo` DISABLE KEYS */;
INSERT INTO `Protocolo` VALUES (1,'Protocolo Herbicida Maíz Post-Emergencia','Control de malezas de hoja ancha y gramíneas en maíz.'),(2,'Protocolo Fungicida Trigo Espiga 2025','Control de enfermedades foliares y de espiga en trigo.'),(3,'Protocolo Insecticida Soja V3','Control de orugas y chinches en soja en estado V3.'),(5,'Protocolo de prueba','test test test'),(6,'test 2','test 2'),(7,'Protocolo Fungicida Soja - PRUEBA COMPLETA 2026','Evaluación de fungicidas para control de Sclerotinia sclerotiorum y Phakopsora pachyrhizi en soja de 1.ª. Diseño DBCA 4 bloques, 5 tratamientos. Parcela bruta 5 surcos × 10 m (52 cm entre surcos), parcela neta 3 surcos × 8 m. Aplicación única estadio R1.'),(8,'Protocolo 7',NULL),(9,'Protocolo 8',NULL),(10,'Protocolo 9',NULL),(11,'Protocolo 10',NULL),(12,'Protocolo 11',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Protocolo_Variable`
--

LOCK TABLES `Protocolo_Variable` WRITE;
/*!40000 ALTER TABLE `Protocolo_Variable` DISABLE KEYS */;
INSERT INTO `Protocolo_Variable` VALUES (42,'PLANTULAS NORMALES','%',NULL,1),(43,'PLANTULAS ANORMALES','%',NULL,1),(44,'SEMILLAS MUERTAS','%',NULL,1),(45,'LONGITUD DE TALLO','CM',NULL,1),(46,'LONGITUD DE RAICES','CM',NULL,1),(47,'PESO SECO TALLO','g',NULL,1),(48,'PESO SECO RAICES','g',NULL,1),(49,'SANIDAD GENERAL (LAB)','%',NULL,1),(50,'PORCENTAJE DE CONTROL GENERAL (BARBECHO)','%',NULL,2),(51,'FITOTOXICIDAD (BARBECHO)','ESCALA 1-9',NULL,2),(52,'PORCENTAJE DE CONTROL GENERAL (PREEMERGENTES)','%',NULL,3),(53,'FITOTOXICIDAD (PREEMERGENTES)','ESCALA 1-9',NULL,3),(54,'PORCENTAJE DE CONTROL PARA DISTINTAS MALEZAS','ESCALA 1-9',NULL,3),(55,'N° DE PLANTAS POR METROS LINEAL','N°/METRO',NULL,4),(56,'VIGOR PLANTAS','ESCALA 1-5',NULL,4),(57,'ESTADO SANITARIO GENERAL (CAMPO)','0-100%',NULL,4),(58,'LONGITUD DE PLANTAS','CM',NULL,4),(59,'LONGITUD DE RAICES (CAMPO)','CM',NULL,4),(60,'VIGOR DE RAICES','ESCALA 1-5',NULL,4),(61,'NUMERO DE NODULO/PLANTULAS','N°',NULL,4),(62,'VIGOR AEREO','ESCALA 1-5',NULL,5),(63,'FITOTOXICIDAD (FOLIARES)','ESCALA 1-9',NULL,5),(64,'NVI (FOLIARES)','ESCALA 0-1',NULL,5),(65,'OBSERVACIONES (FOLIARES)','TEXTO',NULL,5),(66,'ENFERMEDAD ESCLEROTINIA - INCIDENCIA','%',NULL,6),(67,'ENFERMEDAD ESCLEROTINIA - SEVERIDAD','%',NULL,6),(68,'FITOTOXICIDAD (FUNGICIDA)','ESCALA 1-9',NULL,6),(69,'NVI (FUNGICIDA)','ESCALA 0-1',NULL,6),(70,'SANIDAD GENERAL (FUNGICIDA)','ESCALA 0-100',NULL,6),(71,'N° DE ACAROS POR FOLIOLO','N°',NULL,7),(72,'N° DE TRIPS ADULTOS POR FOLIOLO','N°',NULL,7),(73,'N° DE TRIPS NINFA POR FOLIOLO','N°',NULL,7),(74,'N° DE MOSCA BLANCA ADULTA','N°',NULL,7),(75,'N° DE NINFA DE MOSCA BLANCA','N°',NULL,7),(76,'N° DE HUEVOS DE MOSCA BLANCA','N°',NULL,7),(77,'N° DE MEDIDORA POR METROS MENORES A 1,5 CM','N°',NULL,7),(78,'N° DE MEDIDORA POR METROS MAYORES A 1,5 CM','N°',NULL,7),(79,'N° DE ANTICARCIA POR METRO MENORES A 1,5 CM','N°',NULL,7),(80,'N° DE ANTICARCIA POR METRO MAYORES A 1,5 CM','N°',NULL,7),(81,'N° DE SPODOPTERA POR METROS MENORES A 1,5 CM','N°',NULL,7),(82,'N° DE SPODOPTERA POR METROS MAYORES A 1,5 CM','N°',NULL,7),(83,'PORCENTAJE DE DESFOLIACIÓN','ESCALA 0-100',NULL,7),(84,'SANIDAD GENERAL (INSECTICIDA)','ESCALA 0-100',NULL,7),(85,'OTROS (INSECTICIDA)','TEXTO',NULL,7),(86,'ENFERMEDAD BACTERIA - INCIDENCIA','%',NULL,8),(87,'ENFERMEDAD BACTERIA - SEVERIDAD','%',NULL,8),(88,'FITOTOXICIDAD (BACTERICIDA)','ESCALA 1-9',NULL,8),(89,'NVI (BACTERICIDA)','ESCALA 0-1',NULL,8),(90,'SANIDAD GENERAL (BACTERICIDA)','ESCALA 0-100',NULL,8),(91,'PORCENTAJE DE CONTROL GENERAL (DESECANTES)','%',NULL,9),(92,'FITOTOXICIDAD (DESECANTES)','ESCALA 1-9',NULL,9),(93,'PORCENTAJE SECADO TALLO','ESCALA 0-100',NULL,9),(94,'PORCENTAJE SECADO HOJAS','ESCALA 0-100',NULL,9),(95,'PORCENTAJE SECADO CHAUCHA','ESCALA 0-100',NULL,9),(98,'dsfadsfds','sadfdsf','sdfasdfasf',9),(100,'fito','%','aaa',12),(101,'fsdsf','3','3',13),(102,'ree','32434','234',13),(103,'3444','432432','423324',13),(104,'32','213','123',2);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rol`
--

LOCK TABLES `Rol` WRITE;
/*!40000 ALTER TABLE `Rol` DISABLE KEYS */;
INSERT INTO `Rol` VALUES (2,'Superadministrador','Acceso total. Puede gestionar Administradores.'),(3,'Administrador','Puede gestionar Usuarios y asignar roles. Acceso a todo.'),(4,'Manager','Puede crear Labs/Productos, ver Ensayos y Reportes.'),(5,'Tecnico','Puede cargar datos de campo (Ensayos, Mediciones).'),(6,'Invitado','Acceso de solo lectura a laboratorios y ensayos asignados.'),(9,'test','test');
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
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `esta_activo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_416261df52165aa9c7ef8ef788` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TipoSiembra`
--

LOCK TABLES `TipoSiembra` WRITE;
/*!40000 ALTER TABLE `TipoSiembra` DISABLE KEYS */;
INSERT INTO `TipoSiembra` VALUES (1,'Siembra Directa',NULL,1,'2026-02-11 23:46:46','2026-02-11 23:46:46'),(2,'Labranza Convencional',NULL,1,'2026-02-11 23:46:46','2026-02-11 23:46:46'),(3,'Labranza Mínima',NULL,1,'2026-02-11 23:46:46','2026-02-11 23:46:46'),(4,'Siembra en Surcos',NULL,1,'2026-02-11 23:46:46','2026-02-11 23:46:46'),(5,'Siembra al Voleo',NULL,1,'2026-02-11 23:46:46','2026-02-11 23:46:46'),(6,'Siembra de Precisión',NULL,1,'2026-02-11 23:46:46','2026-02-11 23:46:46');
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
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`tipo_ensayo_id`),
  UNIQUE KEY `IDX_3796314b3911f1617134a14941` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipo_Ensayo`
--

LOCK TABLES `Tipo_Ensayo` WRITE;
/*!40000 ALTER TABLE `Tipo_Ensayo` DISABLE KEYS */;
INSERT INTO `Tipo_Ensayo` VALUES (1,'LABORATORIO (TRATAMIENTO DE SEMILLA)','3,7,14',1,'2025-11-27 04:38:29','2025-11-27 04:38:29',NULL),(2,'BARBECHO','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29',NULL),(3,'PREEMERGENTES','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29',NULL),(4,'TRATAMIENTOS DE SEMILLAS CAMPO','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29',NULL),(5,'FOLIARES Y RECUPERADORES','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29',NULL),(6,'FUNGICIDA','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29',NULL),(7,'INSECTICIDA','3,7,14,21,28',1,'2025-11-27 04:38:29','2025-11-27 04:38:29',NULL),(8,'BACTERICIDA','3,7,14,19',1,'2025-11-27 04:38:29','2026-03-07 21:36:53','.....---adssa'),(9,'DESECANTES','3,7,14,21,28',1,'2025-11-27 04:38:29','2025-11-27 04:38:29',NULL),(10,'OTRO','3,7,14,21,28,35',1,'2025-11-27 04:38:29','2025-11-27 04:38:29',NULL),(12,'tipo nuevo 20',NULL,1,'2026-01-05 18:44:57','2026-01-05 18:44:57',NULL),(13,'Insecticida Orugas',NULL,1,'2026-03-02 22:28:19','2026-03-02 22:28:19',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tratamiento`
--

LOCK TABLES `Tratamiento` WRITE;
/*!40000 ALTER TABLE `Tratamiento` DISABLE KEYS */;
INSERT INTO `Tratamiento` VALUES (1,1,1,'Tratamiento 1 (P1): Glifosato Ultra (1.5 L/ha) + Atrazina Max (2 L/ha)',0),(2,1,2,'Tratamiento 2 (P1): Testigo (Sin aplicación)',1),(5,3,1,'Tratamiento 1 (P3): Insecticid Pro (0.2 L/ha) + Fertilizante NPK (100 kg/ha)',0),(6,3,2,'Tratamiento 2 (P3): Testigo (Sin aplicación)',1),(16,3,3,'wqewqewq',0),(17,2,1,'Testigo',1),(22,2,3,'Gramoxone + actara',0),(23,2,4,'aaaaaa',0),(24,5,1,'sadas',1),(25,6,1,'testigo',1),(26,6,2,'tratamiento 2',0),(27,6,3,'32432',0),(28,6,4,'324324',0),(29,6,5,'32432',0),(30,7,1,'T0 - Testigo sin aplicacion',1),(31,7,2,'T1 - Amistar Xtra TEST 500 cc/ha (R1)',0),(32,7,3,'T2 - Nativo TEST 400 cc/ha (R1)',0),(33,7,4,'T3 - Opera TEST 750 cc/ha (R1)',0),(34,7,5,'T4 - Amistar Xtra TEST 500 + Comet TEST 300 cc/ha (R1)',0),(36,12,1,NULL,1),(37,11,1,NULL,1),(39,11,3,NULL,0),(40,11,2,NULL,0),(41,11,4,NULL,0),(42,2,2,NULL,0),(43,2,5,NULL,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tratamiento_Producto`
--

LOCK TABLES `Tratamiento_Producto` WRITE;
/*!40000 ALTER TABLE `Tratamiento_Producto` DISABLE KEYS */;
INSERT INTO `Tratamiento_Producto` VALUES (1,1,1,'1.5','L/ha',NULL),(2,1,2,'2','L/ha',NULL),(4,5,4,'0.2','L/ha',NULL),(5,5,5,'100','kg/ha',NULL),(10,16,6,'12332121','cc/ha',NULL),(12,1,9,'250','cc/ha','v1'),(15,22,8,'200','cc/ha',NULL),(16,22,9,'200','cc/ha',NULL),(17,23,5,'250','cc/ha','v1'),(18,26,1,'32','cc/ha','2'),(19,26,5,'324','cc/ha',NULL),(20,27,6,'34432','cc/ha',NULL),(21,28,8,'4234','cc/ha234','234'),(22,29,9,'432423','234cc/ha','3244'),(23,31,21,'500','cc/ha','R1'),(24,32,22,'400','cc/ha','R1'),(25,33,23,'750','cc/ha','R1'),(26,34,21,'500','cc/ha','R1'),(27,34,24,'300','cc/ha','R1');
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
  `notificationHour` tinyint DEFAULT NULL COMMENT 'Hour of the day (0-23) for notifications',
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `IDX_fc2564b581e02a535b31470a00` (`username`),
  KEY `FK_d0b0f6000bbbe6950ca3faa26af` (`rol_id_fk`),
  CONSTRAINT `FK_d0b0f6000bbbe6950ca3faa26af` FOREIGN KEY (`rol_id_fk`) REFERENCES `Rol` (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES (1,2,'dariassoft@gmail.com','$2b$10$pMnYNGT5VPqbTcTBLEjNT.5r5NM6teNrDgMsB42eqDVJJ7qFQq.CG','Daniel','Arias','3875789133',NULL,1,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
-- Table structure for table `Variable`
--

DROP TABLE IF EXISTS `Variable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Variable` (
  `variable_id` int NOT NULL AUTO_INCREMENT,
  `nombre_variable` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unidad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`variable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Variable`
--

LOCK TABLES `Variable` WRITE;
/*!40000 ALTER TABLE `Variable` DISABLE KEYS */;
INSERT INTO `Variable` VALUES (1,'3DDA_FITO','Fitotoxicidad','%'),(2,'3DDA_VIGOR','Vigor','%'),(3,'7DDA_FITO','Fitotoxicidad','%'),(4,'7DDA_VIGOR','Vigor','%'),(5,'14DDA_FITO','Fitotoxicidad','%'),(6,'14DDA_VIGOR','Vigor','%'),(7,'21DDA_FITO','Fitotoxicidad','%'),(8,'21DDA_VIGOR','Vigor','%');
/*!40000 ALTER TABLE `Variable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `importaciones_ensayo_log`
--

DROP TABLE IF EXISTS `importaciones_ensayo_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `importaciones_ensayo_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ensayo_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `hojasModificadas` int NOT NULL DEFAULT '0',
  `resumen` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_332dd3071b8daea5ce78fed0669` (`ensayo_id`),
  KEY `FK_b7b62bfd0724530e0749342eaf3` (`usuario_id`),
  CONSTRAINT `FK_332dd3071b8daea5ce78fed0669` FOREIGN KEY (`ensayo_id`) REFERENCES `Ensayo` (`ensayo_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_b7b62bfd0724530e0749342eaf3` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario` (`usuario_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `importaciones_ensayo_log`
--

LOCK TABLES `importaciones_ensayo_log` WRITE;
/*!40000 ALTER TABLE `importaciones_ensayo_log` DISABLE KEYS */;
INSERT INTO `importaciones_ensayo_log` VALUES (1,76,1,1,'Datos Campo: 180 fila(s)','2026-09-30 18:13:21');
/*!40000 ALTER TABLE `importaciones_ensayo_log` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1765461926925,'AddResponsableToEnsayo1765461926925'),(3,1765474065022,'RefactorEnsayoCultivoAndDates1765474065022'),(4,1770832200000,'AddMatrizParcelasToEnsayo1770832200000'),(5,1707619600000,'AddLaboratorioFields1707619600000'),(6,1707620400000,'AddProductoFields1707620400000'),(7,1707620500000,'AddCultivoFields1707620500000'),(8,1707620600000,'AddCultivoVariedadFields1707620600000'),(9,1707620700000,'AddTipoEnsayoDescripcion1707620700000'),(10,1707620800000,'AddTipoSiembraFields1707620800000'),(11,1707621000000,'CreatePermisoTable1707621000000'),(12,1709667600000,'AddExtendedCosechaFields1709667600000'),(14,1710192000000,'CreateNotificacionesTable1710192000000'),(15,1710193000000,'AddUserToNotifications1710193000000'),(16,1745280000000,'AddPesoGranoHumedadCosecha1745280000000'),(17,1746200000000,'AddCantBloquesToEnsayo1746200000000'),(18,1746300000000,'AddPesoMilSemillasToCosecha1746300000000'),(19,1760000000000,'CreateImportacionEnsayoLog1760000000000');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT '0',
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `ensayo_id` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_2c6341d5bd206ff522b35aa6b69` (`usuario_id`),
  CONSTRAINT `FK_2c6341d5bd206ff522b35aa6b69` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,'Info incompleta - Ensayo #63: Ensayo Soja Temprana 2024','El ensayo \"Ensayo Soja Temprana 2024\" tiene información pendiente: fecha de inicio, datos de cosecha en 7 parcela(s).',0,'info_incompleta',63,'2026-03-12 15:18:54','/ensayos/63',1),(2,'Info incompleta - Ensayo #64: Ensayo Maíz Híbrido Temprano','El ensayo \"Ensayo Maíz Híbrido Temprano\" tiene información pendiente: fecha de cosecha, fecha de inicio.',0,'info_incompleta',64,'2026-03-12 15:18:54','/ensayos/64',1),(3,'Info incompleta - Ensayo #66: Ensayo Soja tardía con Fungicidas','El ensayo \"Ensayo Soja tardía con Fungicidas\" tiene información pendiente: fecha de cosecha, fecha de inicio.',0,'info_incompleta',66,'2026-03-12 15:18:54','/ensayos/66',1),(4,'Medición (DDA 21) - Ensayo #69: Ensayo Poroto - Densidad de siembra','Hoy corresponde tomar mediciones \"21 DDA\" (Primera aplicación1) (DDA 21) en el ensayo \"Ensayo Poroto - Densidad de siembra\".',0,'medicion',69,'2026-03-12 15:18:54','/mediciones?ensayoId=69',1),(5,'Info incompleta - Ensayo #69: Ensayo Poroto - Densidad de siembra','El ensayo \"Ensayo Poroto - Densidad de siembra\" tiene información pendiente: fecha de cosecha, fecha de inicio, datos de siembra en 1 parcela(s).',1,'info_incompleta',69,'2026-03-12 15:18:54','/ensayos/69',1),(6,'Info incompleta - Ensayo #71: Ensayo Cebada cervecera','El ensayo \"Ensayo Cebada cervecera\" tiene información pendiente: fecha de cosecha, fecha de inicio, datos de siembra en 1 parcela(s).',0,'info_incompleta',71,'2026-03-12 15:18:54','/ensayos/71',1),(7,'Info incompleta - Ensayo #73: Ensayo de prueba 1','El ensayo \"Ensayo de prueba 1\" tiene información pendiente: fecha de cosecha, fecha de inicio.',0,'info_incompleta',73,'2026-03-12 15:18:54','/ensayos/73',1),(8,'Info incompleta - Ensayo #74: asdasd','El ensayo \"asdasd\" tiene información pendiente: fecha de cosecha, fecha de inicio, datos de siembra en 1 parcela(s).',0,'info_incompleta',74,'2026-03-12 15:18:54','/ensayos/74',1),(9,'Info incompleta - Ensayo #75: Ensayo 02Marzo','El ensayo \"Ensayo 02Marzo\" tiene información pendiente: fecha de siembra, fecha de cosecha, fecha de inicio, datos de siembra en 7 parcela(s).',0,'info_incompleta',75,'2026-03-12 15:18:54','/ensayos/75',1),(10,'Importación Excel - Ensayo #76','Se importaron mediciones en Datos Campo: 180 fila(s). Usuario: dariassoft@gmail.com.',0,'general',76,'2026-09-30 18:13:21','/ensayos/76',1);
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-01  0:34:52
