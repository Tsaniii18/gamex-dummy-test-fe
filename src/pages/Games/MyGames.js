import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyGames } from '../../api/users';
import { applyDiscount } from '../../api/games';

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
        
        // Initialize discount inputs
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
  // Allow numbers, empty string, or decimal point
  if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
    const numValue = parseFloat(value) || 0;
    setDiscountInputs(prev => ({
      ...prev,
      [gameId]: Math.min(100, Math.max(0, numValue))
    }));
  }
};


  // const handleDiscountChange = (gameId, value) => {
  //   const numValue = parseInt(value) || 0;
  //   setDiscountInputs(prev => ({
  //     ...prev,
  //     [gameId]: Math.min(100, Math.max(0, numValue))
  //   }));
  // };

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

//     try {
//     // Ensure discount is a valid number between 0 and 100
//     const discountValue = parseFloat(discountInputs[gameId]);
//     if (isNaN(discountValue)) {
//       throw new Error('Discount must be a number');
//     }
    
//     const validDiscount = Math.min(100, Math.max(0, discountValue));
    
//     await applyDiscount(gameId, { discount: validDiscount });
//     setGames(prev => prev.map(game => 
//       game.id === gameId ? { ...game, discount: validDiscount } : game
//     ));
//   } catch (err) {
//     setError(err.response?.data?.msg || err.message || 'Failed to apply discount');
//   } finally {
//     setApplyingDiscount(null);
//   }
// };

  if (loading) return <div className="has-text-centered mt-5">Loading...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;

  return (
    <div className="container">
      <div className="level">
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
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src={game.gambar} alt={game.nama} />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">{game.nama}</p>
                      <p className="subtitle is-6">{game.deskripsi}</p>
                      <div className="tags">
                        {game.tag.split(',').map((tag, index) => (
                          <span key={index} className="tag is-info is-light">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="content">
                    <div className="is-size-5">${game.harga.toFixed(2)}</div>
                    {game.discount > 0 && (
                      <span className="tag is-danger">
                        {game.discount}% discount (${(game.harga * (1 - game.discount/100)).toFixed(2)})
                      </span>
                    )}
                  </div>
                  
                  <div className="field has-addons">
                    <div className="control is-expanded">
                      <input
                        className="input"
                        type="number"  // change to "text" or keep as "number" with step="any"
                        step="any"     // add this to allow decimal values
                        min="0"
                        max="100"
                        value={discountInputs[game.id]}
                        onChange={(e) => handleDiscountChange(game.id, e.target.value)}
                        placeholder="Discount %"
                      />
                    </div>
                    <div className="control">
                      <button 
                        className={`button is-info ${applyingDiscount === game.id ? 'is-loading' : ''}`}
                        onClick={() => applyGameDiscount(game.id)}
                        disabled={applyingDiscount === game.id}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  <div className="buttons mt-3">
                    <Link 
                      to={`/games/${game.id}`} 
                      className="button is-primary is-small"
                    >
                      <span className="icon">
                        <i className="fas fa-eye"></i>
                      </span>
                      <span>View</span>
                    </Link>
                    <Link 
                      to={`/games/${game.id}/edit`} 
                      className="button is-info is-small"
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