import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star, Heart, Share, ChevronLeft, Home, Users, Bed, Bath,
  Wifi, Car, Utensils, Wind, Tv, Droplets, Flame, Check,
  Shield, Clock, MessageCircle, Award, ChevronRight,
  KeyRound, Baby, Cigarette, PawPrint, PartyPopper,
  SprayCan, Wind as WindIcon, AlertTriangle
} from "lucide-react";
import { apiUrl } from "../api";

// ─── Safe Text Helper ────────────────────────────────────
const safeText = (val, fallback = "") => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    if (val.name && typeof val.name === 'string') return val.name;
    if (val.text && typeof val.text === 'string') return val.text;
    return fallback;
  }
  return fallback;
};

// ─── Helpers ─────────────────────────────────────────────
const getListingImage = (listing) => {
  if (!listing) return null;
  if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
    const first = listing.images[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object') return first.url || first.image || first.src || first.link || null;
  }
  if (listing.image && typeof listing.image === 'string') return listing.image;
  if (listing.image_url && typeof listing.image_url === 'string') return listing.image_url;
  if (listing.photo && typeof listing.photo === 'string') return listing.photo;
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

const getAllImages = (listing) => {
  if (!listing) return [];
  const images = [];
  if (listing.images && Array.isArray(listing.images)) {
    listing.images.forEach(img => {
      if (typeof img === 'string') images.push(img);
      else if (img && typeof img === 'object') {
        const url = img.url || img.image || img.src || img.link;
        if (url) images.push(url);
      }
    });
  }
  if (images.length === 0) {
    const single = getListingImage(listing);
    if (single) images.push(single);
  }
  return images;
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
];

// ─── Safe Image ──────────────────────────────────────────
const SafeImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setErrored(false);
  }, [src]);

  const handleError = () => {
    if (!errored) {
      setErrored(true);
      setImgSrc("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop");
    }
  };

  if (!imgSrc) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <Home className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  return <img src={imgSrc} alt={alt || ""} className={className} onError={handleError} loading="lazy" />;
};

