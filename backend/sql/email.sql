CREATE TABLE `life_in_weeks`.`email` (
  `email_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `email_address` VARCHAR(45) NOT NULL,
  `confirmed` BINARY(1) NOT NULL DEFAULT 0,
  `is_default_address` BINARY(1) NOT NULL,
  PRIMARY KEY (`email_id`));