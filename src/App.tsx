import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import FeaturedSection from "./component/FeaturedSection";
import AboutSection from "./component/AboutSection";
import TravelGuides from "./component/TravelGuides";
import PageBottomSection from "./component/PageBottomSection";

import Africa from "./pages/Africa";
import America from "./pages/America";
import Register from "./pages/Register";
import Login from "./pages/UserLogin";

const App: React.FC = () => {
  return (
    <>
      <Navbar />

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
              <PageBottomSection />
            </>
          }
        />

        {/* Other Pages */}
        <Route path="/africa" element={<Africa />} />
        <Route path="/america" element={<America />} />
        <Route path="/login" element={<Login onClose={() => console.log("Login closed")} />} />
        <Route path="/register" element={<Register onClose={() => console.log("Register closed")} />} />
      </Routes>
    </>
  );
};

export default App;
