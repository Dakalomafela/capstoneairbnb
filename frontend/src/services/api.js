export const api = {
  checkBackend: () => fetch('/api/listings', { method: 'HEAD' })
    .then(res => res.ok)
    .catch(() => false),
  
  getListings: () => fetch('/api/listings').then(res => res.json()),
}
