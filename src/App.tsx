import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./components/Home.tsx";
import Login from "./dashboard/auth/Auth.tsx";

// Dashboard
import DashboardLayout from "./dashboard/layout/DashboardLayout.tsx";
import DashboardHome from "./dashboard/pages/DashboardHome.tsx";
import BlogAdmin from "./dashboard/pages/BlogAdmin.tsx";

// Guard
import ProtectedRoute from "./guards/ProtectedRoute.tsx";

import NotFound from "./dashboard/pages/NotFound.tsx";
import Register from "./dashboard/auth/Register.tsx";
import Clients from "./dashboard/pages/Clients.tsx";
import Calendar from "./dashboard/pages/Calendar.tsx";
import Cases from "./dashboard/pages/Cases.tsx";
import Billing from "./dashboard/pages/Billing.tsx";
import Stats from "./dashboard/pages/Stats.tsx";
import Contacts from "./dashboard/pages/Contacts.tsx";
import Lawyers from "./dashboard/pages/Lawyers.tsx";

export default function App() {
  return (
    <Routes>

      {/* Landing pública */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Register */}
      <Route path="/register" element={<Register />} />

      {/* Dashboard protegido */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/clientes" element={<Clients />} />
          <Route path="/dashboard/calendario" element={<Calendar />} />
          <Route path="/dashboard/asuntos" element={<Cases />} />
          <Route path="/dashboard/cobros" element={<Billing />} />
          <Route path="/dashboard/estadisticas" element={<Stats />} />
          <Route path="/dashboard/blog" element={<BlogAdmin />} />
          <Route path="/dashboard/contactos" element={<Contacts />} />
          <Route path="/dashboard/abogados" element={<Lawyers />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}