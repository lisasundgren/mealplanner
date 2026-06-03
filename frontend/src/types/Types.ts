export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  allergen: string | null;
}

export interface Recipe {
  id: number;
  name: string;
  description: string | null;
  instructions: string;
  cooking_time: number | null;
  portions: number | null;
  ingredients: Ingredient[]; // the JSON AGG-list is in here
}

export interface RecipeIngredient {
  id: number;
  recipe_id: number;
  ingredient_id: number;
  amount: number;
  unit: string;
}

// Frontend types

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export interface RecipeListProps {
  recipes: Recipe[];
}

export interface AllergenFilterProps {
  allergensList: string[]; // grabs the unique allergens from Home.tsx
  selectedAllergens: string[];
  onAllergenChange: (allergen: string) => void;
}

export interface SavedRecipe {
  recipeId: number;
  portions: number;
}

export interface RecipeContextType {
  recipes: Recipe[];
  allergens: string[];
  loading: boolean;
}
