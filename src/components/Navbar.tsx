import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-brand">
            <Link to="/">MyApp</Link>
          </div>
          <div className="navbar-links">
            <Link
              to="/todo"
              className={location.pathname === '/todo' ? 'active' : ''}
            >
              TODOアプリ
            </Link>
            <Link
              to="/fortune"
              className={location.pathname === '/fortune' ? 'active' : ''}
            >
              🔮 占い
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
