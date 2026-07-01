import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function NavbarLinks() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, [location]);

  const isAdmin = user?.role === "admin";

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-3">
        {/* Desktop */}
        <div className="hidden md:flex gap-5 text-sm font-medium items-center">
          <Link to="/" className="hover:text-[#FF5A5F]">Home</Link>
          
          {user && (
            <>
              <Link to="/my-listings" className="hover:text-[#FF5A5F]">My Listings</Link>
              <Link to="/reservations" className="hover:text-[#FF5A5F]">Reservations</Link>
              <Link to="/create-listing" className="hover:text-[#FF5A5F]">Create</Link>
            </>
          )}
          
          {isAdmin && (
            <>
              <Link to="/admin/dashboard" className="hover:text-[#FF5A5F]">Admin</Link>
              <Link to="/admin/reservations" className="hover:text-[#FF5A5F]">Admin Reservations</Link>
            </>
          )}
          
          {!user ? (
            <Link to="/admin/login" className="hover:text-[#FF5A5F]">Admin Login</Link>
          ) : (
            <button onClick={logout} className="hover:text-[#FF5A5F]">Logout</button>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex justify-between items-center">
          <span className="font-bold text-sm">Menu</span>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-3 pt-4 pb-2 text-sm font-medium">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            
            {user && (
              <>
                <Link to="/my-listings" onClick={() => setIsOpen(false)}>My Listings</Link>
                <Link to="/reservations" onClick={() => setIsOpen(false)}>Reservations</Link>
                <Link to="/create-listing" onClick={() => setIsOpen(false)}>Create</Link>
              </>
            )}
            
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>Admin</Link>
                <Link to="/admin/reservations" onClick={() => setIsOpen(false)}>Admin Reservations</Link>
              </>
            )}
            
            {!user ? (
              <Link to="/admin/login" onClick={() => setIsOpen(false)}>Admin Login</Link>
            ) : (
              <button onClick={() => { logout(); setIsOpen(false); }}>Logout</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}