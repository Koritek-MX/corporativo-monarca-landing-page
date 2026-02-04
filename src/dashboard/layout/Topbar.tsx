import { HiOutlineMenu } from "react-icons/hi";

interface Props {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: Props) => {

  const userName = "Braulio Reyes";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1A3263&color=FFFFFF&rounded=true&size=128&bold=true`;

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Buenos días 🌤";
    if (hour >= 12 && hour < 19) return "Buenas tardes ☀️";
    return "Buenas noches 😴";
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-primary"
          aria-label="Abrir menú"
        >
          <HiOutlineMenu size={26} />
        </button>

        {/* Greeting */}
        <h1 className="hidden md:block text-lg font-semibold text-primary">
          {getGreeting()}
        </h1>
      </div>

      {/* Right - User */}
      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="flex items-center gap-3">


          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-primary">
              Braulio Reyes
            </p>
            <p className="text-xs text-gray-500">
              Abogado
            </p>
          </div>
          <img
            src={avatarUrl}
            alt="Avatar usuario"
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
        </div>


      </div>
    </header>
  );
};

export default Topbar;