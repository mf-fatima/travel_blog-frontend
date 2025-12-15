import { Routes, Route } from "react-router-dom";

// Context

// Layout
import Navbar from "./component/Navbar";

// Main Sections
import Hero from "./component/Hero";
import FeaturedSection from "./component/FeaturedSection";
import AboutSection from "./component/AboutSection";
import TravelGuides from "./component/TravelGuides";
import Destinations from "./component/Destinations";
import PageBottomSection from "./component/PageBottomSection";

// Continent Pages
import Asia from "./pages/Asia";
import Africa from "./pages/Africa";
import America from "./pages/America";
import MiddleEast from "./pages/MiddleEast";
import Europe from "./pages/Europe";
import Oceania from "./pages/Oceania";

// Auth
import Register from "./pages/Register";
import Login from "./pages/UserLogin";

// Blogs
import BlogList from "./pages/BlogList";
import CreateBlog from "./pages/CreateBlog";
import BlogPage from "./pages/BlogPage";
import CategoryPage from "./pages/CategoryPage";
import MyBlogs from "./pages/MyBlogs";
import EditBlog from "./pages/EditBlog";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Protected Route
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

const PublicShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    {children}
    <PageBottomSection />
  </>
);

const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: "100vh", background: "#0b1020", color: "#e5e7eb" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>{children}</div>
  </div>
);

const App: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <PublicShell>
              <Hero />
              <FeaturedSection />
              <AboutSection />
              <TravelGuides />
              <Destinations />
            </PublicShell>
          }
        />

        {/* Continent Pages */}
        <Route path="/africa" element={<PublicShell><Africa /></PublicShell>} />
        <Route path="/america" element={<PublicShell><America /></PublicShell>} />
        <Route path="/asia" element={<PublicShell><Asia /></PublicShell>} />
        <Route path="/europe" element={<PublicShell><Europe /></PublicShell>} />
        <Route path="/middle-east" element={<PublicShell><MiddleEast /></PublicShell>} />
        <Route path="/oceania" element={<PublicShell><Oceania /></PublicShell>} />

        {/* Static Pages */}
        <Route path="/about" element={<PublicShell><About /></PublicShell>} />
        <Route path="/contact" element={<PublicShell><Contact /></PublicShell>} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<PublicShell><Login /></PublicShell>} />
        <Route path="/register" element={<PublicShell><Register /></PublicShell>} />
        <Route path="/admin/login" element={<AdminShell><Login /></AdminShell>} />

        {/* Blog Routes */}
        <Route path="/blogs" element={<PublicShell><BlogList /></PublicShell>} />
        <Route path="/category/:id" element={<PublicShell><CategoryPage /></PublicShell>} />
        <Route path="/my-blogs" element={<PublicShell><MyBlogs /></PublicShell>} />

        <Route
          path="/blogs/edit/:id"
          element={
            <ProtectedRoute>
              <PublicShell><EditBlog /></PublicShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/blogs/create"
          element={
            <ProtectedRoute>
              <PublicShell><CreateBlog /></PublicShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <ProtectedRoute>
              <PublicShell><BlogPage /></PublicShell>
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<AdminShell><ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute></AdminShell>} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="text-center p-20">
              <h2 className="text-3xl font-bold text-red-500">
                Page Not Found
              </h2>
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;
