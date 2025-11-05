-- Create olympic_athletes table to store athlete information
CREATE TABLE IF NOT EXISTS olympic_athletes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    athlete_url VARCHAR(500),
    athlete_full_name VARCHAR(255),
    games_participations INT,
    first_game VARCHAR(255),
    athlete_year_birth DECIMAL(10,1),
    athlete_medals VARCHAR(255),
    bio TEXT
) DEFAULT CHARSET=utf8mb4;
