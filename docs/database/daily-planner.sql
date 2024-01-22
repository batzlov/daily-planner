-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Erstellungszeit: 22. Jan 2024 um 13:12
-- Server-Version: 5.7.39
-- PHP-Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `daily-planner`
--
CREATE DATABASE IF NOT EXISTS `daily-planner` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `daily-planner`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `title` longtext NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `share_todo_list_with_users`
--

CREATE TABLE `share_todo_list_with_users` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `todo_list_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todos`
--

CREATE TABLE `todos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `title` longtext NOT NULL,
  `description` longtext NOT NULL,
  `completed` tinyint(1) DEFAULT NULL,
  `order` bigint(20) UNSIGNED NOT NULL,
  `todo_list_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todo_lists`
--

CREATE TABLE `todo_lists` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `title` longtext NOT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `first_name` longtext NOT NULL,
  `last_name` longtext NOT NULL,
  `password` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_categories_deleted_at` (`deleted_at`);

--
-- Indizes für die Tabelle `share_todo_list_with_users`
--
ALTER TABLE `share_todo_list_with_users`
  ADD PRIMARY KEY (`user_id`,`todo_list_id`),
  ADD KEY `fk_share_todo_list_with_users_todo_list` (`todo_list_id`);

--
-- Indizes für die Tabelle `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_todos_deleted_at` (`deleted_at`),
  ADD KEY `fk_todo_lists_todos` (`todo_list_id`),
  ADD KEY `fk_todos_category` (`category_id`);

