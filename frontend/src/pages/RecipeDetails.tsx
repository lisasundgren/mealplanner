import { useContext, useState, type ReactElement } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RecipeContext } from '../context/RecipeContext';
import { type Recipe } from '../types/Types';
import EditRecipeForm from '../components/EditRecipeForm';

const RecipeDetails = (): ReactElement => {
  // urls are always strings
  const { id } = useParams<{ id: string }>();
  const context = useContext(RecipeContext);
  const navigate = useNavigate();
  // if false shows recipe, if true shows editing form
  const [isEditing, setIsEditing] = useState(false);

  if (!context)
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Context error...
        </div>
      </div>
    );

  const { recipes, updateRecipe, deleteRecipe } = context;

  //   converts the id to a number instead of string
  //   first value, what you want to convert
  // second value, radix, the number system we want to use. 10 = the recimal number system, what we use when we use the number 0-9.
  const recipeId = id ? parseInt(id, 10) : null;

  const recipe = recipes.find((rec: Recipe) => rec.id === recipeId);

  if (!recipe) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          Recipe not found...
        </div>
      </div>
    );
  }

  const handleDelete = async (): Promise<void> => {
    // window.confirm creates a pop up to ensure the user is sure of what they want to delete
    const confirmDelete = window.confirm(`Are you sure you want to delete ${recipe.name}?`);

    if (confirmDelete && recipeId !== null) {
      await deleteRecipe(recipeId);
      void navigate('/');
    }
  };

  if (isEditing) {
    return (
      <div className="container mt-4">
        <EditRecipeForm
          recipe={recipe}
          onCancel={() => {
            setIsEditing(false);
          }}
          onSave={updateRecipe}
        />
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Back to Recipes
        </Link>
        <button
          className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          <i className="bi bi-pencil-square"></i> Edit recipe
        </button>
      </div>
      <h1 className="fw-bold text-dark mb-2">{recipe.name}</h1>
      <div className="d-flex gap-3 text-muted small mb-4">
        <span>
          <i className="bi bi-clock me-1"></i> {recipe.cooking_time} min
        </span>
        <span>
          <i className="bi bi-people me-1"></i> {recipe.portions} portions
        </span>
      </div>

      <p className="lead text-secondary mb-4">{recipe.description}</p>
      <div className="row g-4">
        <div className="col-md-4">
          <h2 className="fw-bold mb-3">Ingredients:</h2>
          <ul>
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="py-1 border-bottom border-light">
                <span className="fw-semibold text-success">
                  {ing.amount} {ing.unit}{' '}
                </span>{' '}
                {ing.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-8">
          <h2 className="fw-bold mb-3">Instructions</h2>
          <div className="d-flex flex-column gap-3">
            {recipe.instructions ? (
              recipe.instructions
                // We clean up recipes, so if a user has added steps manually (e.g. "1. bla bla") we wont have it twice
                // cleans up a space followed by a number and a period, remove the space and make it a \n instead
                .replace(/\s+(?=\d+\.)/g, '\n')
                // \s whitespace (space by using the Tab)
                // + one or multiple characters
                // (?= ...) "lookahead" tells JS that it's ony allowed to mark the space IF what is placed immediately after matches what it says in the paranthesis
                // \d means digit
                // \. a regular period, just a period . means something different in Regex
                // /g means globally, all numbers in the text not just the first ones

                // We split each time a user uses Enter, pressing enter creates a hidden \n in the code that we use split on.
                .split('\n')
                // we remove unnecessary enter-presses, e.g. if a user has pressed Enter 3 times it would leave an empty row
                .filter((step) => step.trim() !== '')
                // loops through each section
                .map((step, index) => {
                  // We use Regex to remove numbers in the beginning, like the database already has, so if a user adds the steps manually we won't end up with "1. 1. add abc.."
                  const cleanedStep = step.replace(/^\d+\.\s*/, '');
                  // ^ means beginning of row
                  // * null or more times

                  return (
                    <div key={index} className="d-flex gap-3 align-items-start">
                      {/* generates a number for each step/enter-press */}
                      <span className="fw-bold text-danger" style={{ minWidth: '20px' }}>
                        {index + 1}
                      </span>
                      <p className="m-0 text-secondary">{cleanedStep}</p>
                    </div>
                  );
                })
            ) : (
              <p className="text-muted">No instructions available.</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5 pt-3 border-top">
        <button
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
          onClick={() => {
            void handleDelete();
          }}
        >
          Delete recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;
