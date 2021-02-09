DROP DATABASE IF EXISTS `gecons`; 
CREATE DATABASE `gecons` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci */;
USE `gecons`;

DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_spanish_ci NOT NULL,
  `password` varchar(70) COLLATE utf8mb4_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` int(10) unsigned NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

DROP TABLE IF EXISTS `buildings`;
CREATE TABLE `buildings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_spanish_ci NOT NULL,
  `password` varchar(70) COLLATE utf8mb4_spanish_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

DROP TABLE IF EXISTS `apartments`;
CREATE TABLE `apartments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `building_id` int(10) unsigned NOT NULL,
  `name` varchar(500) COLLATE utf8mb4_spanish_ci NOT NULL,
  `description` varchar(1000) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `init_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` decimal(10,2) unsigned DEFAULT NULL,
  `document_url` varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `building_id` (`building_id`),
  CONSTRAINT `apartments_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(191) COLLATE utf8mb4_spanish_ci NOT NULL,
  `apartment_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`),
  KEY `images_ibfk_1` (`apartment_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
