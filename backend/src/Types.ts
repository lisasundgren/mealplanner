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
