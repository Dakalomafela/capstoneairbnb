import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, MapPin } from "lucide-react";
import { apiUrl } from "../api";

// Helper: safely get first image from any backend format
const getListingImage = (listing) => {
  if (!listing) return null;

  // Check images array
  if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
    const first = listing.images[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object') {
      return first.url || first.image || first.src || first.link || null;
    }
  }

  // Check single image fields
  if (listing.image && typeof listing.image === 'string') return listing.image;
  if (listing.image_url && typeof listing.image_url === 'string') return listing.image_url;
  if (listing.photo && typeof listing.photo === 'string') return listing.photo;

  // Try parsing JSON string
  if (listing.images && typeof listing.images === 'string') {
    try {
      const parsed = JSON.parse(listing.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0];
        return typeof first === 'string' ? first : (first?.url || first?.image || null);
      }
    } catch { /* ignore */ }
  }

  return null;
};

// Fallback images for each listing position
const fallbackImages = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518780664697-55e3b674a7d4?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
];

// Safe image component with fallback
const SafeImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  useEffect(() => { setImgSrc(src); setErrored(false); }, [src]);

  const handleError = () => {
    if (!errored) {
      setErrored(true);
      setImgSrc("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop");
    }
  };

  if (!imgSrc) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <MapPin className="w-10 h-10 text-gray-400" />
      </div>
    );
  }

  return <img src={imgSrc} alt={alt} className={className} onError={handleError} loading="lazy" />;
};

