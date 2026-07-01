import { Link } from 'react-router-dom';

export default function CityCard({ image, title, distance }) {
  return (
    <Link to="/locations" className="group cursor-pointer block">
      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-200 relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>
      <div className="mt-3">
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <p className="text-gray-500">{distance}</p>
      </div>
    </Link>
  );
}
