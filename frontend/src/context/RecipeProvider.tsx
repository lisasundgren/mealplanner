import React, { useState, useEffect } from 'react';
import { type Recipe } from '../types/Types';
import { RecipeContext } from './RecipeContext';

export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [recipesResponse, allergensResponse] = await Promise.all([
          fetch('http://localhost:3000/recipes'),
          fetch('http://localhost:3000/allergens'),
        ]);
        if (!recipesResponse.ok || !allergensResponse.ok) {
          throw new Error('Could not load the data.');
        }
        const recipesData = await recipesResponse.json();
        const allergensData = await allergensResponse.json();

        setRecipes(recipesData);
        setAllergens(allergensData);
      } catch (error) {
        console.error('Error while catching:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, allergens, loading }}>
      {children}
    </RecipeContext.Provider>
  );
};
