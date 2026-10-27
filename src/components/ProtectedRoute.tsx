import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[] ;
}

// ProtectedRoute.tsx
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);

  if (auth?.loading) {
    return <div>Loading...</div>; // or a spinner component later
  }

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && auth.user && !allowedRoles.includes(auth.user.role.name)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}