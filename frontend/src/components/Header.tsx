import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

const Header = (): ReactElement => {
  return (
    <header className="bg-light px-3 py-2 border-bottom">
      <nav className="container px-0 d-flex justify-content-between align-items-center gap-2">
        <Link
          to="/"
          className="text-decoration-none text-dark fs-4 fs-md-2 d-flex align-items-center py-2"
        >
          <i className="bi bi-fork-knife text-success me-1"></i>
          <span className="fw-bold">Mealplanner</span>
        </Link>
        <div className="d-flex align-items-center gap-3 text-nowrap">
          <Link to="/" className="text-decoration-none text-secondary py-2">
            Home
          </Link>
          <Link to="grocerylist" className="text-decoration-none text-secondary py-2">
            Grocery List
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
