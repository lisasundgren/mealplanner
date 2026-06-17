import { useState, useContext, type ReactElement } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import SearchBar from '../components/SearchBar';
import AllergenFilter from '../components/AllergenFilter';
import RecipeList from '../components/RecipeList';
import EditRecipeForm from '../components/EditRecipeForm';
import { type Recipe } from '../types/Types';

const Home = (): ReactElement => {
  const context = useContext(RecipeContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  if (!context)
    return (
      <div className="container mt-4">
        {/* role is for screen readers to ensure this error message is accessible */}
        <p className="alert alert-danger" role="alert">
          Context error...
        </p>
      </div>
    );

  const { recipes, allergens, loading, addRecipe } = context;

  const emptyRecipe: Recipe = {
    id: 0, //signals to the component that this is a new recipe
    name: '',
    description: '',
    instructions: '',
    cooking_time: 0,
    portions: 4, // default portions
    ingredients: [], // begin with an empty array
  };

  //   Prev stands for previous state and includes the list of how the checked allergens "looked" before we clicked.
  // prev.includes(allergen) checks if the allergen we just clicked already exist in the checked filters.
  // if yes, we uncheck the box. "if yes, create a new array with all the allergens but allergen a that I unchecked"
  // if no, copy everything ... in prev and add the new allergen at the end
  const handleAllergenChange = (allergen: string): void => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen],
    );
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedAllergens.length === 0) {
      return matchesSearch;
    }
    // Here we check if a recipe has a checked allergen or not, if it does it's removed from results, if not it's safe and shown.
    // .some is a built in JS-function that checks if at least one element in an array is a match to my criteria, and returns the match as true (or false if there was no match) aka is THIS allergen IN selectedAllergen true or false
    // nestled arrays, my recipes has ingredients in another array, so we use two .some
    // outer .some checks allergens the user has checked
    // inner .some loops trhough the specific recipes ingredients to see if the allergen is matched to any of the ingredients in the recipe.
    // allergen? the ? is an optional chaining and ensures that ing.allergen only checks actual values, and if it's an undefined or null value it just skips this and moves to the next step.
    const hasBlockedAllergen = selectedAllergens.some((allergen) =>
      recipe.ingredients.some((ing) => ing.allergen?.toLowerCase() === allergen.toLowerCase()),
    );

    return matchesSearch && !hasBlockedAllergen;
  });

  if (loading)
    return (
      <div className="container mt-4 placeholder-glow">
        <p className="placeholder bg-secondary opacity-15 rounded">Loading...</p>
        {/* visible while loading, switches to the recipes asap when it's done */}
      </div>
    );

  if (isAdding) {
    return (
      <div className="container mt-4">
        <EditRecipeForm
          recipe={emptyRecipe}
          onCancel={() => {
            setIsAdding(false);
          }}
          // by wrapping the function in an inline-arrow-function and using void we avoid sending the functions promise to EditRecipeForm, same as we did in RecipeList.tsx
          // updatedRecipe is in the provider
          onSave={(updatedRecipe) => {
            void addRecipe(updatedRecipe);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-dark m-0">Recipe bank</h1>
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={() => {
            setIsAdding(true);
          }}
        >
          <i className="bi bi-plus-lg"></i> Add new recipe
        </button>
      </div>
      <div className="bg-light p-3 rounded shadow-sm mb-4">
        <div className="row g-3">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <AllergenFilter
            allergensList={allergens}
            selectedAllergens={selectedAllergens}
            onAllergenChange={handleAllergenChange}
          />
        </div>
      </div>
      <hr className="my-4 text-muted" /> {/* gives a visual break */}
      <RecipeList recipes={filteredRecipes} />
    </div>
  );
};

export default Home;
