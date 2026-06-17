import React, { useState, useEffect, type ReactElement } from 'react';
import { type SavedRecipe, type Recipe } from '../types/Types';
import { RecipeContext } from './RecipeContext';

export const RecipeProvider = ({ children }: { children: React.ReactNode }): ReactElement => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [groceryList, setGroceryList] = useState<SavedRecipe[]>([]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const [recipesResponse, allergensResponse] = await Promise.all([
          fetch('http://localhost:3000/recipes'),
          fetch('http://localhost:3000/allergens'),
        ]);
        if (!recipesResponse.ok || !allergensResponse.ok) {
          throw new Error('Could not load the data.');
        }

        // Type Assertion by putting Recipe[] and string[]
        const recipesData = (await recipesResponse.json()) as Recipe[];
        const allergensData = (await allergensResponse.json()) as string[];

        setRecipes(recipesData);
        setAllergens(allergensData);
      } catch (error) {
        console.error('Error while catching:', error);
      } finally {
        setLoading(false);
      }
    }

    // void used, we are aware and turn on the function anyway
    void fetchData();
  }, []);

  const addToGroceryList = (recipe: Recipe): void => {
    setGroceryList((prev) => {
      // we double check if the recipe already exist in the list (which it should if we use the plus on GrocerList page)
      const existingRecipe = prev.find((item) => item.recipeId === recipe.id);

      // if it does, loop thorugh the list and increase this specific recipes' ingredients based on the portions
      //  : item at the end means if the recipe isn't a match, we return th object as it is
      if (existingRecipe) {
        return prev.map((item) =>
          item.recipeId === recipe.id
            ? // adds to the original portions
              { ...item, portions: item.portions + recipe.portions }
            : item,
        );
      }
      // if it doesn't (when we first add it on the Home-page), create a new object
      return [...prev, { recipeId: recipe.id, name: recipe.name, portions: recipe.portions }];
    });
  };

  // a function that helps fins the original portions based on a recipe
  // if portions can't be found we default them to 4
  const getOriginalPortions = (recipeId: number): number => {
    const original = recipes.find((r) => r.id === recipeId);
    return original ? original.portions : 4; // Standard till 4 om det inte hittas
  };

  const increasePortions = (recipeId: number): void => {
    const originalPortions = getOriginalPortions(recipeId);

    setGroceryList((prev) =>
      prev.map((item) =>
        item.recipeId === recipeId ? { ...item, portions: item.portions + originalPortions } : item,
      ),
    );
  };

  // if portions reach 0 and below it gets removed from grocerylist
  const decreasePortions = (recipeId: number): void => {
    const originalPortions = getOriginalPortions(recipeId);

    setGroceryList((prev) =>
      prev
        .map((item) =>
          item.recipeId === recipeId
            ? { ...item, portions: item.portions - originalPortions }
            : item,
        )
        .filter((item) => item.portions > 0),
    );
  };

  const removeFromGroceryList = (recipeId: number): void => {
    setGroceryList((prev) => prev.filter((item) => item.recipeId !== recipeId));
  };

  const updateRecipe = async (updatedRecipe: Recipe): Promise<void> => {
    try {
      // We send the data to our backend
      const response = await fetch(`http://localhost:3000/recipes/${updatedRecipe.id.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
      });

      // If the server crashes, stop function
      if (!response.ok) {
        throw new Error('Could not update recipe on the server');
      }

      const data = (await response.json()) as { recipe: Recipe };
      const savedRecipe: Recipe = data.recipe;

      // We update the local state så we can see the new changes on the screeen
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) => (recipe.id === savedRecipe.id ? savedRecipe : recipe)),
      );
      console.log('Recipe saved in backend');
    } catch (error) {
      console.error('Error with fetch in updateRecipe:', error);
      alert('Changes not saved.');
    }
  };

  const addRecipe = async (newRecipeData: Omit<Recipe, 'id'>): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipeData),
      });

      // get the response from the backend
      const data = (await response.json()) as { recipeId: number };

      // build the complete reciope object
      const completeRecipe: Recipe = {
        ...newRecipeData,
        id: data.recipeId, // the id comes from the RETURNING id in SQL-queries in index.ts
      };

      // Update the state so the new recipe is visible
      setRecipes((prevRecipes) => [...prevRecipes, completeRecipe]);

      console.log('New recipe added in database and state');
    } catch (error) {
      console.error('Error when adding new recipe', error);
      alert('Error when trying to create new recipe');
    }
  };

  const deleteRecipe = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/recipes/${id.toString()}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Could not delete recipe from server');
      }

      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
      console.log('Recipe deleted from server and state');
    } catch (error) {
      console.error('Error when trying to delete', error);
      alert('Delete failed');
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        allergens,
        loading,
        groceryList,
        addToGroceryList,
        increasePortions,
        decreasePortions,
        removeFromGroceryList,
        updateRecipe: (recipe) => {
          void updateRecipe(recipe);
        },
        deleteRecipe,
        addRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