// ─── Calendar Sub-component ──────────────────────────────
function CalendarMonth({ monthName, year, selectedStart, selectedEnd }) {
  const daysInMonth = 28;
  const startOffset = 2;

  const isSelected = (day) => {
    const d = day + startOffset;
    return d >= selectedStart && d <= selectedEnd;
  };

  const isStart = (day) => day + startOffset === selectedStart;
  const isEnd = (day) => day + startOffset === selectedEnd;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={16} /></button>
        <h3 className="font-semibold text-sm">{monthName} {year}</h3>
        <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 text-center text-sm">
        {Array.from({ length: startOffset }).map((_, i) => <span key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const sel = isSelected(day);
          return (
            <div key={day} className={[
              "py-2 relative cursor-pointer",
              sel ? "bg-gray-900 text-white" : "text-gray-900 hover:bg-gray-100",
              isStart(day) ? "rounded-l-full" : "",
              isEnd(day) ? "rounded-r-full" : "",
              !sel ? "rounded-full" : ""
            ].join(" ")}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Icon Helpers ────────────────────────────────────────
const HouseRuleIcon = ({ rule }) => {
  const text = safeText(rule, "").toLowerCase();
  if (text.includes('check-in') || text.includes('checkout')) return <Clock size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  if (text.includes('self check-in') || text.includes('lockbox')) return <KeyRound size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  if (text.includes('infant') || text.includes('children')) return <Baby size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  if (text.includes('smoking')) return <Cigarette size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  if (text.includes('pet')) return <PawPrint size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  if (text.includes('party') || text.includes('event')) return <PartyPopper size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  return <Check size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
};

const HealthIcon = ({ item }) => {
  const text = safeText(item, "").toLowerCase();
  if (text.includes('cleaning') || text.includes('clean')) return <SprayCan size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  if (text.includes('covid') || text.includes('guideline')) return <WindIcon size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  if (text.includes('carbon')) return <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  if (text.includes('smoke')) return <Flame size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  if (text.includes('security') || text.includes('deposit')) return <Shield size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
  return <Check size={16} className="mt-0.5 flex-shrink-0 text-gray-500" />;
};

// ─── Main Component ──────────────────────────────────────
export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const demoData = {
    id: parseInt(id) || 10,
    title: "Modern Condo in Tokyo",
    location: "Tokyo, Japan",
    type: "Entire home",
    guests: "3-3",
    beds: 1,
    bathrooms: 1,
    bedrooms: 1,
    rating: 5.0,
    reviews: 7,
    price: 195,
    description: "A beautiful modern condo in the heart of Tokyo. Perfect for your next getaway with stunning city views and all the amenities you need.",
    amenities: ["Wifi", "Kitchen", "Garden view", "Free parking", "Air conditioning", "TV", "Washing machine", "Refrigerator", "Pool", "Hot tub"],
    images: fallbackImages,
    host: {
      name: "Ghazal",
      image: null,
      since: "2021",
      reviews: 12,
      identityVerified: true,
      superhost: true,
      bio: "Ghazal is a Superhost. Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.",
      responseRate: 100,
      responseTime: "within an hour",
    },
    bedrooms: [
      { name: "Bedroom 1", bed: "1 queen bed", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068f85f?w=400&h=300&fit=crop" }
    ],
    reviewStats: {
      cleanliness: 5.0,
      communication: 5.0,
      checkIn: 5.0,
      accuracy: 5.0,
      location: 4.9,
      value: 4.7,
    },
    reviewList: [
      { id: 1, name: "Jose", date: "December 2021", avatar: null, text: "Host was very attentive." },
      { id: 2, name: "Luke", date: "December 2021", avatar: null, text: "Nice place to stay!" },
      { id: 3, name: "Shayna", date: "December 2021", avatar: null, text: "Wonderful neighborhood, easy access to restaurants and the subway, cozy studio apartment with a super comfortable bed. Great host, super helpful and responsive. Cool murphy bed..." },
      { id: 4, name: "Josh", date: "November 2021", avatar: null, text: "Well designed and fun space, neighborhood has lots of energy and amenities." },
      { id: 5, name: "Vladko", date: "November 2020", avatar: null, text: "This is amazing place. It has everything one needs for a monthly business stay. Very clean and organized place. Amazing hospitality affordable price." },
      { id: 6, name: "Jennifer", date: "January 2022", avatar: null, text: "A centric place, near of a sub station and a supermarket with everything you need...." },
    ],
    houseRules: [
      "Check-in: After 4:00 PM",
      "Checkout: 10:00 AM",
      "Self check-in with lockbox",
      "Not suitable for infants (under 2 years)",
      "No smoking",
      "No pets",
      "No parties or events",
    ],
    healthSafety: [
      "Committed to Airbnb's enhanced cleaning process. Show more",
      "Airbnb's social-distancing and other COVID-19-related guidelines apply",
      "Carbon monoxide alarm",
      "Smoke alarm",
      "Security Deposit – if you damage the home, you may be charged up to $566",
    ],
    cancellationPolicy: "Free cancellation before Feb 14",
    country: "France",
    region: "Bordeaux",
    cityLinks: [
      ["Paris", "Nice", "Lyon", "Marseille"],
      ["Lille", "Aix-en-Provence", "Rouen", "Amiens"],
      ["Toulouse", "Montpellier", "Dijon", "Grenoble"],
    ],
    uniqueStays: [
      ["Beach House Rentals", "Camper Rentals", "Glamping Rentals", "Treehouse Rentals"],
      ["Cabin Rentals", "Tiny House Rentals", "Lakehouse Rentals", "Mountain Chalet Rentals"],
    ],
  };

  useEffect(() => {
    fetch(apiUrl(`/api/accommodations/${id}`))
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        const merged = { ...demoData, ...data };
        // Ensure bedrooms is always an array of objects
        if (!Array.isArray(merged.bedrooms)) {
          merged.bedrooms = demoData.bedrooms;
        }
        setListing(merged);
        setLoading(false);
      })
      .catch(() => {
        setListing(demoData);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5A5F]"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Something went wrong. <Link to="/" className="text-[#FF5A5F] underline ml-1">Go home</Link>
      </div>
    );
  }

  const images = getAllImages(listing);
  const displayImages = images.length > 0 ? images : fallbackImages;
  const mainImage = displayImages[0];
  const sideImages = displayImages.slice(1, 5);

  const amenityIcons = {
    wifi: Wifi, kitchen: Utensils, "garden view": Home, "free parking": Car,
    "air conditioning": Wind, tv: Tv, "washing machine": Droplets, heating: Flame,
    refrigerator: Home, pool: Droplets, "hot tub": Droplets,
  };

  const parseAmenities = (amenities) => {
    if (!amenities) return ["Wifi", "Kitchen", "Garden view"];
    if (typeof amenities === "string") {
      try { return JSON.parse(amenities); } catch { return amenities.split(",").map(s => s.trim()); }
    }
    if (Array.isArray(amenities)) return amenities;
    return ["Wifi", "Kitchen", "Garden view"];
  };

  const amenities = parseAmenities(listing.amenities);
  const reviewStats = listing.reviewStats || {};
  const reviewList = Array.isArray(listing.reviewList) ? listing.reviewList : [];
  const host = listing.host || {};
  const bedrooms = Array.isArray(listing.bedrooms) ? listing.bedrooms : [];
  const houseRules = Array.isArray(listing.houseRules) ? listing.houseRules : [];
  const healthSafety = Array.isArray(listing.healthSafety) ? listing.healthSafety : [];
  const cancellationPolicy = listing.cancellationPolicy || "Free cancellation before Feb 14";
  const cityLinks = Array.isArray(listing.cityLinks) ? listing.cityLinks : [];
  const uniqueStays = Array.isArray(listing.uniqueStays) ? listing.uniqueStays : [];

  const barWidth = (score) => `${((score || 0) / 5) * 100}%`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-[#FF5A5F] font-bold text-2xl">airbnb</Link>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-full transition">Airbnb your home</button>
            <button className="hover:bg-gray-100 p-2 rounded-full transition">
              <GlobeIcon />
            </button>
            <button className="flex items-center gap-2 border rounded-full px-3 py-2 hover:shadow-md transition">
              <MenuIcon />
              <UserIcon />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Title & Actions */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{safeText(listing.title, "Beautiful Stay")}</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm font-medium underline hover:bg-gray-100 px-3 py-2 rounded-lg transition">
              <Share size={16} /> Share
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center gap-2 text-sm font-medium underline hover:bg-gray-100 px-3 py-2 rounded-lg transition"
            >
              <Heart size={16} className={isFavorite ? "fill-[#FF5A5F] text-[#FF5A5F]" : ""} />
              {isFavorite ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden mb-8 h-[400px]">
          <div className="relative h-full overflow-hidden group cursor-pointer">
            <SafeImage src={mainImage} alt={safeText(listing.title, "Stay")} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2 h-full">
            {sideImages.map((img, i) => (
              <div key={i} className="relative overflow-hidden group cursor-pointer h-full">
                <SafeImage src={img} alt={`${safeText(listing.title, "Stay")} ${i + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
            ))}
            {sideImages.length < 4 && Array.from({ length: 4 - sideImages.length }).map((_, i) => (
              <div key={`fill-${i}`} className="relative overflow-hidden group cursor-pointer h-full">
                <SafeImage src={fallbackImages[(i + sideImages.length) % fallbackImages.length]} alt="Fallback" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Host Info */}
            <div className="border-b pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {safeText(listing.type, "Entire home")} hosted by {safeText(host.name, "Host")}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {safeText(listing.guests, "2-4")} guests · {safeText(listing.bedrooms, "1")} bedrooms · {safeText(listing.beds, "1")} beds · {safeText(listing.bathrooms, "1")} bath
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {host.image ? (
                    <SafeImage src={host.image} alt="Host" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-8 h-8 text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b pb-6 mb-6">
              <p className="text-gray-700 leading-relaxed">{safeText(listing.description, "A wonderful place to stay.")}</p>
            </div>

            {/* Where You'll Sleep */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Where you'll sleep</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {bedrooms.map((room, i) => (
                  <div key={i} className="min-w-[200px] border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-gray-200">
                      <SafeImage src={room.image} alt={safeText(room.name, "Bedroom")} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-medium text-gray-900">{safeText(room.name, "Bedroom")}</p>
                    <p className="text-sm text-gray-500">{safeText(room.bed, "1 bed")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity, i) => {
                  const key = typeof amenity === 'string' ? amenity.toLowerCase() : '';
                  const IconComp = amenityIcons[key] || Check;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <IconComp size={24} className="text-gray-700" />
                      <span className="text-gray-700">{safeText(amenity, "Amenity")}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calendar */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">7 nights in {safeText((listing.location || "New York").split(',')[0], "New York")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <CalendarMonth monthName="February" year={2022} selectedStart={21} selectedEnd={26} />
                <CalendarMonth monthName="March" year={2022} selectedStart={1} selectedEnd={5} />
              </div>
            </div>

            {/* Reviews */}
            <div className="border-b pb-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Star size={20} className="fill-[#FF5A5F] text-[#FF5A5F]" />
                <h3 className="text-xl font-semibold text-gray-900">{(listing.rating || 5.0).toFixed(1)} · {listing.reviews || 7} reviews</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mb-8">
                {[
                  { label: "Cleanliness", score: reviewStats.cleanliness || 5.0 },
                  { label: "Communication", score: reviewStats.communication || 5.0 },
                  { label: "Check-in", score: reviewStats.checkIn || 5.0 },
                  { label: "Accuracy", score: reviewStats.accuracy || 5.0 },
                  { label: "Location", score: reviewStats.location || 4.9 },
                  { label: "Value", score: reviewStats.value || 4.7 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: barWidth(item.score) }} />
                      </div>
                      <span className="text-sm text-gray-900 w-8 text-right">{item.score.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {reviewList.slice(0, 6).map((review) => (
                  <div key={review.id || Math.random()}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                        {review.avatar ? (
                          <SafeImage src={review.avatar} alt={safeText(review.name, "Guest")} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{safeText(review.name, "Guest")}</p>
                        <p className="text-xs text-gray-500">{safeText(review.date, "Recently")}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{safeText(review.text, "Great stay!")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hosted By */}
            <div className="border-b pb-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {host.image ? (
                    <SafeImage src={host.image} alt={safeText(host.name, "Host")} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Hosted by {safeText(host.name, "Ghazal")}</h3>
                  <p className="text-sm text-gray-500">Joined May {safeText(host.since, "2021")}</p>
                </div>
              </div>
              <button className="border border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                Contact Host
              </button>
            </div>

            {/* Things to Know */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Things to know</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">House rules</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {houseRules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <HouseRuleIcon rule={safeText(rule, "")} />
                        <span>{safeText(rule, "")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Health & safety</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {healthSafety.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <HealthIcon item={safeText(item, "")} />
                        <span>{safeText(item, "")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cancellation policy</h4>
                  <p className="text-sm text-gray-700 mb-2">{safeText(cancellationPolicy, "Free cancellation")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-2xl font-bold">${listing.price || 195}</span>
                  <span className="text-gray-600"> / night</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-black text-black" />
                  <span className="font-medium">{listing.rating || 4.8}</span>
                </div>
              </div>
              <button className="w-full bg-[#FF5A5F] text-white font-bold py-3 rounded-lg mt-4 hover:bg-[#e04e53] transition">
                Reserve
              </button>
              <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total before taxes</span>
                  <span>${(listing.price || 195) * 5 + 125}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t pt-8 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore other options in {safeText(listing.country, "France")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 mb-6">
            {cityLinks.flat().map((city, i) => (
              <a key={i} href={`/location/${safeText(city, "").toLowerCase()}`} className="text-sm text-gray-600 hover:underline">
                {safeText(city, "")}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">Safety information</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Community</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Airbnb.org</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Hosting</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Try hosting</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">About</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:underline">Newsroom</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Icon Components ─────────────────────────────────────
function GlobeIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}