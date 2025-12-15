import { FaGlobe } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { useCategory } from "../context/CategoryContext";

const Navbar: React.FC = () => {
  const [showDestinations, setShowDestinations] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);

  const { user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { categories, loading, error, fetchAllCategories } = useCategory();
  const [imgFailed, setImgFailed] = useState(false);

  const resolveImageUrl = (key?: string | null) => {
    if (!key) return null;
    if (/^https?:\/\//i.test(key)) return key;
    const bucket = (import.meta as any).env?.VITE_AWS_BUCKET_NAME;
    const region = (import.meta as any).env?.VITE_AWS_REGION;
    if (bucket && region) return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    // Fallback to backend host
    const host = "http://localhost:8000";
    if (key.startsWith("/")) return host + key;
    return host + "/" + key;
  };

  const handleLogout = async () => {
    await logout();
  };

  // Load categories on navbar mount
  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <nav className="navbar bg-blue-600 text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="logo">
        <FaGlobe />
        The World Travel Guy
      </div>

      {/* Menu Links */}
      <ul className="nav-links flex items-center gap-6">
        <li>
          <Link to="/" className="hover:underline">HOME</Link>
        </li>

        <li>
          <Link to="/blogs" className="hover:underline">BLOG</Link>
        </li>

        {/* Destinations Dropdown */}
        <li
          className="dropdown relative cursor-pointer"
          onMouseEnter={() => setShowDestinations(true)}
          onMouseLeave={() => setShowDestinations(false)}
        >
          DESTINATIONS ▾
          {showDestinations && (
            <ul className="dropdown-menu absolute bg-white text-black mt-1 p-2 rounded shadow w-40">
              <li><Link to="/africa">Africa</Link></li>
              <li><Link to="/america">America</Link></li>
              <li><Link to="/asia">Asia</Link></li>
              <li><Link to="/europe">Europe</Link></li>
              <li><Link to="/middle-east">Middle East</Link></li>
              <li><Link to="/oceania">Oceania</Link></li>
            </ul>
          )}
        </li>

        {/* ================================
            CATEGORIES DROPDOWN (DYNAMIC)
        ================================= */}
        <li
          className="dropdown relative cursor-pointer"
          onMouseEnter={() => setShowCatDropdown(true)}
          onMouseLeave={() => setShowCatDropdown(false)}
        >
          CATEGORIES ▾

          {showCatDropdown && (
            <ul className="dropdown-menu absolute bg-white text-black mt-1 p-2 rounded shadow grid grid-cols-2 gap-2 w-56">
              
              {/* Loading State */}
              {loading && <li>Loading...</li>}

              {/* Error State */}
              {error && <li className="text-red-500">{error}</li>}

              {/* No categories */}
              {!loading && categories.length === 0 && (
                <li>No categories found</li>
              )}

              {/* Dynamic Categories */}
              {!loading &&
                categories.map((cat) => (
                  <li key={cat._id}>
                    <Link to={`/category/${cat._id}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </li>

        
        <li><Link to="/about" className="hover:underline">ABOUT</Link></li>
        <li><Link to="/contact" className="hover:underline">CONTACT</Link></li>

        {/* AUTH SECTION */}
        {!user ? (
          <>
            <li>
              <Link to="/login" className="hover:underline">Login</Link>
            </li>
            <li>
              <Link to="/register" className="hover:underline">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li
              className="dropdown relative cursor-pointer font-semibold flex items-center gap-2"
              onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <span className="avatar">
                {(() => {
                  const src = resolveImageUrl((user as any).profileImageUrl || user.profileImage || null);
                  const label = (user.userName?.split(" ")[0] || "User");
                  return src && !imgFailed ? (
                    <img
                      src={src}
                      alt="profile"
                      className="avatar-img"
                      onError={() => setImgFailed(true)}
                    />
                  ) : (
                    <span className="avatar-initials">{label}</span>
                  );
                })()}
              </span>
              
              {showUserDropdown && (
                <ul className="dropdown-menu user-dropdown-menu w-44">
                  <li>
                    <Link to="/my-blogs">My Blogs</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
