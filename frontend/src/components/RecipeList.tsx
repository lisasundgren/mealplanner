import { useEffect, useState } from 'react';
import { type Recipe } from '../types/Recipes';

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch('http://localhost:3000/recipes');
        if (!response.ok) {
          throw new Error("Couldn't load the recipes.");
        }
        const data = await response.json();
        setRecipes(data); //saves the data in our state
      } catch (error) {
        console.error('Error while catching:', error);
      } finally {
        //finally tells the code to do this no matter what has ahppened, the React knows the wait is over.
        setLoading(false); //Turns of the loading
      }
    }

    fetchRecipes();
  }, []); //runs only once when the page loads

  if (loading) return <p>Loading the recipes...</p>; //visible while loading, switches to the recipes asap when it's done

  return (
    <div>
      <h1>All the recipes</h1>
      <div>
        {recipes.map((recipe) => (
          <div key={recipe.id}>
            <h2>{recipe.name}</h2>
            <p>
              <i>{recipe.description}</i>
            </p>
            <p>
              {recipe.cooking_time} min | {recipe.portions} portions
            </p>

            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients.map((ing, index) => (
                <li key={index}>
                  {ing.amount} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            <p>{recipe.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
