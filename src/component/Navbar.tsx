import { FaGlobe } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [showDestinations, setShowDestinations] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);

  return (
    <nav className="navbar bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="logo flex items-center gap-2 text-xl font-bold">
        <FaGlobe />
        The World Travel Guy
      </div>

      <ul className="nav-links flex items-center gap-6">
        <li>
          <Link to="/" className="hover:underline">
            HOME
          </Link>
        </li>
        <li>
          <Link to="/blogs" className="hover:underline">
            BLOG
          </Link>
        </li>

        {/* Destinations Dropdown */}
        <li
          className="dropdown relative"
          onMouseEnter={() => setShowDestinations(true)}
          onMouseLeave={() => setShowDestinations(false)}
        >
          DESTINATIONS ▾
          {showDestinations && (
            <ul className="dropdown-menu absolute bg-white text-black mt-1 p-2 rounded shadow">
              <li>
                <Link to="/africa">Africa</Link>
              </li>
              <li>
                <Link to="/america">America</Link>
              </li>
              <li>
                <Link to="/asia">Asia</Link>
              </li>
              <li>
                <Link to="/europe">Europe</Link>
              </li>
              <li>
                <Link to="/middle-east">Middle East</Link>
              </li>
              <li>
                <Link to="/oceania">Oceania</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Categories Dropdown */}
        <li
          className="dropdown relative"
          onMouseEnter={() => setShowCatDropdown(true)}
          onMouseLeave={() => setShowCatDropdown(false)}
        >
          CATEGORIES ▾
          {showCatDropdown && (
            <ul className="dropdown-menu absolute bg-white text-black mt-1 p-2 rounded shadow grid grid-cols-2 gap-2 w-48">
              <li>Beaches</li>
              <li>Bucket List</li>
              <li>Hikes</li>
              <li>Wildlife</li>
              <li>Waterfalls</li>
              <li>Itineraries</li>
              <li>Monuments</li>
              <li>UNESCO Geoparks</li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/gallery" className="hover:underline">
            GALLERY
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:underline">
            ABOUT
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:underline">
            CONTACT
          </Link>
        </li>

        {/* Login/Register Links */}
        <li>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        </li>
        <li>
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
