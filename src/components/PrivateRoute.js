import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="has-text-centered mt-5">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default PrivateRoute;