export default function LocationPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/accommodations"))
      .then(res => res.json())
      .then(data => {
        // Ensure every listing has an image
        const processed = (data || []).map((item, index) => ({
          ...item,
          // Use backend image, or fallback based on index
          _displayImage: getListingImage(item) || fallbackImages[index % fallbackImages.length],
          // Ensure these fields exist
          title: item.title || item.name || "Beautiful Stay",
          location: item.location || item.city || "Unknown location",
          type: item.type || "Entire home",
          guests: item.guests || item.max_guests || "2-4",
          beds: item.beds || item.bedrooms || 1,
          bathrooms: item.bathrooms || 1,
          rating: item.rating || 4.8,
          reviews: item.reviews || 0,
          price: item.price || item.price_per_night || 200,
          amenities: item.amenities || ["Wifi", "Kitchen"],
        }));
        setListings(processed);
        setLoading(false);
      })
      .catch(() => {
        // Demo data if API fails
        setListings([
          { id: 1, title: "Bordeaux Getaway", location: "Bordeaux", type: "Entire home", guests: "4-6", beds: 5, bathrooms: 3, rating: 5.0, reviews: 318, price: 325, _displayImage: fallbackImages[0], amenities: ["Wifi", "Kitchen", "Free Parking"] },
          { id: 2, title: "Charming Waterfront Condo", location: "Bordeaux", type: "Entire home", guests: "4-6", beds: 5, bathrooms: 3, rating: 5.0, reviews: 318, price: 200, _displayImage: fallbackImages[1], amenities: ["Wifi", "Kitchen", "Free Parking"], isFavorite: true },
          { id: 3, title: "Historic City Center Home", location: "Bordeaux", type: "Entire home", guests: "4-6", beds: 5, bathrooms: 3, rating: 5.0, reviews: 318, price: 125, _displayImage: fallbackImages[2], amenities: ["Wifi", "Kitchen", "Free Parking"] },
          { id: 4, title: "Luxury Villa with Pool", location: "Bordeaux", type: "Entire home", guests: "4-6", beds: 5, bathrooms: 3, rating: 5.0, reviews: 318, price: 450, _displayImage: fallbackImages[3], amenities: ["Wifi", "Kitchen", "Pool"] },
          { id: 5, title: "Cozy Countryside Cottage", location: "Bordeaux", type: "Entire home", guests: "4-6", beds: 5, bathrooms: 3, rating: 5.0, reviews: 318, price: 180, _displayImage: fallbackImages[4], amenities: ["Wifi", "Kitchen", "Free Parking"] },
        ]);
        setLoading(false);
      });
  }, []);

  const filters = ["Free cancellation", "Type of place", "Price", "Instant Book", "More filters"];

  const parseAmenities = (amenities) => {
    if (!amenities) return "Wifi · Kitchen · Free Parking";
    if (typeof amenities === "string") {
      if (amenities.startsWith("[")) {
        try { return JSON.parse(amenities).join(" · "); } catch { return amenities; }
      }
      return amenities.split(",").join(" · ");
    }
    if (Array.isArray(amenities)) return amenities.join(" · ");
    return "Wifi · Kitchen · Free Parking";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <nav className="sticky top-0 bg-white border-b px-6 py-3 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-[#FF5A5F] font-bold text-xl">airbnb</Link>

          <div className="hidden md:flex items-center border rounded-full shadow-sm hover:shadow-md transition px-2 py-1 bg-white">
            <span className="border-r pr-3 pl-3 text-sm font-medium">Bordeaux</span>
            <span className="border-r px-3 text-sm font-medium">Feb 19-26</span>
            <span className="px-3 text-sm text-gray-500">2 guests</span>
            <button className="bg-[#FF5A5F] rounded-full p-2 ml-1 hover:bg-[#e04e53] transition">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/create" className="hidden md:block bg-[#FF5A5F] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#e04e53] transition">
              + Create Listing
            </Link>
            <span className="text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-full cursor-pointer transition">Become a Host</span>
            
            {/* ═══ USER DROPDOWN ═══ */}
            <div className="relative group">
              <button className="flex items-center gap-2 border rounded-full px-2 py-1 hover:shadow-md transition">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div className="bg-gray-500 rounded-full p-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-xl shadow-lg py-2 hidden group-hover:block">
                <Link to="/my-listings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Listings</Link>
                <Link to="/reservations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Reservations</Link>
                <div className="border-t my-1"></div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account</Link>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log out</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">200+ Airbnb Luxe stays in Bordeaux</h1>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {filters.map((f, i) => (
            <button key={i} className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:border-black transition whitespace-nowrap">{f}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading stays...</div>
        ) : (
          <div className="space-y-6">
            {listings.map((l) => (
              <Link key={l.id} to={`/listing/${l.id}`} className="group flex gap-4 border-b border-gray-200 pb-6 cursor-pointer">
                {/* Image */}
                <div className="w-72 h-48 rounded-xl overflow-hidden bg-gray-200 relative flex-shrink-0">
                  <SafeImage 
                    src={l._displayImage} 
                    alt={l.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <button className="absolute top-3 right-3 p-1 hover:scale-110 transition" onClick={(e) => e.preventDefault()}>
                    <svg className={`w-6 h-6 drop-shadow-md ${l.isFavorite ? 'text-[#FF5A5F] fill-current' : 'text-white'}`} fill={l.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <p className="text-sm text-gray-500">{l.type} in {l.location}</p>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:underline mt-1">{l.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {l.guests} guests · {l.type} · {l.beds} beds · {l.bathrooms} bath
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {parseAmenities(l.amenities)}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm">{(l.rating || 0).toFixed(1)}</span>
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-gray-500 text-sm">({l.reviews} reviews)</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${l.price} <span className="font-normal text-gray-500 text-sm">/night</span></p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-gray-100 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">Safety Information</a></li>
                <li><a href="#" className="hover:underline">Cancellation Options</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Community</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Airbnb.org</a></li>
                <li><a href="#" className="hover:underline">Disaster Relief</a></li>
                <li><a href="#" className="hover:underline">Combating Discrimination</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Hosting</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Try Hosting</a></li>
                <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
                <li><a href="#" className="hover:underline">Explore Hosting Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Airbnb</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Newsroom</a></li>
                <li><a href="#" className="hover:underline">Learn About New Features</a></li>
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
              <span>·</span>
              <a href="#" className="hover:underline">Sitemap</a>
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