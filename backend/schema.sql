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
    date DATE
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
    meal_type TEXT,
    FOREIGN KEY (mealplanner_id) REFERENCES mealplanner(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

INSERT INTO recipes (name, description, instructions, cooking_time, portions) VALUES
(
    'Simple Tomato Pasta',
    'A quick Italian classic made with basic pantry ingredients.',
    '1. Cook pasta. 2. Fry chopped garlic in olive oil. 3. Add canned tomatoes and basil, simmer for 10 mins. 4. Mix with pasta.',
    15,
    2
),
(
    'Easy Quesadillas',
    'Crispy tortillas filled with melted cheese and black beans.',
    '1. Mix beans with cumin. 2. Place tortilla in a dry pan, add cheese and beans on one half. 3. Fold and fry 2 mins each side.',
    10,
    2
),
(
    'Baked Salmon with Rice',
    'Healthy baked salmon served with jasmine rice and yogurt sauce.',
    '1. Bake salmon at 200C for 12-15 mins with salt and lemon. 2. Cook rice. 3. Serve together with plain yogurt.',
    20,
    2
);

INSERT INTO ingredients (name, category, allergen) VALUES
('Pasta', 'Pantry', 'Gluten'),            -- ID 1
('Chopped Tomatoes', 'Pantry', NULL),      -- ID 2
('Garlic', 'Produce', NULL),              -- ID 3
('Olive oil', 'Pantry', NULL),            -- ID 4
('Dried basil', 'Pantry', NULL),          -- ID 5
('Tortilla bread', 'Pantry', 'Gluten'),   -- ID 6
('Shredded cheese', 'Dairy', 'Lactose'),  -- ID 7
('Black beans', 'Pantry', NULL),          -- ID 8
('Cumin', 'Pantry', NULL),                -- ID 9
('Salmon fillet', 'Seafood', 'Fish'),     -- ID 10
('Jasmine rice', 'Pantry', NULL),         -- ID 11
('Butter', 'Dairy', 'Lactose'),           -- ID 12
('Plain yogurt', 'Dairy', 'Lactose');     -- ID 13


INSERT INTO mealplanner (date) VALUES
('2026-05-25'), -- Generates ID 1 (Monday)
('2026-05-26'), -- Generates ID 2 (Tuesday)
('2026-05-27'); -- Generates ID 3 (Wednesday)

INSERT INTO recipes_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
-- Simple Tomato Pasta (Recipe 1)
(1, 1, 200, 'g'),    -- Pasta
(1, 2, 400, 'g'),    -- Chopped Tomatoes
(1, 3, 2, 'pcs'),    -- Garlic
(1, 4, 1, 'tbsp'),   -- Olive oil
(1, 5, 1, 'tsp'),    -- Dried basil

-- Easy Quesadillas (Recipe 2)
(2, 6, 4, 'pcs'),    -- Tortilla bread
(2, 7, 2, 'dl'),     -- Shredded cheese
(2, 8, 1, 'can'),    -- Black beans
(2, 9, 1, 'tsp'),    -- Cumin

-- Baked Salmon with Rice (Recipe 3)
(3, 10, 2, 'pcs'),   -- Salmon fillet
(3, 11, 2, 'dl'),    -- Jasmine rice
(3, 12, 1, 'tbsp'),  -- Butter
(3, 13, 1, 'dl');    -- Plain yogurt

INSERT INTO mealplanner_recipes (mealplanner_id, recipe_id, meal_type) VALUES
-- Monday (mealplanner_id = 1)
(1, 1, 'Dinner'), -- Tomato Pasta for Dinner

-- Tuesday (mealplanner_id = 2)
(2, 1, 'Lunch'),  -- Tomato Pasta for Lunch (Leftovers!)
(2, 2, 'Dinner'), -- Quesadillas for Dinner

-- Wednesday (mealplanner_id = 3)
(3, 3, 'Dinner'); -- Baked Salmon for Dinner