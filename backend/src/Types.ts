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

// backend types

// We omit ID from the recipe in our response, and same with ingredient id's and allergens
export interface CreateRecipeRequest extends Omit<Recipe, 'id' | 'ingredients'> {
  ingredients: Omit<Ingredient, 'id' | 'allergen'>[];
}

// we type the database's ID response
export interface DbId {
  id: number;
}

export interface AllergenRow {
  allergen: string;
}

export interface UpdateRecipeRequest extends Omit<Recipe, 'id' | 'ingredients'> {
  ingredients: Omit<Ingredient, 'id'>[]; // We just remove id here but keep allergens
}
