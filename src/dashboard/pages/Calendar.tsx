import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import Select from "react-select";
import Swal from "sweetalert2";

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
    extendedProps: { category: "audiencia", guests: [] },
  },
];

/* ⚖️ Asuntos */
const CASES = [
  { id: "A-1023", name: "Expediente laboral – Juan Pérez" },
  { id: "C-2045", name: "Contrato mercantil – Empresa XYZ" },
  { id: "P-3301", name: "Proceso penal – María López" },
  { id: "F-4412", name: "Divorcio – Carlos Hernández" },
  { id: '0', name: "Ninguno" }
];

/* 👥 Invitados */
const LAWYERS = [
  { value: "ana@monarca.com", label: "Ana Martínez" },
  { value: "luis@monarca.com", label: "Luis Gómez" },
  { value: "carlos@monarca.com", label: "Carlos Ramírez" },
  { value: "maria@monarca.com", label: "María López" },
];

const Calendar = () => {
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "audiencia",
    start: "",
    end: "",
    guests: [] as { value: string; label: string }[],
    caseId: "",
  });

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
    setIsModalOpen(true);
  };

  const handleCreateEvent = () => {
    if (!form.title || !form.start || !form.end) return;

    const startDate = new Date(form.start);
    let hours = startDate.getHours();
    const minutes = startDate.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const time = `${hours}:${minutes} ${period}`;

    setEvents((prev) => [
      ...prev,
      {
        title: `${time} - ${form.title}`,
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
      title: "Evento creado con exito.",
      showConfirmButton: false,
      timer: 1500
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
          className="bg-primary text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition"
        >
          + Crear evento
        </button>
      </div>

      {/* Calendar */}
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          height="100%"
          events={events}
          displayEventTime={false}
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

            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Crear evento
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título del evento
                </label>
                <input
                  type="text"
                  placeholder="Agregar título"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoría
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                >
                  <option value="audiencia">Audiencia</option>
                  <option value="cita">Cita</option>
                  <option value="revision">Revisión</option>
                  <option value="vencimiento">Vencimiento</option>
                </select>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Asunto relacionado
                </label>
                <select
                  value={form.caseId}
                  onChange={(e) =>
                    setForm({ ...form, caseId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Selecciona un asunto</option>
                  {CASES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Inicio */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fecha y hora de inicio
                </label>
                <input
                  type="datetime-local"
                  value={form.start}
                  onChange={(e) =>
                    setForm({ ...form, start: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

              {/* Fin */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fecha y hora de cierre
                </label>
                <input
                  type="datetime-local"
                  value={form.end}
                  onChange={(e) =>
                    setForm({ ...form, end: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

              {/* Invitados */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Invitados
                </label>
                <Select
                  isMulti
                  options={LAWYERS}
                  value={form.guests}
                  onChange={(selected) =>
                    setForm({ ...form, guests: selected as any })
                  }
                  placeholder="Selecciona abogados"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "0.5rem",
                      minHeight: "48px",
                      borderColor: state.isFocused
                        ? "#FAB95B"
                        : "#D1D5DB",
                      boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(250,185,91,.3)"
                        : "none",
                      "&:hover": {
                        borderColor: "#FAB95B",
                      },
                    }),
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreateEvent}
                disabled={!form.title}
                className={`px-6 py-2 rounded-lg font-semibold transition
                  ${form.title
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Crear evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;