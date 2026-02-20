import { getUserByIdService } from "../../services/user.services";
import { useState, useRef, useEffect } from "react";
import SettingsModal from "../pages/SettingsModal";
import ProfileModal from "../pages/ProfileModal";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineMenu,
  HiOutlineUserCircle,
  HiOutlineLogout,
} from "react-icons/hi";
import Swal from "sweetalert2";
import { logoutService } from "../../services/auth.service";

interface Props {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: Props) => {

  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [myprofileOpen, setmyProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userId] = useState(1);
  const [settingsOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  const menuRef = useRef<HTMLDivElement>(null);

  /* 👉 Obtener usuario */
  const refreshUser = async () => {
    try {
      const data = await getUserByIdService(userId);
      setUser(data);
    } catch (error) {
      console.error("Error cargando usuario:", error);
    }
  };

  /* 👉 Carga inicial */
  useEffect(() => {
    refreshUser();
  }, [userId]);

  /* 👉 Auto refresh cada 30s (opcional pero recomendado) */
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /* 👉 Reloj en vivo */
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* 👉 Cerrar dropdown */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Seguro que deseas cerrar sesión?",
      text: "Tu sesión se cerrará",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#1A3263",
      cancelButtonColor: "#CB942F",
    });

    if (!result.isConfirmed) return;

    logoutService();

    await Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      timer: 1000,
      showConfirmButton: false,
    });

    navigate("/login", { replace: true });
  };

  /* Avatar fallback */
  const avatarUrl = (userName: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName || "Usuario"
    )}&background=1A3263&color=FFFFFF&rounded=true&size=128&bold=true`;

  /* Saludo dinámico */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Buenos días 🌤";
    if (hour >= 12 && hour < 19) return "Buenas tardes ☀️";
    return "Buenas noches 😴";
  };

  /* Formato hora */
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes}:${seconds} ${period}`;
  };

  /* Formato fecha */
  const formatDate = (date: Date) =>
    date.toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* IZQUIERDA */}
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuClick}
          className="md:hidden text-primary"
          aria-label="Abrir menú"
        >
          <HiOutlineMenu size={26} />
        </button>

        <div className="hidden md:flex items-center gap-4">
          <h1 className="text-lg font-semibold text-primary">
            {getGreeting()}
          </h1>

          <div className="w-px h-8 bg-gray-300"></div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-600">
              {formatTime(time)}
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {formatDate(time)}
            </span>
          </div>
        </div>
      </div>

      {/* PERFIL */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-3"
        >
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 lowercase first-letter:uppercase">
              {user?.role}
            </p>
          </div>

          <img
            src={user?.avatar || avatarUrl(user?.name)}
            alt="Avatar usuario"
            className="w-9 h-9 rounded-full border border-gray-200"
          />
        </button>

        {profileOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border overflow-hidden z-50">
            <div className="px-4 py-3 border-b">
              <p className="font-semibold text-primary">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 lowercase first-letter:uppercase">
                {user?.role}
              </p>
            </div>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
              onClick={() => setmyProfileOpen(true)}
            >
              <HiOutlineUserCircle />
              Mi perfil
            </button>

            <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
            >
              <HiOutlineLogout />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* MODALES */}
      <ProfileModal
        open={myprofileOpen}
        onClose={() => {
          setmyProfileOpen(false);
          refreshUser(); // refresca info al cerrar
        }}
        user={user}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => { }}
      />
    </header>
  );
};

export default Topbar;