CREATE TABLE `life_in_weeks`.`events` (
  `event_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `start_date` DATETIME NOT NULL,
  `life_week_start` DATETIME NOT NULL,
  `end_date` DATETIME NULL,
  `life_week_end` DATETIME NULL,
  `title` VARCHAR(45) NOT NULL,
  `description` TINYTEXT NOT NULL,
  `event_type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`event_id`));
