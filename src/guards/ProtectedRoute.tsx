import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/hooks/AuthContext";

interface Props {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user } = useAuth();

  // 🔒 No autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Si se definieron roles permitidos y no coincide
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;