-- MySQL dump 10.13  Distrib 5.5.29, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: club
-- ------------------------------------------------------
-- Server version	5.5.29-0ubuntu0.12.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `left` varchar(64) NOT NULL,
  `right` varchar(255) NOT NULL,
  `user_i` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'Ivy','http://www2.artflakes.com/artwork/products/258043/poster/e7149ed4a12b2af6dbdb78f76497add6.jpg',0),(2,'East','http://www.awomenshub.com/wp-content/uploads/2013/03/Pakistani-Wedding-Hairstyles-for-Girls-Pictures1.jpg',0),(4,'School','http://4.bp.blogspot.com/-ROoNBw1p-j8/Ts8kRRGlkfI/AAAAAAAAAMk/UA1SEZ970zo/s640/Girls+Hairstyles+for+School.jpg',0),(5,'Funky','http://cooleasyhairstyles.com/wp-content/uploads/2012/10/Funky-girls-haircuts-3.jpg',0),(6,'Clean','http://img02.taobaocdn.com/imgextra/i2/572147632/T2MB4sXXlXXXXXXXXX_!!572147632.jpg',0),(7,'Easter','https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxE6wvmMvYMTWPCmOyhGTZh9Fo9lj9HyZcmx9JiLN0MEsEnVTY',0),(8,'Long Natural','http://media-cache-ec2.pinimg.com/236x/f2/88/7f/f2887fd79503407bdae10b6ecb369f63.jpg',0),(9,'Back','http://www.hairstylestars.com/wp-content/uploads/2012/07/triple-dutch-braid.jpg',0),(10,'cutie','http://girlshue.com/wp-content/uploads/2012/07/Best-Cute-Simple-Unique-Little-Girls-Kids-Hairstyles-Haircuts-1.jpg',0),(11,'Emo','http://1.bp.blogspot.com/-175qtHg4Ryg/TzuPX5Qc_II/AAAAAAAABB0/1hvkLiHSc9g/s400/Scene%2BEmo%2BHairstyles2.jpg',0),(12,'Uber','http://ushairstyles.com/wp-content/uploads/2011/07/School-Girls-Updo-Hairstyles.jpg',0),(13,'Candy','http://kookhair.com/large/Wedding_Hairstyle_For_Round_Faces_4.jpg',0),(14,'Easter','https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxE6wvmMvYMTWPCmOyhGTZh9Fo9lj9HyZcmx9JiLN0MEsEnVTY',0),(15,'Bird','http://media.onsugar.com/files/2010/12/48/5/1238/12388651/a5/short-funky-hairstyles.jpg',0),(16,'Simple','http://yourhairstylee.com/wp-content/uploads/2013/08/simple-updos-for-little-girlshairstyles-for-girls---hair-styles---braiding---princess-hairstyles-nuultnbg.jpg',0),(17,'Sendler','http://www.sendler.co.uk/Archive/images/hats/misc/1.jpg',0),(18,'Witch','http://img1.etsystatic.com/003/2/5359030/il_fullxfull.354998575_eth4.jpg?ref=l2',0),(19,'Katy','http://creativefan.com/important/cf/2012/12/katy-perry-hairstyles/red-feathers.jpg',0),(20,'Oriental Blonde','http://www.short-haircut.com/wp-content/uploads/2013/05/Blonde-bob-hairstyles-2013.jpg',0);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salons`
--

DROP TABLE IF EXISTS `salons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `salons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `left` varchar(128) NOT NULL,
  `right` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salons`
--

