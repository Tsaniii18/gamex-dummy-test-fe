import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameDetail, updateGame } from '../../api/games';

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    harga: '',
    tag: '',
    deskripsi: ''
  });
  const [gambarFile, setGambarFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await getGameDetail(id);
        setFormData({
          nama: response.data.nama,
          harga: response.data.harga,
          tag: response.data.tag,
          deskripsi: response.data.deskripsi
        });
        setCurrentImage(response.data.gambar);
      } catch (err) {
        setError('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGambarFile(e.target.files[0]);
      // Preview the new image
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const numericPrice = parseFloat(formData.harga);
      if (isNaN(numericPrice)) {
        throw new Error('Price must be a number');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('harga', numericPrice);
      formDataToSend.append('tag', formData.tag);
      formDataToSend.append('deskripsi', formData.deskripsi);
      
      // Only append the file if a new one was selected
      if (gambarFile) {
        formDataToSend.append('gambar', gambarFile);
      }

      await updateGame(id, formDataToSend);
      navigate(`/games/${id}`);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to update game');
    }
  };

  if (loading) return <div className="has-text-centered mt-5">Loading...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <div className="box">
          <h1 className="title has-text-centered">Edit Game</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Game Image</label>
              {currentImage && (
                <figure className="image is-128x128 mb-3">
                  <img src={currentImage} alt="Current game" />
                </figure>
              )}
              <div className="control">
                <input
                  className="input"
                  type="file"
                  name="gambar"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <p className="help">Leave empty to keep current image</p>
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
                />
              </div>
            </div>
            
            <div className="field">
              <div className="control">
                <button className="button is-primary is-fullwidth" type="submit">
                  Update Game
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGame;