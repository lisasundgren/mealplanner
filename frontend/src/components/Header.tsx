import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/">Home men logga!</Link>
        <div>
          <Link to="/">Home</Link>
          <Link to="grocerylist">Grocery List</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
