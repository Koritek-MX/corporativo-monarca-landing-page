import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import type { EventApi } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { HiOutlinePlus } from "react-icons/hi";
import FullCalendar from "@fullcalendar/react";
import Select from "react-select";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  createEventService,
  updateEventService,
  getEventService,
  deleteEventService
} from "../../services/event.service";

/* 🎨 Colores por categoría */
const CATEGORY_COLORS: Record<string, string> = {
  audiencia: "#1A3263",
  cita: "#2F855A",
  vencimiento: "#B153D7",
  revision: "#FF6500",
};

/* ⚖️ Asuntos */
const CASES = [
  { id: "A-1023", name: "Expediente laboral – Juan Pérez" },
  { id: "C-2045", name: "Contrato mercantil – Empresa XYZ" },
  { id: "P-3301", name: "Proceso penal – María López" },
  { id: "F-4412", name: "Divorcio – Carlos Hernández" },
  { id: "0", name: "Ninguno" },
];

/* 👥 Invitados */
const LAWYERS = [
  { value: "ana@monarca.com", label: "Braulio Reyes" },
  { value: "luis@monarca.com", label: "Conny" },
  { value: "carlos@monarca.com", label: "Jesus Meza" },
];

const Calendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [activeEvent, setActiveEvent] = useState<EventApi | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      Swal.fire({
        title: "Cargando eventos...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [data] = await Promise.all([
        getEventService(),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      const formatted = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        extendedProps: {
          category: e.category,
        },
      }));

      setEvents(formatted);

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    } finally {
      Swal.close();
    }
  };

  const [form, setForm] = useState({
    title: "",
    category: "audiencia",
    start: "",
    end: "",
    guests: [] as { value: string; label: string }[],
    caseId: "",
  });

  /* ➕ Abrir modal manual */
  const openCreateModal = () => {
    const now = new Date().toISOString().slice(0, 16);
    setForm({
      title: "",
      category: "audiencia",
      start: now,
      end: now,
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

    setForm({
      title: event.title.replace(/^\d{1,2}:\d{2}\s(AM|PM)\s-\s/, ""),
      category: event.extendedProps.category,
      start: event.startStr.slice(0, 16),
      end: event.endStr?.slice(0, 16) || event.startStr.slice(0, 16),
      guests: (event.extendedProps.guests || []).map((g: string) => ({
        value: g,
        label: g,
      })),
      caseId: event.extendedProps.caseId || "",
    });

    setMode("edit");
    setActiveEvent(event);
    setIsModalOpen(true);
  };

  /* ➕ Crear evento */
  const handleCreateEvent = async () => {
    if (!form.title || !form.start) return;

    try {
      await createEventService({
        title: form.title,
        start: form.start,
        end: form.end,
        category: form.category,
        caseId: 1, // 👈 temporal hasta servicio de casos
        userId: 1 // 👈 temporal hasta login
      });

      await loadEvents(); // refresca calendario
      setIsModalOpen(false);

      Swal.fire({
        icon: "success",
        title: "Evento creado",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error(error);
    }
  };

  /* ✏️ Editar evento */
  const handleUpdateEvent = async () => {
    if (!activeEvent) return;

    try {
      await updateEventService(Number(activeEvent.id), {
        title: form.title,
        start: form.start,
        end: form.end,
        category: form.category,
        caseId: form.caseId || null,
        guests: form.guests.map((g) => g.value),
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
      console.error(error);
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
          console.error(error);
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
  };

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
            if (!start) return null;

            let hours = start.getHours();
            const minutes = start.getMinutes().toString().padStart(2, "0");
            const period = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;

            const color =
              CATEGORY_COLORS[arg.event.extendedProps.category] || "#1A3263";

            return (
              <div
                style={{
                  backgroundColor: color,
                  color: "#fff",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 500,
                  whiteSpace: "normal",
                }}
              >
                {hours}:{minutes} {period} - {arg.event.title}
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

            <div className="px-6 py-6 space-y-4">
              <input
                placeholder="Título del evento"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              >
                <option value="">Selecciona una categoría</option>
                <option value="audiencia">Audiencia</option>
                <option value="cita">Cita</option>
                <option value="revision">Revisión</option>
                <option value="vencimiento">Vencimiento</option>
              </select>

              <select
                value={form.caseId}
                onChange={(e) =>
                  setForm({ ...form, caseId: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              >
                <option value="">Selecciona un asunto</option>
                {CASES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                value={form.start}
                onChange={(e) =>
                  setForm({ ...form, start: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                type="datetime-local"
                value={form.end}
                onChange={(e) =>
                  setForm({ ...form, end: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              <Select
                isMulti
                options={LAWYERS}
                value={form.guests}
                onChange={(g) =>
                  setForm({ ...form, guests: g as any })
                }
                placeholder="Invitados"
              />
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
                className="bg-primary text-white px-6 py-2 rounded-lg"
              >
                {mode === "create" ? "Crear evento" : "Guardar cambios"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;