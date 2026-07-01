import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, User, Home, X } from "lucide-react";

export default function ReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Reservations data:", data);
        setReservations(Array.isArray(data) ? data : (data.reservations || data.data || []));
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (err) {
      console.log("Using demo data:", err.message);
      setError("Could not load reservations. Showing demo data.");

      // Demo data matching the Figma
      setReservations([
        {
          id: 1,
          guestName: "Johann Coetzee",
          propertyName: "Property 1",
          checkIn: "19/06/2024",
          checkOut: "24/06/2024",
          status: "active",
        },
        {
          id: 2,
          guestName: "Asif Hassam",
          propertyName: "Property 2",
          checkIn: "19/06/2024",
          checkOut: "19/06/2024",
          status: "active",
        },
        {
          id: 3,
          guestName: "Kago Kola",
          propertyName: "Property 1",
          checkIn: "25/06/2024",
          checkOut: "30/06/2024",
          status: "active",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Error canceling reservation:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Airbnb Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <svg className="w-8 h-8 text-rose-500" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 22c4.5-5.5 7-9 7-12.5 0-2.5-1.5-4.5-4-4.5-1.5 0-3 .5-3.5 2.5h-1C10 3 8.5 5 8.5 7.5 8.5 11 11 14.5 16 22zm-1.5-17c.5-1 1.5-1.5 2.5-1.5 1.5 0 2.5 1 2.5 2.5 0 2.5-2 5.5-5.5 10.5-3.5-5-5.5-8-5.5-10.5 0-1.5 1-2.5 2.5-2.5 1 0 2 .5 2.5 1.5h1z" />
            </svg>
            <span className="text-rose-500 font-bold text-xl tracking-tight">airbnb</span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/admin/reservations")}
              className="text-sm font-semibold text-gray-900"
            >
              View Reservations
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              View Listings
            </button>
            <button
              onClick={() => navigate("/admin/create-listing")}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Create Listing
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Reservations</h1>

        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {reservations.length === 0 ? (
          <div className="text-center py-16">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-500">You don&apos;t have any bookings yet.</p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <User size={16} />
                Booked by
              </div>
              <div className="flex items-center gap-2">
                <Home size={16} />
                Property
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Check-in
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Check-out
              </div>
              <div className="text-right">Action</div>
            </div>

            {/* Table Rows */}
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center"
              >
                <div className="text-sm font-medium text-gray-900">
                  {reservation.guestName || reservation.guest_name || reservation.userName || "Guest"}
                </div>
                <div className="text-sm text-gray-600">
                  {reservation.propertyName || reservation.property_name || reservation.listingTitle || "Property"}
                </div>
                <div className="text-sm text-gray-600">
                  {reservation.checkIn || reservation.check_in || reservation.startDate || "-"}
                </div>
                <div className="text-sm text-gray-600">
                  {reservation.checkOut || reservation.check_out || reservation.endDate || "-"}
                </div>
                <div className="text-right">
                  <button
                    onClick={() => handleCancel(reservation.id)}
                    className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
              <div className="space-y-2 text-gray-500">
                <p className="hover:underline cursor-pointer">Help Center</p>
                <p className="hover:underline cursor-pointer">Safety information</p>
                <p className="hover:underline cursor-pointer">Cancellation options</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Community</h4>
              <div className="space-y-2 text-gray-500">
                <p className="hover:underline cursor-pointer">Our COVID-19 Response</p>
                <p className="hover:underline cursor-pointer">Supporting people with disabilities</p>
                <p className="hover:underline cursor-pointer">Report a neighborhood concern</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Hosting</h4>
              <div className="space-y-2 text-gray-500">
                <p className="hover:underline cursor-pointer">Airbnb your home</p>
                <p className="hover:underline cursor-pointer">AirCover for Hosts</p>
                <p className="hover:underline cursor-pointer">Explore hosting resources</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">About</h4>
              <div className="space-y-2 text-gray-500">
                <p className="hover:underline cursor-pointer">Newsroom</p>
                <p className="hover:underline cursor-pointer">Learn about new features</p>
                <p className="hover:underline cursor-pointer">Careers</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500 flex items-center justify-between">
            <p>© 2024 Airbnb, Inc. · Privacy · Terms · Sitemap</p>
          </div>
        </div>
      </div>
    </div>
  );
}