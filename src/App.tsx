import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Guards
import ProtectedRoute from "./guards/ProtectedRoute.tsx";
import PublicRoute from "./guards/PublicRoute.tsx";

// ===== PUBLIC PAGES =====
const Home = lazy(() => import("./components/Home.tsx"));
const Login = lazy(() => import("./dashboard/auth/Auth.tsx"));
const Register = lazy(() => import("./dashboard/auth/Register.tsx"));
const AllBlogs = lazy(() => import("./components/sections/AllBlogs.tsx"));
const BlogDetail = lazy(() => import("./components/sections/BlogDetail.tsx"));

// ===== DASHBOARD LAYOUT =====
const DashboardLayout = lazy(() => import("./dashboard/layout/DashboardLayout.tsx"));

// ===== DASHBOARD PAGES =====
const DashboardHome = lazy(() => import("./dashboard/pages/DashboardHome.tsx"));
const Clients = lazy(() => import("./dashboard/pages/Clients.tsx"));
const Calendar = lazy(() => import("./dashboard/pages/Calendar.tsx"));
const CasesDashboard = lazy(() => import("./dashboard/pages/CasesDashboard.tsx"));
const CaseFiles = lazy(() => import("./dashboard/pages/CaseFiles.tsx"));
const Billing = lazy(() => import("./dashboard/pages/Billing.tsx"));
const PaymentInstallments = lazy(() => import("./dashboard/pages/PaymentInstallments.tsx"));
const Stats = lazy(() => import("./dashboard/pages/Stats.tsx"));
const BlogAdmin = lazy(() => import("./dashboard/pages/BlogAdmin.tsx"));
const Contacts = lazy(() => import("./dashboard/pages/Contacts.tsx"));
const Lawyers = lazy(() => import("./dashboard/pages/Lawyers.tsx"));
const SuccessCases = lazy(() => import("./dashboard/pages/successCases.tsx"));
const FAQDashboard = lazy(() => import("./dashboard/pages/FAQDashboard.tsx"));

// ===== ERROR PAGE =====
const NotFound = lazy(
  () => import("./dashboard/pages/NotFound.tsx")
);

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-gray-500">
          Cargando...
        </div>
      }
    >
      <Routes>

        {/* 🔐 Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<AllBlogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 🔒 Dashboard protegido */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/clientes" element={<Clients />} />
            <Route path="/dashboard/calendario" element={<Calendar />} />
            <Route path="/dashboard/asuntos" element={<CasesDashboard />} />
            <Route path="/dashboard/asuntos/:caseId/expedientes" element={<CaseFiles />} />
            <Route path="/dashboard/cobros" element={<Billing />} />
            <Route path="/dashboard/cobros/:paymentId/abonos" element={<PaymentInstallments />} />
            <Route path="/dashboard/estadisticas" element={<Stats />} />
            <Route path="/dashboard/blog" element={<BlogAdmin />} />
            <Route path="/dashboard/contactos" element={<Contacts />} />
            {/* ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/dashboard/abogados" element={<Lawyers />} />
              <Route path="/dashboard/casos-exito" element={<SuccessCases />} />
              <Route path="/dashboard/preguntas-respuestas" element={<FAQDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}