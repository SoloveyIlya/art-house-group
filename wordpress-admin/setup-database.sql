-- Create database for Art House WordPress
CREATE DATABASE IF NOT EXISTS arthouse_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user for WordPress (if not exists)
CREATE USER IF NOT EXISTS 'arthouse_user'@'localhost' IDENTIFIED BY 'arthouse_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON arthouse_wp.* TO 'arthouse_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE arthouse_wp;

-- Create sample products table structure (WordPress will create its own tables)
-- This is just for reference
CREATE TABLE IF NOT EXISTS sample_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    area VARCHAR(50),
    capacity VARCHAR(50),
    power VARCHAR(50),
    dimensions VARCHAR(100),
    weight VARCHAR(50),
    description TEXT,
    image_url VARCHAR(500),
    external_protection TEXT,
    guest_control TEXT,
    accessories TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO sample_products (title, price, area, capacity, power, dimensions, weight, description, external_protection, guest_control, accessories) VALUES
('Space Capsule House G30', 14200.00, '30 м²', '2-4 чел.', '5 кВт', '6.0×5.0×2.8 м', '2.5 тонны', 'Модель G30 из серии Galaxy предлагает современное компактное решение для жизни.', 
'Система видеонаблюдения|Датчики движения|Сигнализация|Освещение периметра', 
'Умный домофон|Контроль доступа|Мобильное приложение|Уведомления', 
'Мебель в комплекте|Бытовая техника|Система отопления|Кондиционирование'),
('Space Capsule House G40', 18500.00, '40 м²', '3-5 чел.', '7 кВт', '8.0×5.0×2.8 м', '3.2 тонны', 'Увеличенная модель G40 с дополнительным пространством и комфортом.', 
'Система видеонаблюдения|Датчики движения|Сигнализация|Освещение периметра|Защитные решетки', 
'Умный домофон|Контроль доступа|Мобильное приложение|Уведомления|Биометрический доступ', 
'Мебель в комплекте|Бытовая техника|Система отопления|Кондиционирование|Солнечные панели'),
('Space Capsule House G50', 22500.00, '50 м²', '4-6 чел.', '10 кВт', '10.0×5.0×2.8 м', '4.0 тонны', 'Просторная модель G50 для больших семей.', 
'Система видеонаблюдения|Датчики движения|Сигнализация|Освещение периметра|Защитные решетки|Система пожаротушения', 
'Умный домофон|Контроль доступа|Мобильное приложение|Уведомления|Биометрический доступ|Система распознавания лиц', 
'Мебель в комплекте|Бытовая техника|Система отопления|Кондиционирование|Солнечные панели|Система очистки воды');
