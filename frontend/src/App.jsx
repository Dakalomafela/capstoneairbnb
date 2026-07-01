import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LocationPage from "./pages/LocationPage";
import ListingDetails from "./pages/ListingDetails";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MyReservations from "./pages/MyReservations";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import ReservationsPage from "./pages/ReservationsPage";
import MyHotelList from "./pages/MyHotelList";
import AdminSignup from './pages/AdminSignup';

function App() {
  return (
    <BrowserRouter>
      {/* <NavbarLinks />  REMOVED for now */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location/:location" element={<LocationPage />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/my-listings" element={<MyHotelList />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reservations" element={<MyReservations />} />
        <Route path="/admin/listings/edit/:id" element={<EditListing />} />
        <Route path="*" element={<Home />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
      </Routes>
    </BrowserRouter>
  );
} 

export default App;