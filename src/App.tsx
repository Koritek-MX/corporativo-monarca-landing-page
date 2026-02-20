import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./components/Home.tsx";
import Login from "./dashboard/auth/Auth.tsx";
import Register from "./dashboard/auth/Register.tsx";

// Dashboard
import DashboardLayout from "./dashboard/layout/DashboardLayout.tsx";
import DashboardHome from "./dashboard/pages/DashboardHome.tsx";
import BlogAdmin from "./dashboard/pages/BlogAdmin.tsx";

// Guards
import ProtectedRoute from "./guards/ProtectedRoute.tsx";
import PublicRoute from "./guards/PublicRoute.tsx";

import NotFound from "./dashboard/pages/NotFound.tsx";
import Clients from "./dashboard/pages/Clients.tsx";
import Calendar from "./dashboard/pages/Calendar.tsx";
import Cases from "./dashboard/pages/Cases.tsx";
import Billing from "./dashboard/pages/Billing.tsx";
import Stats from "./dashboard/pages/Stats.tsx";
import Contacts from "./dashboard/pages/Contacts.tsx";
import Lawyers from "./dashboard/pages/Lawyers.tsx";
import CaseFiles from "./dashboard/pages/CaseFiles.tsx";
import PaymentInstallments from "./dashboard/pages/PaymentInstallments.tsx";
import AllBlogs from "./components/sections/AllBlogs.tsx";
import BlogDetail from "./components/sections/BlogDetail.tsx";

export default function App() {
  return (
    <Routes>

      {/* 🔐 Rutas publicas */}
      <Route element={<PublicRoute />}>
        <Route path="/blog" element={<AllBlogs />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 🔒 Dashboard protegido */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/clientes" element={<Clients />} />
          <Route path="/dashboard/calendario" element={<Calendar />} />
          <Route path="/dashboard/asuntos" element={<Cases />} />
          <Route path="/dashboard/asuntos/:caseId/expedientes" element={<CaseFiles />} />
          <Route path="/dashboard/cobros" element={<Billing />} />
          <Route path="/dashboard/cobros/:paymentId/abonos" element={<PaymentInstallments />} />
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