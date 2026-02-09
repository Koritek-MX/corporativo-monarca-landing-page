import { useState, useRef, useEffect } from "react";
import {
  HiOutlineMenu,
  HiOutlineUserCircle,
  HiOutlineLogout,
} from "react-icons/hi";
import ProfileModal from "../pages/ProfileModal";
import SettingsModal from "../pages/SettingsModal";

interface Props {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: Props) => {

  const [profileOpen, setProfileOpen] = useState(false);
  const [myprofileOpen, setmyProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userName = "Braulio Reyes";

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=1A3263&color=FFFFFF&rounded=true&size=128&bold=true`;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Buenos días 🌤";
    if (hour >= 12 && hour < 19) return "Buenas tardes ☀️";
    return "Buenas noches 😴";
  };

  /* 👉 Cerrar dropdown si haces click fuera */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-primary"
          aria-label="Abrir menú"
        >
          <HiOutlineMenu size={26} />
        </button>

        <h1 className="hidden md:block text-lg font-semibold text-primary">
          {getGreeting()}
        </h1>
      </div>

      {/* RIGHT */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-3"
        >
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">
              {userName}
            </p>
            <p className="text-xs text-gray-500">
              Abogado
            </p>
          </div>

          <img
            src={avatarUrl}
            alt="Avatar usuario"
            className="w-9 h-9 rounded-full border border-gray-200"
          />
        </button>

        {/* DROPDOWN PERFIL */}
        {profileOpen && (
          <div
            className="
              absolute right-0 mt-3 w-56
              bg-white rounded-xl shadow-lg border
              overflow-hidden z-50
              animate-fade-in
            "
          >
            {/* Header */}
            <div className="px-4 py-3 border-b">
              <p className="font-semibold text-primary">
                {userName}
              </p>
              <p className="text-xs text-gray-500">
                Abogado
              </p>
            </div>

            {/* Opciones */}
            <button
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
              onClick={() => setmyProfileOpen(true)}
            >
              <HiOutlineUserCircle />
              Mi perfil
            </button>

            {/* <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
              onClick={() => setSettingsOpen(true)}
            >
              <HiOutlineCog />
              Configuración
            </button> */}

            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50">
              <HiOutlineLogout />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
      {/* MODAL PERFIL */}
      <ProfileModal
        open={myprofileOpen}
        onClose={() => setmyProfileOpen(false)}
      />
      {/* MODAL CONFIGURACIÓN */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </header>


  );
};

export default Topbar;