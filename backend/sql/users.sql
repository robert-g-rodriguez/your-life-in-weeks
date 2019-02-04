CREATE TABLE `life_in_weeks`.`Users` (
  `id` INT ZEROFILL NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `birthdate` DATETIME NOT NULL,
  PRIMARY KEY (`id`));