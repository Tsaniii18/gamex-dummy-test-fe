import api from './axios';

export const updateProfile = (formData) => {
  return api.put('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const buyGame = ({gameId, paymentMethod}) => api.post('/users/buy', { gameId, paymentMethod });
export const updateGameStatus = (gameId, {status}) => api.patch(`/users/library/${gameId}`, { status });
export const deleteFromLibrary = (gameId) => api.delete(`/users/library/${gameId}`);
export const getPurchaseHistory = () => api.get('/users/history');
export const getMyGames = () => api.get('/users/my-games');
export const getLibrary = () => api.get('/users/library');
export const deleteAccount = () => api.delete('/users/account');
export const getProfile = (decode) => api.get(`/users/me/${decode}`);