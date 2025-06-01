import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';

const GameCard = ({ game }) => {
  const { user } = useAuth();
  const isOwner = user && user.userId === game.uploader_id;
  const discountedPrice = game.harga * (1 - (game.discount || 0) / 100);

  return (
    <div className="card" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <div className="card-image">
        <figure className="image is-4by3" style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', overflow: 'hidden' }}>
          <img src={game.gambar} alt={game.nama} />
        </figure>
      </div>
      <div className="card-content">
        <div className="media" style={{ marginBottom: '0.5rem' }}>
          <div className="media-content">
            <p className="title is-4" style={{ marginBottom: '0.2rem' }}>{game.nama}</p>
            <p className="subtitle is-6 has-text-grey-dark" style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>
              <FaUser style={{ marginRight: '6px' }} />
              @{game.User?.username || 'unknown'}
            </p>

           <p className="subtitle is-6" style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {game.deskripsi}
            </p>
            <div className="subtitle is-7 has-text-grey" style={{ marginTop: '0.5rem' }}>
              <strong>Tags:</strong>{' '}
              {game.tag?.split(',').map((t, index) => (
                <span key={index} className="tag is-light is-info mr-1">
                  {t.trim()}
                </span>
              ))}
            </div>

          </div>
        </div>

        <div className="content" style={{ marginBottom: '1rem' }}>
          {game.discount > 0 ? (
            <div>
              <span className="has-text-danger has-text-weight-bold" style={{ fontSize: '1.2rem' }}>
                ${discountedPrice.toFixed(2)}
              </span>
              <span
                className="has-text-grey-light ml-2"
                style={{ textDecoration: 'line-through', fontSize: '1rem' }}
              >
                ${game.harga.toFixed(2)}
              </span>
              <span className="tag is-danger ml-2" style={{ fontWeight: '600' }}>
                {game.discount}% OFF
              </span>
            </div>
          ) : (
            <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>${game.harga.toFixed(2)}</div>
          )}
        </div>

        <div className="buttons">
          <Link to={`/games/${game.id}`} className="button is-primary is-small">
            Details
          </Link>
          {isOwner && (
            <Link to={`/games/my-games`} className="button is-info is-small">
              Manage
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
