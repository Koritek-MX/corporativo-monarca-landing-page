import {
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineClock,
} from "react-icons/hi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* 📈 KPIs */
const STATS = [
  {
    label: "Clientes",
    value: 128,
    icon: HiOutlineUserGroup,
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Asuntos activos",
    value: 42,
    icon: HiOutlineBriefcase,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    label: "Ingresos del mes",
    value: "$125,400 MXN",
    icon: HiOutlineCash,
    color: "bg-green-100 text-green-700",
  },
  {
    label: "Pagos pendientes",
    value: "$32,800 MXN",
    icon: HiOutlineClock,
    color: "bg-red-100 text-red-700",
  },
];

/* 📉 Ingresos */
const INCOME_DATA = [
  { month: "Ene", total: 45000 },
  { month: "Feb", total: 52000 },
  { month: "Mar", total: 48000 },
  { month: "Abr", total: 61000 },
  { month: "May", total: 58000 },
];

/* ⚖️ Asuntos */
const CASES_DATA = [
  { name: "Por iniciar", value: 10, color: "#93C5FD" },
  { name: "En proceso", value: 18, color: "#FCD34D" },
  { name: "Resueltos", value: 9, color: "#86EFAC" },
  { name: "Archivados", value: 5, color: "#E5E7EB" },
];

const Stats = () => {
  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">
          Estadísticas
        </h1>
        <p className="text-gray-600">
          Resumen general del desempeño del despacho
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${stat.color}`}
              >
                <Icon size={24} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-primary">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Ingresos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="font-semibold text-primary mb-4">
            Ingresos mensuales
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={INCOME_DATA}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#1A3263"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Asuntos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="font-semibold text-primary mb-4">
            Asuntos por estatus
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={CASES_DATA}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {CASES_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Leyenda */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {CASES_DATA.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-gray-600">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-primary/5 rounded-2xl p-6">
        <p className="text-sm text-primary font-medium">
          📌 Obvservaciones:
        </p>
        <p className="text-gray-700 mt-1">
          Los ingresos han crecido un <b>18%</b> respecto al mes anterior y
          el <b>65%</b> de los asuntos se encuentran activos o en proceso.
        </p>
      </div>

    </div>
  );
};

export default Stats;