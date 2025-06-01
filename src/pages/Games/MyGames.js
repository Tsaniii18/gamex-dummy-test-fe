import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyGames } from '../../api/users';
import { applyDiscount } from '../../api/games';
import '../../styles.css'; // import styling khusus

const MyGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [discountInputs, setDiscountInputs] = useState({});
  const [applyingDiscount, setApplyingDiscount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getMyGames();
        setGames(response.data);
        
        const inputs = {};
        response.data.forEach(game => {
          inputs[game.id] = game.discount || 0;
        });
        setDiscountInputs(inputs);
      } catch (err) {
        setError('Failed to load your games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleDiscountChange = (gameId, value) => {
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      const numValue = parseFloat(value) || 0;
      setDiscountInputs(prev => ({
        ...prev,
        [gameId]: Math.min(100, Math.max(0, numValue))
      }));
    }
  };

  const applyGameDiscount = async (gameId) => {
    setApplyingDiscount(gameId);
    setError('');
    
    try {
      await applyDiscount(gameId, { discount: discountInputs[gameId] });
      setGames(prev => prev.map(game => 
        game.id === gameId ? { ...game, discount: discountInputs[gameId] } : game
      ));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to apply discount');
    } finally {
      setApplyingDiscount(null);
    }
  };

  if (loading) return <div className="has-text-centered mt-5">Loading...</div>;
  if (error) return <div className="notification is-danger mx-4">{error}</div>;

  return (
    <div className="container mygames-container">
      <div className="level mygames-header">
        <div className="level-left">
          <h1 className="title">My Games</h1>
        </div>
        <div className="level-right">
          <button 
            className="button is-primary"
            onClick={() => navigate('/games/create')}
          >
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Create New Game</span>
          </button>
        </div>
      </div>
      
      {games.length === 0 ? (
        <div className="notification is-info">
          You haven't uploaded any games yet.
        </div>
      ) : (
        <div className="columns is-multiline">
          {games.map((game) => (
            <div className="column is-one-third" key={game.id}>
              <div className="card mygames-card">
                <div className="card-image">
                  <figure className="image is-4by3 mygames-image-wrapper">
                    <img src={game.gambar} alt={game.nama} className="mygames-image" />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content has-text-centered">
                      <p className="title is-4 mygames-title">{game.nama}</p>
                      <p className="subtitle is-6 mygames-description">{game.deskripsi}</p>
                      <div className="tags mygames-tags">
                        {game.tag.split(',').map((tag, index) => (
                          <span key={index} className="tag is-info is-light mygames-tag">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="content has-text-centered mygames-price">
                    <div className="is-size-5">${game.harga.toFixed(2)}</div>
                    {game.discount > 0 && (
                      <span className="tag is-danger mygames-discount-tag">
                        {game.discount}% discount (${(game.harga * (1 - game.discount / 100)).toFixed(2)})
                      </span>
                    )}
                  </div>
                  
                  <div className="field has-addons mygames-discount-input-group">
                    <div className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        value={discountInputs[game.id]}
                        onChange={(e) => handleDiscountChange(game.id, e.target.value)}
                        placeholder="Discount %"
                        aria-label={`Discount input for ${game.nama}`}
                      />
                    </div>
                    <div className="control">
                      <button 
                        className={`button is-info ${applyingDiscount === game.id ? 'is-loading' : ''}`}
                        onClick={() => applyGameDiscount(game.id)}
                        disabled={applyingDiscount === game.id}
                        aria-label={`Apply discount for ${game.nama}`}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  <div className="buttons is-centered mt-3">
                    <Link 
                      to={`/games/${game.id}`} 
                      className="button is-primary is-small"
                      aria-label={`View ${game.nama}`}
                    >
                      <span className="icon">
                        <i className="fas fa-eye"></i>
                      </span>
                      <span>View</span>
                    </Link>
                    <Link 
                      to={`/games/${game.id}/edit`} 
                      className="button is-info is-small"
                      aria-label={`Edit ${game.nama}`}
                    >
                      <span className="icon">
                        <i className="fas fa-edit"></i>
                      </span>
                      <span>Edit</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGames;
