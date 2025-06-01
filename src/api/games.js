import api from './axios';

export const getAllGames = () => api.get('/games');
export const getGameDetail = (id) => api.get(`/games/${id}`);
export const createGame = (formData) => {
  return api.post('/games', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const updateGame = (id, formData) => {
  return api.put(`/games/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const applyDiscount = (id, {discount}) => api.patch(`/games/${id}/discount`, { discount });
export const getSalesHistory = (id) => api.get(`/games/${id}/sales`);
export const deleteGame = (id) => api.delete(`/games/${id}`);