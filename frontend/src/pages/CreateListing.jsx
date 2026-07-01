import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Upload, X, Plus, Home, Building, TreePine, Hotel, Warehouse } from "lucide-react";

const propertyTypes = [
  { value: "apartment", label: "Apartment", icon: Building },
  { value: "house", label: "House", icon: Home },
  { value: "villa", label: "Villa", icon: Warehouse },
  { value: "cabin", label: "Cabin", icon: TreePine },
  { value: "hotel", label: "Hotel", icon: Hotel },
];

export default function CreateListing() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    city: "",
    price: "",
    description: "",
    bedrooms: "1",
    bathrooms: "1",
    guests: "2",
    propertyType: "apartment",
    amenities: [],
    images: [],
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !form.amenities.includes(amenityInput.trim())) {
      setForm({ ...form, amenities: [...form.amenities, amenityInput.trim()] });
      setAmenityInput("");
    }
  };

  const removeAmenity = (index) => {
    setForm({ ...form, amenities: form.amenities.filter((_, i) => i !== index) });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result]);
        setForm((prev) => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const res = await fetch("/api/accommodations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price) || 0,
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          guests: Number(form.guests),
          image: form.images[0] || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create listing");
      }

      setSuccess(true);
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 text-sm";
  const labelBase = "block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Airbnb Logo */}
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-rose-500" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 22c4.5-5.5 7-9 7-12.5 0-2.5-1.5-4.5-4-4.5-1.5 0-3 .5-3.5 2.5h-1C10 3 8.5 5 8.5 7.5 8.5 11 11 14.5 16 22zm-1.5-17c.5-1 1.5-1.5 2.5-1.5 1.5 0 2.5 1 2.5 2.5 0 2.5-2 5.5-5.5 10.5-3.5-5-5.5-8-5.5-10.5 0-1.5 1-2.5 2.5-2.5 1 0 2 .5 2.5 1.5h1z"/>
            </svg>
            <span className="text-rose-500 font-bold text-xl tracking-tight">airbnb</span>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">John Doe</span>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-600">
              JD
            </div>
          </div>
        </div>

        {/* View my listings link */}
        <div className="max-w-5xl mx-auto px-6 pb-3">
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            View my listings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-10">Create Listing</h1>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium text-center">
            Listing created successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Listing Name | Rooms | Baths | Type */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5">
              <label className={labelBase}>Listing Name</label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="Enter listing name"
                className={inputBase}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelBase}>Rooms</label>
              <input
                type="number"
                name="bedrooms"
                min="1"
                value={form.bedrooms}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelBase}>Baths</label>
              <input
                type="number"
                name="bathrooms"
                min="1"
                value={form.bathrooms}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
            <div className="md:col-span-3">
              <label className={labelBase}>Type</label>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                className={inputBase + " cursor-pointer"}
              >
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Location | Location (City) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className={labelBase}>Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  required
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className={inputBase + " pl-10"}
                />
              </div>
            </div>
            <div>
              <label className={labelBase}>Location</label>
              <input
                type="text"
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={inputBase}
              />
            </div>
          </div>

          {/* Row 3: Description | Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelBase}>Description</label>
              <textarea
                name="description"
                rows={6}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                className={inputBase + " resize-none"}
              />
            </div>
            <div>
              <label className={labelBase}>Amenities</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                  placeholder="Add amenity"
                  className={inputBase}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(idx)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Price & Guests (hidden in layout but needed for API) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelBase}>Price per Night ($)</label>
              <input
                type="number"
                name="price"
                required
                min="1"
                value={form.price}
                onChange={handleChange}
                placeholder="150"
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelBase}>Max Guests</label>
              <input
                type="number"
                name="guests"
                min="1"
                value={form.guests}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
          </div>

          {/* Row 5: Images */}
          <div>
            <label className={labelBase}>Images</label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Upload size={16} />
                Upload image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Image preview area */}
              {previewImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {previewImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      >
                        <X size={14} className="text-gray-700" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center text-gray-400">
                    <Upload size={32} className="mx-auto mb-2" />
                    <span className="text-sm">Click to upload images</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              type="submit"
              disabled={loading || success}
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-10 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}