import { useState, type ReactNode } from 'react';
import { type IngredientsListProps, type CombinedIngredient } from '../types/Types';

// ReactNode is a less strict type than ReactElement, and works if there is a possibility it won't return and HTML or JSX-element (Element demands this). Node is fine with null being returned.
const IngredientsList = ({ groceryList, recipes }: IngredientsListProps): ReactNode => {
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  if (groceryList.length === 0) return null;

  // creates a large combined, list and calculate the math with the multiplier
  const allIngredients: CombinedIngredient[] = [];
  groceryList.forEach((SavedRecipe) => {
    // find the original recipe from the API
    const originalRecipe = recipes.find((r) => r.id === SavedRecipe.recipeId);

    if (originalRecipe) {
      // we use multiplicationfactor(?)
      const multiplier = SavedRecipe.portions / originalRecipe.portions;

      // loops through the ingredients froom the original recipe, and rounds it to the closest 1 decimal.
      originalRecipe.ingredients.forEach((ing) => {
        const calculatedAmount = Math.round(ing.amount * multiplier * 10) / 10;

        // combine duplicate ingredients if they already exist in allIngredients.
        // We match both name and unit to avoid issues like e.g. 3 carrots and 500g carrots combining into 503g carrots
        // two separate rows for the two units will be created instead
        const existingIngredient = allIngredients.find(
          (item) => item.name.toLowerCase() === ing.name.toLowerCase() && item.unit == ing.unit,
        );

        if (existingIngredient) {
          // if it exists, add the new amount
          existingIngredient.amount += calculatedAmount;
        } else {
          // if it doesn't exist, add as a new row in groceryList
          allIngredients.push({
            name: ing.name,
            amount: calculatedAmount,
            unit: ing.unit,
          });
        }
      });
    }
  });

  // check-function
  const toggleCheck = (ingredientName: string): void => {
    setCheckedIngredients((prev) =>
      prev.includes(ingredientName)
        ? // remove if exists
          prev.filter((name) => name !== ingredientName)
        : // Add if it doesn't
          [...prev, ingredientName],
    );
  };

  return (
    <div>
      <h2 className="fs-5 fw-bold text-secondary mb-3">Ingredients:</h2>
      <ul className="list-unstyled">
        {allIngredients.map((ing, index) => {
          const isChecked = checkedIngredients.includes(ing.name);

          return (
            <li key={index} className="mb-2">
              <label style={{ cursor: 'pointer' }} className="d-flex align-items-center">
                <input
                  type="checkbox"
                  className="me-2"
                  checked={isChecked}
                  onChange={() => {
                    toggleCheck(ing.name);
                  }}
                />
                <span
                  className={
                    isChecked ? 'text-decoration-line-through text-muted opacity-75' : 'text-dark'
                  }
                >
                  {ing.amount} {ing.unit} {ing.name}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default IngredientsList;