LOCK TABLES `salons` WRITE;
/*!40000 ALTER TABLE `salons` DISABLE KEYS */;
INSERT INTO `salons` VALUES (2,'Nice','http://www.travels.com/Cms/images/GlobalPhoto/Articles/18850/289826-main_Full.jpg',0),(3,'Ginas','https://www.ginaspa.com/assets/Anchor-Images-of-Servcies/_resampled/resizedimage600400-hair-salon-copy.jpg',0),(4,'High Street','https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT6kF09rCcBjqDCMf3Qosp1q6_bgfGLRRwvg6GIzGbp-ko1cYAweApQsDbG',0),(6,'Specjalista','http://www.szkola.gowork.pl/userfiles/image/technik%20us%C5%82ug%20fryzjerskich/65419287_1-Pictures-of-Wedding-Bridal-Packages-Hair-Salon.jpg',0),(7,'Advance It','http://advanceit.com/blog/wp-content/uploads/2012/06/Hair-Salon-Alternative-Financing.jpg',0),(8,'Rush','http://cdni.condenast.co.uk/320x360/k_n/Maybelline_V_10nov08_PR_b_1.jpg',0),(9,'Urooj','http://uroojbeauty.co.uk/images/salonexample.png',0),(10,'Adison','http://images.topix.com/gallery/up-B2BH7JIM02LDNPMD.jpg',0);
/*!40000 ALTER TABLE `salons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stylists`
--

DROP TABLE IF EXISTS `stylists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stylists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stylists`
--

LOCK TABLES `stylists` WRITE;
/*!40000 ALTER TABLE `stylists` DISABLE KEYS */;
INSERT INTO `stylists` VALUES (23,'PHL 1','https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/s160x160/527171_10151106166996550_1534475413_a.jpg',0,'123 Main','phil@phil.com','555 555 5555'),(27,'Raymond','http://www.details.com/images/style-advice/grooming-and-health/201104/hair_stylists_sized/Getty_Raymond_Bessone_harticle_embed.jpg',0,'','',''),(28,'Vidal','http://www.haaretz.com/polopoly_fs/1.429315.1336609155!/image/3128092562.jpg_gen/derivatives/landscape_640/3128092562.jpg',0,NULL,'',NULL),(34,'new','http://tocnoihanoi.com/wp-content/uploads/2013/09/hairdressing-stylist.jpg',0,'','','');
/*!40000 ALTER TABLE `stylists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stylists_clients`
--

DROP TABLE IF EXISTS `stylists_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stylists_clients` (
  `id` int(11) NOT NULL,
  `rel` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stylists_clients`
--

LOCK TABLES `stylists_clients` WRITE;
/*!40000 ALTER TABLE `stylists_clients` DISABLE KEYS */;
INSERT INTO `stylists_clients` VALUES (23,'[]'),(34,'[]'),(24,'{\"1\":{\"ord\":\"0\"},\"2\":{\"ord\":\"1\"}}'),(27,'[]'),(28,'[]'),(31,'{\"16\":{\"ord\":\"0\"}}'),(29,'{\"2\":{\"ord\":\"7\"},\"13\":{\"ord\":\"0\"},\"14\":{\"ord\":\"2\"},\"15\":{\"ord\":\"1\"},\"16\":{\"ord\":\"5\"},\"17\":{\"ord\":\"4\"},\"18\":{\"ord\":\"6\"},\"19\":{\"ord\":\"3\"}}');
/*!40000 ALTER TABLE `stylists_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stylists_salons`
--

DROP TABLE IF EXISTS `stylists_salons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stylists_salons` (
  `id` int(11) NOT NULL,
  `rel` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stylists_salons`
--

LOCK TABLES `stylists_salons` WRITE;
/*!40000 ALTER TABLE `stylists_salons` DISABLE KEYS */;
INSERT INTO `stylists_salons` VALUES (23,'[]'),(24,'{\"1\":{\"ord\":\"0\"},\"2\":{\"ord\":\"1\"},\"3\":{\"ord\":\"2\"}}'),(27,'[]'),(29,'{\"1\":{\"ord\":\"8\"},\"3\":{\"ord\":\"0\"},\"10\":{\"ord\":\"9\"}}'),(28,'[]'),(31,'{\"2\":{\"ord\":\"2\"},\"3\":{\"ord\":\"0\"},\"6\":{\"ord\":\"1\"}}'),(34,'[]');
/*!40000 ALTER TABLE `stylists_salons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `first` varchar(32) NOT NULL,
  `last` varchar(32) NOT NULL,
  `email` varchar(128) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `role` int(11) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('tuc','kowski','tuc@kowski.com','555-555-5555',1,'');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-10-04 16:28:14
