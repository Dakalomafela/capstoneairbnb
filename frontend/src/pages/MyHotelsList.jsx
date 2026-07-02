import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Menu, User, Home, Heart } from "lucide-react";

const SafeImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  useEffect(() => { setImgSrc(src); setErrored(false); }, [src]);

  const handleError = () => {
    if (!errored) {
      setErrored(true);
      setImgSrc("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop");
    }
  };

  if (!imgSrc) {
    return <div className={`bg-gray-200 flex items-center justify-center ${className}`}><Home className="w-8 h-8 text-gray-400" /></div>;
  }

  return <img src={imgSrc} alt={alt || ""} className={className} onError={handleError} loading="lazy" />;
};

export default function MyHotelList() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TEMP: Force Figma demo data. Replace with fetch when your API is ready.
    setTimeout(() => {
      setListings([
        {
          id: 1,
          title: "Sandton City Hotel",
          location: "Bordeaux",
          type: "3 Room Bedroom",
          guests: "4-6",
          beds: 5,
          bathrooms: 3,
          rating: 5.0,
          reviews: 318,
          price: 325,
          _displayImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop",
          amenities: ["Wifi", "Kitchen", "Free Parking"],
          hasHeart: false,
          showLocationInSubtitle: false,
        },
        {
          id: 2,
          title: "Woodmead City Hotel",
          location: "Bordeaux",
          type: "Entire home",
          guests: "4-6",
          beds: 5,
          bathrooms: 3,
          rating: 5.0,
          reviews: 318,
          price: 325,
          _displayImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
          amenities: ["Wifi", "Kitchen", "Free Parking"],
          hasHeart: false,
          showLocationInSubtitle: true,
        },
        {
          id: 3,
          title: "Historic City Center Home",
          location: "Bordeaux",
          type: "Entire home",
          guests: "4-6",
          beds: 5,
          bathrooms: 3,
          rating: 5.0,
          reviews: 318,
          price: 125,
          _displayImage: "https://images.unsplash.com/photo-1518780664697-55e3b674a7d4?w=400&h=300&fit=crop",
          amenities: ["Wifi", "Kitchen", "Free Parking"],
          hasHeart: true,
          showLocationInSubtitle: true,
        },
      ]);
      setLoading(false);
    }, 300);

    // When your API is fixed, delete the setTimeout above and uncomment:
    /*
    fetch("/api/accommodations")
      .then(res => res.json())
      .then(data => {
        const processed = (data || []).map((item) => ({
          ...item,
          _displayImage: item.images?.[0] || item.image || item.image_url,
          title: item.title || item.name || "Unnamed Hotel",
          location: item.location || item.city || "Unknown location",
          type: item.type || "Entire home",
          guests: item.guests || "4-6",
          beds: item.beds || 5,
          bathrooms: item.bathrooms || 3,
          rating: item.rating || 5.0,
          reviews: item.reviews || 318,
          price: item.price || item.price_per_night || 325,
          amenities: Array.isArray(item.amenities) ? item.amenities : ["Wifi", "Kitchen", "Free Parking"],
          hasHeart: item.hasHeart || false,
          showLocationInSubtitle: item.showLocationInSubtitle !== false,
        }));
        setListings(processed);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    */
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    fetch(`/api/accommodations/${id}`, { method: "DELETE" })
      .then(() => setListings(prev => prev.filter(l => l.id !== id)))
      .catch(() => alert("Failed to delete. Try again."));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-[#FF5A5F] font-bold text-2xl flex items-center gap-1">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            airbnb
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">John Doe</span>
            <button className="hover:bg-gray-100 p-2 rounded-full transition">
              <Menu size={20} className="text-gray-600" />
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sub-nav */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-3">
          <Link to="/reservations" className="border rounded-full px-4 py-2 text-sm font-medium hover:border-black transition">View Reservations</Link>
          <Link to="/my-listings" className="border border-black rounded-full px-4 py-2 text-sm font-medium bg-black text-white">View Listings</Link>
          <Link to="/create-listing" className="border rounded-full px-4 py-2 text-sm font-medium hover:border-black transition">Create Listing</Link>
        </div>
      </div>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">My Hotel List</h1>
      </div>

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No listings found. <Link to="/create-listing" className="text-[#FF5A5F] underline">Create one</Link></div>
        ) : (
          <div className="space-y-8">
            {listings.map((listing) => (
              <div key={listing.id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-64 h-44 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                    <SafeImage
                      src={listing._displayImage}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {listing.showLocationInSubtitle === false
                          ? listing.type
                          : `${listing.type} in ${listing.location}`}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900 mt-1">{listing.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {listing.guests} guests · {listing.type} · {listing.beds} beds · {listing.bathrooms} bath
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {listing.amenities.join(" · ")}
                      </p>
                    </div>

                    {/* Rating / Price */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{listing.rating}</span>
                        <span className="text-gray-500 text-sm">({listing.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">${listing.price}</span>
                        <span className="text-gray-500 text-sm">/night</span>
                        {listing.hasHeart && (
                          <button className="ml-2 p-1 hover:bg-gray-100 rounded-full transition">
                            <Heart size={20} className="text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Buttons — STACKED vertically */}
                    <div className="mt-4 space-y-2.5">
                      <button
                        onClick={() => navigate(`/update/${listing.id}`)}
                        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition active:scale-[0.99]"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="w-full py-3 bg-rose-500 text-white font-medium rounded-lg hover:bg-rose-600 transition active:scale-[0.99]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">Safety information</a></li>
                <li><a href="#" className="hover:underline">Cancellation options</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Community</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Airbnb.org</a></li>
                <li><a href="#" className="hover:underline">Disaster relief</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Hosting</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Try hosting</a></li>
                <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Airbnb</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Newsroom</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>© 2024 Airbnb, Inc.</span>
              <span>·</span>
              <a href="#" className="hover:underline">Privacy</a>
              <span>·</span>
              <a href="#" className="hover:underline">Terms</a>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="font-semibold text-gray-900">English (US)</span>
              <span className="font-semibold text-gray-900">$ USD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}