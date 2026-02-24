import { createInstallmentService } from "../../services/paymentInstallments.service";
import { createEventService, getTodayEventsService } from "../../services/event.service";
import { createClientService, getClientsService } from "../../services/client.service";
import { getDashboardStatsService } from "../../services/stats.service";
import { createPaymentsService } from "../../services/payment.service";
import type { Client, ClientType } from "../../types/client.type";
import { getUsersService } from "../../services/user.services";
import { useAuth } from "../../components/hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createCaseService,
  getCasesByClientIdService,
  getCasesByLawyerIdService
} from "../../services/case.services";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlineClock
} from "react-icons/hi";

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

const emptyEvent = {
  title: "",
  category: "audiencia",
  start: "",
  end: "",
  guests: [] as { value: string; label: string }[],
  caseId: "",
}

const emptyCase = {
  title: "",
  folio: "",
  area: "",
  description: "",
  status: "POR_INICIAR",
  clientId: "",
  lawyerId: ""
};

const emptyPayments = {
  currency: "MXN",
  totalAmount: "",
  finalAmount: "",
  initialPaid: "",
  iva: 16,
  status: "pendiente",
  sendEmail: false,
  clientId: "",
  caseId: "",
  invoiceUrl: "",
}

const initialStats = {
  activeCases: 0,
  clients: 0,
  pendingPayments: 0,
};



