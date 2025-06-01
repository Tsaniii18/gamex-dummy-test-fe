import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getGameDetail, deleteGame, getSalesHistory } from '../../api/games';
import { buyGame } from '../../api/users';

const GameDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await getGameDetail(id);
        setGame(response.data);

        if (user && response.data.User?.id === user.id) {
          const salesResponse = await getSalesHistory(id);
          setSales(salesResponse.data);
        }
      } catch (err) {
        setError('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, user]);

  const handleBuy = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    setIsPurchasing(true);
    setError('');
    setMessage('');

    try {
      await buyGame({ gameId: id, paymentMethod });
      setMessage('Game purchased successfully! Redirecting to your library...');
      setTimeout(() => {
        navigate('/library');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to purchase game';
      setError(errorMsg);
      if (errorMsg.toLowerCase().includes('already owned')) {
        setAlreadyOwned(true);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      try {
        await deleteGame(id);
        navigate('/games/my-games');
      } catch (err) {
        setError('Failed to delete game');
      }
    }
  };

  if (loading) return <div className="has-text-centered mt-6">Loading...</div>;
  if (error && !message) return <div className="notification is-danger mt-6 mx-4">{error}</div>;
  if (!game) return <div className="notification is-warning mt-6 mx-4">Game not found</div>;

  const isOwner = user && game.User && user.id === game.User?.id;
  const discountedPrice = game.harga * (1 - (game.discount || 0) / 100);

  return (
  <div className="container mt-6">
    <div className="columns is-variable is-8 is-multiline">
      {/* Left Column: Game Image */}
      <div className="column is-full-tablet is-half-desktop">
        <figure className="image is-4by3" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <img
            src={game.gambar}
            alt={game.nama}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </figure>
      </div>

      {/* Right Column: Details */}
      <div className="column is-full-tablet is-half-desktop">
        <div className="content mb-5">
          <h1 className="title is-2">{game.nama}</h1>
          <p className="subtitle is-5 has-text-grey-dark">{game.deskripsi}</p>
          <div className="tags mt-3">
            {game.tag.split(',').map((tag, index) => (
              <span key={index} className="tag is-info is-light mr-2 mb-2" style={{ fontWeight: 600 }}>
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="box">
          {/* Price Section */}
          <div className="content has-text-centered mb-5">
            {game.discount > 0 ? (
              <>
                <span className="has-text-danger has-text-weight-bold is-size-3">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span
                  className="has-text-grey-light is-size-5 ml-4"
                  style={{ textDecoration: 'line-through' }}
                >
                  ${game.harga.toFixed(2)}
                </span>
                <span className="tag is-danger is-medium ml-4">{game.discount}% OFF</span>
              </>
            ) : (
              <span className="is-size-3 has-text-weight-semibold">${game.harga.toFixed(2)}</span>
            )}
          </div>

          {/* Notifications */}
          {message && (
            <div className="notification is-success">
              <button className="delete" onClick={() => setMessage('')}></button>
              {message}
            </div>
          )}

          {error && (
            <div className="notification is-danger">
              <button className="delete" onClick={() => setError('')}></button>
              {error}
            </div>
          )}

          {/* Payment Selection */}
          {!isOwner && !alreadyOwned && !message && (
            <div className="field mt-4">
              <label className="label">Choose Payment Method</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    aria-label="Payment Method"
                  >
                    <option value="">-- Select Payment Method --</option>
                    <option value="dana">DANA</option>
                    <option value="gopay">GoPay</option>
                    <option value="ovo">OVO</option>
                    <option value="mandiri">Bank Mandiri</option>
                    <option value="bca">Bank BCA</option>
                    <option value="bri">Bank BRI</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="buttons is-centered mt-5">
            {isOwner ? (
              <>
                <button
                  className="button is-info is-medium"
                  onClick={() => navigate(`/games/${game.id}/edit`)}
                  aria-label="Edit Game"
                >
                  <span className="icon">
                    <i className="fas fa-edit"></i>
                  </span>
                  <span>Edit Game</span>
                </button>
                <button
                  className="button is-danger is-medium"
                  onClick={handleDelete}
                  aria-label="Delete Game"
                >
                  <span className="icon">
                    <i className="fas fa-trash"></i>
                  </span>
                  <span>Delete Game</span>
                </button>
              </>
            ) : (
              <button
                className={`button is-primary is-large ${isPurchasing ? 'is-loading' : ''}`}
                onClick={handleBuy}
                disabled={!paymentMethod || message || alreadyOwned || isPurchasing}
                aria-label="Buy Game"
              >
                {alreadyOwned ? (
                  <>
                    <span className="icon">
                      <i className="fas fa-check"></i>
                    </span>
                    <span>Already Owned</span>
                  </>
                ) : message ? (
                  <>
                    <span className="icon">
                      <i className="fas fa-check"></i>
                    </span>
                    <span>Purchased!</span>
                  </>
                ) : (
                  <>
                    <span className="icon">
                      <i className="fas fa-shopping-cart"></i>
                    </span>
                    <span>Buy Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Sales Report (Owner only) */}
    {isOwner && (
      <div className="box mt-6">
        <h2 className="title is-4">Sales Report</h2>
        {sales.length > 0 ? (
          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable is-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Buyer ID</th>
                  <th>Payment Method</th>
                  <th>Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale, index) => (
                  <tr key={sale.id}>
                    <td>{index + 1}</td>
                    <td>{sale.id_pembeli}</td>
                    <td>{sale.metode_pembayaran}</td>
                    <td>{new Date(sale.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="has-text-grey">No sales yet for this game.</p>
        )}
      </div>
    )}
  </div>
);

};

export default GameDetail;
