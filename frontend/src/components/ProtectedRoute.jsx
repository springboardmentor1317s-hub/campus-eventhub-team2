import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (role && role !== userRole) {
    // logged in but wrong role → redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
