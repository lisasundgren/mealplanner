import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

const Header = (): ReactElement => {
  return (
    <header className="bg-light p-3 border-bottom">
      <nav className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-decoration-none text-dark fs-2 d-flex align-items-center">
          <i className="bi bi-fork-knife text-success"></i>
          <span className="fw-bold"> Mealplanner</span>
        </Link>
        <div className="d-flex gap-3">
          <Link to="/" className="text-decoration-none text-secondary">
            Home
          </Link>
          <Link to="grocerylist" className="text-decoration-none text-secondary">
            Grocery List
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
