import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { AuthProvider } from "./context/authcontext";
import { BlogProvider } from "./context/BlogContext";
import { CategoryProvider } from "./context/CategoryContext";   // ✅ Add this

import "./style.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CategoryProvider>     {/* ✅ MUST wrap Blog + App */}
          <BlogProvider>
            <App />
          </BlogProvider>
        </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