const DashboardHome = () => {

  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(initialStats);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [openCaseModal, setOpenCaseModal] = useState(false);
  const [formPayment, setFormPayment] = useState<any>(emptyPayments);
  const [formClient, setFormClient] = useState<any>(emptyClient);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [formEvent, setFormEvent] = useState<any>(emptyEvent);
  const [formCase, setFormCase] = useState<any>(emptyCase);
  const [detailOpen, setDetailOpen] = useState(false);
  const [includeIva, setIncludeIva] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    loadDashboardStats();
    loadTodayEvents(user.id);
    loadCases(user.id);
    loadUsers();
    loadClients();
  }, [user]);

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
      console.log("EVENTOS DE HOY", data);
      setEvents(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los eventos", "error");
    }
  };

  const loadCases = async (id: any) => {
    try {
      const data = await getCasesByLawyerIdService(id);
      setCases(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los casos", "error");
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsersService();
      const formatted = data.map((u: any) => ({
        value: u.id,
        label: u.name,
      }));
      setUsers(formatted);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  const loadClients = async () => {
    try {
      const data = await getClientsService();
      setClients(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    }
  };

  const loadCasesByClient = async (clientId: number) => {
    try {
      Swal.fire({
        title: "Cargando asuntos...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const start = Date.now();

      const data = await getCasesByClientIdService(clientId);
      setCases(data);

      // 👇 Garantiza mínimo 700ms de loader
      const elapsed = Date.now() - start;
      if (elapsed < 700) {
        await new Promise((resolve) =>
          setTimeout(resolve, 700 - elapsed)
        );
      }

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los asuntos", "error");
    } finally {
      Swal.close();
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
      label: "Eventos hoy",
      value: events.length || 0,
      icon: HiOutlineCalendar,
      color: "bg-green-50 text-green-600",
    },
  ];

  const createClient = async () => {
    if (!formClient.name || !formClient.email) {
      Swal.fire("Error", "Nombre y correo son obligatorios", "error");
      return;
    }
    try {
      const payload = {
        type: formClient.type.trim().toUpperCase() as ClientType,
        name: formClient.name.trim(),
        lastName: formClient.lastName.trim(),
        phone: formClient.phone.trim(),
        email: formClient.email.trim(),
        rfc: formClient.rfc.trim(),
        address: {
          state: formClient.address.state.trim(),
          city: formClient.address.city.trim(),
          colony: formClient.address.colony.trim(),
          postalCode: formClient.address.postalCode.trim(),
          street: formClient.address.street.trim(),
          extNumber: formClient.address.extNumber.trim(),
          intNumber: formClient.address.intNumber.trim()
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
      setFormClient(emptyClient);
      navigate(`/dashboard/clientes`);
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el cliente", "error");
    }
  };


  const openCreateModal = () => {
    const { start, end } = getNowPlusOneHour();
    setFormEvent({
      title: "",
      category: "",
      start,
      end,
      guests: [],
      caseId: "",
    });
    setOpenEventModal(true);
  };

  const getNowPlusOneHour = () => {
    const now = new Date();
    const plusOne = new Date(now.getTime() + 60 * 60 * 1000);
    const formatLocal = (date: Date) => {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    return {
      start: formatLocal(now),
      end: formatLocal(plusOne),
    };
  };
  const handleCreateEvent = async () => {
    if (!formEvent.title || !formEvent.start) return;
    try {
      if (new Date(formEvent.end) < new Date(formEvent.start)) {
        Swal.fire({
          icon: "warning",
          title: "Hora inválida",
          text: "La hora de fin no puede ser antes que la hora de inicio",
        });
        return;
      }
      await createEventService({
        title: formEvent.title,
        start: formEvent.start,
        end: formEvent.end,
        category: formEvent.category,
        caseId: formEvent.caseId ? Number(formEvent.caseId) : null,
        userId: user.id,
        guests: formEvent.guests.map((g: { value: any; label: any; }) => ({
          id: g.value,
          name: g.label,
        })),
      });
      setOpenEventModal(false);
      setFormEvent(emptyEvent);
      navigate(`/dashboard/calendario`);

      Swal.fire({
        icon: "success",
        title: "Evento creado",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo crear el evento", "error");
    }
  };

  const createCase = async () => {
    try {
      if (!formCase.title || !formCase.clientId || !formCase.lawyerId) {
        await Swal.fire("Error", "Completa los campos", "warning");
        return;
      }
      await createCaseService({
        ...formCase,
        clientId: Number(formCase.clientId),
        lawyerId: Number(formCase.lawyerId),
      });

      await Swal.fire({
        icon: "success",
        title: "Asunto creado",
        timer: 1500,
        showConfirmButton: false,
      });

      setOpenCaseModal(false);
      setFormCase(emptyCase);
      navigate(`/dashboard/asuntos`);

    } catch (error) {
      Swal.fire("Error", "No se pudo crear el asunto", "error");
    }
  };


  const createPayment = async () => {
    try {
      if (!formPayment.clientId || !formPayment.caseId || !formPayment.totalAmount) {
        return Swal.fire("Error", "Completa los campos", "warning");
      }
      const totalAmount = Number(formPayment.totalAmount || 0);
      const initialPaid = Number(formPayment.initialPaid || 0);
      const iva = includeIva ? Number(formPayment.iva || 0) : 0;
      const finalAmount = totalAmount + (totalAmount * iva) / 100;
      const payload = {
        clientId: Number(formPayment.clientId),
        caseId: Number(formPayment.caseId),
        currency: formPayment.currency,
        status: formPayment.status,
        totalAmount,
        initialPaid,
        iva,
        finalAmount,
        invoiceUrl: formPayment.invoiceUrl || "",
      };
      const paymentCreated = await createPaymentsService(payload);

      if (initialPaid > 0) {
        await createInstallmentService({
          paymentId: paymentCreated.id,
          amount: initialPaid,
          notes: "Abono inicial automático",
          method: "EFECTIVO",
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Cobro creado",
        timer: 1500,
        showConfirmButton: false,
      });

      setOpenPaymentModal(false);
      setFormPayment(emptyPayments);
      setIncludeIva(true);
      navigate(`/dashboard/cobros`);

    } catch (error) {
      Swal.fire("Error", "No se pudo crear el cobro", "error");
    }
  };

  const openDetailEvent = (event: any) => {
    console.log(event)
    setSelectedEvent(event);
    setDetailOpen(true);
  }

  const isFormUserValid =
    formClient.type &&
    formClient.name &&
    formClient.lastName &&
    formClient.phone &&
    formClient.email &&
    formClient.password &&
    formClient.confirmPassword &&
    formClient.address.state &&
    formClient.address.city &&
    formClient.address.colony &&
    formClient.password === formClient.confirmPassword;

  const isFormEventValid =
    formEvent.title?.trim() &&
    formEvent.category &&
    formEvent.caseId &&
    formEvent.start &&
    formEvent.end;

  const isFormCaseValid =
    formCase.folio?.trim() &&
    formCase.area &&
    formCase.title?.trim() &&
    formCase.description?.trim() &&
    formCase.clientId &&
    formCase.lawyerId;


  const total = Number(formPayment.totalAmount || 0);
  const initial = Number(formPayment.initialPaid || 0);
  const iva = Number(formPayment.iva || 0);

  const isFormPaymentValid =
    formPayment.clientId &&
    formPayment.clientId !== "0" &&
    formPayment.caseId &&
    formPayment.currency &&
    formPayment.status &&
    total > 0 &&
    initial >= 0 &&
    initial <= total &&
    (!includeIva || iva >= 0);

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
          <button
            onClick={openCreateModal}
            className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left flex items-center justify-between">
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
          <button
            onClick={() => setOpenCaseModal(true)}
            className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left flex items-center justify-between">
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
          <button
            onClick={() => setOpenPaymentModal(true)}
            className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-left flex items-center justify-between">
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
              Eventos pendientes de hoy
            </h2>

            <HiOutlineCalendar className="text-primary" size={22} />
          </div>

          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                onClick={() => openDetailEvent(event)}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-primary">
                    {event.title}

                    {event.userId !== user.id && (
                      <span
                        className="inline-flex uppercase px-3 py-1 ml-3 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800"
                      >
                        COMO INVITADO
                      </span>
                    )}
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
                    value={formClient.type}
                    onChange={(e) =>
                      setFormClient({ ...formClient, type: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  >
                    <option value="FISICA">Persona Física</option>
                    <option value="MORAL">Persona Moral</option>
                  </select>

                  <input
                    placeholder="RFC"
                    value={formClient.rfc}
                    onChange={(e) =>
                      setFormClient({ ...formClient, rfc: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Nombre(s)"
                    value={formClient.name}
                    onChange={(e) =>
                      setFormClient({ ...formClient, name: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Apellidos"
                    value={formClient.lastName}
                    onChange={(e) =>
                      setFormClient({ ...formClient, lastName: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Teléfono"
                    value={formClient.phone}
                    onChange={(e) =>
                      setFormClient({ ...formClient, phone: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Correo electrónico"
                    value={formClient.email}
                    onChange={(e) =>
                      setFormClient({ ...formClient, email: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={formClient.password || ""}
                    onChange={(e) =>
                      setFormClient({ ...formClient, password: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={formClient.confirmPassword || ""}
                    onChange={(e) =>
                      setFormClient({ ...formClient, confirmPassword: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                </div>

                {formClient.confirmPassword &&
                  formClient.password !== formClient.confirmPassword && (
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
                    value={formClient.address.state}
                    onChange={(e) =>
                      setFormClient({
                        ...formClient,
                        address: {
                          ...formClient.address,
                          state: e.target.value,
                        },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />

                  <input
                    placeholder="Municipio"
                    value={formClient.address.city}
                    onChange={(e) =>
                      setFormClient({
                        ...formClient,
                        address: {
                          ...formClient.address,
                          city: e.target.value,
                        },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />

                  <input
                    placeholder="Colonia"
                    value={formClient.address.colony}
                    onChange={(e) =>
                      setFormClient({
                        ...formClient,
                        address: {
                          ...formClient.address,
                          colony: e.target.value,
                        },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />

                  <input
                    placeholder="Código Postal"
                    value={formClient.address.postalCode}
                    onChange={(e) =>
                      setFormClient({
                        ...formClient,
                        address: { ...formClient.address, postalCode: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="Calle"
                    value={formClient.address.street}
                    onChange={(e) =>
                      setFormClient({
                        ...formClient,
                        address: { ...formClient.address, street: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="No. Exterior"
                    value={formClient.address.extNumber}
                    onChange={(e) =>
                      setFormClient({
                        ...formClient,
                        address: { ...formClient.address, extNumber: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="No. Interior"
                    value={formClient.address.intNumber}
                    onChange={(e) =>
                      setFormClient({
                        ...formClient,
                        address: { ...formClient.address, intNumber: e.target.value },
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
                disabled={!isFormUserValid}
                className={`px-6 py-2 rounded-lg font-semibold transition
                  ${isFormUserValid
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

      {openEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Crear evento
              </h2>
            </div>
            <div className="px-6 py-6 space-y-5">
              {/* Título */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Título del evento
                </label>
                <input
                  value={formEvent.title}
                  onChange={(e) =>
                    setFormEvent({ ...formEvent, title: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3 mt-1"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Categoría
                </label>
                <select
                  value={formEvent.category}
                  onChange={(e) =>
                    setFormEvent({ ...formEvent, category: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3 mt-1"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="audiencia">Audiencia</option>
                  <option value="cita">Cita</option>
                  <option value="revision">Revisión</option>
                  <option value="vencimiento">Vencimiento</option>
                </select>
              </div>

              {/* Asunto */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Asuntos
                </label>
                <select
                  value={formEvent.caseId}
                  onChange={(e) =>
                    setFormEvent({ ...formEvent, caseId: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3 mt-1"
                >
                  <option value="">Selecciona un asunto</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha inicio */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Fecha y hora inicio
                </label>
                <input
                  type="datetime-local"
                  value={formEvent.start}
                  onChange={(e) =>
                    setFormEvent({ ...formEvent, start: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3 mt-1"
                />
              </div>

              {/* Fecha fin */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Fecha y hora fin
                </label>
                <input
                  type="datetime-local"
                  value={formEvent.end}
                  onChange={(e) =>
                    setFormEvent({ ...formEvent, end: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3 mt-1"
                />
              </div>

              {/* Invitados */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Invitados
                </label>
                <Select
                  isMulti
                  options={users}
                  value={formEvent.guests}
                  onChange={(g) =>
                    setFormEvent({ ...formEvent, guests: g as any })
                  }
                  placeholder="Selecciona invitados"
                />
              </div>

            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setOpenEventModal(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={!isFormEventValid}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition
                  ${isFormEventValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Crear evento
              </button>
            </div>

          </div>
        </div>
      )}

      {openCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Nuevo asunto
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Folio
                </label>
                <input
                  type="text"
                  value={formCase.folio}
                  onChange={(e) =>
                    setFormCase({ ...formCase, folio: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Ej. LAB-2026-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Área legal
                </label>
                <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  value={formCase.area}
                  onChange={(e) =>
                    setFormCase({ ...formCase, area: e.target.value })
                  }>
                  <option value="Derecho Laboral">Derecho Laboral</option>
                  <option value="Derecho Civil">Derecho Civil</option>
                  <option value="Derecho Penal">Derecho Penal</option>
                  <option value="Derecho Mercantil">Derecho Mercantil</option>
                  <option value="Derecho Familiar">Derecho Familiar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Título del asunto
                </label>
                <input
                  type="text"
                  value={formCase.title}
                  onChange={(e) =>
                    setFormCase({ ...formCase, title: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Ej. Audiencia laboral"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descripcion del asunto
                </label>
                <textarea
                  value={formCase.description}
                  onChange={(e) =>
                    setFormCase({ ...formCase, description: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Ej. La empresa ofrece 3 meses de salario; el trabajador pide 4. Si no hay acuerdo, se procede al juicio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cliente
                </label>
                <select
                  value={formCase.clientId}
                  onChange={(e) =>
                    setFormCase({ ...formCase, clientId: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">Selecciona cliente</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Abogado responsable
                </label>
                <select
                  value={formCase.lawyerId}
                  onChange={(e) =>
                    setFormCase({ ...formCase, lawyerId: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">Selecciona abogado</option>
                  {users.map(u => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setOpenCaseModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>

              <button
                onClick={createCase}
                disabled={!isFormCaseValid}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition
                  ${isFormCaseValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Crear asunto
              </button>
            </div>
          </div>
        </div>
      )}

      {openPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl">

            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Registar cobro
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">

              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <select
                  value={formPayment.clientId}
                  onChange={async (e) => {
                    const id = e.target.value;

                    setFormPayment({
                      ...formPayment,
                      clientId: id,
                      caseId: "",
                    });

                    if (!id) return;

                    // 👉 Mostrar loader SIN await
                    Swal.fire({
                      title: "Cargando asuntos...",
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    try {
                      await loadCasesByClient(Number(id));
                    } finally {
                      Swal.close();
                    }
                  }}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="0">Selecciona cliente</option>

                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-sm font-medium mb-1">Asunto</label>
                <select
                  value={formPayment.caseId}
                  onChange={(e) =>
                    setFormPayment({ ...formPayment, caseId: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">Selecciona un asunto</option>

                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.folio} - {c.title}
                    </option>
                  ))}
                </select>
              </div>
              {/* Estado de la factura */}
              <div>
                <label className="block text-sm font-medium mb-1">Estado del folio</label>
                <select
                  value={formPayment.status}
                  onChange={(e) =>
                    setFormPayment({ ...formPayment, status: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="PAGADO">Pagado</option>
                </select>
              </div>

              {/* Montos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Monto total
                  </label>
                  <input

                    value={formPayment.totalAmount}
                    onChange={(e) =>
                      setFormPayment({ ...formPayment, totalAmount: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Abono inicial
                  </label>
                  <input
                    type="number"
                    value={formPayment.initialPaid}
                    onChange={(e) =>
                      setFormPayment({ ...formPayment, initialPaid: e.target.value })
                    }
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
              {/* Checkbox IVA */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeIva}
                  onChange={(e) => {
                    setIncludeIva(e.target.checked);

                    // 👉 si quita IVA se pone en 0
                    if (!e.target.checked) {
                      setFormPayment({ ...formPayment, iva: 0 });
                    } else {
                      setFormPayment({ ...formPayment, iva: 16 });
                    }
                  }}
                />
                <span className="text-sm font-medium">
                  Agregar IVA
                </span>
              </div>


              {/* IVA */}


              {includeIva && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">IVA %</label>
                    <input
                      type="number"
                      value={formPayment.iva}
                      onChange={(e) =>
                        setFormPayment({ ...formPayment, iva: Number(e.target.value) })
                      }
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                      placeholder="IVA %"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Total IVA
                    </label>
                    <input
                      value={`${formPayment.currency} ${((Number(formPayment.totalAmount) * Number(formPayment.iva)) / 100).toFixed(2)}`}
                      disabled
                      className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Monto total con IVA
                    </label>
                    <input
                      value={`${formPayment.currency} ${(Number(formPayment.totalAmount) + ((Number(formPayment.totalAmount) * Number(formPayment.iva)) / 100)).toFixed(2)}`}
                      disabled
                      className="w-full border rounded-lg px-4 py-3 bg-gray-100 font-semibold"
                    />
                  </div>
                </div>
              )}



            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setOpenPaymentModal(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>

              <button
                onClick={createPayment}
                disabled={!isFormPaymentValid}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition
                  ${isFormPaymentValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Crear cobro
              </button>
            </div>

          </div>
        </div>
      )}

      {detailOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between">
              <h2 className="text-lg font-bold text-primary">
                Detalle del evento
              </h2>

              <button
                onClick={() => setDetailOpen(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4 text-sm">

              <p>
                <strong>Título:</strong>{" "}
                {selectedEvent.title.replace(/^\d{1,2}:\d{2}\s(AM|PM)\s-\s/, "")}
              </p>

              <p>
                <strong>Categoría:</strong>{" "}
                {selectedEvent.category}
              </p>

              <p>
                <strong>Responsable:</strong>{" "}
                {selectedEvent.user.name}
              </p>

              <p>
                <strong>Inicio:</strong>{" "}
                {new Date(selectedEvent.start).toLocaleString("es-MX")}
              </p>

              {selectedEvent.end && (
                <p>
                  <strong>Fin:</strong>{" "}
                  {new Date(selectedEvent.end).toLocaleString("es-MX")}
                </p>
              )}

              {selectedEvent.case.title && (
                <p>
                  <strong>Asunto:</strong>{" "}
                  {selectedEvent.case.title}
                </p>
              )}

              {selectedEvent.guests?.length > 0 && (
                <div>
                  <strong>Invitados:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {selectedEvent.guests.map((g: any) => (
                      <li key={g.id}>{g.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;