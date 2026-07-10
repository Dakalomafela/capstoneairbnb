import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, Home, Calendar, Search, LayoutDashboard, ImageIcon } from 'lucide-react';
import { apiUrl } from '../api';

export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch(apiUrl('/api/accommodations'))
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch listings');
        return res.json();
      })
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setListings(arr);
        setFiltered(arr);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      listings.filter(l => {
        const title = (l.title || l.name || '').toLowerCase();
        const location = (l.location || l.city || l.address || '').toLowerCase();
        return title.includes(term) || location.includes(term);
      })
    );
  }, [search, listings]);

  const getTitle = (listing) => listing.title || listing.name || 'Untitled';
  const getLocation = (listing) => listing.location || listing.city || listing.address || 'No location';
  const getPrice = (listing) => listing.price || listing.price_per_night || 0;

  const getImage = (listing) => {
    const raw = listing.images || listing.image || listing.image_url || listing.photo;
    if (!raw) return '';
    if (Array.isArray(raw)) return raw[0];
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed[0];
        return parsed;
      } catch {
        return raw;
      }
    }
    return '';
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(apiUrl(`/api/accommodations/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      const updated = listings.filter(l => l.id !== id);
      setListings(updated);
      setFiltered(updated);
    } catch {
      alert('Failed to delete listing');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const navItem = (label, icon, path, active = false) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
        active
          ? 'bg-rose-50 text-rose-600 font-semibold shadow-sm'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col sticky top-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-rose-500 tracking-tight">Admin Panel</h2>
          <p className="text-xs text-gray-400 mt-1">Manage your listings</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItem('Dashboard', <LayoutDashboard size={18} />, '/admin/dashboard', true)}
          {navItem('My Listings', <Home size={18} />, '/my-listings')}
          {navItem('Create Listing', <Plus size={18} />, '/create-listing')}
          {navItem('Reservations', <Calendar size={18} />, '/reservations')}
          {navItem('Admin Reservations', <Calendar size={18} />, '/admin/reservations')}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-3 rounded-xl text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LogOut size={18} />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-500 mt-1">Manage and update your properties</p>
          </div>
          <button
            onClick={() => navigate('/create-listing')}
            className="inline-flex items-center bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-rose-200 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={18} className="mr-2" />
            Add New Listing
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="p-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="p-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price / Night</th>
                    <th className="p-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <div className="flex flex-col items-center text-gray-400">
                          <Home size={48} className="mb-3 opacity-50" />
                          <p className="text-lg font-medium text-gray-600">No listings found</p>
                          <p className="text-sm mt-1">{search ? 'Try a different search term' : 'Get started by adding your first property'}</p>
                          {!search && (
                            <button
                              onClick={() => navigate('/create-listing')}
                              className="mt-4 text-rose-500 font-medium hover:underline"
                            >
                              Create a listing →
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(listing => (
                      <tr key={listing.id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                              {getImage(listing) ? (
                                <img src={getImage(listing)} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                  <ImageIcon size={16} />
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{getTitle(listing)}</span>
                          </div>
                        </td>
                        <td className="p-5 text-gray-600">{getLocation(listing)}</td>
                        <td className="p-5">
                          <span className="font-semibold text-gray-900">${getPrice(listing)}</span>
                        </td>
                        <td className="p-5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate(`/admin/listings/edit/${listing.id}`)}
                              className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(listing.id)}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}