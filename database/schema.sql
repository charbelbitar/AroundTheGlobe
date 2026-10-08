CREATE DATABASE IF NOT EXISTS around_the_globe
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE around_the_globe;


CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(100) NOT NULL UNIQUE,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,

    airline VARCHAR(100) NOT NULL,

    departure_airport VARCHAR(100) NOT NULL,
    arrival_airport VARCHAR(100) NOT NULL,

    departure_date DATETIME NOT NULL,
    arrival_date DATETIME NOT NULL,

    price DECIMAL(10,2) NOT NULL,
    available_seats INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_flight_price
        CHECK (price >= 0),

    CONSTRAINT chk_available_seats
        CHECK (available_seats >= 0),

    CONSTRAINT chk_flight_dates
        CHECK (arrival_date > departure_date)
);


CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    flight_id INT NOT NULL,

    seat_number VARCHAR(10),

    booking_status ENUM('confirmed', 'cancelled')
        NOT NULL DEFAULT 'confirmed',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_booking_flight
        FOREIGN KEY (flight_id)
        REFERENCES flights(flight_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE password_reset_tokens (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


CREATE INDEX idx_flights_route
    ON flights(departure_airport, arrival_airport);

CREATE INDEX idx_flights_departure_date
    ON flights(departure_date);

CREATE INDEX idx_bookings_user_id
    ON bookings(user_id);

CREATE INDEX idx_bookings_flight_id
    ON bookings(flight_id);

CREATE INDEX idx_password_reset_token
    ON password_reset_tokens(token_hash);