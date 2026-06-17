import express, { type Request, type Response } from 'express';
import cors from 'cors'; //
import database from './database.js';
import {
  type DbId,
  type CreateRecipeRequest,
  type AllergenRow,
  type UpdateRecipeRequest,
  type Recipe,
} from './Types.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// unknown means "I don't really know what this is yet, so before we use it TS force me to check and validate what it is before I use it."
// Promise<Respponse> forces us to send a response,we have to write 'return' on every possible ending
app.get(
  '/recipes',
  async (req: Request<void, unknown, void, void>, res: Response): Promise<Response> => {
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
      const result = await database.query<Recipe>(queryText);

      // returns the ready data to the frontend
      return res.json(result.rows);
    } catch (error: unknown) {
      console.error('Error during collection of recipe:', error);
      return res.status(500).json({ error: 'Could not collect data from the database' });
    }
  },
);

// Not used right now, might use in future
// app.get('/ingredients', async (req, res) => {
//   try {
//     const result = await database.query('SELECT * FROM ingredients ORDER BY name ASC');
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error when collecting the ingredients:', error);
//     res.status(500).json({ error: 'Could not collect ingredients from database.' });
//   }
// });

app.post(
  '/recipes',
  async (
    req: Request<
      void, // URL-parameters are not here (e.g. :id)
      unknown, // the answers body
      CreateRecipeRequest, // the interface
      void // no query-strings (?search=pasta)
    >,
    res: Response,
  ): Promise<Response> => {
    const { name, description, instructions, cooking_time, portions, ingredients } = req.body;

    // validate that all required fields are filled in, and checks that ingredients is an array.
    if (!name || !instructions || !Array.isArray(ingredients) || ingredients.length === 0) {
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
      // DbId is used here to ensure that the id will be a number, in the object.
      const recipeResult = await database.query<DbId>(recipeQuery, [
        name,
        description,
        instructions,
        cooking_time,
        portions,
      ]);

      // picks out the array .rows and since we only add 1 recipe at a time, can check at index 0, and locks in the .id row.
      // Ensures there will always be an id to check
      const recipeRow = recipeResult.rows[0];
      if (!recipeRow) {
        throw new Error('Database failed to return recipe ID');
      }
      const newRecipeId = recipeRow.id;

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

        const ingredientResult = await database.query<DbId>(ingredientQuery, [ing.name]);
        const ingredientRow = ingredientResult.rows[0];

        if (!ingredientRow) {
          throw new Error('Database failed to return ingredient ID');
        }

        const ingredientId = ingredientRow.id;

        // creates the connection in recipes_ingredients
        const linkQuery = `
      INSERT INTO recipes_ingredients (recipe_id, ingredient_id, amount, unit)
      VALUES ($1, $2, $3, $4);
      `;
        await database.query(linkQuery, [newRecipeId, ingredientId, ing.amount, ing.unit]);
      }

      // No errors, save to the database
      await database.query('COMMIT');
      return res
        .status(201)
        .json({ message: 'Recipe created succesfully!', recipeId: newRecipeId });
    } catch (error) {
      await database.query('ROLLBACK');
      console.error('Error during creation of recipe:', error);

      // We check if error is a real Error-object, then it contains a .message.
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return res.status(500).json({
        error: 'Could not create recipe',
        details: errorMessage,
      });
    }
  },
);

app.get(
  '/allergens',
  async (req: Request<void, unknown, void, void>, res: Response): Promise<Response> => {
    try {
      const result = await database.query<AllergenRow>(
        // DISTINCT checks through the entire column and only returns each allergen once
        'SELECT DISTINCT allergen FROM ingredients WHERE allergen IS NOT NULL ORDER BY allergen ASC',
      );

      const allergens = result.rows.map((row) => row.allergen);
      return res.json(allergens);
    } catch (error: unknown) {
      console.error('Error fetching allergens:', error);
      return res.status(500).json({ error: 'Could not fetch allergens' });
    }
  },
);

