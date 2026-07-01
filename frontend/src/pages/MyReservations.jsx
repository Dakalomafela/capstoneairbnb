import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, ArrowLeft, Eye, Trash2, LayoutDashboard, Plus } from 'lucide-react';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
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

    fetch('http://localhost:5000/api/reservations')
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setReservations(arr);
        setFiltered(arr);
        setLoading(false);
      })
      .catch(() => {
        const demo = [
          { id: 1, guestName: 'Johann Coetzee', property: 'Property 1', checkin: '19/06/2024', checkout: '24/06/2024', status: 'confirmed' },
          { id: 2, guestName: 'Asif Hassam', property: 'Property 2', checkin: '19/06/2024', checkout: '19/06/2024', status: 'pending' },
          { id: 3, guestName: 'Kago Kola', property: 'Property 1', checkin: '25/06/2024', checkout: '30/06/2024', status: 'confirmed' },
        ];
        setReservations(demo);
        setFiltered(demo);
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      reservations.filter(r => 
        r.guestName.toLowerCase().includes(term) || 
        r.property.toLowerCase().includes(term)
      )
    );
  }, [search, reservations]);

  const handleDelete = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await fetch(`http://localhost:5000/api/reservations/${id}`, { method: 'DELETE' });
    } catch {}
    setReservations(prev => prev.filter(r => r.id !== id));
    setFiltered(prev => prev.filter(r => r.id !== id));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-50 text-green-700';
      case 'pending': return 'bg-yellow-50 text-yellow-700';
      case 'cancelled': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">My Reservations</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/create-listing')}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition"
            >
              <Plus size={16} />
              Create Listing
            </button>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by guest name or property..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-5 text-left text-xs font-semibold text-gray-500 uppercase">Booked by</th>
                  <th className="p-5 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                  <th className="p-5 text-left text-xs font-semibold text-gray-500 uppercase">Checkin</th>
                  <th className="p-5 text-left text-xs font-semibold text-gray-500 uppercase">Checkout</th>
                  <th className="p-5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="p-5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={6} className="p-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500 mx-auto"></div></td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400">
                      <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No reservations found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-5 font-medium text-gray-900">{r.guestName}</td>
                      <td className="p-5 text-gray-600">{r.property}</td>
                      <td className="p-5 text-gray-600">{r.checkin}</td>
                      <td className="p-5 text-gray-600">{r.checkout}</td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(r.id)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
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
      </div>
    </div>
  );
}