import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute ensures that only authenticated users can access certain routes.
 * It checks if a valid token exists in localStorage.
 * If not, it redirects the user to /login.
 */
export default function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // "admin" or "district"

  // ❌ No token? Redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but wrong role (optional check)
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Authenticated → Allow access
  return <Outlet />;
}
