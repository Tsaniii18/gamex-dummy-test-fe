import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  console.log(user)

  return (
    <div className="container has-text-centered mt-6">
      <h1 className="title is-1">Welcome to GameStore</h1>
      <h2 className="subtitle is-3">
        {user ? `Hello, ${user.username}!` : 'Please login or register'}
      </h2>
      
      <div className="columns is-centered mt-5">
        <div className="column is-half">
          <div className="box">
            <p className="content is-medium">
              {user
                ? 'Browse our collection of games or manage your own creations.'
                : 'Join our community to buy and sell amazing games!'}
            </p>
            
            <div className="buttons is-centered">
              <a href="/games" className="button is-primary is-medium">
                Browse Games
              </a>
              {user && (
                <a href="/games/create" className="button is-info is-medium">
                  Create Game
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;