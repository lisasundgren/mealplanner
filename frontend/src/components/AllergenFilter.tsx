import { type AllergenFilterProps } from '../types/Types';

const AllergenFilter = ({
  allergensList,
  selectedAllergens,
  onAllergenChange,
}: AllergenFilterProps) => {
  return (
    <div>
      <h3>Filter allergens:</h3>
      {allergensList.length === 0 ? (
        <p>No allergens found</p>
      ) : (
        <div>
          {allergensList.map((allergen) => (
            <label key={allergen}>
              <input
                type="checkbox"
                checked={selectedAllergens.includes(allergen)}
                onChange={() => onAllergenChange(allergen)}
              />
              {allergen}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
export default AllergenFilter;
