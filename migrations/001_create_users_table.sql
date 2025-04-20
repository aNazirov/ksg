BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  balance DECIMAL
);

-- Регистрация миграции
INSERT INTO migrations(version) VALUES ('001_create_users_table');

COMMIT;
