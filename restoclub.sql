-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: cs_restoclub
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.20.04.2

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
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Restaurante'),(2,'Pub'),(3,'Discoteca'),(4,'Cervecería'),(5,'Bar'),(6,'Cafetería'),(7,'Panadería'),(8,'Vinoteca'),(9,'Recreativo');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `fecha` datetime NOT NULL,
  `comentario` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comentarios_local` (`local_id`),
  KEY `fk_comentarios_usuario` (`usuario_id`),
  CONSTRAINT `fk_comentarios_local` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_comentarios_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
INSERT INTO `comentarios` VALUES (67,265,7,'2023-05-26 19:20:07','Buena relación calidad-precio! Comimos genial con muy buen ambiente y servicio'),(70,83,7,'2023-05-27 14:54:13','Es nuestra panadería de diario!!'),(71,79,14,'2023-05-27 16:56:30','La carne buenísima!!!'),(72,80,14,'2023-05-27 17:01:53','El mejor vino de Granada'),(73,265,14,'2023-05-27 17:02:11','Lo probamos por casualidad y nos encantó!'),(74,77,7,'2023-05-28 16:28:32','Quedé encantada con el pollo asado. Repetiremos!'),(75,284,7,'2023-05-29 21:29:30','una noche increíble!!'),(76,285,7,'2023-05-31 19:28:13','nos encantó! volveremos pronto');
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dietas`
--

DROP TABLE IF EXISTS `dietas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dietas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dieta` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dietas`
--

LOCK TABLES `dietas` WRITE;
/*!40000 ALTER TABLE `dietas` DISABLE KEYS */;
INSERT INTO `dietas` VALUES (1,'Sin gluten'),(2,'Vegetariano');
/*!40000 ALTER TABLE `dietas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dietas_local`
--

DROP TABLE IF EXISTS `dietas_local`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dietas_local` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int NOT NULL,
  `dieta_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dieta_local_local` (`local_id`),
  KEY `fk_dieta_local_dieta` (`dieta_id`),
  CONSTRAINT `fk_dieta_local_dieta` FOREIGN KEY (`dieta_id`) REFERENCES `dietas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_dieta_local_local` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dietas_local`
--

LOCK TABLES `dietas_local` WRITE;
/*!40000 ALTER TABLE `dietas_local` DISABLE KEYS */;
INSERT INTO `dietas_local` VALUES (5,79,2),(9,83,1),(33,219,1),(36,242,2),(39,264,2),(41,266,1),(42,269,1),(43,281,2),(44,282,2),(45,283,2),(46,285,2),(47,286,2),(48,297,2),(49,298,1),(50,275,1),(51,303,1);
/*!40000 ALTER TABLE `dietas_local` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direcciones`
--

DROP TABLE IF EXISTS `direcciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direcciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `latitud` varchar(50) NOT NULL,
  `longitud` varchar(50) NOT NULL,
  `calle` varchar(200) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `provincia_id` int DEFAULT NULL,
  `cp` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_provincia_direccion` (`provincia_id`),
  CONSTRAINT `fk_provincia_direccion` FOREIGN KEY (`provincia_id`) REFERENCES `provincias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=351 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direcciones`
--

