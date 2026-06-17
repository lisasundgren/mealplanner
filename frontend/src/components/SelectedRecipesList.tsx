import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { type SelectedRecipesListProps } from '../types/Types';

const SelectedRecipesList = ({
  groceryList,
  increasePortions,
  decreasePortions,
  removeFromGroceryList,
}: SelectedRecipesListProps): ReactElement => {
  const navigate = useNavigate();

  if (groceryList.length === 0) {
    return <p className="text-muted italic">No recipes added to the list yet</p>;
  }

  return (
    <div>
      <h2 className="fs-5 fw-bold text-secondary mb-3">Selected recipes:</h2>
      <ul className="list-unstyled d-flex flex-column gap-2">
        {groceryList.map((recipe) => (
          <li
            key={recipe.recipeId}
            className="d-flex justify-content-between align-items-center p-2 rounded bg-light border-bottom border-white"
          >
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                void navigate(`/recipes/${recipe.recipeId.toString()}`);
              }}
            >
              <strong className="text-dark">{recipe.name}</strong>
              <span className="text-muted small ms-2"> - {recipe.portions} portions</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <button
                className="btn btn-sm btn-white border px-2 py-1 d-flex align-items-center"
                onClick={() => {
                  decreasePortions(recipe.recipeId);
                }}
              >
                <i className="bi bi-dash"></i>{' '}
              </button>
              <button
                className="btn btn-sm btn-white border px-2 py-1 d-flex align-items-center"
                onClick={() => {
                  increasePortions(recipe.recipeId);
                }}
              >
                <i className="bi bi-plus"></i> {/* Plus-ikonen */}{' '}
              </button>
              <button
                className="btn btn-sm btn-link text-danger text-decoration-none ms-2"
                onClick={() => {
                  removeFromGroceryList(recipe.recipeId);
                }}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedRecipesList;
