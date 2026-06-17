import { useContext, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeContext } from '../context/RecipeContext';
import { type RecipeListProps } from '../types/Types';

const RecipeList = ({ recipes }: RecipeListProps): ReactElement => {
  const context = useContext(RecipeContext);
  const navigate = useNavigate();

  if (!context) return <p className="text-danger">Context error...</p>;

  const { addToGroceryList } = context;

  return (
    <div>
      <h2 className="fs-4 fw-bold text-dark mb-4">Recipes ({recipes.length}) total.</h2>
      {recipes.length === 0 ? (
        <p className="text-muted italic">No recipes matching your search or filters.</p>
      ) : (
        <div className="row g-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="col-12 col-md-6">
              <div
                className="card h-100 p-3 bg-white border border-light rounded shadow-sm position-relative text-decoration-none"
                // { around our navigate ensures onClick recieves a function that returns void}
                // void-operatorn before the naviate tells lint that I'm aware of the Promise that Maps creates, and I'm ignoring it
                onClick={() => {
                  void navigate(`/recipes/${recipe.id.toString()}`);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content--between align-items-start mb-2 gap-2">
                  <h3 className="fs-5 fw-bold text-dark m-0">{recipe.name}</h3>
                  {/* e.stopPopagation stops the navigation from happening when clicking the button */}
                  <button
                    className="btn btn-outline-success btn-sm text-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToGroceryList(recipe);
                    }}
                  >
                    <i className="bi bi-plus"></i> Add to grocery list.
                  </button>
                </div>
                <div>
                  <p className="text-muted small mb-3 flex-grow-1">
                    <i>{recipe.description}</i>
                  </p>
                  <div className="d-flex gap-3 text-secondary small border-top pt-2 mt-auto">
                    <span>
                      <i className="bi bi-clock me-1"></i> {recipe.cooking_time} min
                    </span>
                    <span>
                      <i className="bi bi-people me-1"></i> {recipe.portions} portions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
