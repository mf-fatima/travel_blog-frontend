import React, { useState } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import "../pages/register.css";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    profileImg: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 🔹 Prepare FormData with correct backend keys
  const data = new FormData();
  data.append("userName", formData.name);
  data.append("userEmail", formData.email);
  data.append("userPassword", formData.password);
  data.append("userAddress", formData.address);

  if (formData.profileImg) {
    data.append("profileImage", formData.profileImg);
  }

  const success = await registerUser(data);

  if (success) {
    navigate("/login");
  }
};


  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>

        {error && <p className="error-text">{error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="input-group">
            <label>Profile Image</label>
            <input
              type="file"
              name="profileImg"
              accept="image/*"
              onChange={handleChange}
            />
          </div> */}

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
