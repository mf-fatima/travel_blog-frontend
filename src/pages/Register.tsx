import React, { useState } from "react";
import "../pages/register.css";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    profileImg: null as File | null,
  });

  // Handle input changes
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can send formData to your backend
    console.log(formData);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              title="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              title="Enter your email address"
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              title="Enter a secure password"
              required
            />
          </div>

          {/* Address */}
          <div className="input-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              title="Enter your full address"
              required
            />
          </div>

          {/* Profile Image */}
          <div className="input-group">
            <label htmlFor="profileImg">Profile Image</label>
            <input
              id="profileImg"
              type="file"
              name="profileImg"
              accept="image/*"
              onChange={handleChange}
              title="Upload a profile image"
            />
          </div>

          {/* Register Button */}
          <button className="register-btn" type="submit">
            Register
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
