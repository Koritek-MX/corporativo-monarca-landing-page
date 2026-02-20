import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return !isAuthenticated
    ? <Outlet />
    : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;