import { useState, useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import SearchBar from '../components/SearchBar';
import AllergenFilter from '../components/AllergenFilter';
import RecipeList from '../components/RecipeList';

const Home = () => {
  const context = useContext(RecipeContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);

  if (!context) return <p>Context error...</p>;

  const { recipes, allergens, loading } = context;

  //   Prev stands for previous state and includes the list of how the checked allergens "looked" before we clicked.
  // prev.includes(allergen) checks if the allergen we just clicked already exist in the checked filters.
  // if yes, we uncheck the box. "if yes, create a new array with all the allergens but allergen a that I unchecked"
  // if no, copy everything ... in prev and add the new allergen at the end
  const handleAllergenChange = (allergen: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen],
    );
  };

  //   A failsafe if anything would be undefined, an empty array is used instead.
  const filteredRecipes = (recipes || []).filter((recipe) => {
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

  if (loading) return <p>Loading...</p>; //visible while loading, switches to the recipes asap when it's done

  return (
    <div>
      <h1>Recipe bank</h1>
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <AllergenFilter
        allergensList={allergens}
        selectedAllergens={selectedAllergens}
        onAllergenChange={handleAllergenChange}
      />
      <hr /> {/* gives a visual break */}
      <RecipeList recipes={filteredRecipes} />
    </div>
  );
};

export default Home;
