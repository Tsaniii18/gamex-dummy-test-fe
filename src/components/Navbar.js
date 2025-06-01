import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaGamepad, 
  FaThList, 
  FaBookOpen, 
  FaHistory, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus, 
  FaHome 
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar is-primary" role="navigation" aria-label="main navigation" style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}>
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item is-flex is-align-items-center" to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white' }}>
            <FaGamepad style={{ marginRight: '8px' }} />
            Game-Ex
          </Link>

          {/* Hamburger menu for mobile */}
          <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasic">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasic" className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item is-flex is-align-items-center" to="/games">
              <FaThList style={{ marginRight: '6px' }} />
              Games
            </Link>
            {user && (
              <>
                <Link className="navbar-item is-flex is-align-items-center" to="/games/my-games">
                  <FaGamepad style={{ marginRight: '6px' }} />
                  My Games
                </Link>
                <Link className="navbar-item is-flex is-align-items-center" to="/library">
                  <FaBookOpen style={{ marginRight: '6px' }} />
                  Library
                </Link>
                <Link className="navbar-item is-flex is-align-items-center" to="/history">
                  <FaHistory style={{ marginRight: '6px' }} />
                  Purchase History
                </Link>
              </>
            )}
          </div>

          <div className="navbar-end">
            {user ? (
              <>
                <Link className="navbar-item is-flex is-align-items-center" to="/profile">
                  <FaUserCircle style={{ marginRight: '6px' }} />
                  Profile
                </Link>
                <div className="navbar-item">
                  <button className="button is-light is-flex is-align-items-center" onClick={logout}>
                    <FaSignOutAlt style={{ marginRight: '6px' }} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link className="navbar-item is-flex is-align-items-center" to="/auth/login">
                  <FaSignInAlt style={{ marginRight: '6px' }} />
                  Login
                </Link>
                <Link className="navbar-item is-flex is-align-items-center" to="/auth/register">
                  <FaUserPlus style={{ marginRight: '6px' }} />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
