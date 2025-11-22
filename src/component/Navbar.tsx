import { FaGlobe } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [showDestinations, setShowDestinations] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLLIElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setShowDestinations(false);
  };

  return (
    <nav className="navbar bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="logo flex items-center gap-2 text-xl font-bold">
        <FaGlobe />
        The World Travel Guy
      </div>

      <ul className="nav-links flex items-center gap-6">
        <li onClick={() => navigate("/")}>HOME</li>
        <li onClick={() => navigate("/blog")}>BLOG</li>

        <li
          className="dropdown relative"
          onMouseEnter={() => setShowDestinations(true)}
          onMouseLeave={() => setShowDestinations(false)}
        >
          DESTINATIONS ▾
          {showDestinations && (
            <ul className="dropdown-menu absolute bg-white text-black mt-1 p-2 rounded shadow">
              <li onClick={() => handleNavigate("/africa")}>Africa</li>
              <li onClick={() => handleNavigate("/america")}>America</li>
              <li onClick={() => handleNavigate("/asia")}>Asia</li>
              <li onClick={() => handleNavigate("/europe")}>Europe</li>
              <li onClick={() => handleNavigate("/middle-east")}>Middle East</li>
              <li onClick={() => handleNavigate("/oceania")}>Oceania</li>
            </ul>
          )}
        </li>

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

        <li onClick={() => navigate("/gallery")}>GALLERY</li>
        <li onClick={() => navigate("/about")}>ABOUT</li>
        <li onClick={() => navigate("/contact")}>CONTACT</li>

        <li className="relative" ref={profileRef}>
          <img
            src="/logo.jpg"
            alt="profile"
            className="profile-icon w-8 h-8 rounded-full cursor-pointer"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          />
          {showProfileMenu && (
            <ul className="profile-menu absolute right-0 mt-2 bg-white text-black rounded shadow p-2 w-32">
              <li
                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                onClick={() => {
                  navigate("/login");
                  setShowProfileMenu(false);
                }}
              >
                Login
              </li>
              <li
                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                onClick={() => {
                  navigate("/register");
                  setShowProfileMenu(false);
                }}
              >
                Register
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
