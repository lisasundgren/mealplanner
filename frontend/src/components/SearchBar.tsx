import type { ReactElement } from 'react';
import { type SearchBarProps } from '../types/Types';

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps): ReactElement => {
  return (
    <div>
      <input
        type="text"
        className="form-control"
        placeholder="Search for recipes..."
        value={searchTerm}
        onChange={(e) => {
          onSearchChange(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchBar;
