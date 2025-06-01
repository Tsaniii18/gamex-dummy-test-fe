import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, deleteAccount } from '../../api/users';

const Profile = () => {
  const { user: authUser, logout, setUser: setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [fotoProfilFile, setFotoProfilFile] = useState(null);
  const [fotoProfilPreview, setFotoProfilPreview] = useState(
    'https://marketplace.canva.com/EAFG8MJkQBI/2/0/1600w/canva-inspiration-professional-instagram-profile-picture-fF81hMsjbhQ.jpg'
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authUser) {
      setFormData(prev => ({
        ...prev,
        username: authUser.username || '',
        email: authUser.email || '',
        password: '', // Ensure password fields are empty
        confirmPassword: '' // Ensure password fields are empty
      }));
      if (authUser.foto_profil) {
        setFotoProfilPreview(authUser.foto_profil);
      }
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoProfilFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setFotoProfilPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      if (fotoProfilFile) {
        formDataToSend.append('foto_profil', fotoProfilFile);
      }

      const response = await updateProfile(formDataToSend);
      setMessage(response.data.msg || 'Profile updated successfully');

      if (authUser) {
        setAuthUser({
          ...authUser,
          username: formData.username,
          email: formData.email,
          foto_profil: response.data.user.foto_profil || fotoProfilPreview
        });
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
      console.error('Profile update error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await deleteAccount();
        logout();
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete account');
      }
    }
  };

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <div className="box">
          <h1 className="title has-text-centered">Profile Settings</h1>

          {/* Profile picture preview and upload - Made larger */}
          <div className="has-text-centered mb-4">
            <figure className="image is-256x256 is-inline-block">
              <img
                src={fotoProfilPreview}
                alt="Profile preview"
                className="is-rounded"
                style={{
                  width: '256px',
                  height: '256px',
                  objectFit: 'cover'
                }}
              />
            </figure>
            <div className="file is-centered mt-3">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">
                    {fotoProfilFile ? 'Change Photo' : 'Upload Photo'}
                  </span>
                </span>
              </label>
            </div>
          </div>

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

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">New Password (leave blank to keep current)</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Confirm Password</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="6"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button
                  className="button is-primary is-fullwidth"
                  type="submit"
                  disabled={!formData.username || !formData.email}
                >
                  Update Profile
                </button>
              </div>
            </div>
          </form>

          <div className="field mt-5">
            <div className="control">
              <button
                className="button is-danger is-fullwidth"
                onClick={handleDeleteAccount}
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;