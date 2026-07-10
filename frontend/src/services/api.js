import { apiUrl } from '../api';

export const api = {
  checkBackend: () => fetch(apiUrl('/api/health'), { method: 'GET' })
    .then(res => res.ok)
    .catch(() => false),

  getListings: () => fetch(apiUrl('/api/accommodations')).then(res => res.json()),
};
