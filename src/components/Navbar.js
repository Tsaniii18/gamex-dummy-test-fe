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
  FaUserPlus
} from 'react-icons/fa';
import '../styles.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="pixel-navbar">
      <div className="pixel-navbar-container">
        <Link to="/" className="pixel-navbar-brand">
          <FaGamepad className="navbar-icon" />
          Game-Ex
        </Link>

        <div className="pixel-navbar-menu">
          <div className="pixel-navbar-start">
            <Link to="/games" className="pixel-navbar-item">
              <FaThList className="navbar-icon" />
              Games
            </Link>
            {user && (
              <>
                <Link to="/games/my-games" className="pixel-navbar-item">
                  <FaGamepad className="navbar-icon" />
                  My Games
                </Link>
                <Link to="/library" className="pixel-navbar-item">
                  <FaBookOpen className="navbar-icon" />
                  Library
                </Link>
                <Link to="/history" className="pixel-navbar-item">
                  <FaHistory className="navbar-icon" />
                  Purchase History
                </Link>
              </>
            )}
          </div>

          <div className="pixel-navbar-end">
            {user ? (
              <>
                <Link to="/profile" className="pixel-navbar-item">
                  <FaUserCircle className="navbar-icon" />
                  Profile
                </Link>
                <button className="pixel-button logout-button" onClick={logout}>
                  <FaSignOutAlt className="navbar-icon" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="pixel-navbar-item">
                  <FaSignInAlt className="navbar-icon" />
                  Login
                </Link>
                <Link to="/auth/register" className="pixel-navbar-item">
                  <FaUserPlus className="navbar-icon" />
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
