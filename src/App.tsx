import React from "react";
import { Routes, Route } from "react-router-dom";

// Main Components
import Navbar from "./component/Navbar";
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

// User Auth
import Register from "./pages/Register";
import Login from "./pages/UserLogin";

// Blog Pages
import BlogList from "./pages/BlogList";
import CreateBlog from "./pages/CreateBlog";
import BlogPage from "./pages/BlogPage";

const App: React.FC = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <FeaturedSection />
              <AboutSection />
              <TravelGuides />
              <Destinations />
              <PageBottomSection />
            </>
          }
        />

        {/* Continent Pages */}
        <Route path="/africa" element={<Africa />} />
        <Route path="/america" element={<America />} />
        <Route path="/asia" element={<Asia />} />
        <Route path="/europe" element={<Europe />} />
        <Route path="/middle-east" element={<MiddleEast />} />
        <Route path="/oceania" element={<Oceania />} />

        {/* User Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Blog Routes */}
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/create" element={<CreateBlog />} />
        <Route path="/blogs/:id" element={<BlogPage />} />

        {/* 404 Page */}
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
