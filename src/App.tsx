import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./components/Home.tsx";
import Login from "./dashboard/auth/Auth.tsx";

// Dashboard
import DashboardLayout from "./dashboard/layout/DashboardLayout.tsx";
import DashboardHome from "./dashboard/pages/DashboardHome.tsx";

// Guard
import ProtectedRoute from "./guards/ProtectedRoute.tsx";

import NotFound from "./dashboard/pages/NotFound.tsx";

export default function App() {
  return (
    <Routes>

      {/* Landing pública */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard protegido */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}