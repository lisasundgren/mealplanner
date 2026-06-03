import { type SearchBarProps } from '../types/Types';

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search for recipes..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
