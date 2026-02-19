
import { getDashboardStatsService } from "../../services/stats.service";
import { getTodayEventsService } from "../../services/event.service";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlineClock
} from "react-icons/hi";
import type { Client, ClientType } from "../../types/client.type";
import { createClientService } from "../../services/client.service";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  activeCases: number;
  clients: number;
  pendingPayments: number;
};

const emptyClient: Client = {
  type: "FISICA",
  name: "",
  lastName: "",
  phone: "",
  email: "",
  rfc: "",
  password: "",
  confirmPassword: "",
  address: {
    state: "",
    city: "",
    colony: "",
    postalCode: "",
    street: "",
    extNumber: "",
    intNumber: "",
  },
  id: 0
};

const DashboardHome = () => {

  const navigate = useNavigate();
  const [openClientModal, setOpenClientModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeCases: 0,
    clients: 0,
    pendingPayments: 0,
  });
  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState<Client>(emptyClient);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    loadDashboardStats();
    loadTodayEvents(userId);
  }, []);

  const loadDashboardStats = async () => {
    try {
      Swal.fire({
        title: "Cargando información...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const [data] = await Promise.all([
        getDashboardStatsService(),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);
      setDashboardStats(data);
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la información", "error");
    } finally {
      Swal.close();
    }
  };

  const loadTodayEvents = async (userId: number) => {
    try {
      const data = await getTodayEventsService(userId);
      setEvents(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los eventos", "error");
    }
  };

  const stats = [
    {
      label: "Clientes activos",
      value: dashboardStats?.clients || 0,
      icon: HiOutlineUserGroup,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Asuntos avtivos",
      value: dashboardStats?.activeCases || 0,
      icon: HiOutlineBriefcase,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Pagos pendientes",
      value: `$${(dashboardStats?.pendingPayments || 0).toLocaleString()} MXN`,
      icon: HiOutlineClock,
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Citas hoy",
      value: events.length || 0,
      icon: HiOutlineCalendar,
      color: "bg-green-50 text-green-600",
    },
  ];

  const createClient = async () => {
    if (!form.name || !form.email) {
      Swal.fire("Error", "Nombre y correo son obligatorios", "error");
      return;
    }

    try {
      const payload = {
        type: form.type.trim().toUpperCase() as ClientType,
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        rfc: form.rfc.trim(),
        address: {
          state: form.address.state.trim(),
          city: form.address.city.trim(),
          colony: form.address.colony.trim(),
          postalCode: form.address.postalCode.trim(),
          street: form.address.street.trim(),
          extNumber: form.address.extNumber.trim(),
          intNumber: form.address.intNumber.trim()
        }
      };


      await createClientService(payload);

      await Swal.fire({
        icon: "success",
        title: "Cliente creado",
        timer: 1500,
        showConfirmButton: false,
      });

      setOpenClientModal(false);
      setForm(emptyClient);
      navigate(`/dashboard/clientes`);

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar el cliente", "error");
    }
  };

  const isFormValid =
    form.type &&
    form.name &&
    form.lastName &&
    form.phone &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.address.state &&
    form.address.city &&
    form.address.colony &&
    form.password === form.confirmPassword;


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
          <button
            onClick={() => setOpenClientModal(true)}
            className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">
                Nuevo cliente
              </p>
              <p className="text-sm text-gray-500">
                Clientes
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
              <HiOutlinePlus size={20} />
            </div>
          </button>
          <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">
                Crear evento
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
                Asuntos
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
              <HiOutlinePlus size={20} />
            </div>
          </button>
          <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">
                Registar cobro
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

      {/* Calendar / Pending */}
      {events.length > 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">
              Pendientes de hoy
            </h2>

            <HiOutlineCalendar className="text-primary" size={22} />
          </div>

          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-primary">
                    {event.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.category}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HiOutlineClock />
                  {new Date(event.start).toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  {" - "}
                  {new Date(event.end).toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="text-5xl mb-3">📅</div>
          <p className="font-semibold text-lg">
            No hay eventos hoy registrados
          </p>
          <p className="text-sm">
            Cuando agregues uno aparecerá aquí.
          </p>
        </div>
      )}

      {openClientModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Nuevo cliente
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-6 max-h-[75vh] overflow-y-auto">

              {/* Información general */}
              <section>
                <h3 className="font-semibold mb-4">
                  Información general
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  >
                    <option value="FISICA">Persona Física</option>
                    <option value="MORAL">Persona Moral</option>
                  </select>

                  <input
                    placeholder="RFC"
                    value={form.rfc}
                    onChange={(e) =>
                      setForm({ ...form, rfc: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Nombre(s)"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Apellidos"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Teléfono"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={form.password || ""}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={form.confirmPassword || ""}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                </div>

                {form.confirmPassword &&
                  form.password !== form.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2">
                      Las contraseñas no coinciden
                    </p>
                  )}
              </section>

              {/* Dirección */}
              <section>
                <h3 className="font-semibold mb-4">Dirección</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <input
                    placeholder="Estado"
                    value={form.address.state}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: {
                          ...form.address,
                          state: e.target.value,
                        },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />

                  <input
                    placeholder="Municipio"
                    value={form.address.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: {
                          ...form.address,
                          city: e.target.value,
                        },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />

                  <input
                    placeholder="Colonia"
                    value={form.address.colony}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: {
                          ...form.address,
                          colony: e.target.value,
                        },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />

                  <input
                    placeholder="Código Postal"
                    value={form.address.postalCode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, postalCode: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="Calle"
                    value={form.address.street}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, street: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="No. Exterior"
                    value={form.address.extNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, extNumber: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="No. Interior"
                    value={form.address.intNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, intNumber: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setOpenClientModal(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>

              <button
                onClick={createClient}
                disabled={!isFormValid}
                className={`px-6 py-2 rounded-lg font-semibold transition
                  ${isFormValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Guardar cliente
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;