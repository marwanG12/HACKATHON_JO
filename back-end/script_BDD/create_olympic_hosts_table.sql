-- Create olympic_hosts table to store Olympic Games host information
CREATE TABLE IF NOT EXISTS olympic_hosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `index` INT,
    game_slug VARCHAR(255),
    game_end_date VARCHAR(255),
    game_start_date VARCHAR(255),
    game_location VARCHAR(255),
    game_name VARCHAR(255),
    game_season VARCHAR(50),
    game_year INT
) DEFAULT CHARSET=utf8mb4;
