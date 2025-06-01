import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getGameDetail, deleteGame, getSalesHistory } from '../../api/games';
import { buyGame } from '../../api/users';
import '../../styles.css';

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
    <div className="game-detail-page">
      <div className="game-detail-container">
        <div className="columns is-multiline game-detail-content">
          <div className="column is-full-mobile is-half-tablet is-half-desktop">
            <figure className="game-image">
              <img src={game.gambar} alt={game.nama} />
            </figure>
          </div>

          <div className="column is-full-mobile is-half-tablet is-half-desktop">
            <div className="game-info">
              <h1 className="title is-2 game-title">{game.nama}</h1>
              <p className="subtitle is-5 game-description">{game.deskripsi}</p>
              <div className="tags game-tags">
                {game.tag.split(',').map((tag, index) => (
                  <span key={index} className="tag is-info is-light">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="box game-box">
              <div className="content has-text-centered price-section">
                {game.discount > 0 ? (
                  <>
                    <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
                    <span className="original-price">${game.harga.toFixed(2)}</span>
                    <span className="tag is-danger is-medium">{game.discount}% OFF</span>
                  </>
                ) : (
                  <span className="is-size-3 has-text-weight-semibold">
                    ${game.harga.toFixed(2)}
                  </span>
                )}
              </div>

              {message && (
                <div className="notification is-success mb-4">
                  <button className="delete" onClick={() => setMessage('')}></button>
                  {message}
                </div>
              )}
              {error && (
                <div className="notification is-danger mb-4">
                  <button className="delete" onClick={() => setError('')}></button>
                  {error}
                </div>
              )}

              {!isOwner && !alreadyOwned && !message && (
                <div className="field mb-5">
                  <label className="label">Choose Payment Method</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
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

              <div className="buttons is-centered">
                {isOwner ? (
                  <>
                    <button
                      className="button is-info is-medium"
                      onClick={() => navigate(`/games/${game.id}/edit`)}
                    >
                      <span className="icon"><i className="fas fa-edit"></i></span>
                      <span>Edit Game</span>
                    </button>
                    <button
                      className="button is-danger is-medium"
                      onClick={handleDelete}
                    >
                      <span className="icon"><i className="fas fa-trash"></i></span>
                      <span>Delete Game</span>
                    </button>
                  </>
                ) : (
                  <button
                    className={`button is-primary is-large ${isPurchasing ? 'is-loading' : ''}`}
                    onClick={handleBuy}
                    disabled={!paymentMethod || message || alreadyOwned || isPurchasing}
                  >
                    {alreadyOwned ? (
                      <>
                        <span className="icon"><i className="fas fa-check"></i></span>
                        <span>Already Owned</span>
                      </>
                    ) : message ? (
                      <>
                        <span className="icon"><i className="fas fa-check"></i></span>
                        <span>Purchased!</span>
                      </>
                    ) : (
                      <>
                        <span className="icon"><i className="fas fa-shopping-cart"></i></span>
                        <span>Buy Now</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="box sales-report-box">
            <h2 className="title is-4 has-text-centered">Sales Report</h2>
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
              <p className="has-text-grey has-text-centered">No sales yet for this game.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetail;
