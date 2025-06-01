import { useEffect, useState } from 'react';
import { getAllGames } from '../../api/games';
import GameCard from '../../components/GameCard';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getAllGames();
        setGames(response.data);
      } catch (err) {
        setError('Failed to load games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) 
    return <div className="loading-text has-text-centered mt-5">Loading...</div>;
  if (error) 
    return <div className="notification is-danger mt-5">{error}</div>;

  return (
    <div className="game-list-wrapper">
      <div className="game-list-container">
        <h1 className="pixel-title has-text-centered">All Games</h1>

        <div className="columns is-multiline is-variable is-4">
          {games.map((game) => (
            <div className="column is-full-mobile is-half-tablet is-one-third-desktop is-one-third-widescreen" key={game.id}>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameList;
