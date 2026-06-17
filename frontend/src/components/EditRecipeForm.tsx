import { useState, type ReactElement } from 'react';
import { type Recipe, type Ingredient, type EditRecipeFormProps } from '../types/Types';

const EditRecipeForm = ({ recipe, onCancel, onSave }: EditRecipeFormProps): ReactElement => {
  // We check if it is an existing recipe or not
  const isCreating = recipe.id === 0;

  // local states for the fields we want to edit
  const [name, setName] = useState(recipe.name);
  const [cookingTime, setCookingTime] = useState(recipe.cooking_time);
  const [portions, setPortions] = useState(recipe.portions);
  const [description, setDescription] = useState(recipe.description);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredients);

  // we edit a specific ingredient
  const handleIngredientChange = (
    index: number,
    //   keyof is an operator that takes an object type and produces a string or numeric literal union of the objects' keys e.g. the field can be amount or unit, and their value is either a number (amount) or string (unit)
    // field refers to the input field being used for the right key in the object
    field: keyof Ingredient,
    value: string | number,
  ): void => {
    setIngredients((prevIng) =>
      prevIng.map((ing, i) =>
        // if we're on the right row, create a new object but swap the value
        i === index ? { ...ing, [field]: value } : ing,
      ),
    );
  };

  // we add a new, empty ingredient row
  const addIngredientRow = (): void => {
    const newIngredient: Ingredient = {
      id: Date.now(), // creates a temporary, unique ID
      name: '',
      amount: 0,
      unit: '',
      allergen: '',
    };
    setIngredients((prev) => [...prev, newIngredient]);
  };

  // we remove a row entirely
  const removeIngredientRow = (index: number): void => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // rebuild the updated recipe object
    const updatedRecipe: Recipe = {
      ...recipe, //We keep id and ingredients (ing updates further up)
      name,
      cooking_time: Number(cookingTime), //ensure it's a number
      portions,
      description,
      instructions,
      ingredients,
    };

    onSave(updatedRecipe);
    onCancel();
  };

  return (
    <div className="row justify-content-center">
      <form
        onSubmit={handleSubmit}
        className="w-100 p-4 bg-white rounded shadow-sm border border-light"
      >
        <h1 className="fs-3 fw-bold text-dark mb-4">
          {isCreating ? 'Add new recipe' : 'Edit recipe'}
        </h1>
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label fw-semibold text-secondary">Cooking time (min):</label>
            <input
              // on value, ?? only jumps in if the value is exactly null or undefined. || can be trigger by 0 as well, bad in Number cases.
              type="number"
              className="form-control"
              value={cookingTime ?? ''}
              onChange={(e) => {
                setCookingTime(Number(e.target.value));
              }}
            />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label fw-semibold text-secondary">Portions:</label>
            <input
              type="number"
              className="form-control"
              value={portions}
              onChange={(e) => {
                setPortions(Number(e.target.value));
              }}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">Description:</label>
          <textarea
            value={description ?? ''}
            className="form-control"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="form-label fw-semibold text-secondary d-block mb-2">
            {' '}
            Ingredients:
          </label>
          {ingredients.map((ing, index) => (
            <div
              key={index}
              className="row g-2 mb-3 mb-md-2 align-items-center bg-light bg-md-transparent p-2 p-md-0 rounded"
            >
              {/* Amount */}
              <div className="col-6 col-md-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Amount"
                  value={ing.amount || ''}
                  onChange={(e) => {
                    handleIngredientChange(index, 'amount', Number(e.target.value));
                  }}
                />
              </div>

              {/* Unit */}
              <div className="col-6 col-md-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => {
                    handleIngredientChange(index, 'unit', e.target.value);
                  }}
                />
              </div>

              {/* Name */}
              <div className="col-12 col-md-5">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ingredient's name"
                  value={ing.name}
                  onChange={(e) => {
                    handleIngredientChange(index, 'name', e.target.value);
                  }}
                />
              </div>

              {/* Allergens */}
              <div className="col-10 col-md-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Allergen?"
                  value={ing.allergen ?? ''}
                  onChange={(e) => {
                    handleIngredientChange(index, 'allergen', e.target.value);
                  }}
                />
              </div>

              {/* Remove this specific row */}
              <div className="col-2 col-md-1 text-end">
                <button
                  type="button"
                  className="btn fs-5 btn-outline-danger border-0"
                  onClick={() => {
                    removeIngredientRow(index);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-outline-primary mt-2"
            onClick={addIngredientRow}
          >
            <i className="bi bi-plus-lg me-1"></i> Add an ingredient
          </button>
        </div>
        <div className="mb-4">
          <label className="form-label fw-semibold text-secondary">Instructions:</label>
          <textarea
            value={instructions}
            className="form-control"
            onChange={(e) => {
              setInstructions(e.target.value);
            }}
            rows={6}
          />
        </div>
        <div className="d-flex gap-2 border-top pt-3">
          <button type="submit" className="btn btn-success">
            <i className="bi bi-check-lg me-1"></i> Save
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipeForm;
