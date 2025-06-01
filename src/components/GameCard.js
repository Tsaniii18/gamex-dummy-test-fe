import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';
import '../styles.css';

const GameCard = ({ game }) => {
  const { user } = useAuth();
  const isOwner = user && user.userId === game.uploader_id;
  const discountedPrice = game.harga * (1 - (game.discount || 0) / 100);

  return (
    <div className="pixel-card">
      <div className="pixel-card-image">
        <img src={game.gambar} alt={game.nama} />
      </div>

      <div className="pixel-card-content">
        <h2 className="pixel-game-title">{game.nama}</h2>

        <p className="pixel-uploader">
          <FaUser className="pixel-icon" /> @{game.User?.username || 'unknown'}
        </p>

        <p className="pixel-description">{game.deskripsi}</p>

        <div className="pixel-tags">
          <strong>Tags:</strong>{' '}
          {game.tag?.split(',').map((t, index) => (
            <span key={index} className="pixel-tag">
              {t.trim()}
            </span>
          ))}
        </div>

        <div className="pixel-price">
          {game.discount > 0 ? (
            <>
              <span className="pixel-discounted-price">${discountedPrice.toFixed(2)}</span>
              <span className="pixel-original-price">${game.harga.toFixed(2)}</span>
              <span className="pixel-discount-tag">{game.discount}% OFF</span>
            </>
          ) : (
            <span className="pixel-normal-price">${game.harga.toFixed(2)}</span>
          )}
        </div>

        <div className="pixel-buttons">
          <Link to={`/games/${game.id}`} className="pixel-button">
            Details
          </Link>
          {isOwner && (
            <Link to={`/games/my-games`} className="pixel-button pixel-button-alt">
              Manage
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
