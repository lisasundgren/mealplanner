import { createContext } from 'react';
import { type RecipeContextType } from '../types/Types';

export const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [allergens, setAllergens] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // We catch two endpoints to get both recipes and allergens
//         const [recipesResponse, allergensResponse] = await Promise.all([
//           fetch('http://localhost:3000/recipes'),
//           fetch('http://localhost:3000/allergens'),
//         ]);
//         if (!recipesResponse.ok || !allergensResponse.ok) {
//           throw new Error('Could not load the data.');
//         }
//         const recipesData = await recipesResponse.json();
//         const allergensData = await allergensResponse.json();

//         setRecipes(recipesData); //saves the data in our state
//         setAllergens(allergensData);
//       } catch (error) {
//         console.error('Error while catching:', error);
//       } finally {
//         //finally tells the code to do this no matter what has ahppened, the React knows the wait is over.
//         setLoading(false); //Turns of the loading
//       }
//     }

//     fetchData();
//   }, []); //runs only once when the page loads

//   return (
//     <RecipeContext.Provider value={{ recipes, allergens, loading }}>
//       {children}
//     </RecipeContext.Provider>
//   );
// };
