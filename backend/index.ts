import express from 'express';
import database from './database.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// EN TEST-ROUTE FÖR ATT HÄMTA RECEPT
app.get('/api/recipes', async (req, res) => {
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
    'unit', recipes_ingredients.unit
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
    console.error('Fel vid hämtning av recept:', error);
    res.status(500).json({ error: 'Kunde inte hämta data från databasen' });
  }
});

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
