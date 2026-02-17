import { useEffect, useState } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineClock,
} from "react-icons/hi";
import Swal from "sweetalert2";

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

import { getStatsService } from "../../services/stats.service";

const CASE_STATUS_LABELS: Record<string, string> = {
  POR_INICIAR: "Por iniciar",
  PROCESO: "En proceso",
  RESUELTO: "Resueltos",
  ARCHIVADO: "Archivados",
};

const Stats = () => {
  const [kpis, setKpis] = useState<any>(null);
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [casesData, setCasesData] = useState<any[]>([]);

  /* 👉 Cargar estadísticas */
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      Swal.fire({
        title: "Cargando estadísticas...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const [data] = await Promise.all([
        getStatsService(),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      // 👇 Aquí transformamos los estatus
      const formattedCases = data.cases.map((c: any) => ({
        name: CASE_STATUS_LABELS[c.name] || c.name,
        value: Number(c.value || 0),
      }));

      console.log("STATS BACK:", data);

      setKpis(data.kpis);
      setIncomeData(data.income);
      setCasesData(formattedCases);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los estadísticas", "error");
    } finally {
      Swal.close();
    }
  };

  /* 👉 KPIs dinámicos */
  const STATS = [
    {
      label: "Clientes",
      value: kpis?.clients || 0,
      icon: HiOutlineUserGroup,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Asuntos activos",
      value: kpis?.activeCases || 0,
      icon: HiOutlineBriefcase,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Ingresos del mes",
      value: `$${(kpis?.monthlyIncome || 0).toLocaleString()} MXN`,
      icon: HiOutlineCash,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Pagos pendientes",
      value: `$${(kpis?.pendingPayments || 0).toLocaleString()} MXN`,
      icon: HiOutlineClock,
      color: "bg-red-100 text-red-700",
    },
  ];

  const dateLabel = new Date().toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  const totalAnnual = incomeData.reduce(
    (acc, item) => acc + Number(item.total || 0),
    0
  );

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
            Ingresos mensuales -{" "}
            {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={incomeData}>
              <XAxis dataKey="month" />

              {/* 👉 Eje Y con signo pesos */}
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />

              {/* 👉 Tooltip con signo pesos */}
              <Tooltip
                formatter={(value) => `$${Number(value).toLocaleString()}`}
              />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#1A3263"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-right mt-4 font-semibold text-primary">
            Total anual: ${totalAnnual.toLocaleString("es-MX")} MXN
          </div>
        </div>

        {/* Casos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="font-semibold text-primary mb-4">
            Asuntos por estatus
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={casesData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {casesData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      [
                        "#93C5FD",
                        "#FCD34D",
                        "#86EFAC",
                        "#E5E7EB",
                      ][index % 4]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Leyenda */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {casesData.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: [
                      "#93C5FD",
                      "#FCD34D",
                      "#86EFAC",
                      "#E5E7EB",
                    ][i % 4],
                  }}
                />
                <span className="text-gray-600">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-primary/5 rounded-2xl p-6">
        <p className="text-sm text-primary font-medium">
          📌 Observaciones:
        </p>
        <p className="text-gray-700 mt-1">
          Dashboard actualizado en tiempo real con datos
          financieros y operativos del despacho.
        </p>
      </div>

    </div>
  );
};

export default Stats;