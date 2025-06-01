import { useAuth } from '../context/AuthContext';
import './../styles.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <h1 className="pixel-title">Welcome to GameStore</h1>
        <h2 className="pixel-subtitle">
          {user ? `Hello, ${user.username}!` : 'Please login or register'}
        </h2>

        <div className="home-box box">
          <p className="pixel-content is-medium">
            {user
              ? 'Browse our collection of games or manage your own creations.'
              : 'Join our community to buy and sell amazing games!'}
          </p>

          <div className="buttons is-centered">
            <a href="/games" className="button pixel-button is-primary is-medium">
              Browse Games
            </a>
            {user && (
              <a href="/games/create" className="button pixel-button is-info is-medium">
                Create Game
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
