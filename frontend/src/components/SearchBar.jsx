import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="flex justify-center py-4">
      <div className="flex items-center border rounded-full shadow-md hover:shadow-lg transition cursor-pointer bg-white max-w-2xl w-full">
        <div className="flex-1 px-6 py-3 border-r hover:bg-gray-100 rounded-l-full transition">
          <p className="text-xs font-bold text-gray-900">Location</p>
          <p className="text-sm text-gray-500">Where are you going?</p>
        </div>
        <div className="flex-1 px-6 py-3 border-r hover:bg-gray-100 transition">
          <p className="text-xs font-bold text-gray-900">Check in</p>
          <p className="text-sm text-gray-500">Add dates</p>
        </div>
        <div className="flex-1 px-6 py-3 border-r hover:bg-gray-100 transition">
          <p className="text-xs font-bold text-gray-900">Check out</p>
          <p className="text-sm text-gray-500">Add dates</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-r-full transition">
          <div>
            <p className="text-xs font-bold text-gray-900">Guests</p>
            <p className="text-sm text-gray-500">Add guests</p>
          </div>
          <div className="bg-[#FF5A5F] p-3 rounded-full text-white">
            <Search size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
