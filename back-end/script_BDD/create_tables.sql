-- Script SQL pour créer les tables de la base de données Olympic
-- Base de données : marwan-ipssi_predict-jo2024
-- Compatible avec MySQL 5.7 (AlwaysData)

-- Supprimer les tables si elles existent déjà
DROP TABLE IF EXISTS olympic_results;
DROP TABLE IF EXISTS olympic_medals;
DROP TABLE IF EXISTS olympic_games;

-- Table 1: olympic_games (données pour les prédictions)
CREATE TABLE olympic_games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_year INT NOT NULL,
    country_name VARCHAR(255) NOT NULL,
    total_medals INT DEFAULT 0,
    gold_medals INT DEFAULT 0,
    silver_medals INT DEFAULT 0,
    bronze_medals INT DEFAULT 0,
    sports INT DEFAULT 0,
    epreuves INT DEFAULT 0,
    game_part INT DEFAULT 0,
    prec_game_medal INT DEFAULT 0,
    prec_game_gold INT DEFAULT 0,
    prec_game_silver INT DEFAULT 0,
    prec_game_bronze INT DEFAULT 0,
    INDEX idx_country (country_name),
    INDEX idx_year (game_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 2: olympic_medals (médailles détaillées)
CREATE TABLE olympic_medals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discipline_title VARCHAR(255),
    slug_game VARCHAR(100),
    event_title VARCHAR(255),
    event_gender VARCHAR(50),
    medal_type VARCHAR(20),
    participant_type VARCHAR(100),
    participant_title VARCHAR(255),
    athlete_url TEXT,
    athlete_full_name VARCHAR(255),
    country_name VARCHAR(255),
    country_code VARCHAR(10),
    country_3_letter_code VARCHAR(10),
    INDEX idx_slug_game (slug_game),
    INDEX idx_country_name (country_name),
    INDEX idx_medal_type (medal_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 3: olympic_results (résultats détaillés)
CREATE TABLE olympic_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discipline_title VARCHAR(255),
    event_title VARCHAR(255),
    slug_game VARCHAR(100),
    participant_type VARCHAR(100),
    medal_type VARCHAR(20),
    athletes TEXT,
    rank_equal BOOLEAN DEFAULT FALSE,
    rank_position INT,
    country_name VARCHAR(255),
    country_code VARCHAR(10),
    country_3_letter_code VARCHAR(10),
    athlete_url TEXT,
    athlete_full_name VARCHAR(255),
    value_unit VARCHAR(50),
    value_type VARCHAR(50),
    INDEX idx_slug_game (slug_game),
    INDEX idx_country_name (country_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