--
-- Indizes für die Tabelle `todo_lists`
--
ALTER TABLE `todo_lists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_todo_lists_deleted_at` (`deleted_at`),
  ADD KEY `fk_users_todo_lists` (`created_by`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_deleted_at` (`deleted_at`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `todos`
--
ALTER TABLE `todos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `todo_lists`
--
ALTER TABLE `todo_lists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `share_todo_list_with_users`
--
ALTER TABLE `share_todo_list_with_users`
  ADD CONSTRAINT `fk_share_todo_list_with_users_todo_list` FOREIGN KEY (`todo_list_id`) REFERENCES `todo_lists` (`id`),
  ADD CONSTRAINT `fk_share_todo_list_with_users_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints der Tabelle `todos`
--
ALTER TABLE `todos`
  ADD CONSTRAINT `fk_todo_lists_todos` FOREIGN KEY (`todo_list_id`) REFERENCES `todo_lists` (`id`),
  ADD CONSTRAINT `fk_todos_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints der Tabelle `todo_lists`
--
ALTER TABLE `todo_lists`
  ADD CONSTRAINT `fk_users_todo_lists` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `deleted_at`, `email`, `first_name`, `last_name`, `password`) VALUES
(1, NOW(), NOW(), NULL, 'max.mustermann@example.com', 'Max', 'Mustermann', 'pass123'),
(2, NOW(), NOW(), NULL, 'maria.musterfrau@example.com', 'Maria', 'Musterfrau', 'pass456'),
(3, NOW(), NOW(), NULL, 'johann.schmidt@example.com', 'Johann', 'Schmidt', 'pass789'),
(4, NOW(), NOW(), NULL, 'lisa.bauer@example.com', 'Lisa', 'Bauer', 'pass101'),
(5, NOW(), NOW(), NULL, 'tobias.gruber@example.com', 'Tobias', 'Gruber', 'pass102');

INSERT INTO `categories` (`created_at`, `updated_at`, `deleted_at`, `title`, `created_by`) VALUES
(NOW(), NOW(), NULL, 'Gesundheit', 0),
(NOW(), NOW(), NULL, 'Fitness', 0),
(NOW(), NOW(), NULL, 'Bildung', 0),
(NOW(), NOW(), NULL, 'Kochen', 0),
(NOW(), NOW(), NULL, 'Reisen', 0),
(NOW(), NOW(), NULL, 'Hobbys', 0),
(NOW(), NOW(), NULL, 'Musik', 0),
(NOW(), NOW(), NULL, 'Kunst', 0),
(NOW(), NOW(), NULL, 'Finanzen', 0),
(NOW(), NOW(), NULL, 'Shopping', 0),
(NOW(), NOW(), NULL, 'Soziales', 0),
(NOW(), NOW(), NULL, 'Beruf', 0),
(NOW(), NOW(), NULL, 'Haushalt', 0),
(NOW(), NOW(), NULL, 'Gartenarbeit', 0),
(NOW(), NOW(), NULL, 'Technologie', 0),
(NOW(), NOW(), NULL, 'Persönliche Projekte', 1),
(NOW(), NOW(), NULL, 'Wochenziele', 1),
(NOW(), NOW(), NULL, 'Persönliche Projekte', 2),
(NOW(), NOW(), NULL, 'Wochenziele', 2),
(NOW(), NOW(), NULL, 'Persönliche Projekte', 3),
(NOW(), NOW(), NULL, 'Wochenziele', 3),
(NOW(), NOW(), NULL, 'Persönliche Projekte', 4),
(NOW(), NOW(), NULL, 'Wochenziele', 4),
(NOW(), NOW(), NULL, 'Persönliche Projekte', 5),
(NOW(), NOW(), NULL, 'Wochenziele', 5);

INSERT INTO `todo_lists` (`created_at`, `updated_at`, `deleted_at`, `title`, `deleted`, `created_by`) VALUES
(NOW(), NOW(), NULL, 'Einkaufsliste', 0, 1),
(NOW(), NOW(), NULL, 'Projektaufgaben', 0, 1),
(NOW(), NOW(), NULL, 'Fitnessziele', 0, 1),
(NOW(), NOW(), NULL, 'Buchliste', 0, 1),
(NOW(), NOW(), NULL, 'Reiseplanung', 0, 2),
(NOW(), NOW(), NULL, 'Wochenendaktivitäten', 0, 2),
(NOW(), NOW(), NULL, 'Haushaltsaufgaben', 0, 3),
(NOW(), NOW(), NULL, 'Lernziele', 0, 3),
(NOW(), NOW(), NULL, 'Arbeitsziele', 0, 4),
(NOW(), NOW(), NULL, 'Freizeitaktivitäten', 0, 4),
(NOW(), NOW(), NULL, 'Gartenarbeit', 0, 5),
(NOW(), NOW(), NULL, 'Kochrezepte', 0, 5);

INSERT INTO `todos` (`created_at`, `updated_at`, `deleted_at`, `title`, `description`, `completed`, `order`, `todo_list_id`, `category_id`) VALUES
(NOW(), NOW(), NULL, 'Milch kaufen', '1 Liter Bio-Milch', 0, 1, 1, 1),
(NOW(), NOW(), NULL, 'Brot kaufen', 'Vollkornbrot', 0, 2, 1, 1),
(NOW(), NOW(), NULL, 'Butter besorgen', 'Bio-Butter', 0, 3, 1, 1),
(NOW(), NOW(), NULL, 'Äpfel holen', 'Frische Äpfel', 0, 4, 1, 1),
(NOW(), NOW(), NULL, 'Käse kaufen', 'Verschiedene Käsesorten', 0, 5, 1, 1),
(NOW(), NOW(), NULL, 'Tomaten besorgen', 'Frische Tomaten', 0, 6, 1, 1),
(NOW(), NOW(), NULL, 'Kaffee kaufen', 'Bio-Kaffee', 0, 7, 1, 1),
(NOW(), NOW(), NULL, 'Projektplan aktualisieren', 'Aktualisierung des Zeitplans', 0, 1, 2, 2),
(NOW(), NOW(), NULL, 'Meeting organisieren', 'Meeting mit dem Team', 0, 2, 2, 2),
(NOW(), NOW(), NULL, 'Budget überprüfen', 'Budget für das nächste Quartal', 0, 3, 2, 2),
(NOW(), NOW(), NULL, 'Bericht fertigstellen', 'Abschlussbericht für das Projekt', 0, 4, 2, 2),
(NOW(), NOW(), NULL, 'Präsentation vorbereiten', 'Projektpräsentation erstellen', 0, 5, 2, 2),
(NOW(), NOW(), NULL, 'Joggen gehen', '30 Minuten joggen', 0, 1, 3, 3),
(NOW(), NOW(), NULL, 'Yoga-Session', 'Yoga am Morgen', 0, 2, 3, 3),
(NOW(), NOW(), NULL, 'Fitnessstudio anmelden', 'Mitgliedschaft im Fitnessstudio', 0, 3, 3, 3),
(NOW(), NOW(), NULL, '1984 lesen', 'George Orwell', 0, 1, 4, 4),
(NOW(), NOW(), NULL, 'Die Verwandlung lesen', 'Franz Kafka', 0, 2, 4, 4);

INSERT INTO `share_todo_list_with_users` (`user_id`, `todo_list_id`) VALUES
(1, 5),
(2, 1),
(3, 4);


COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
