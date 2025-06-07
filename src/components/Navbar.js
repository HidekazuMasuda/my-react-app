import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
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
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;