import { type RecipeListProps } from '../types/Types';

const RecipeList = ({ recipes }: RecipeListProps) => {
  return (
    <div>
      <h2>Recipes ({recipes?.length || 0}) total.</h2>
      <div>
        {recipes?.length === 0 ? (
          <p>No recipes matching your search or filters.</p>
        ) : (
          recipes?.map((recipe) => (
            <div key={recipe.id}>
              <h2>{recipe.name}</h2>
              <p>
                <i>{recipe.description}</i>
              </p>
              <p>
                {recipe.cooking_time} min | {recipe.portions} portions
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeList;
