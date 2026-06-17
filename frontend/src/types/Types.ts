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
  portions: number;
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
  name: string;
  portions: number;
}

export interface RecipeContextType {
  recipes: Recipe[];
  allergens: string[];
  loading: boolean;
  groceryList: SavedRecipe[];
  addToGroceryList: (recipe: Recipe) => void;
  increasePortions: (recipeId: number) => void;
  decreasePortions: (recipeId: number) => void;
  removeFromGroceryList: (recipeId: number) => void;
  updateRecipe: (updatedRecipe: Recipe) => void;
  deleteRecipe: (id: number) => Promise<void>;
  addRecipe: (newRecipe: Omit<Recipe, 'id'>) => Promise<void>;
}

export interface SelectedRecipesListProps {
  groceryList: SavedRecipe[];
  increasePortions: (id: number) => void;
  decreasePortions: (id: number) => void;
  removeFromGroceryList: (id: number) => void;
}

export interface IngredientsListProps {
  groceryList: SavedRecipe[];
  recipes: Recipe[];
}

// an internal interface for the ingredients on the GroceryList screen
export interface CombinedIngredient {
  name: string;
  amount: number;
  unit: string;
}

export interface EditRecipeFormProps {
  recipe: Recipe;
  onCancel: () => void;
  onSave: (updatedRecipe: Recipe) => void;
}
