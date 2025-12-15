import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // If no user → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
