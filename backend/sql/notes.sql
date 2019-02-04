CREATE TABLE `notes` (
  `note_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `note` text NOT NULL,
  `date` datetime NOT NULL,
  `life_week_date` datetime NOT NULL,
  `deleted` binary(1) NOT NULL,
  PRIMARY KEY (`note_id`),
  UNIQUE KEY `note_id_UNIQUE` (`note_id`)
)