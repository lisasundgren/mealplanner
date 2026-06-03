import express, { response } from 'express';
import cors from 'cors'; //
import database from './database.js';
import { request } from 'http';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/recipes', async (req, res) => {
  try {
    // JSON_AGG creates the ingredient list
    // FROM and JOIN shows the way to the ingredients (built the routes in the SQL, here we give the direction like a GPS)
    // GROUP BY groups everything by ID and makes sure we only have 1 row of e.g. the recipe name instad of as many times as for each ingredient, JSON_AGG then puts the ingredients in its own list on the correct row.
    const queryText = `
    SELECT
    recipes.id,
    recipes.name,
    recipes.description,
    recipes.instructions,
    recipes.cooking_time,
    recipes.portions,
    JSON_AGG(
    JSON_BUILD_OBJECT(
    'name', ingredients.name,
    'amount', recipes_ingredients.amount,
    'unit', recipes_ingredients.unit,
    'allergen', ingredients.allergen
    )
    ) AS ingredients
     FROM recipes
     JOIN recipes_ingredients ON recipes.id = recipes_ingredients.recipe_id
     JOIN ingredients ON recipes_ingredients.ingredient_id = ingredients.id
     GROUP BY recipes.id`;

    // we send a question (query) to our Postgres database
    const result = await database.query(queryText);

    // returns the ready data to the frontend
    res.json(result.rows);
  } catch (error) {
    console.error('Error during collection of recipe:', error);
    res.status(500).json({ error: 'Could not collect data from the database' });
  }
});

app.get('/ingredients', async (request, res) => {
  try {
    const result = await database.query('SELECT * FROM ingredients ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error when collecting the ingredients:', error);
    res.status(500).json({ error: 'Could not collect ingredients from database.' });
  }
});

app.post('/recipes', async (req, res) => {
  const { name, description, instructions, cooking_time, portions, ingredients } = req.body;

  // validate that all required fields are filled in, and checks that ingredients is an array.
  if (!name || !instructions || !ingredients || !Array.isArray(ingredients)) {
    return res
      .status(400)
      .json({ error: 'Missing required fields or ingredients are not an array.' });
  }

  try {
    await database.query('BEGIN');

    // using $1 instead of String Interpolation we avoid that users could tamper with the SQL-code in our frontend
    // The number then matches with the index in the second argument to database.query()
    // Creates the new recipe and grabs the ID
    const recipeQuery = `
    INSERT INTO recipes (name, description, instructions, cooking_time, portions)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
    `;
    // sends the request to the database to fetch the table rows
    const recipeResult = await database.query(recipeQuery, [
      name,
      description,
      instructions,
      cooking_time,
      portions,
    ]);
    // picks out the array .rows and since we only add 1 recipe at a time, can check at index 0, and locks in the .id row.
    const newRecipeId = recipeResult.rows[0].id;

    // Loops through all the ingredients so we can use it in the frontend
    for (const ing of ingredients) {
      // checks if an ingredient already exists, otherwise it creates one
      // ON CONFLICT (name) DO UPDATE SET NAME = EXCLUDED.name by using Postgres and UNIQUE on name in the SQL we can avoid duplicates.
      // Excluded refers to the value that conflicted.
      // if there is a conflict, e.g. garlic exists, overwrite 'garlic' with 'garlic' to prevent the crash
      // We avoid using another SELECT and get the existing ID returned.
      const ingredientQuery = `
      INSERT INTO ingredients (name)
      VALUES ($1)
      ON CONFLICT (name) DO UPDATE SET NAME = EXCLUDED.name
      RETURNING id;
      `;

      const ingredientResult = await database.query(ingredientQuery, [ing.name]);
      const ingredientId = ingredientResult.rows[0].id;

      // creates the connection in recipes_ingredients
      const linkQuery = `
      INSERT INTO recipes_ingredients (recipe_id, ingredient_id, amount, unit)
      VALUES ($1, $2, $3, $4);
      `;
      await database.query(linkQuery, [newRecipeId, ingredientId, ing.amount, ing.unit]);
    }

    // No errors, save to the database
    await database.query('COMMIT');
    res.status(201).json({ message: 'Recipe created succesfully!', recipeId: newRecipeId });
  } catch (error) {
    await database.query('ROLLBACK');
    console.error('Error during creation of recipe:', error);

    // We check if error is a real Error-object, then it contains a .message.
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    res.status(500).json({
      error: 'Could not create recipe',
      details: errorMessage,
    });
  }
});

app.get('/allergens', async (req, res) => {
  try {
    const result = await database.query(
      // DISTINCT checks through the entire column and only returns each allergen once
      'SELECT DISTINCT allergen FROM ingredients WHERE allergen IS NOT NULL ORDER BY allergen ASC',
    );

    const allergens = result.rows.map((row) => row.allergen);
    res.json(allergens);
  } catch (error) {
    console.error('Error fetching allergens:', error);
    res.status(500).json({ error: 'Could not fetch allergens' });
  }
});

app.listen(PORT, () => {
  console.log(`Server live on http://localhost:${PORT}`);
});
