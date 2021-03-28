CREATE DATABASE IF NOT EXISTS `users`;

CREATE TABLE IF NOT EXISTS `users`.`users`
(
    `id`        int(10) unsigned NOT NULL AUTO_INCREMENT,
    `firstName` varchar(50)      NOT NULL,
    `lastName`  varchar(50)      NOT NULL,
    `email`     varchar(50)      NOT NULL,
    `pass`      varchar(50)      NOT NULL,
    `isAdmin`   tinyint(1)       NOT NULL,
    `token`     varchar(50)      NOT NULL,
    PRIMARY KEY (`id`),
    KEY `id_IDX` (`id`)
);

CREATE TABLE IF NOT EXISTS `users`.`tables`
(
    `id`       int(10) unsigned NOT NULL AUTO_INCREMENT,
    `database` varchar(50)      NOT NULL,
    `table`    varchar(50)      NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `test` (`database`, `table`),
    KEY `id_IDX` (`id`)
);

CREATE TABLE IF NOT EXISTS `users`.`usersTables`
(
    `user_id`  int(10) unsigned NOT NULL,
    `table_id` int(10) unsigned NOT NULL,
    PRIMARY KEY (`user_id`, `table_id`),
    KEY `user_id` (`user_id`),
    KEY `table_id` (`table_id`),
    CONSTRAINT `FK_table` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`) ON DELETE CASCADE,
    CONSTRAINT `FK_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);