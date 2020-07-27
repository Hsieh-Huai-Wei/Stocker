CREATE SCHEMA `stock` ;

USE stock;
CREATE TABLE `information`
(
`id` int (25) unsigned NOT NULL AUTO_INCREMENT,
`code` varchar (25) COLLATE utf8mb4_unicode_ci NOT NULL,
`name` varchar (50) COLLATE utf8mb4_unicode_ci NOT NULL,
`industry` varchar (500) COLLATE utf8mb4_unicode_ci,
PRIMARY KEY (`id`),
UNIQUE KEY `information` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

USE stock;
CREATE TABLE `history_price`
(
`id` int (25) unsigned NOT NULL AUTO_INCREMENT,
`stock_id` int (25) unsigned NOT NULL,
`date` int (25) COLLATE utf8mb4_unicode_ci NOT NULL,
`volume` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`open` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`high` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`low` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`close` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`changes` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`PE` float(20,5) COLLATE utf8mb4_unicode_ci,
`MC` float(20,5)  COLLATE utf8mb4_unicode_ci,
`DY` float(20,5) COLLATE utf8mb4_unicode_ci,
`PB` float(20,5) COLLATE utf8mb4_unicode_ci,
PRIMARY KEY (`id`),
UNIQUE KEY `histroy_price` (`stock_id`, `date`),
CONSTRAINT fk_stock FOREIGN KEY (stock_id) REFERENCES information (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `stock`.`history_price` 
ADD INDEX `date_index` (`date` ASC) VISIBLE;
;

USE stock;
CREATE TABLE `legal`
(
`id` int (25) unsigned NOT NULL AUTO_INCREMENT,
`stock_id` int (25) unsigned NOT NULL,
`date` int (25) COLLATE utf8mb4_unicode_ci NOT NULL,
`FD` varchar (25) COLLATE utf8mb4_unicode_ci NOT NULL,
`SITC` varchar (25) COLLATE utf8mb4_unicode_ci NOT NULL,
`Dealers` varchar (25) COLLATE utf8mb4_unicode_ci NOT NULL,
`total` varchar (25) COLLATE utf8mb4_unicode_ci NOT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `legal` (`stock_id`, `date`),
CONSTRAINT fk_legal FOREIGN KEY (stock_id) REFERENCES information (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `stock`.`legal` 
ADD INDEX `date_index` (`date` ASC) VISIBLE;
;

USE stock;
CREATE TABLE `season`
(
`id` int (25) unsigned NOT NULL AUTO_INCREMENT,
`stock_id` int (25) unsigned NOT NULL,
`season` varchar (25) COLLATE utf8mb4_unicode_ci NOT NULL,
`OPM` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`NPM` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`GM` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
PRIMARY KEY (`id`),
CONSTRAINT fk_season FOREIGN KEY (stock_id) REFERENCES information (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

USE stock;
CREATE TABLE `month`
(
`id` int (25) unsigned NOT NULL AUTO_INCREMENT,
`stock_id` int (25) unsigned NOT NULL,
`date` int (25) COLLATE utf8mb4_unicode_ci NOT NULL,
`AGR` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`LMR` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`LSMR` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`LMP` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`LSMP` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
PRIMARY KEY (`id`),
CONSTRAINT fk_month FOREIGN KEY (stock_id) REFERENCES information (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `stock`.`month` 
ADD INDEX `date_index` (`date` ASC) VISIBLE;
;

USE stock;
CREATE TABLE `history_price_week`
(
`id` int (25) unsigned NOT NULL AUTO_INCREMENT,
`stock_id` int (25) unsigned NOT NULL,
`date` int (25) COLLATE utf8mb4_unicode_ci NOT NULL,
`volume` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`open` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`high` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`low` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`close` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`changes` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`FD` float(20,5) COLLATE utf8mb4_unicode_ci,
`SITC` float(20,5) COLLATE utf8mb4_unicode_ci,
`Dealers` float(20,5) COLLATE utf8mb4_unicode_ci,
PRIMARY KEY (`id`),
UNIQUE KEY `histroy_price_week` (`stock_id`, `date`),
CONSTRAINT fk_stock_week FOREIGN KEY (stock_id) REFERENCES information (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `stock`.`history_price_week` 
ADD INDEX `date_index` (`date` ASC) VISIBLE;
;

USE stock;
CREATE TABLE `Exdivdate`
(
`id` int (25) unsigned NOT NULL AUTO_INCREMENT,
`stock_id` int (25) unsigned NOT NULL,
`ex-div-date` int (25) COLLATE utf8mb4_unicode_ci NOT NULL,
PRIMARY KEY (`id`),
UNIQUE KEY `Exdivdate` (`stock_id`, `ex-div-date`),
CONSTRAINT fk_stock_ex FOREIGN KEY (stock_id) REFERENCES information (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `stock`.`Exdivdate` 
ADD INDEX `date_index` (`ex-div-date` ASC) VISIBLE;
;

USE stock;
CREATE TABLE `fake`
(
`id` int (25) unsigned NOT NULL AUTO_INCREMENT,
`stock_id` int (25) unsigned NOT NULL,
`date` int (25) COLLATE utf8mb4_unicode_ci NOT NULL,
`volume` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`open` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`high` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`low` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`close` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
`changes` float(20,5) COLLATE utf8mb4_unicode_ci NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


`EXdivdate` int (25) COLLATE utf8mb4_unicode_ci,

USE stock;
CREATE TABLE `provider`
(
 `id` int
(25) unsigned NOT NULL AUTO_INCREMENT,
`provider` varchar
(50) COLLATE utf8mb4_unicode_ci NOT NULL,
 PRIMARY KEY
(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT *
FROM stock.provider;
INSERT INTO provider
  (provider)
VALUES
  ("native"),
  ("google");

USE stock;
CREATE TABLE `user`
(
 `id` int
(25) unsigned NOT NULL AUTO_INCREMENT,
`number` varchar
(50) COLLATE utf8mb4_unicode_ci NOT NULL,
`name` varchar
(50) COLLATE utf8mb4_unicode_ci NOT NULL,
 `email` varchar
(100) COLLATE utf8mb4_unicode_ci NOT NULL,
 `password` varchar
(50) COLLATE utf8mb4_unicode_ci,
`picture` varchar
(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`provider_id` int
(25) unsigned NOT NULL,
`access_token` varchar
(255) COLLATE utf8mb4_unicode_ci NOT NULL,
 `access_expired` varchar
(50) COLLATE utf8mb4_unicode_ci NOT NULL,
 PRIMARY KEY
(`id`),
 UNIQUE KEY `email`
(`email`),
CONSTRAINT provider FOREIGN KEY
(provider_id)
REFERENCES provider (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;