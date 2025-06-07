import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">MyApp</Link>
        </div>
        <div className="navbar-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            ホーム
          </Link>
          <Link 
            to="/todo" 
            className={location.pathname === '/todo' ? 'active' : ''}
          >
            TODOアプリ
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;