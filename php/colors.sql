CREATE TABLE IF NOT EXISTS colors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  hex_value VARCHAR(7) NOT NULL UNIQUE
);

INSERT IGNORE INTO colors (name, hex_value) VALUES
('Red', '#FF0000'),
('Blue', '#0000FF'),
('Green', '#008000'),
('Yellow', '#FFFF00'),
('Orange', '#FFA500'),
('Purple', '#800080'),
('Black', '#000000'),
('White', '#FFFFFF'),
('Brown', '#A52A2A'),
('Pink', '#FFC0CB');
