-- Gör klart diagram först
DROP TABLE IF EXISTS mealplanner_recipes CASCADE;
DROP TABLE IF EXISTS recipes_ingredients CASCADE;
DROP TABLE IF EXISTS mealplanner CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     username TEXT UNIQUE NOT NULL,
--     email TEXT UNIQUE NOT NULL,
--     password TEXT NOT NULL
-- );

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    cooking_time integer,
    portions INTEGER
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    allergen TEXT
);

CREATE TABLE mealplanner (
    id SERIAL PRIMARY KEY,
    -- user_id INTEGER NOT NULL,
    date DATE,
    meal_type TEXT,
    -- FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE recipes_ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    unit TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

CREATE TABLE mealplanner_recipes (
    id SERIAL PRIMARY KEY,
    mealplanner_id INTEGER NOT NULL,
    recipe_id INTEGER NOT NULL,
    FOREIGN KEY (mealplanner_id) REFERENCES mealplanner(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

