import {
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineCalendar,
  HiOutlinePlus
} from "react-icons/hi";

const stats = [
  {
    label: "Clientes activos",
    value: 128,
    icon: HiOutlineUserGroup,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Asuntos en curso",
    value: 42,
    icon: HiOutlineBriefcase,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Pagos pendientes",
    value: "$24,500",
    icon: HiOutlineCash,
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    label: "Citas hoy",
    value: 6,
    icon: HiOutlineCalendar,
    color: "bg-green-50 text-green-600",
  },
];

const DashboardHome = () => {
  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">
          Resumen general
        </h1>
        <p className="text-gray-600 mt-1">
          Vista rápida del estado actual del despacho
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-primary mt-1">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-primary mb-4">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">
                Nuevo cliente
              </p>
              <p className="text-sm text-gray-500">
                Registrar cliente
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
              <HiOutlinePlus size={20} />
            </div>
          </button>
          <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">
                Agendar cita
              </p>
              <p className="text-sm text-gray-500">
                Calendario
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
              <HiOutlinePlus size={20} />
            </div>
          </button>
          <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">
                Nuevo asunto
              </p>
              <p className="text-sm text-gray-500">
                Abrir expediente
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
              <HiOutlinePlus size={20} />
            </div>
          </button>
          <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">
                Registar pago
              </p>
              <p className="text-sm text-gray-500">
                Cobros
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
              <HiOutlinePlus size={20} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;