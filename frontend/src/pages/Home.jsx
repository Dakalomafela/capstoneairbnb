import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Globe, Search, ChevronDown, MapPin } from 'lucide-react';
import CityCard from '../components/CityCard';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Popular');
  
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showHotelDropdown, setShowHotelDropdown] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch('/api/accommodations')
      .then(res => res.json())
      .then(data => { setListings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowHotelDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFirstImage = (listing) => {
    const raw = listing.images || listing.image || listing.image_url || listing.photo;
    if (!raw) return 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400';
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
    return 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400';
  };

  const getawayTabs = ['Popular', 'Arts & culture', 'Outdoors', 'Mountains', 'Beach', 'Unique stays', 'Categories', 'Things to do'];
  const getawayContent = {
    'Popular': ['Canmore', 'Benalmádena', 'Marbella', 'Mijas', 'Prescott', 'Scottsdale', 'Tucson', 'Jasper', 'Mountain View', 'Devonport', 'Mallacoota', 'Ibiza', 'Anaheim', 'Monterey', 'Paso Robles', 'Santa Barbara', 'Sonoma', 'Barcelona', 'Lucerne', 'London'],
    'Arts & culture': ['Florence', 'Paris', 'Rome', 'Vienna', 'Athens', 'Berlin', 'Madrid', 'Lisbon', 'Prague', 'Budapest'],
    'Outdoors': ['Zermatt', 'Banff', 'Whistler', 'Aspen', 'Jackson Hole', 'Lake Tahoe', 'Yosemite', 'Moab', 'Sedona', 'Boulder'],
    'Mountains': ['Swiss Alps', 'Rocky Mountains', 'Himalayas', 'Andes', 'Dolomites', 'Pyrenees', 'Atlas Mountains', 'Caucasus', 'Carpathians', 'Tatra Mountains'],
    'Beach': ['Maldives', 'Bora Bora', 'Cancun', 'Bali', 'Santorini', 'Amalfi Coast', 'Maui', 'Fiji', 'Seychelles', 'Phuket'],
    'Unique stays': ['Treehouses', 'Tiny homes', 'Castles', 'Boats', 'Campervans', 'Caves', 'Domes', 'Yurts', 'Windmills', 'Barns'],
    'Categories': ['Amazing pools', 'Beachfront', 'Cabins', 'Camping', 'Design', 'Farms', 'Golfing', 'Islands', 'Luxe', 'National parks'],
    'Things to do': ['Cooking classes', 'Wine tasting', 'Hiking', 'Surfing', 'Skiing', 'Art workshops', 'Yoga retreats', 'Photography tours', 'Music festivals', 'Local markets']
  };

  const MobileSearchBar = () => (
    <div className="md:hidden w-full px-4 mt-2">
      <button 
        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
        className="w-full bg-white rounded-full shadow-lg flex items-center gap-3 px-4 py-3 text-left"
      >
        <Search size={18} className="text-[#FF5A5F]" />
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">Where to?</p>
          <p className="text-xs text-gray-500">Anywhere · Any week · Add guests</p>
        </div>
      </button>
      
      {isMobileSearchOpen && (
        <div className="mt-2 bg-white rounded-2xl shadow-xl p-4 space-y-3">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowHotelDropdown(!showHotelDropdown)}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-gray-400 transition"
            >
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-900 uppercase">Hotels</p>
                <p className="text-sm text-gray-500">{selectedHotel ? selectedHotel.title || selectedHotel.name : 'Select Hotel'}</p>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${showHotelDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showHotelDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">All Hotels</p>
                  {listings.length > 0 ? listings.map((hotel) => (
                    <button
                      key={hotel.id || hotel._id}
                      onClick={() => { setSelectedHotel(hotel); setShowHotelDropdown(false); }}
                      className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded-lg transition text-left"
                    >
                      <img src={getFirstImage(hotel)} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{hotel.title || hotel.name}</p>
                        <p className="text-xs text-gray-500">{hotel.location || 'Unknown location'}</p>
                      </div>
                    </button>
                  )) : (
                    <p className="text-sm text-gray-500 px-2 py-2">No hotels available</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-gray-200 rounded-xl">
              <p className="text-[10px] font-bold text-gray-900 uppercase">Check in</p>
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-sm text-gray-900 outline-none mt-1"
              />
            </div>
            <div className="p-3 border border-gray-200 rounded-xl">
              <p className="text-[10px] font-bold text-gray-900 uppercase">Check out</p>
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-sm text-gray-900 outline-none mt-1"
              />
            </div>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-xl">
            <p className="text-[10px] font-bold text-gray-900 uppercase">Guests</p>
            <input 
              type="number" 
              min="1"
              placeholder="Add guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full text-sm text-gray-900 outline-none mt-1"
            />
          </div>
          
          <button className="w-full bg-[#FF5A5F] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e04e53] transition">
            <Search size={18} /> Search
          </button>
        </div>
      )}
    </div>
  );

  const DesktopSearchBar = () => (
    <div className="hidden md:flex justify-center mt-1 relative" ref={dropdownRef}>
      <div className="bg-white rounded-full shadow-lg hover:shadow-xl transition flex items-center relative">
        <div className="relative">
          <button 
            onClick={() => setShowHotelDropdown(!showHotelDropdown)}
            className="px-5 py-2.5 border-r border-gray-200 hover:bg-gray-100 rounded-l-full cursor-pointer transition text-left min-w-[180px]"
          >
            <p className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">Hotels</p>
            <div className="flex items-center gap-1">
              <p className="text-sm text-gray-500 truncate max-w-[140px]">
                {selectedHotel ? (selectedHotel.title || selectedHotel.name) : 'Select Hotel'}
              </p>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${showHotelDropdown ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          {showHotelDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 w-[360px] max-h-[400px] overflow-y-auto z-50 py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Hotels</p>
              </div>
              {listings.length > 0 ? listings.map((hotel) => (
                <button
                  key={hotel.id || hotel._id}
                  onClick={() => { setSelectedHotel(hotel); setShowHotelDropdown(false); }}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-left"
                >
                  <img 
                    src={getFirstImage(hotel)} 
                    alt={hotel.title || hotel.name} 
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{hotel.title || hotel.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={10} /> {hotel.location || 'Unknown location'}
                    </p>
                    <p className="text-xs text-gray-900 font-medium mt-0.5">${hotel.price || '0'} / night</p>
                  </div>
                </button>
              )) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500">No hotels available</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-2.5 border-r border-gray-200 hover:bg-gray-100 cursor-pointer transition">
          <p className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">Check in</p>
          <input 
            type="date" 
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="text-sm text-gray-500 bg-transparent outline-none w-full cursor-pointer"
          />
        </div>

        <div className="px-5 py-2.5 border-r border-gray-200 hover:bg-gray-100 cursor-pointer transition">
          <p className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">Check out</p>
          <input 
            type="date" 
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="text-sm text-gray-500 bg-transparent outline-none w-full cursor-pointer"
          />
        </div>

        <div className="px-5 py-2.5 flex items-center gap-3 hover:bg-gray-100 rounded-r-full cursor-pointer transition">
          <div>
            <p className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">Guests</p>
            <input 
              type="number" 
              min="1"
              placeholder="Add guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="text-sm text-gray-500 bg-transparent outline-none w-24 cursor-pointer"
            />
          </div>
          <button className="bg-[#FF5A5F] rounded-full p-2.5 hover:bg-[#e04e53] transition flex-shrink-0">
            <Search size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* BLACK HEADER */}
      <div className="bg-black text-white pt-2 pb-2">
        <nav className="px-4 py-1">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* LOGO - WHITE to match Figma */}
            <Link to="/" className="flex items-center gap-1">
              <svg className="w-8 h-8" style={{ color: '#FFFFFF' }} viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 22c-1.5-2-2.8-4-3.8-6-.8-1.6-1.2-3-1.2-4.2 0-2.2.7-4 2-5.4C13.8 5.2 15.3 4.5 16 4.5c.7 0 2.2.7 3 1.9 1.3 1.4 2 3.2 2 5.4 0 1.2-.4 2.6-1.2 4.2-1 2-2.3 4-3.8 6zm0-15c-.5 0-1.2.5-1.8 1.2-.8.9-1.2 2-1.2 3.4 0 .8.3 1.8.8 3 .7 1.4 1.5 2.8 2.2 4 .7-1.2 1.5-2.6 2.2-4 .5-1.2.8-2.2.8-3 0-1.4-.4-2.5-1.2-3.4-.6-.7-1.3-1.2-1.8-1.2z"/>
              </svg>
              <span className="text-white font-bold text-xl tracking-tight">airbnb</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <span className="text-sm font-medium text-white border-b-2 border-white pb-0">Places to stay</span>
              <span className="text-sm font-medium text-gray-300 hover:text-white cursor-pointer transition">Experiences</span>
              <span className="text-sm font-medium text-gray-300 hover:text-white cursor-pointer transition">Online Experiences</span>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/create-listing" className="hidden md:block text-sm font-medium hover:bg-gray-800 px-3 py-1.5 rounded-full cursor-pointer transition">
                Airbnb your home
              </Link>
              <Link to="/admin/login" className="hidden md:block text-sm font-medium hover:bg-gray-800 px-3 py-1.5 rounded-full cursor-pointer transition">
                Log in
              </Link>
              <button className="flex items-center gap-1 bg-white text-black rounded-full px-2 py-1 hover:bg-gray-200 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div className="bg-gray-500 rounded-full p-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </nav>

        <MobileSearchBar />
        <DesktopSearchBar />
      </div>

      {/* HERO */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <img src="/hero.png" className="w-full h-full object-cover" alt="Luxury home" />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Not sure where to go? Perfect.
          </h1>
          <button className="bg-white text-[#6B21A8] px-6 py-3 rounded-full text-base font-bold shadow-xl hover:scale-105 transition duration-300">
            I'm flexible
          </button>
        </div>
      </div>

      {/* INSPIRATION FOR YOUR NEXT TRIP */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Inspiration for your next trip</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/listing/1" className="group cursor-pointer block">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=500&fit=crop" alt="Sandton City Hotel" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-600/90 via-rose-500/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg leading-tight">Sandton City Hotel</h3>
                <p className="text-white/80 text-sm mt-1">53 km away</p>
              </div>
            </div>
          </Link>

          <Link to="/listing/2" className="group cursor-pointer block">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=500&fit=crop" alt="Joburg City Hotel" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/90 via-pink-500/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg leading-tight">Joburg City Hotel</h3>
                <p className="text-white/80 text-sm mt-1">168 km away</p>
              </div>
            </div>
          </Link>

          <Link to="/listing/3" className="group cursor-pointer block">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=500&fit=crop" alt="Woodmead Hotel" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/90 via-rose-400/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg leading-tight">Woodmead Hotel</h3>
                <p className="text-white/80 text-sm mt-1">30 miles away</p>
              </div>
            </div>
          </Link>

          <Link to="/listing/4" className="group cursor-pointer block">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=500&fit=crop" alt="Hyde Park Hotel" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-red-500/90 via-red-400/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg leading-tight">Hyde Park Hotel</h3>
                <p className="text-white/80 text-sm mt-1">34 km away</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* CREATE LISTING BUTTON */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link to="/create-listing" className="inline-block bg-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition">
          + Create Listing
        </Link>
      </div>

      {/* LISTINGS GRID */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Inspiration for your next trip</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center py-12 text-gray-500 text-lg">Loading stays...</div>
          ) : listings.length > 0 ? (
            listings.slice(0, 4).map((listing) => (
              <Link key={listing.id || listing._id} to={`/listing/${listing.id || listing._id}`} className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 relative">
                  <img src={getFirstImage(listing)} alt={listing.title || listing.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'; }} />
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{listing.title || 'Bordeaux Getaway'}</h3>
                      <p className="text-gray-500 text-xs">{listing.location || 'Bordeaux, France'}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-900">
                      <Star size={12} fill="black" className="text-black" /> {listing.rating || '4.8'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <span className="font-semibold text-gray-900">${listing.price || '225'}</span> night
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <>
              <CityCard image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=500&fit=crop" title="Paris" distance="2,034 kilometres away" />
              <CityCard image="https://images.unsplash.com/photo-1533929736458-ca588d08a8f7?w=400&h=500&fit=crop" title="London" distance="2,104 kilometres away" />
              <CityCard image="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=500&fit=crop" title="New York" distance="2,500 kilometres away" />
              <CityCard image="https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&h=500&fit=crop" title="Tokyo" distance="2,800 kilometres away" />
            </>
          )}
        </div>
      </div>

      {/* THINGS TO DO */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-[400px] rounded-xl overflow-hidden group cursor-pointer">
            <img src="/trip.png" alt="Things to do on your trip" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-8 left-8 text-white">
              <h3 className="text-[32px] font-bold leading-tight mb-6 max-w-[200px]">Things to do<br />on your trip</h3>
              <button className="bg-white text-gray-900 px-5 py-3 rounded-lg font-semibold text-sm hover:bg-gray-100 transition shadow-md">Experiences</button>
            </div>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden group cursor-pointer">
            <img src="/home.png" alt="Things to do from home" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-8 left-8 text-white">
              <h3 className="text-[32px] font-bold leading-tight mb-6 max-w-[200px]">Things to do<br />from home</h3>
              <button className="bg-white text-gray-900 px-5 py-3 rounded-lg font-semibold text-sm hover:bg-gray-100 transition shadow-md">Online Experiences</button>
            </div>
          </div>
        </div>
      </div>

      {/* SHOP GIFT CARDS */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-none overflow-visible">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-shrink-0 md:w-[280px]">
              <h2 className="text-[32px] md:text-[36px] font-bold text-gray-900 leading-tight mb-6">Shop Airbnb<br />gift cards</h2>
              <button className="bg-black text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition">Learn more</button>
            </div>
            <div className="relative flex-1 flex items-center justify-center" style={{ minHeight: '220px', minWidth: '420px' }}>
              <div className="absolute w-[190px] h-[120px] rounded-xl overflow-hidden shadow-lg" style={{ left: '2%', top: '48%', transform: 'translateY(-50%) rotate(-18deg)', zIndex: 1 }}>
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=260&fit=crop" alt="Lavender field" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-purple-400/25" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="44" height="44" viewBox="0 0 32 32" fill="none"><path d="M16 22c-1.5-2-2.8-4-3.8-6-.8-1.6-1.2-3-1.2-4.2 0-2.2.7-4 2-5.4C13.8 5.2 15.3 4.5 16 4.5c.7 0 2.2.7 3 1.9 1.3 1.4 2 3.2 2 5.4 0 1.2-.4 2.6-1.2 4.2-1 2-2.3 4-3.8 6zm0-15c-.5 0-1.2.5-1.8 1.2-.8.9-1.2 2-1.2 3.4 0 .8.3 1.8.8 3 .7 1.4 1.5 2.8 2.2 4 .7-1.2 1.5-2.6 2.2-4 .5-1.2.8-2.2.8-3 0-1.4-.4-2.5-1.2-3.4-.6-.7-1.3-1.2-1.8-1.2z" fill="#fff"/></svg>
                </div>
              </div>
              <div className="absolute w-[190px] h-[120px] rounded-xl overflow-hidden shadow-xl flex flex-col items-center justify-center gap-1.5" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(0deg)', background: '#E61E4D', zIndex: 3 }}>
                <svg width="36" height="36" viewBox="0 0 32 32" fill="none"><path d="M16 22c-1.5-2-2.8-4-3.8-6-.8-1.6-1.2-3-1.2-4.2 0-2.2.7-4 2-5.4C13.8 5.2 15.3 4.5 16 4.5c.7 0 2.2.7 3 1.9 1.3 1.4 2 3.2 2 5.4 0 1.2-.4 2.6-1.2 4.2-1 2-2.3 4-3.8 6zm0-15c-.5 0-1.2.5-1.8 1.2-.8.9-1.2 2-1.2 3.4 0 .8.3 1.8.8 3 .7 1.4 1.5 2.8 2.2 4 .7-1.2 1.5-2.6 2.2-4 .5-1.2.8-2.2.8-3 0-1.4-.4-2.5-1.2-3.4-.6-.7-1.3-1.2-1.8-1.2z" fill="#fff"/></svg>
                <span className="text-white text-[11px] font-bold tracking-wider">airbnb</span>
              </div>
              <div className="absolute w-[190px] h-[120px] rounded-xl overflow-hidden shadow-lg" style={{ right: '2%', top: '48%', transform: 'translateY(-50%) rotate(18deg)', zIndex: 2 }}>
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=260&fit=crop" alt="Sunset beach" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 to-purple-400/25" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="44" height="44" viewBox="0 0 32 32" fill="none"><path d="M16 22c-1.5-2-2.8-4-3.8-6-.8-1.6-1.2-3-1.2-4.2 0-2.2.7-4 2-5.4C13.8 5.2 15.3 4.5 16 4.5c.7 0 2.2.7 3 1.9 1.3 1.4 2 3.2 2 5.4 0 1.2-.4 2.6-1.2 4.2-1 2-2.3 4-3.8 6zm0-15c-.5 0-1.2.5-1.8 1.2-.8.9-1.2 2-1.2 3.4 0 .8.3 1.8.8 3 .7 1.4 1.5 2.8 2.2 4 .7-1.2 1.5-2.6 2.2-4 .5-1.2.8-2.2.8-3 0-1.4-.4-2.5-1.2-3.4-.6-.7-1.3-1.2-1.8-1.2z" fill="#fff"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTIONS ABOUT HOSTING */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative rounded-2xl overflow-hidden h-[400px]">
          <img src="hosting.png" alt="Happy host" className="w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 70%)' }} />
          <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16">
            <h2 className="text-white text-[40px] md:text-[48px] font-bold mb-5 leading-[1.08]">Questions<br />about<br />hosting?</h2>
            <button className="bg-white text-gray-900 px-5 py-2.5 rounded-lg font-semibold text-sm w-fit hover:bg-gray-100 transition shadow-md">Ask a Superhost</button>
          </div>
        </div>
      </div>

      {/* FUTURE GETAWAYS */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Inspiration for future getaways</h2>
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {getawayTabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-4">
          {getawayContent[activeTab]?.map((place, i) => (
            <div key={i} className="cursor-pointer group">
              <p className="font-medium text-sm text-gray-900 group-hover:underline">{place}</p>
              <p className="text-xs text-gray-500">Holiday rentals</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-sm mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:underline">Help Centre</a></li>
                <li><a href="#" className="hover:underline">AirCover</a></li>
                <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
                <li><a href="#" className="hover:underline">Disability support</a></li>
                <li><a href="#" className="hover:underline">Cancellation options</a></li>
                <li><a href="#" className="hover:underline">Report neighbourhood concern</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Hosting</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:underline">Airbnb your home</a></li>
                <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
                <li><a href="#" className="hover:underline">Hosting resources</a></li>
                <li><a href="#" className="hover:underline">Community forum</a></li>
                <li><a href="#" className="hover:underline">Hosting responsibly</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Airbnb</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:underline">Newsroom</a></li>
                <li><a href="#" className="hover:underline">New features</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Investors</a></li>
                <li><a href="#" className="hover:underline">Gift cards</a></li>
                <li><a href="#" className="hover:underline">Airbnb.org emergency stays</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Policies</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:underline">Terms</a></li>
                <li><a href="#" className="hover:underline">Privacy</a></li>
                <li><a href="#" className="hover:underline">Site Map</a></li>
                <li><a href="#" className="hover:underline">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>© 2024 Airbnb, Inc.</span>
              <span className="hidden md:inline">·</span>
              <a href="#" className="hover:underline hidden md:inline">Privacy</a>
              <span className="hidden md:inline">·</span>
              <a href="#" className="hover:underline hidden md:inline">Terms</a>
              <span className="hidden md:inline">·</span>
              <a href="#" className="hover:underline hidden md:inline">Sitemap</a>
            </div>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline"><Globe size={16} /> English (ZA)</button>
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline">R <span>ZAR</span></button>
              <div className="flex gap-4">
                <svg className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <svg className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <svg className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}