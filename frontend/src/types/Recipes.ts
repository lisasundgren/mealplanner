export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  instructions: string;
  cooking_time: number;
  portions: number;
  ingredients: Ingredient[]; // the JSON AGG-list is in here
}
