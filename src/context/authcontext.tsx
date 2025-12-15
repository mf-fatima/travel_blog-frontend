// src/context/authcontext.tsx
import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// =========================
// 🔹 Types
// =========================
interface User {
  userName: string;
  userEmail: string;
  phoneNumber?: string;
  userAddress?: string;
  profileImage?: string | null;
  userRole?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  registerUser: (form: FormData) => Promise<boolean>;
  loginUser: (data: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
}

// =========================
// 🔹 Context
// =========================
const AuthContext = createContext<AuthContextType | null>(null);

// =========================
// 🔹 Provider
// =========================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw) as User;
        if (parsed && parsed.userEmail) setUser(parsed);
      }
    } catch {}
  }, []);

  // =========================
  // REGISTER USER
  // =========================
  const registerUser = async (form: FormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/auth/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.status >= 200 && res.status < 300;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGIN USER
  // =========================
  const loginUser = async (data: LoginPayload): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/auth/login-user", {
        userEmail: data.email,
        userPassword: data.password,
      });

      const userObj = res.data?.data?.user;
      const accessToken = res.data?.data?.tokens?.accessToken;

      if (!userObj || !accessToken) {
        setError("Invalid server response");
        return false;
      }

      // ✅ Save access token only; refresh token is in HTTP-only cookie
      localStorage.setItem("accessToken", accessToken);

      // ✅ Update user state
      setUser(userObj);
      try { localStorage.setItem("user", JSON.stringify(userObj)); } catch {}

      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT USER
  // =========================
  const logout = async () => {
    try {
      await api.post("/auth/logout-user"); // backend clears cookie

      // Clear access token and user
      localStorage.removeItem("accessToken");
      try { localStorage.removeItem("user"); } catch {}
      setUser(null);

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, registerUser, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// =========================
// 🔹 Custom hook
// =========================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