LOCK TABLES `direcciones` WRITE;
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
INSERT INTO `direcciones` VALUES (165,'-3.717','40.42746','C. de Quintana,30','Madrid',28,28008),(167,'-2.9332386031573403','43.26344759495781',' Portuko Markesaren Kalea, 4','Bilbao',48,48009),(168,'-3.597322073430162','37.17695822937469',' C. Almireceros, 5','Granada',18,18010),(171,'-8.407241592626901','43.365676496913785','Rúa Rosalía de Castro, 7','A coruña',15,15004),(172,'-3.6943127898734582','40.4063063434293','P.º de Sta. María de la Cabeza, 16','Madrid',28,28045),(173,'-5.788605409617179','37.19117438101736','Av. Alcalde José Dorado Alé, 3','Utrera',41,48170),(248,'-5.661250237008121','43.54365941953321','C. Cabrales, 18','Asturias',33,33201),(266,'1.333','1.222','kjh','k',1,12),(267,'-0.3660506443537847','39.470771466812515','C/ de Sorní, 42','Valencia',46,46004),(287,'-6.383968119944885','39.470319946315726','Av. Ruta de la Plata, 4','Cáceres',10,10001),(288,'-13.686797087690621','28.948485173181936','Carretera Tías - Macher, 84','Macher',35,35571),(309,'-3.6850031426508494','40.42390691629651','C. Jorge Juan,20','Madrid',28,28001),(310,'-2.933803494795643','43.256999977214946','Calle Gral. Concha, 46','Bilbao',48,48012),(311,'2.1720880841093604','41.40383561131828',' C/ de Sicília, 330','Barcelona',8,8025),(312,'-0.39040608378860964','39.48656342428005','C/ Gil Roger, 1','Valencia',46,46009),(313,'1.333','1.222','123','123',1,123),(314,'1.333','1.222','123','123',1,123),(315,'1.333','1.222','123','123',1,123),(316,'1.333','1.222','123','123',1,123),(317,'1.333','1.222','123','123',1,123),(318,'1.333','1.222','123','123',1,123),(319,'1.333','1.222','123','123',1,123),(320,'1.333','1.222','123','123',1,123),(321,'2.434545','3.94124414','Pullu del amor 123','Andorra',31,90903),(322,'1.333','1.222','123','123',1,123),(323,'1.333','1.222','123','123',1,123),(324,'1.333','1.333','123','123',1,123),(325,'1.333','1.222','123','123',1,123),(326,'1.333','1.222','123','123',1,123),(327,'1.333','1.222','123','123',1,13),(328,'1.333','1.222','123','123',1,123),(329,'-0.37479932440294506','39.4759614333995.','C/ del Cobertís dels Brodadors','Valencia',46,46022),(330,'-4.9518312545305525','36.496020944599735','Ctra. Nac. 340 km 175 Río Verde, C.C. RIMESA-TINO','Marbella',29,29660),(331,'-0.38286842328776627','39.46272905110756','Ptge. de Ventura Feliu, 11','Valencia',46,46007),(332,'1.1095005168758376','41.156944927105165','Plaça de la Farinera, 9 ','Reus',43,43201),(333,'1.333','1.222','123','123',1,123),(334,'1.333','1.222','123','123',1,123),(335,'1.333','1.222','123','123',1,123),(336,'1.333','1.222','123','123',1,123),(337,'1.333','1.222','123','123',1,123),(338,'1.333','1.222','123','123',46,46930),(339,'1.333','1.222','123','123',1,123),(340,'1.333','1.222','123','123',1,123),(341,'1.333','1.222','123','12',1,123),(342,'1.333','1.222','123','123',1,123),(343,'1.333','1.222','123','123',1,123),(344,'1.333','1.222','123','123',1,123),(345,'-0.3765116748615745','39.468446484443135','C/ del Convent de Sta. Clara, 13,','Valencia',46,46002),(346,'1.333','1.222','C/ del Comte dAlmodóvar, 1','123',1,123),(347,'-0.3753228926071166','39.4775390920764','C/ del Comte dAlmodóvar, 1','Valencia',46,46003),(348,'-0.3753228926071166','39.4775390920764','C/ del Comte dAlmodóvar, 1','Valencia',46,46003),(349,'-0.37559874861461295','39.4624252155833','Carrer de Sueca, 21','Valencia',46,45004),(350,'1.333','1.222','123','123',1,123);
/*!40000 ALTER TABLE `direcciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos_local`
--

DROP TABLE IF EXISTS `eventos_local`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos_local` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `evento` varchar(200) NOT NULL,
  `local_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_eventos_local_local` (`local_id`),
  CONSTRAINT `fk_eventos_local_local` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos_local`
--

LOCK TABLES `eventos_local` WRITE;
/*!40000 ALTER TABLE `eventos_local` DISABLE KEYS */;
INSERT INTO `eventos_local` VALUES (22,'2023-07-20 00:00:00','22:00 Concierto de bandas locales',79),(25,'2023-05-23 00:00:00','19:00-24:00 Música de África',84),(26,'2023-06-03 00:00:00','22:00 Salif Keïta',84),(73,'2023-04-24 16:00:00','Música chill out',200),(81,'2024-10-20 20:00:00','Concierto de Miranda',219),(84,'2023-12-23 21:00:00','Concierto Melendi',241),(85,'2023-12-23 21:00:00','Concierto Melendi',242),(112,'2023-12-29 20:00:00','Concierto de Michel Teló',263),(114,'2023-06-28 20:48:00','Monólogo en directo',77),(117,'2023-05-28 20:51:00','Concierto falso',219),(118,'2023-07-04 22:00:00','Curso online de coctelería',219),(119,'2023-07-04 22:00:00','Curso online de coctelería',200),(121,'0001-11-11 11:01:00','1111',267),(122,'0022-02-22 22:02:00','222',267),(126,'0666-06-06 06:59:00','666',267),(127,'0022-02-22 22:02:00','evt1',279),(128,'0011-11-11 11:01:00','wvt2',279),(129,'0333-03-31 03:33:00','evt3',279),(138,'1997-01-11 11:01:00','evt2',280),(139,'2009-05-04 22:02:00','2342',280),(140,'1995-02-22 12:34:00','evt1',281),(141,'2000-02-22 22:02:00','evt2',281),(142,'2023-03-31 22:02:00','222',281),(143,'1996-10-20 20:10:00','evt1',282),(144,'2018-03-31 10:10:00','ect2',282),(145,'2016-02-11 11:11:00','evt3',282),(146,'2000-04-03 10:10:00','wegw',282),(147,'2024-07-02 00:00:00','Fade',284),(148,'2024-11-25 20:30:00','Concierto de rap',284),(161,'2023-05-18 20:22:00','111',288),(162,'2023-05-01 20:22:00','werw',287),(163,'2023-05-01 20:22:00','werw',288),(164,'2023-05-11 20:23:00','evt1',287),(165,'2023-05-11 20:23:00','evt1',288),(166,'2023-05-18 20:22:00','111',289),(167,'2023-05-18 20:22:00','111',290),(168,'2023-05-18 20:22:00','111',291),(169,'2023-05-04 20:27:00','111',293),(170,'2023-05-05 20:28:00','evt1',293),(177,'2023-06-15 19:43:00','evt1',296),(181,'2023-06-15 19:45:00','111',297),(185,'5225-05-31 02:34:00','extinción del mundo',275),(186,'2023-06-10 20:00:00','Espectáculo magia',299),(187,'2023-12-31 22:00:00','Año nuevo con Carlos Baute',302),(188,'2023-06-06 17:57:00','Intercambio de idiomas',303),(190,'2023-06-10 18:06:00','Dia nacional sin gluten',266),(191,'2023-06-16 18:06:00','Evento super inventado',266);
/*!40000 ALTER TABLE `eventos_local` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gamas`
--

DROP TABLE IF EXISTS `gamas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gamas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gama` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gamas`
--

LOCK TABLES `gamas` WRITE;
/*!40000 ALTER TABLE `gamas` DISABLE KEYS */;
INSERT INTO `gamas` VALUES (1,'Gama alta'),(2,'Gama media'),(3,'Gama baja');
/*!40000 ALTER TABLE `gamas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenes_local`
--

DROP TABLE IF EXISTS `imagenes_local`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenes_local` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int NOT NULL,
  `imagen` varchar(300) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_imagenes_local_local` (`local_id`),
  CONSTRAINT `fk_imagenes_local_local` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=945 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenes_local`
--

LOCK TABLES `imagenes_local` WRITE;
/*!40000 ALTER TABLE `imagenes_local` DISABLE KEYS */;
INSERT INTO `imagenes_local` VALUES (309,200,'Varsovia-5.jpg'),(568,241,'albalat-1.jpeg'),(569,241,'albalat-2.jpeg'),(570,241,'albalat-3.jpeg'),(571,241,'albalat-4.jpeg'),(588,242,'la-cabana-macher-1.jpeg'),(589,242,'la-cabana-macher-2.jpeg'),(590,242,'la-cabana-macher-3.jpeg'),(600,241,'alBalat-5.jpeg'),(601,241,'alBalat-6.jpeg'),(660,263,'amazonico-1.jpeg'),(661,263,'amazonico-2.jpeg'),(662,263,'amazonico-3.jpeg'),(663,263,'amazonico-4.jpeg'),(664,263,'amazonico-5.jpeg'),(683,267,'123-1.png'),(684,268,'222-1.jpeg'),(685,269,'111-1.jpeg'),(686,270,'222-1.jpeg'),(687,271,'333-1.jpeg'),(688,272,'444-1.jpeg'),(689,273,'555-1.jpeg'),(690,274,'555-1.jpeg'),(691,275,'666-1.jpeg'),(692,276,'777-1.jpeg'),(693,277,'12-1.jpeg'),(694,278,'123-1.jpeg'),(695,279,'123-1.jpeg'),(696,280,'123-1.jpeg'),(697,281,'jej-1.jpeg'),(698,282,'prueba-1.png'),(699,282,'prueba-1.jpeg'),(700,282,'prueba-2.jpeg'),(701,282,'prueba-3.jpeg'),(702,282,'prueba-4.jpeg'),(703,282,'prueba-1.jpeg'),(704,282,'prueba-2.jpeg'),(705,282,'prueba-3.jpeg'),(706,282,'prueba-4.jpeg'),(710,284,'dreamers-marbella-1.jpeg'),(711,284,'dreamers-marbella-2.jpeg'),(712,284,'dreamers-marbella-3.jpeg'),(713,284,'dreamers-marbella-4.jpeg'),(714,284,'dreamers-marbella-5.jpeg'),(715,284,'dreamers-marbella-6.jpeg'),(739,285,'restaurante-uzbeco-1.jpeg'),(740,285,'restaurante-uzbeco-2.jpeg'),(741,285,'restaurante-uzbeco-3.jpeg'),(742,285,'restaurante-uzbeco-4.jpeg'),(743,285,'restaurante-uzbeco-5.jpeg'),(744,286,'the-lotus-bistro-1.jpeg'),(745,286,'the-lotus-bistro-2.jpeg'),(746,286,'the-lotus-bistro-3.jpeg'),(747,286,'the-lotus-bistro-4.jpeg'),(748,286,'the-lotus-bistro-5.jpeg'),(756,287,'111-1.jpeg'),(757,288,'123-1.jpeg'),(758,289,'123-1.jpeg'),(759,290,'123-1.jpeg'),(760,291,'123-1.jpeg'),(761,292,'1234-1.jpeg'),(762,293,'1234-1.jpeg'),(764,294,'111-1.jpeg'),(766,80,'la-vinoteca-7.jpeg'),(767,80,'la-vinoteca-8.png'),(768,80,'la-vinoteca-9.jpeg'),(769,200,'varsovia-6.jpeg'),(770,200,'varsovia-7.jpeg'),(771,200,'varsovia-8.jpeg'),(772,85,'ajolote-bar-9.jpeg'),(773,85,'ajolote-bar-10.jpeg'),(775,80,'la-vinoteca-10.jpeg'),(783,283,'la-pappardella-2.jpeg'),(784,283,'la-pappardella-3.jpeg'),(786,283,'la-pappardella-5.jpeg'),(787,283,'la-pappardella-6.jpeg'),(788,264,'melao-de-ca-a-5.jpeg'),(789,264,'melao-de-ca-a-6.jpeg'),(790,264,'melao-de-ca-a-7.jpeg'),(791,264,'melao-de-ca-a-8.jpeg'),(792,265,'wawel-restobar-6.jpeg'),(793,265,'wawel-restobar-7.jpeg'),(794,265,'wawel-restobar-8.jpeg'),(795,265,'wawel-restobar-9.jpeg'),(796,265,'wawel-restobar-10.jpeg'),(797,265,'wawel-restobar-11.jpeg'),(816,83,'pandelino-11.png'),(817,83,'pandelino-12.png'),(818,83,'pandelino-13.png'),(819,83,'pandelino-14.png'),(826,84,'restaurante-et-ope-habesha-30.png'),(827,84,'restaurante-et-ope-habesha-31.png'),(828,84,'restaurante-et-ope-habesha-32.png'),(829,219,'la-diva-11.jpeg'),(830,219,'la-diva-12.jpeg'),(831,219,'la-diva-13.jpeg'),(832,219,'la-diva-14.jpeg'),(833,219,'la-diva-15.jpeg'),(834,79,'margarito-17.png'),(835,79,'margarito-18.png'),(836,79,'margarito-19.png'),(837,79,'margarito-20.png'),(881,77,'pituca-46.jpeg'),(882,77,'pituca-47.jpeg'),(883,77,'pituca-48.webp'),(884,77,'pituca-49.jpeg'),(885,295,'123-1.jpeg'),(886,296,'123-1.jpeg'),(887,297,'123-1.jpeg'),(888,298,'123-1.jpeg'),(889,298,'123-1.jpeg'),(890,298,'123-2.jpeg'),(891,298,'123-3.jpeg'),(892,298,'123-4.jpeg'),(893,298,'123-5.jpeg'),(894,298,'123-1.jpeg'),(895,298,'123-2.jpeg'),(896,298,'123-3.jpeg'),(897,298,'123-4.jpeg'),(898,298,'123-5.jpeg'),(921,300,'123-1.jpeg'),(922,301,'caf-de-las-horas-1.jpeg'),(923,301,'caf-de-las-horas-2.jpeg'),(924,301,'caf-de-las-horas-3.jpeg'),(925,301,'caf-de-las-horas-4.jpeg'),(926,301,'caf-de-las-horas-5.jpeg'),(927,302,'caf-de-las-horas-1.jpeg'),(928,302,'caf-de-las-horas-2.jpeg'),(929,302,'caf-de-las-horas-3.jpeg'),(930,302,'caf-de-las-horas-4.jpeg'),(931,302,'caf-de-las-horas-5.jpeg'),(932,299,'sushi-kory-6.jpeg'),(933,299,'sushi-kory-7.jpeg'),(934,299,'sushi-kory-8.jpeg'),(935,303,'olh-ps-craft-beer-house-1.jpeg'),(936,303,'olh-ps-craft-beer-house-2.png'),(937,303,'olh-ps-craft-beer-house-3.png'),(938,266,'panader-a-baking-free-artesana-sin-gluten-2.jpeg'),(939,266,'panader-a-baking-free-artesana-sin-gluten-3.jpeg'),(940,266,'panader-a-baking-free-artesana-sin-gluten-4.jpeg'),(941,266,'panader-a-baking-free-artesana-sin-gluten-5.jpeg'),(942,266,'panader-a-baking-free-artesana-sin-gluten-6.jpeg'),(943,304,'prueba-1.jpeg');
/*!40000 ALTER TABLE `imagenes_local` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `local`
--

DROP TABLE IF EXISTS `local`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `local` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `categoria_id` int DEFAULT NULL,
  `tipo_id` int DEFAULT NULL,
  `web` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `red_social` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `precio_medio` varchar(100) NOT NULL,
  `gama_id` int DEFAULT NULL,
  `menu` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion_id` int DEFAULT NULL,
  `cancelado` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_direccion_local` (`direccion_id`),
  KEY `fk_tipo_restaurante_local` (`tipo_id`),
  KEY `fk_categoria_local` (`categoria_id`),
  KEY `fk_gama_local` (`gama_id`),
  CONSTRAINT `fk_categoria_local` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_direccion_local` FOREIGN KEY (`direccion_id`) REFERENCES `direcciones` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_gama_local` FOREIGN KEY (`gama_id`) REFERENCES `gamas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_tipo_restaurante_local` FOREIGN KEY (`tipo_id`) REFERENCES `tipos_restaurante` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=305 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `local`
--

LOCK TABLES `local` WRITE;
/*!40000 ALTER TABLE `local` DISABLE KEYS */;
INSERT INTO `local` VALUES (77,'Pituca',1,5,'https://pitucamadrid.es/','pitucamadrid','23 euros',2,'https://pitucamadrid.es/carta/','698 95 41 97',165,0),(79,'Margarito',1,8,'https://margaritorestaurant.com/','margaritogrillmarket','9 € - 37 €',2,'https://margaritorestaurant.com/carta',' 944719705',167,0),(80,'La Vinoteca',8,NULL,'http://www.lavinotecagranada.es/','lavinotecagr','25 euros',2,'http://www.lavinotecagranada.es/index.php/la-carta',' 615991761',168,0),(83,'Pandelino',7,NULL,'https://pandelino.es/','pandelino','30',1,'https://cartas.pandelino.es/','981 20 75 84',171,0),(84,'Restaurante Etíope Habesha',1,7,'https://www.restauranteetiopiahabesha.com/','habeshamadrid','15',3,'https://www.thefork.es/restaurante/habesha-r427973/menu','914388072',172,0),(85,'Ajolote Bar',5,NULL,'https://www.grupoajolote.com/','ajolotebar','20-30',2,'https://www.grupoajolote.com/ajolote-bar/','659280184',173,0),(200,'Varsovia',2,NULL,'https://varsoviagijon.com/','varsoviagijon','7-10',2,'https://varsoviagijon.com/#carta','984 19 68 42',248,0),(218,'Restau Etípoe RGEEûrg',1,1,NULL,NULL,'lkhj',1,NULL,'kjh',266,1),(219,'La Diva',1,1,'https://ladivavalencia.com/','ladivavalencia','50',1,'https://ladivavalencia.com/carta/','960 99 00 20',267,0),(241,'alBalat',1,1,'https://restaurantealbalat.com/','restaurantealbalat','17-50',1,'https://restaurantealbalat.com/cartas-albalat/','927 03 83 03',287,0),(242,'La Cabaña Macher',1,1,'https://www.lacabanamacher.com/','restaurantemacher60','20-40',1,'https://www.lacabanamacher.com/weekly-menu/','650 68 56 62',288,0),(263,'Amazónico',1,8,'https://restauranteamazonico.com/','amazonico.madrid','50',1,'https://restauranteamazonico.com/cartas_esp/',' 915 15 43 32',309,0),(264,'Melao de Caña',1,5,'https://melao-de-cana.negocio.site/','melaoasador_bilbao','12-15',2,NULL,'946 57 93 94',310,0),(265,'Wawel Restobar',1,14,NULL,'wavelrestobar','4-20',3,NULL,'934 57 95 50',311,0),(266,'Panadería Baking Free - Artesana ~ Sin Gluten',7,NULL,'http://www.bakingfree.es/','bakingfree_','10-20',2,'https://www.bakingfree.es/tiendaonline/','960 221 819',312,0),(267,'123',1,1,NULL,NULL,'123',1,NULL,'123',313,1),(268,'222',1,1,NULL,NULL,'12',1,NULL,'123',314,0),(269,'111',1,1,NULL,NULL,'123',1,NULL,'123',315,1),(270,'222',1,1,NULL,NULL,'123',1,NULL,'123',316,1),(271,'333',1,1,NULL,NULL,'123',1,NULL,'123',317,1),(272,'444',1,1,NULL,NULL,'123',1,NULL,'123',318,1),(273,'555',1,1,NULL,NULL,'123',1,NULL,'123',319,1),(274,'555',1,1,NULL,NULL,'123',1,NULL,'123',320,1),(275,'Camelia y Mauri 4ever',9,NULL,'http://www.tequieroamor.com','cameliaymauri','50000',1,'http://www.pullu.com/carta','123456789',321,1),(276,'777',1,1,NULL,NULL,'123',1,NULL,'123',322,1),(277,'12',1,1,NULL,NULL,'123',1,NULL,'123',323,1),(278,'123',1,1,NULL,NULL,'123',1,NULL,'123',324,1),(279,'123',1,1,NULL,NULL,'123',1,NULL,'123',325,1),(280,'123',1,1,NULL,NULL,'123',1,NULL,'123',326,1),(281,'jej',1,1,NULL,NULL,'123',1,NULL,'123',327,1),(282,'prueba',1,1,NULL,NULL,'123',1,NULL,'123',328,1),(283,'La Pappardella',1,4,'https://www.restaurantelapappardella.com/','papardellavalencia','5-20',1,'https://app.scanmimenu.com/local/la-pappardella/','963918915',329,0),(284,'Dreamers Marbella',3,NULL,'https://dreamersmarbella.club/','dreamersmarbella','20-180',1,NULL,'684 41 53 91',330,0),(285,'RESTAURANTE UZBEKO . HALAL 100%',1,13,'https://uzbekorestaurante.wixsite.com/restaurante-uzbeko',NULL,'25',2,NULL,'643 48 15 76',331,0),(286,'The Lotus Bistro',1,15,'https://thelotusbistro.es',NULL,'9-20',2,'https://thelotusbistro.es/menu/','877217100',332,0),(287,'111',1,1,NULL,NULL,'111',1,NULL,'123',333,1),(288,'123',1,1,NULL,NULL,'123',1,NULL,'123',334,1),(289,'123',1,1,NULL,NULL,'123',1,NULL,'123',335,1),(290,'123',1,1,NULL,NULL,'123',1,NULL,'123',336,1),(291,'123',1,1,NULL,NULL,'123',1,NULL,'312',337,1),(292,'1234',1,1,NULL,NULL,'23',1,NULL,'123',338,1),(293,'1234',1,1,NULL,NULL,'123',1,NULL,'123',339,1),(294,'111',1,1,'https://www.flaticon.es/icon-font-gratis/marque-el-circulo_10469499?term=tic&related_id=10469499',NULL,'123',1,NULL,'123',340,1),(295,'123',1,1,NULL,NULL,'123',1,NULL,'123',341,1),(296,'123',1,1,NULL,NULL,'123',1,NULL,'13',342,1),(297,'123',1,1,NULL,NULL,'123',1,NULL,'123',343,1),(298,'123',1,1,NULL,NULL,'123',1,NULL,'123',344,1),(299,'Sushi Kory',1,2,'http://sushidovalencia.es/','sushikory','20-30',2,'https://www.sushikory.com/nuestra-carta/','682 88 72 82',345,0),(300,'123',1,1,NULL,NULL,'123',1,NULL,'123',346,1),(301,'Café de las Horas',6,NULL,'https://cafedelashoras.com/?page_id=6','cafedelashoras','12-20',1,'https://cafedelashoras.com/la-carta/','963 91 73 36',347,1),(302,'Café de las Horas',6,NULL,'https://cafedelashoras.com/?page_id=6','cafedelashoras','12-20',1,'https://cafedelashoras.com/la-carta/','963 91 73 36',348,0),(303,'Olhöps Craft Beer House',4,NULL,'http://www.beerhouse.olhops.com/','olhops','5-15',3,NULL,'611752940',349,0),(304,'prueba',1,1,NULL,NULL,'123',1,NULL,'123',350,0);
/*!40000 ALTER TABLE `local` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `local_cliente`
--

DROP TABLE IF EXISTS `local_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `local_cliente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `visitado` tinyint DEFAULT NULL,
  `favorito` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_local_cliente_local` (`local_id`),
  KEY `fk_local_cliente_cliente` (`usuario_id`),
  CONSTRAINT `fk_local_cliente_cliente` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_local_cliente_local` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `local_cliente`
--

LOCK TABLES `local_cliente` WRITE;
/*!40000 ALTER TABLE `local_cliente` DISABLE KEYS */;
INSERT INTO `local_cliente` VALUES (1,79,3,0,0),(3,77,3,1,0),(6,83,3,1,1),(8,85,7,0,1),(9,83,7,0,0),(10,79,7,1,1),(11,200,7,0,1),(12,241,7,1,0),(13,77,7,0,1),(14,219,7,1,1),(15,268,7,0,0),(16,85,14,1,1),(17,79,14,0,1),(18,241,14,1,0),(19,284,7,1,0);
/*!40000 ALTER TABLE `local_cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `local_duenyo`
--

DROP TABLE IF EXISTS `local_duenyo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `local_duenyo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `local_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_usuario_duenyo` (`usuario_id`),
  KEY `fk_local_duenyo` (`local_id`),
  CONSTRAINT `fk_local_duenyo` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_duenyo` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `local_duenyo`
--

LOCK TABLES `local_duenyo` WRITE;
/*!40000 ALTER TABLE `local_duenyo` DISABLE KEYS */;
INSERT INTO `local_duenyo` VALUES (4,2,77),(5,2,79),(6,2,80),(11,2,83),(12,2,84),(13,2,85),(99,2,200),(107,2,218),(108,2,219),(130,10,241),(131,10,242),(141,10,264),(142,10,263),(143,10,265),(144,24,267),(145,24,269),(146,24,270),(147,24,271),(148,24,272),(149,24,273),(150,24,274),(151,24,275),(152,24,276),(153,24,277),(154,24,279),(155,24,280),(156,24,281),(157,26,282),(158,10,283),(159,10,284),(160,27,285),(161,27,286),(162,27,287),(163,27,288),(164,27,289),(165,27,290),(166,27,291),(167,27,292),(168,27,293),(169,2,294),(170,2,296),(171,2,297),(172,2,298),(173,24,299),(174,24,300),(175,24,302),(176,24,303),(177,24,266),(178,24,304);
/*!40000 ALTER TABLE `local_duenyo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones_local`
--

DROP TABLE IF EXISTS `promociones_local`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promociones_local` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int NOT NULL,
  `promocion` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_promociones_local_local` (`local_id`),
  CONSTRAINT `fk_promociones_local_local` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones_local`
--

LOCK TABLES `promociones_local` WRITE;
/*!40000 ALTER TABLE `promociones_local` DISABLE KEYS */;
INSERT INTO `promociones_local` VALUES (23,77,'2x1 en hamburguesas los martes'),(24,83,'2x1 en Aceite de Oliva Ahumado Finca La Barca los miércoles'),(41,200,'2x1 en cócteles los miércoles'),(50,219,'Menú los jueves a 20 euros'),(52,242,'2x1 en bebidas los miércoles'),(62,265,'2x1 en chupitos los martes'),(63,219,'promo prueba'),(66,267,'promo2'),(67,267,'promo23'),(69,267,'111'),(72,280,'promo1'),(73,280,'promo2'),(74,280,'promo3'),(75,280,'promo4'),(76,280,'promo5'),(77,281,'promo1'),(78,281,'promo2'),(79,281,'promo3'),(80,269,'promo1'),(81,269,'promo2'),(82,269,'promo3'),(83,282,'promo1'),(84,282,'promo2'),(85,282,'promo3'),(86,282,'promo4'),(87,283,'2x1 en pasta los miércoles'),(88,284,'Entrada con lista=consumición 15 euros'),(89,285,'Si compras en Uber los martes de 13:00 a 15:00 te sale gratis la bebida'),(90,287,'promo1'),(91,287,'promo2'),(92,275,'4x1 en chupitosdadw'),(93,299,'Buffet libre entresemana'),(94,299,'Barra libre cerveza los domingos');
/*!40000 ALTER TABLE `promociones_local` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provincias`
--

DROP TABLE IF EXISTS `provincias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provincias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provincia` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provincias`
--

LOCK TABLES `provincias` WRITE;
/*!40000 ALTER TABLE `provincias` DISABLE KEYS */;
INSERT INTO `provincias` VALUES (1,'Álava'),(2,'Albacete'),(3,'Alacant'),(4,'Almería'),(5,'Ávila'),(6,'Badajoz'),(7,'Illes Balears'),(8,'Barcelona'),(9,'Burgos'),(10,'Cáceres'),(11,'Cádiz'),(12,'Castelló'),(13,'Ciudad Real'),(14,'Córdoba'),(15,'A Coruña'),(16,'Cuenca'),(17,'Girona'),(18,'Granada'),(19,'Guadalajara'),(20,'Gipuzkoa'),(21,'Huelva'),(22,'Huesca'),(23,'Jaén'),(24,'León'),(25,'Lleida'),(26,'La Rioja'),(27,'Lugo'),(28,'Madrid'),(29,'Málaga'),(30,'Murcia'),(31,'Nafarroa'),(32,'Ourense'),(33,'Asturias'),(34,'Palencia'),(35,'Las Palmas'),(36,'Pontevedra'),(37,'Salamanca'),(38,'Sta. Cruz de Tenerife'),(39,'Cantabria'),(40,'Segovia'),(41,'Sevilla'),(42,'Soria'),(43,'Tarragona'),(44,'Teruel'),(45,'Toledo'),(46,'Valéncia'),(47,'Valladolid'),(48,'Bizkaia'),(49,'Zamora'),(50,'Zaragoza'),(51,'Ceuta'),(52,'Melilla');
/*!40000 ALTER TABLE `provincias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_pago`
--

DROP TABLE IF EXISTS `tipos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_pago` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_pago` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_pago`
--

LOCK TABLES `tipos_pago` WRITE;
/*!40000 ALTER TABLE `tipos_pago` DISABLE KEYS */;
INSERT INTO `tipos_pago` VALUES (1,'Efectivo'),(2,'Tarjeta de crédito'),(3,'Bizum');
/*!40000 ALTER TABLE `tipos_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_pagos_local`
--

DROP TABLE IF EXISTS `tipos_pagos_local`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_pagos_local` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int NOT NULL,
  `tipos_pago_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tipo_pago_local_pago` (`tipos_pago_id`),
  KEY `fk_tipo_pago_local_local` (`local_id`),
  CONSTRAINT `fk_tipo_pago_local_local` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_tipo_pago_local_pago` FOREIGN KEY (`tipos_pago_id`) REFERENCES `tipos_pago` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_pagos_local`
--

LOCK TABLES `tipos_pagos_local` WRITE;
/*!40000 ALTER TABLE `tipos_pagos_local` DISABLE KEYS */;
INSERT INTO `tipos_pagos_local` VALUES (17,79,1),(18,79,2),(19,79,3),(20,80,2),(21,80,3),(22,85,1),(23,85,2),(30,200,1),(31,200,2),(32,200,3),(55,219,1),(56,219,2),(57,219,3),(61,241,1),(62,241,2),(63,241,3),(64,242,1),(65,242,2),(66,242,3),(69,263,1),(70,263,2),(71,263,3),(72,264,1),(73,264,2),(74,265,1),(75,265,2),(76,265,3),(78,77,3),(79,83,2),(81,83,1),(82,266,1),(83,267,1),(84,269,1),(85,280,1),(86,280,2),(87,281,1),(88,281,2),(89,282,1),(90,283,1),(91,283,2),(92,283,3),(93,284,1),(94,284,2),(95,284,3),(96,285,1),(97,285,2),(98,286,1),(99,286,2),(100,286,3),(101,297,1),(102,298,1),(103,275,2),(104,275,3),(105,299,1),(106,299,2),(107,301,1),(108,301,2),(109,301,3),(110,302,1),(111,302,2),(112,302,3),(113,303,1),(114,303,2),(117,266,2),(118,266,3);
/*!40000 ALTER TABLE `tipos_pagos_local` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_restaurante`
--

DROP TABLE IF EXISTS `tipos_restaurante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_restaurante` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_restaurante`
--

LOCK TABLES `tipos_restaurante` WRITE;
/*!40000 ALTER TABLE `tipos_restaurante` DISABLE KEYS */;
INSERT INTO `tipos_restaurante` VALUES (1,'Americano'),(2,'Japonés'),(3,'Chino'),(4,'Italiano'),(5,'Colombiano'),(6,'Venezolano'),(7,'Africano'),(8,'Mediterráneo'),(9,'Mexicano'),(10,'Argentino'),(11,'Peruano'),(12,'Español'),(13,'Uzbeko'),(14,'Polaco'),(15,'Vietnamita');
/*!40000 ALTER TABLE `tipos_restaurante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreCompleto` varchar(100) NOT NULL,
  `nombreUsuario` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasenya` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tipo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'administrador','admin','admin@admin.es','$2y$10$KO0plw7VgY4sl1froj4IyOe1ZFUdYSohTyJc/tAFvgS3fiMYZ5aRq',1),(2,'Duenyo Apellido','duenyo1','mail1@mail.es','$2y$10$KO0plw7VgY4sl1froj4IyOe1ZFUdYSohTyJc/tAFvgS3fiMYZ5aRq',2),(3,'user','usuario1','useer@gmail.com','$2y$10$KO0plw7VgY4sl1froj4IyOe1ZFUdYSohTyJc/tAFvgS3fiMYZ5aRq',3),(6,'Camelia Strango','camelia-duenya','camelia.96str@gmail.com','$2y$10$ay4BfRgWxmzd9iF5PNfvQeiAxcrIME1v7n7o/igqu2vxO4gjHi4ZK',2),(7,'camelia','camelia-clienta','camelia.96str@gmail.com','$2y$10$9XnANt7qqeaLI8zIbUILhuZEVwc7tum0kaZ3QvKjWoI69F0B.vr4m',3),(8,'prueba1','prueba1','prueba@eee.es','$2y$10$ZHdefSUI1YDg7pXH..ReC.k7MQXlY7xwVF1dWMLJ3ouO8koMwT/Um',3),(9,'Monigote','monigote','dfasasasf@hotmail.com','$2y$10$qAsInjFOeUm55ZwyOE18wOsq/qEVOaodoA4t/8xzK0rGAQGryUSiW',3),(10,'fasfs','duenyo2','efaff@hotmai.com','$2y$10$rvw/PglpsuLQt08ZN1cODuATkIO.FuiRj3lbbVluFH8kEl8IoauJ.',2),(11,'Camelia Strango','lily2','lilylilybambina@gmail.com',NULL,3),(14,'Mauricio Dal Colle Iglesias','mauridalcolle','mauridalcolle@gmail.com',NULL,3),(24,'duenyo3','duenyo3','duenyo3@mail.es','$2y$10$DEv/.f/wNxrNMw9kFiEavuQxvRmvs1LonCCpK038J0I/OSxtEAD72',2),(25,'camelia','camelia.str.prueba','cameliastr.tr@gmail.com','$2y$10$zGEr3EjOVr9GE8XuUhbOxO8buiUwYhwEDcA.CH8OVDsmaC8ZlpTh.',3),(26,'prueba 2','prueba2','prueba2@mail.com','$2y$10$2N1tmhSBK0bZL.8gzyf.L.U7fixhO/8cbozesWy99YW156.b8Yqi6',2),(27,'duenyo4','duenyo4','pullu@hotmail.com','$2y$10$f1ZE/pJwWcI5rDwihbWh1.ndx3sbXhV.yTtm0N7W3af3INsXlYazO',2),(28,'pruebita','12345678','mail123@mail.es','$2y$10$KPiue0yXEvv1AXC93wOjEu03fgp1zDew61LigH8tR6qre0hPi9lmm',2);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'cs_restoclub'
--

--
-- Dumping routines for database 'cs_restoclub'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-11 21:29:51
