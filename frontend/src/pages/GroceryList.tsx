import { useContext, type ReactElement } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import SelectedRecipesList from '../components/SelectedRecipesList';
import IngredientsList from '../components/IngredientsList';

const GroceryList = (): ReactElement => {
  const context = useContext(RecipeContext);

  if (!context) return <p>Context error...</p>;

  // we grab what we need from our data-sources
  const { groceryList, recipes, increasePortions, decreasePortions, removeFromGroceryList } =
    context;

  return (
    <div className="container my-4">
      <h1 className="fw-bold mb-4">My grocery list</h1>
      <SelectedRecipesList
        // left is the label, the prop
        // right is the content, the function
        groceryList={groceryList}
        increasePortions={increasePortions}
        decreasePortions={decreasePortions}
        removeFromGroceryList={removeFromGroceryList}
      />

      <IngredientsList groceryList={groceryList} recipes={recipes} />
    </div>
  );
};

export default GroceryList;
