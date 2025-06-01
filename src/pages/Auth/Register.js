import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('PASSWORDS DO NOT MATCH');
      return;
    }

    const result = await register(username, email, password);
    if (result.success) {
      navigate('/auth/login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <div className="box">
          <div className="pixel-character ghost register-character"></div>
          <h1 className="title has-text-centered">REGISTER</h1>
          {error && <div className="notification is-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">USERNAME</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="field">
              <label className="label">EMAIL</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="field">
              <label className="label">PASSWORD</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="field">
              <label className="label">CONFIRM PASSWORD</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="field">
              <div className="control">
                <button className="button is-primary is-fullwidth" type="submit">
                  REGISTER
                </button>
              </div>
            </div>
          </form>
          
          <div className="has-text-centered mt-3">
            ALREADY HAVE AN ACCOUNT? <a href="/auth/login">LOGIN</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;