app.put(
  '/recipes/:id',
  async (
    req: Request<{ id: string }, unknown, UpdateRecipeRequest, void>,
    res: Response,
  ): Promise<Response> => {
    const recipeId = parseInt(req.params.id, 10);

    const { name, description, instructions, cooking_time, portions, ingredients } = req.body;

    if (!name || !instructions || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res
        .status(400)
        .json({ error: 'Missing required fields or ingredients are not an array.' });
    }
    try {
      await database.query('BEGIN');

      //  update the recipe in the recipes-table
      const recipeQuery = `
UPDATE recipes
SET name = $1, description = $2, instructions = $3, cooking_time = $4, portions = $5
WHERE id = $6
`;
      await database.query(recipeQuery, [
        name,
        description,
        instructions,
        cooking_time,
        portions,
        recipeId,
      ]);

      // instead of tracking which specific ingredient was changed and only change that one, it is easier to just delete all the ingredients in the relevant recipe and re-add all of them
      const deleteLinksQuery = `
DELETE FROM recipes_ingredients
WHERE recipe_id = $1;
`;
      await database.query(deleteLinksQuery, [recipeId]);

      // loops thorugh the new ingredients
      for (const ing of ingredients) {
        // creates an ingredient if it is new, or updates an allergen if it already exists.
        const ingredientQuery = `
INSERT INTO ingredients (name, allergen)
VALUES ($1, $2)
ON CONFLICT (name)
DO UPDATE SET allergen = excluded.allergen
RETURNING id;
  `;
        const ingredientResult = await database.query<DbId>(ingredientQuery, [
          ing.name,
          ing.allergen,
        ]);
        const ingredientRow = ingredientResult.rows[0];

        if (!ingredientRow) {
          throw new Error('Database failed to return ingredient ID');
        }

        const ingredientId = ingredientRow.id;

        // create the new link in recipes_ingredients
        const linkQuery = `
  INSERT INTO recipes_ingredients(recipe_id, ingredient_id, amount, unit)
  VALUES ($1, $2, $3, $4);
  `;
        await database.query(linkQuery, [recipeId, ingredientId, ing.amount, ing.unit]);
      }

      await database.query('COMMIT');

      // The object we send back to the frontend
      const updatedRecipe = {
        id: recipeId,
        name,
        description,
        instructions,
        cooking_time,
        portions,
        ingredients,
      };

      return res.status(200).json({
        message: 'Recipe updated',
        recipe: updatedRecipe,
      });
    } catch (error: unknown) {
      await database.query('ROLLBACK');
      console.error('Error while updating recipe', error);

      const errorMessage = error instanceof Error ? error.message : 'unknown error';
      return res.status(500).json({ error: 'could not update recipe data', details: errorMessage });
    }
  },
);

// does not touch ingredients in case other recipes need them
app.delete(
  '/recipes/:id',
  async (req: Request<{ id: string }, unknown, void, void>, res: Response): Promise<Response> => {
    const recipeId = parseInt(req.params.id, 10);

    try {
      await database.query('BEGIN');

      // remove connections for this recipe
      const deleteLinksQuery = `
  DELETE FROM recipes_ingredients
  WHERE recipe_id = $1;
  `;
      await database.query(deleteLinksQuery, [recipeId]);

      // delete the recipe itself
      const deleteRecipeQuery = `
  DELETE FROM recipes
  WHERE id = $1;
  `;
      await database.query(deleteRecipeQuery, [recipeId]);

      await database.query('COMMIT');
      console.log('Recipe deleted');
      return res.status(200).json({ message: 'Recipe deleted', id: recipeId });
    } catch (error: unknown) {
      await database.query('ROLLBACK');
      console.error('Error, delete failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'unkown error';
      return res.status(500).json({ error: 'could not delete recipe', details: errorMessage });
    }
  },
);

app.listen(PORT, () => {
  // .toString forces it into a string
  console.log(`Server live on http://localhost:${PORT.toString()}`);
});
