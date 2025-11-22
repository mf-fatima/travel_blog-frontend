import React, { useState } from "react";

interface LoginProps {
  onClose?: () => void; // optional, for modal use
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login submitted with ${form.email}`);
    if (onClose) onClose();
  };

  const content = (
    <form
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 border rounded mt-2"
        required
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full p-2 border rounded mt-2"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700"
      >
        Login
      </button>
      {onClose && (
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          ✖
        </button>
      )}
    </form>
  );

  // Render as modal if onClose exists, else full page
  return onClose ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {content}
    </div>
  ) : (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">{content}</div>
  );
};

export default Login;
