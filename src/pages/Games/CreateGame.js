import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../../api/games';
import '../../styles.css'; // import css terpisah

const CreateGame = () => {
  const [formData, setFormData] = useState({
    nama: '',
    harga: '',
    tag: '',
    deskripsi: ''
  });
  const [gambarFile, setGambarFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGambarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const numericPrice = parseFloat(formData.harga);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error('Price must be a positive number');
      }

      if (!gambarFile) {
        throw new Error('Please select an image file');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('harga', numericPrice);
      formDataToSend.append('tag', formData.tag);
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('gambar', gambarFile);

      await createGame(formDataToSend);
      navigate('/games/my-games');
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to create game');
    }
  };

  return (
    <div className="creategame-container columns is-centered mt-5">
      <div className="column is-full-mobile is-half-tablet is-one-third-desktop">
        <div className="box creategame-box">
          <h1 className="title has-text-centered mb-5">Create New Game</h1>
          {error && <div className="notification is-danger">{error}</div>}
          
          <form onSubmit={handleSubmit} className="creategame-form">
            <div className="field">
              <label className="label">Game Image</label>
              <div className="control">
                <input
                  className="input"
                  type="file"
                  name="gambar"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  aria-label="Upload game image"
                />
              </div>
            </div>
            
            <div className="field">
              <label className="label">Game Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  aria-label="Game name"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Price</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  aria-label="Game price"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Tags (comma separated)</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  required
                  aria-label="Game tags"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  required
                  aria-label="Game description"
                />
              </div>
            </div>
            
            <div className="field mt-4">
              <div className="control">
                <button className="button is-primary is-fullwidth" type="submit" aria-label="Create Game">
                  Create Game
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
