CREATE DATABASE IF NOT EXISTS calendar_app;
USE calendar_app;

-- TABLE USER
CREATE TABLE users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(60) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (id)
) AUTO_INCREMENT=1;

DESCRIBE users;

-- TABLE EVENTS
CREATE TABLE events (
  id INT(11) NOT NULL AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  notes TEXT,
  start datetime NOT NULL,
  end datetime NOT NULL,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
  PRIMARY KEY (id)
) AUTO_INCREMENT=1;

DESCRIBE events;

