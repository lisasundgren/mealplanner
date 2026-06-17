import type { ReactElement } from 'react';
import { type AllergenFilterProps } from '../types/Types';

const AllergenFilter = ({
  allergensList,
  selectedAllergens,
  onAllergenChange,
}: AllergenFilterProps): ReactElement => {
  return (
    <div>
      <h2 className="fw-bold text-muted fs-5 mb-2">Filter allergens:</h2>
      {allergensList.length === 0 ? (
        <p className="fw-bold text-muted mb-2">No allergens found</p>
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {allergensList.map((allergen) => (
            <div key={allergen} className="form-check">
              <label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedAllergens.includes(allergen)}
                  onChange={() => {
                    onAllergenChange(allergen);
                  }}
                />
                {allergen}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AllergenFilter;
