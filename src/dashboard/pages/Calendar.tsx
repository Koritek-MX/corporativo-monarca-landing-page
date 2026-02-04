import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import Select from "react-select";
import Swal from "sweetalert2";
import { HiOutlinePlus } from "react-icons/hi";

/* 🎨 Colores por categoría */
const CATEGORY_COLORS: Record<string, string> = {
  audiencia: "#1A3263",
  cita: "#2F855A",
  vencimiento: "#B153D7",
  revision: "#FF6500",
};

/* 📅 Eventos iniciales */
const initialEvents = [
  {
    title: "10:30 AM - Audiencia laboral",
    start: new Date().toISOString().split("T")[0] + "T10:30:00",
    end: new Date().toISOString().split("T")[0] + "T11:30:00",
    extendedProps: { category: "audiencia", guests: [], caseId: "" },
  },
];

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
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [activeEvent, setActiveEvent] = useState<EventApi | null>(null);

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
  const handleCreateEvent = () => {
    if (!form.title || !form.start || !form.end) return;

    const startDate = new Date(form.start);
    let h = startDate.getHours();
    const m = startDate.getMinutes().toString().padStart(2, "0");
    const p = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    setEvents((prev) => [
      ...prev,
      {
        title: `${h}:${m} ${p} - ${form.title}`,
        start: form.start,
        end: form.end,
        extendedProps: {
          category: form.category,
          guests: form.guests.map((g) => g.value),
          caseId: form.caseId,
        },
      },
    ]);

    setIsModalOpen(false);

    Swal.fire({
      icon: "success",
      title: "Evento creado con éxito",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  /* ✏️ Editar evento */
  const handleUpdateEvent = () => {
    if (!activeEvent) return;

    const startDate = new Date(form.start);
    let h = startDate.getHours();
    const m = startDate.getMinutes().toString().padStart(2, "0");
    const p = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    activeEvent.setProp("title", `${h}:${m} ${p} - ${form.title}`);
    activeEvent.setStart(form.start);
    activeEvent.setEnd(form.end);
    activeEvent.setExtendedProp("category", form.category);
    activeEvent.setExtendedProp(
      "guests",
      form.guests.map((g) => g.value)
    );
    activeEvent.setExtendedProp("caseId", form.caseId);

    setIsModalOpen(false);

    Swal.fire({
      icon: "success",
      title: "Evento actualizado",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  /* 🗑️ Eliminar evento */
  const handleDeleteEvent = () => {
    Swal.fire({
      title: "¿Eliminar evento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        activeEvent?.remove();
        setIsModalOpen(false);
        Swal.fire("Eliminado", "El evento fue eliminado", "success");
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
          eventDidMount={(info) => {
            const color = CATEGORY_COLORS[info.event.extendedProps.category];
            if (color) {
              info.el.style.backgroundColor = color;
              info.el.style.borderColor = color;
              info.el.style.color = "#fff";
            }
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