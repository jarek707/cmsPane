-- phpMyAdmin SQL Dump
-- version 2.8.0.1
-- http://www.phpmyadmin.net
-- 
-- Host: custsql-ipg33.eigbox.net
-- Generation Time: Oct 11, 2013 at 01:30 PM
-- Server version: 5.0.91
-- PHP Version: 4.4.9
-- 
-- Database: `club`
-- 

-- --------------------------------------------------------

-- 
-- Table structure for table `article`
-- 

CREATE TABLE IF NOT EXISTS `article` (
  `id` int(11) NOT NULL auto_increment,
  `pid` int(11) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `article`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `clients`
-- 

CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL auto_increment,
  `left` varchar(64) NOT NULL,
  `right` varchar(255) NOT NULL,
  `pid` int(11) NOT NULL,
  `ord` int(11) NOT NULL default '-1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=latin1 AUTO_INCREMENT=35 ;

-- 
-- Dumping data for table `clients`
-- 

INSERT INTO `clients` VALUES (1, 'Ivy', 'http://www2.artflakes.com/artwork/products/258043/poster/e7149ed4a12b2af6dbdb78f76497add6.jpg', 0, -1);
INSERT INTO `clients` VALUES (2, 'India', 'http://www.awomenshub.com/wp-content/uploads/2013/03/Pakistani-Wedding-Hairstyles-for-Girls-Pictures1.jpg', 0, -1);
INSERT INTO `clients` VALUES (4, 'School', 'http://4.bp.blogspot.com/-ROoNBw1p-j8/Ts8kRRGlkfI/AAAAAAAAAMk/UA1SEZ970zo/s640/Girls+Hairstyles+for+School.jpg', 0, -1);
INSERT INTO `clients` VALUES (5, 'Funky', 'http://cooleasyhairstyles.com/wp-content/uploads/2012/10/Funky-girls-haircuts-3.jpg', 0, -1);
INSERT INTO `clients` VALUES (6, 'Clean', 'http://img02.taobaocdn.com/imgextra/i2/572147632/T2MB4sXXlXXXXXXXXX_!!572147632.jpg', 0, -1);
INSERT INTO `clients` VALUES (7, 'Easter', 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxE6wvmMvYMTWPCmOyhGTZh9Fo9lj9HyZcmx9JiLN0MEsEnVTY', 0, -1);
INSERT INTO `clients` VALUES (8, 'Long Natural', 'http://media-cache-ec2.pinimg.com/236x/f2/88/7f/f2887fd79503407bdae10b6ecb369f63.jpg', 0, -1);
INSERT INTO `clients` VALUES (9, 'Back', 'http://www.hairstylestars.com/wp-content/uploads/2012/07/triple-dutch-braid.jpg', 0, -1);
INSERT INTO `clients` VALUES (10, 'Cutie', 'http://girlshue.com/wp-content/uploads/2012/07/Best-Cute-Simple-Unique-Little-Girls-Kids-Hairstyles-Haircuts-1.jpg', 0, -1);
INSERT INTO `clients` VALUES (11, 'Emo', 'http://1.bp.blogspot.com/-175qtHg4Ryg/TzuPX5Qc_II/AAAAAAAABB0/1hvkLiHSc9g/s400/Scene%2BEmo%2BHairstyles2.jpg', 0, -1);
INSERT INTO `clients` VALUES (12, 'Uber', 'http://ushairstyles.com/wp-content/uploads/2011/07/School-Girls-Updo-Hairstyles.jpg', 0, -1);
INSERT INTO `clients` VALUES (13, 'Candy', 'http://kookhair.com/large/Wedding_Hairstyle_For_Round_Faces_4.jpg', 0, -1);
INSERT INTO `clients` VALUES (14, 'Easter', 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQxE6wvmMvYMTWPCmOyhGTZh9Fo9lj9HyZcmx9JiLN0MEsEnVTY', 0, -1);
INSERT INTO `clients` VALUES (15, 'Bird', 'http://media.onsugar.com/files/2010/12/48/5/1238/12388651/a5/short-funky-hairstyles.jpg', 0, -1);
INSERT INTO `clients` VALUES (16, 'Simple', 'http://yourhairstylee.com/wp-content/uploads/2013/08/simple-updos-for-little-girlshairstyles-for-girls---hair-styles---braiding---princess-hairstyles-nuultnbg.jpg', 0, -1);
INSERT INTO `clients` VALUES (17, 'Sendler', 'http://www.sendler.co.uk/Archive/images/hats/misc/1.jpg', 0, -1);
INSERT INTO `clients` VALUES (19, 'Katy', 'http://creativefan.com/important/cf/2012/12/katy-perry-hairstyles/red-feathers.jpg', 0, -1);
INSERT INTO `clients` VALUES (20, 'Oriental Mystery', 'http://www.short-haircut.com/wp-content/uploads/2013/05/Blonde-bob-hairstyles-2013.jpg', 0, -1);
INSERT INTO `clients` VALUES (21, 'Incoming', 'http://www.graziadaily.co.uk/pub/21publish/c/conversation/tennis-face-3.jpg', 0, -1);
INSERT INTO `clients` VALUES (22, 'Chill', 'http://canburystudio.co.uk/wp-content/gallery/faces/faces12.jpg', 0, -1);
INSERT INTO `clients` VALUES (24, 'New York', 'http://www.simonhoegsberg.com/faces_of_new_york/images/01_faces.jpg', 0, -1);
INSERT INTO `clients` VALUES (25, 'Jan Karol', 'http://digilander.iol.it/kbogucki/karol_chodkiewicz.jpg', 0, -1);
INSERT INTO `clients` VALUES (26, 'Queen', 'http://upload.wikimedia.org/wikipedia/commons/9/98/Marie-Antoinette,_1775_-_Mus%C3%A9e_Antoine_L%C3%A9cuyer.jpg', 0, -1);
INSERT INTO `clients` VALUES (27, 'Destructor', 'http://upload.wikimedia.org/wikipedia/commons/5/5f/Joseph_Schumpeter_ekonomialaria.jpg', 0, -1);
INSERT INTO `clients` VALUES (28, 'Man of the Hour', 'http://merlin.pl/Od-i-Do-tom-1-i-2_Norman-Davies,images_zdjecia,9,978-83-88848-63-6_7.jpg', 0, -1);
INSERT INTO `clients` VALUES (29, 'Federowicz', 'http://i2.ytimg.com/vi/-2mx7v58QO4/hqdefault.jpg', 0, -1);
INSERT INTO `clients` VALUES (30, 'Kwiatkowska', 'http://s.v3.tvp.pl/images/b/e/5/uid_be5c34dd6fea1d340fc2652d4343d9f21274094128011_width_650_play_0_pos_3_gs_0.jpg', 0, -1);
INSERT INTO `clients` VALUES (31, 'Evariste', 'http://upload.wikimedia.org/wikipedia/commons/5/53/Evariste_galois.jpg', 0, -1);
INSERT INTO `clients` VALUES (34, 'Ivy', 'http://www2.artflakes.com/artwork/products/258043/poster/e7149ed4a12b2af6dbdb78f76497add6.jpg', 0, -1);
INSERT INTO `clients` VALUES (33, 'Wei', 'http://www.spcnet.tv/thumbnail.php?img=http://s3.amazonaws.com/spcnet-images/images/actors/Wei-Zhao-4abfed9452bac-307.jpg&width=500&height=800', 0, -1);

-- --------------------------------------------------------

-- 
-- Table structure for table `salons`
-- 

CREATE TABLE IF NOT EXISTS `salons` (
  `id` int(11) NOT NULL auto_increment,
  `left` varchar(128) NOT NULL,
  `right` varchar(255) NOT NULL,
  `pid` int(11) NOT NULL,
  `ord` int(11) NOT NULL default '-1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

-- 
-- Dumping data for table `salons`
-- 

INSERT INTO `salons` VALUES (2, 'Nice', 'http://www.travels.com/Cms/images/GlobalPhoto/Articles/18850/289826-main_Full.jpg', 0, -1);
INSERT INTO `salons` VALUES (3, 'Ginas', 'https://www.ginaspa.com/assets/Anchor-Images-of-Servcies/_resampled/resizedimage600400-hair-salon-copy.jpg', 0, -1);
INSERT INTO `salons` VALUES (4, 'High Street', 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT6kF09rCcBjqDCMf3Qosp1q6_bgfGLRRwvg6GIzGbp-ko1cYAweApQsDbG', 0, -1);
INSERT INTO `salons` VALUES (6, 'Specjalista', 'http://www.szkola.gowork.pl/userfiles/image/technik%20us%C5%82ug%20fryzjerskich/65419287_1-Pictures-of-Wedding-Bridal-Packages-Hair-Salon.jpg', 0, -1);
INSERT INTO `salons` VALUES (7, 'Advance It', 'http://advanceit.com/blog/wp-content/uploads/2012/06/Hair-Salon-Alternative-Financing.jpg', 0, -1);
INSERT INTO `salons` VALUES (8, 'Rush', 'http://cdni.condenast.co.uk/320x360/k_n/Maybelline_V_10nov08_PR_b_1.jpg', 0, -1);
INSERT INTO `salons` VALUES (9, 'Urooj', 'http://uroojbeauty.co.uk/images/salonexample.png', 0, -1);
INSERT INTO `salons` VALUES (10, 'Adison', 'http://images.topix.com/gallery/up-B2BH7JIM02LDNPMD.jpg', 0, -1);

-- --------------------------------------------------------

-- 
-- Table structure for table `stylists`
-- 

CREATE TABLE IF NOT EXISTS `stylists` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(64) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address` varchar(255) default NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(32) default NULL,
  `ord` int(11) NOT NULL default '-1',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=latin1 AUTO_INCREMENT=41 ;

-- 
-- Dumping data for table `stylists`
-- 

INSERT INTO `stylists` VALUES (35, 'Antek', 'http://www.details.com/images/style-advice/grooming-and-health/201104/hair_stylists_sized/Getty_Antoine_harticle_embed.jpg', 0, '', '', '', -1);
INSERT INTO `stylists` VALUES (27, 'Raymond', 'http://www.details.com/images/style-advice/grooming-and-health/201104/hair_stylists_sized/Getty_Raymond_Bessone_harticle_embed.jpg', 0, '', '', '', -1);
INSERT INTO `stylists` VALUES (28, 'Vidal', 'http://www.haaretz.com/polopoly_fs/1.429315.1336609155!/image/3128092562.jpg_gen/derivatives/landscape_640/3128092562.jpg', 0, NULL, '', NULL, -1);
INSERT INTO `stylists` VALUES (34, 'Marcel', 'http://www.details.com/images/style-advice/grooming-and-health/201104/hair_stylists_sized/Getty_Marcel_Grateau_harticle_embed.jpg', 0, '', '', '', -1);
INSERT INTO `stylists` VALUES (36, 'Alexandre', 'http://www.details.com/images/style-advice/grooming-and-health/201104/hair_stylists_sized/Corbis_alexandre_de_paris_harticle_embed.jpg', 0, '', '', '', -1);
INSERT INTO `stylists` VALUES (37, 'Gene', 'http://www.details.com/images/style-advice/grooming-and-health/201104/hair_stylists_sized/everett_shampoo_gene_shacove_harticle_embed.jpg', 0, '', '', '', -1);
INSERT INTO `stylists` VALUES (38, 'Chris', 'http://www.details.com/images/style-advice/grooming-and-health/201104/hair_stylists_sized/Getty_Chris_McMillan_harticle_embed.jpg', 0, '', '', '', -1);
INSERT INTO `stylists` VALUES (39, 'Kenneth', 'http://www.details.com/images/style-advice/grooming-and-health/201104/hair_stylists_sized/Corbis_Kenneth_Battelle_harticle_embed.jpg', 0, '', '', '', -1);

-- --------------------------------------------------------

-- 
-- Table structure for table `stylists_clients`
-- 

CREATE TABLE IF NOT EXISTS `stylists_clients` (
  `id` int(11) NOT NULL,
  `rel` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `stylists_clients`
-- 

INSERT INTO `stylists_clients` VALUES (23, '{"2":{"ord":"0"},"4":{"ord":"2"},"6":{"ord":"4"},"7":{"ord":"1"},"18":{"ord":"5"},"19":{"ord":"6"}}');
INSERT INTO `stylists_clients` VALUES (24, '{"1":{"ord":"0"},"2":{"ord":"1"}}');
INSERT INTO `stylists_clients` VALUES (27, '{"1":{"ord":"0"},"10":{"ord":"0"},"15":{"ord":"0"},"21":{"ord":"8"}}');
INSERT INTO `stylists_clients` VALUES (28, '{"15":{"ord":"1"},"29":{"ord":"2"},"30":{"ord":"0"}}');
INSERT INTO `stylists_clients` VALUES (31, '{"16":{"ord":"0"}}');
INSERT INTO `stylists_clients` VALUES (29, '{"2":{"ord":"7"},"13":{"ord":"0"},"14":{"ord":"2"},"15":{"ord":"1"},"16":{"ord":"5"},"17":{"ord":"4"},"18":{"ord":"6"},"19":{"ord":"3"}}');
INSERT INTO `stylists_clients` VALUES (32, '{"2":{"ord":"4"},"12":{"ord":"2"},"14":{"ord":"3"},"15":{"ord":"1"},"17":{"ord":"0"}}');
INSERT INTO `stylists_clients` VALUES (-1, '[]');
INSERT INTO `stylists_clients` VALUES (35, '{"2":{"ord":"4"},"4":{"ord":"13"},"21":{"ord":"5"},"22":{"ord":"3"},"24":{"ord":"6"},"25":{"ord":"2"},"26":{"ord":"0"},"27":{"ord":"7"},"28":{"ord":"8"},"29":{"ord":"9"},"30":{"ord":"10"},"31":{"ord":"11"},"33":{"ord":"1"},"34":{"ord":"12"}}');
INSERT INTO `stylists_clients` VALUES (36, '{"1":{"ord":"29"},"2":{"ord":"6"},"4":{"ord":"23"},"5":{"ord":"24"},"6":{"ord":"25"},"7":{"ord":"26"},"8":{"ord":"27"},"9":{"ord":"28"},"10":{"ord":"9"},"11":{"ord":"30"},"12":{"ord":"31"},"13":{"ord":"32"},"14":{"ord":"18"},"15":{"ord":"7"},"16":{"ord":"19"},"17":{"ord":"5"},"19":{"ord":"4"},"20":{"ord":"8"},"21":{"ord":"20"},"22":{"ord":"21"},"24":{"ord":"33"},"25":{"ord":"34"},"26":{"ord":"35"},"27":{"ord":"36"},"28":{"ord":"22"},"29":{"ord":"2"},"30":{"ord":"3"},"31":{"ord":"37"},"33":{"ord":"38"},"34":{"ord":"39"}}');
INSERT INTO `stylists_clients` VALUES (34, '{"1":{"ord":"3"},"5":{"ord":"0"},"15":{"ord":"2"},"20":{"ord":"1"},"22":{"ord":"7"},"25":{"ord":"4"},"26":{"ord":"5"},"27":{"ord":"6"}}');
INSERT INTO `stylists_clients` VALUES (37, '{"4":{"ord":"1"},"6":{"ord":"2"},"9":{"ord":"3"},"33":{"ord":"0"}}');
INSERT INTO `stylists_clients` VALUES (38, '{"4":{"ord":"5"},"5":{"ord":"1"},"17":{"ord":"6"},"19":{"ord":"0"},"24":{"ord":"3"},"25":{"ord":"2"},"30":{"ord":"4"}}');
INSERT INTO `stylists_clients` VALUES (39, '{"7":{"ord":"0"},"20":{"ord":"2"},"21":{"ord":"4"},"22":{"ord":"3"},"29":{"ord":"1"}}');

-- --------------------------------------------------------

-- 
-- Table structure for table `stylists_salons`
-- 

CREATE TABLE IF NOT EXISTS `stylists_salons` (
  `id` int(11) NOT NULL,
  `rel` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `stylists_salons`
-- 

INSERT INTO `stylists_salons` VALUES (23, '{"1":{"ord":"4"},"2":{"ord":"3"},"3":{"ord":"1"},"4":{"ord":"0"},"5":{"ord":"2"}}');
INSERT INTO `stylists_salons` VALUES (24, '{"1":{"ord":"0"},"2":{"ord":"1"},"3":{"ord":"2"}}');
INSERT INTO `stylists_salons` VALUES (27, '{"2":{"ord":"0"},"8":{"ord":"1"}}');
INSERT INTO `stylists_salons` VALUES (35, '{"3":{"ord":"2"},"4":{"ord":"3"},"6":{"ord":"0"},"8":{"ord":"1"}}');
INSERT INTO `stylists_salons` VALUES (32, '{"2":{"ord":"2"},"3":{"ord":"1"},"4":{"ord":"0"}}');
INSERT INTO `stylists_salons` VALUES (36, '{"2":{"ord":"1"},"3":{"ord":"4"},"4":{"ord":"5"},"6":{"ord":"3"},"7":{"ord":"6"},"8":{"ord":"7"},"9":{"ord":"0"},"10":{"ord":"2"}}');
INSERT INTO `stylists_salons` VALUES (29, '{"1":{"ord":"8"},"3":{"ord":"0"},"10":{"ord":"9"}}');
INSERT INTO `stylists_salons` VALUES (-1, '[]');
INSERT INTO `stylists_salons` VALUES (28, '{"7":{"ord":"1"},"8":{"ord":"2"},"9":{"ord":"3"}}');
INSERT INTO `stylists_salons` VALUES (31, '{"2":{"ord":"2"},"3":{"ord":"0"},"6":{"ord":"1"}}');
INSERT INTO `stylists_salons` VALUES (34, '{"2":{"ord":"2"},"3":{"ord":"3"},"4":{"ord":"4"},"7":{"ord":"0"},"10":{"ord":"1"}}');
INSERT INTO `stylists_salons` VALUES (37, '{"4":{"ord":"1"},"7":{"ord":"2"},"9":{"ord":"0"}}');
INSERT INTO `stylists_salons` VALUES (38, '{"7":{"ord":"0"},"3":{"ord":"1"}}');
INSERT INTO `stylists_salons` VALUES (39, '{"6":{"ord":"0"},"7":{"ord":"1"},"9":{"ord":"2"}}');

-- --------------------------------------------------------

-- 
-- Table structure for table `topic`
-- 

CREATE TABLE IF NOT EXISTS `topic` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  `ord` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `topic`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `topic_article`
-- 

CREATE TABLE IF NOT EXISTS `topic_article` (
  `id` int(11) NOT NULL,
  `rel` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `topic_article`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `users`
-- 

CREATE TABLE IF NOT EXISTS `users` (
  `first` varchar(32) NOT NULL,
  `last` varchar(32) NOT NULL,
  `email` varchar(128) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `role` int(11) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `users`
-- 

INSERT INTO `users` VALUES ('tuc', 'kowski', 'tuc@kowski.com', '555-555-5555', 1, '');
