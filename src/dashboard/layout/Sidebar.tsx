import { logoutService } from "../../services/auth.service";
import logo from "../../assets/images/monarca-gold.webp";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { VscLaw } from "react-icons/vsc";
import Swal from "sweetalert2";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineChartBar,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineNewspaper,
  HiOutlineClipboardList
} from "react-icons/hi";

interface Props {
  open: boolean;
  onClose: () => void;
}

const links = [
  { to: "/dashboard", label: "Inicio", icon: HiOutlineHome },
  { to: "/dashboard/calendario", label: "Calendario", icon: HiOutlineCalendar },
  { to: "/dashboard/clientes", label: "Clientes", icon: HiOutlineUserGroup },
  { to: "/dashboard/asuntos", label: "Asuntos", icon: HiOutlineBriefcase },
  { to: "/dashboard/abogados", label: "Abogados", icon: VscLaw },
  { to: "/dashboard/cobros", label: "Cobros", icon: HiOutlineCash },
  { to: "/dashboard/contactos", label: "Contactos", icon: HiOutlineClipboardList },
  { to: "/dashboard/blog", label: "Blog", icon: HiOutlineNewspaper },
  { to: "/dashboard/estadisticas", label: "Estadísticas", icon: HiOutlineChartBar }
];

const Sidebar = ({ open, onClose }: Props) => {

  const navigate = useNavigate();

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

    logoutService(); // 👉 elimina token y user

    await Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      timer: 1000,
      showConfirmButton: false,
    });

    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50
          top-0 left-0 h-full w-64
          bg-primary text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/20">
          <img src={logo} alt="Monarca" className="h-20" />
          <p className="uppercase font-semibold">Corporativo monarca</p>

          <button
            onClick={onClose}
            className="md:hidden text-white"
            aria-label="Cerrar menú"
          >
            <HiOutlineX size={26} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition
                ${isActive
                  ? "bg-secondary text-primary font-semibold"
                  : "hover:bg-white/10"
                }
              `
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout (bottom) */}
        <div className="px-4 py-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3
              px-4 py-3 rounded-lg
              text-white
              hover:bg-red-500/20 hover:text-red-300
              transition
            "
          >
            <HiOutlineLogout size={20} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;