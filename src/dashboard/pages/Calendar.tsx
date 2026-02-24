import { getCasesByLawyerIdService } from "../../services/case.services";
import { getUsersService } from "../../services/user.services";
import { useAuth } from "../../components/hooks/AuthContext";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import type { EventApi } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { HiOutlinePlus } from "react-icons/hi";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  createEventService,
  updateEventService,
  deleteEventService,
  getEventsByUserService,
  getEventByIdService
} from "../../services/event.service";

/* 🎨 Colores por categoría */
const CATEGORY_COLORS: Record<string, string> = {
  audiencia: "#1A3263",
  cita: "#2F855A",
  vencimiento: "#B153D7",
  revision: "#FF6500",
};

const Calendar = () => {

  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [activeEvent, setActiveEvent] = useState<EventApi | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    category: "audiencia",
    start: "",
    end: "",
    guests: [] as { value: string; label: string }[],
    caseId: "",
  });

  useEffect(() => {
    if (!user?.id) return;
    loadEvents();
    loadUsers();
    loadCases();
  }, [user]);

  const loadEvents = async () => {
    try {
      Swal.fire({
        title: "Cargando eventos...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [data] = await Promise.all([
        getEventsByUserService(user.id),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      const formatted = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        extendedProps: {
          category: e.category,
          caseId: e.caseId,
          guests: e.guests?.map((g: any) => g.name) || [],
        },
      }));

      setEvents(formatted);

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    } finally {
      Swal.close();
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsersService();

      const formatted = data
        .filter((u: any) => u.id !== user?.id) 
        .map((u: any) => ({
          value: u.id,
          label: u.name,
        }));

      setUsers(formatted);

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  const loadInfoUser = async (userId: number) => {
    try {
      const data = await getEventByIdService(userId);
      return data;
    } catch (error) {
      console.error("Ocurrio un error al obtener la información del usuario.");
    }
  };

  const loadCases = async () => {
    try {
      const data = await getCasesByLawyerIdService(user.id);
      setCases(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los casos", "error");
    }
  };


  /* ➕ Abrir modal manual */
  const openCreateModal = () => {
    const { start, end } = getNowPlusOneHour();

    setForm({
      title: "",
      category: "",
      start,
      end,
      guests: [],
      caseId: "",
    });

    setMode("create");
    setActiveEvent(null);
    setIsModalOpen(true);
  };

  /* 🟢 Click en día */
  const handleDateClick = (info: any) => {
    setForm({
      title: "",
      category: "audiencia",
      start: info.dateStr + "T09:00",
      end: info.dateStr + "T10:00",
      guests: [],
      caseId: "",
    });
    setMode("create");
    setActiveEvent(null);
    setIsModalOpen(true);
  };

  /* 🔵 Click en evento */
  const handleEventClick = (info: any) => {
    const event = info.event;

    setSelectedEvent(event);
    setDetailOpen(true);
  };


  const openEditFromDetail = async () => {
    const currentUserInfo = await loadInfoUser(selectedEvent.id);

    console.log("USER INFO", currentUserInfo);

    if (!currentUserInfo) return;

    const formatForInput = (date: string) => {
      const d = new Date(date);
      const pad = (n: number) => String(n).padStart(2, "0");

      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setForm({
      title: currentUserInfo.title,
      start: formatForInput(currentUserInfo.start),
      end: currentUserInfo.end ? formatForInput(currentUserInfo.end) : "",
      category: currentUserInfo.category,
      caseId: currentUserInfo.caseId?.toString() || "",
      guests: (currentUserInfo.guests || []).map((g: any) => ({
        value: g.id,
        label: g.name,
      })),
    });

    setActiveEvent(selectedEvent);
    setMode("edit");
    setDetailOpen(false);
    setIsModalOpen(true);
  };

  /* ➕ Crear evento */
  const handleCreateEvent = async () => {
    if (!form.title || !form.start) return;

    try {
      if (new Date(form.end) < new Date(form.start)) {
        Swal.fire({
          icon: "warning",
          title: "Hora inválida",
          text: "La hora de fin no puede ser antes que la hora de inicio",
        });
        return;
      }

      console.log("CREAR: ",
        {
          title: form.title,
          start: form.start,
          end: form.end,
          category: form.category,
          caseId: form.caseId ? Number(form.caseId) : null,
          userId: user.id,
          guests: form.guests.map(g => ({
            id: g.value,
            name: g.label,
          })),
        }
      );

      await createEventService({
        title: form.title,
        start: form.start,
        end: form.end,
        category: form.category,
        caseId: form.caseId ? Number(form.caseId) : null,
        userId: user.id,
        guests: form.guests.map(g => ({
          id: g.value,
          name: g.label,
        })),
      });

      await loadEvents();
      setIsModalOpen(false);

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

  /* ✏️ Editar evento */
  const handleUpdateEvent = async () => {
    if (!activeEvent) return;

    try {
      if (new Date(form.end) < new Date(form.start)) {
        Swal.fire({
          icon: "warning",
          title: "Hora inválida",
          text: "La hora de fin no puede ser antes que la hora de inicio",
        });
        return;
      }

      await updateEventService(Number(activeEvent.id), {
        title: form.title,
        start: form.start,
        end: form.end,
        category: form.category,
        caseId: form.caseId ? Number(form.caseId) : null,
        guests: form.guests.map(g => ({
          id: g.value,
          name: g.label,
        }))
      });

      // 🔥 Refrescar calendario desde backend
      await loadEvents();

      setIsModalOpen(false);

      Swal.fire({
        icon: "success",
        title: "Evento actualizado",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  /* 🗑️ Eliminar evento */
  const handleDeleteEvent = () => {
    if (!activeEvent) return;

    Swal.fire({
      title: "¿Eliminar evento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteEventService(Number(activeEvent.id));

          await loadEvents();

          setIsModalOpen(false);

          Swal.fire({
            icon: "success",
            title: "Evento eliminado",
            timer: 1500,
            showConfirmButton: false,
          });

        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
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

  const isFormValid =
    form.title?.trim() &&
    form.category &&
    form.caseId &&
    form.start &&
    form.end;

  return (
    <div className="h-full flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Calendario</h1>
          <p className="text-gray-600">
            Agenda y seguimiento de actividades del despacho
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          <HiOutlinePlus />
          Crear evento
        </button>
      </div>

      {/* Calendar */}
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          events={events}
          height="100%"
          displayEventTime={false}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}

          eventContent={(arg) => {
            const start = arg.event.start;
            const end = arg.event.end;

            if (!start) return null;

            const formatHour = (date: Date) => {
              let h = date.getHours();
              const m = date.getMinutes().toString().padStart(2, "0");
              const p = h >= 12 ? "PM" : "AM";
              h = h % 12 || 12;
              return `${h}:${m} ${p}`;
            };

            const startHour = formatHour(start);
            const endHour = end ? formatHour(end) : "";

            const color =
              CATEGORY_COLORS[arg.event.extendedProps.category] || "#1A3263";

            return (
              <div
                style={{
                  backgroundColor: color,
                  color: "#fff",
                  padding: "6px 8px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  lineHeight: "1.3",
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {arg.event.title}
                </div>

                <div style={{ fontSize: "11px", opacity: 0.9 }}>
                  {startHour}
                  {endHour && ` - ${endHour}`}
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-primary">
                {mode === "create" ? "Crear evento" : "Editar evento"}
              </h2>
              {mode === "edit" && (
                <button
                  onClick={handleDeleteEvent}
                  className="text-red-600 font-semibold"
                >
                  Eliminar
                </button>
              )}
            </div>

            <div className="px-6 py-6 space-y-5">

              {/* Título */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Título del evento
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
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
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
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
                  value={form.caseId}
                  onChange={(e) =>
                    setForm({ ...form, caseId: e.target.value })
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
                  value={form.start}
                  onChange={(e) =>
                    setForm({ ...form, start: e.target.value })
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
                  value={form.end}
                  onChange={(e) =>
                    setForm({ ...form, end: e.target.value })
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
                  value={form.guests}
                  onChange={(g) =>
                    setForm({ ...form, guests: g as any })
                  }
                  placeholder="Selecciona invitados"
                />
              </div>

            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={mode === "create" ? handleCreateEvent : handleUpdateEvent}
                disabled={!isFormValid}
                className={`
                px-6 py-2 rounded-lg font-semibold transition
                ${isFormValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
              `}
              >
                {mode === "create" ? "Crear evento" : "Guardar cambios"}
              </button>
            </div>

          </div>
        </div>
      )}
      {detailOpen && selectedEvent && (
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
                {selectedEvent.extendedProps.category}
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

              {selectedEvent.extendedProps.caseId && (
                <p>
                  <strong>Asunto:</strong>{" "}
                  {selectedEvent.extendedProps.caseId}
                </p>
              )}

              {selectedEvent.extendedProps.guests?.length > 0 && (
                <div>
                  <strong>Invitados:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {selectedEvent.extendedProps.guests.map((g: string, i: number) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setDetailOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cerrar
              </button>

              <button
                onClick={openEditFromDetail}
                className="bg-primary text-white px-6 py-2 rounded-lg"
              >
                Editar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;