import { useState } from "react";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string }
> = {
  "por iniciar": {
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  "en proceso": {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  "resuelto": {
    bg: "bg-green-100",
    text: "text-green-700",
  },
  "archivado": {
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
};

const MOCK_CASES = [
  {
    id: "A-1023",
    title: "Audiencia laboral",
    client: "Juan Pérez",
    area: "Derecho Laboral",
    lawyer: "Braulio Reyes",
    status: "por iniciar",
    startDate: "2024-01-10",
  },
  {
    id: "C-2045",
    title: "Contrato mercantil",
    client: "Empresa XYZ",
    area: "Derecho Mercantil",
    lawyer: "Conny",
    status: "en proceso",
    startDate: "2024-02-05",
  },
   {
    id: "C-2045",
    title: "Contrato mercantil",
    client: "Empresa XYZ",
    area: "Derecho Mercantil",
    lawyer: "Conny",
    status: "resuelto",
    startDate: "2024-02-05",
  },
   {
    id: "C-2045",
    title: "Contrato mercantil",
    client: "Empresa XYZ",
    area: "Derecho Mercantil",
    lawyer: "Conny",
    status: "archivado",
    startDate: "2024-02-05",
  }
];

const Cases = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Asuntos</h1>
          <p className="text-gray-600">
            Gestión de expedientes y casos legales
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="
            inline-flex items-center gap-2
            bg-primary text-white
            px-5 py-3 rounded-xl
            text-sm font-semibold
            hover:bg-primary/90 transition
          "
        >
          <HiOutlinePlus size={20} />
          Nuevo asunto
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Folio</th>
              <th className="px-6 py-4 text-left">Asunto</th>
              <th className="px-6 py-4 text-left">Cliente</th>
              <th className="px-6 py-4 text-left">Área</th>
              <th className="px-6 py-4 text-left">Abogado</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {MOCK_CASES.map((a, index) => (
              <tr
                key={a.id}
                className={`
                border-t transition
                ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                hover:bg-primary/5
              `}
              >
                <td className="px-6 py-4 font-semibold text-primary">
                  {a.id}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {a.title}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {a.client}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {a.area}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {a.lawyer}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`
                    inline-flex items-center
                    px-3 py-1 rounded-full
                    text-xs font-semibold capitalize
                    ${STATUS_STYLES[a.status]?.bg}
                    ${STATUS_STYLES[a.status]?.text}
                  `}
                  >
                    {a.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button className="text-primary hover:text-secondary">
                      <HiOutlinePencil size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-600">
                      <HiOutlineTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL – Crear / Editar Asunto */}
      {isModalOpen && (
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
                  Título del asunto
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  placeholder="Ej. Audiencia laboral"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cliente
                </label>
                <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary">
                  <option>Selecciona un cliente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Área legal
                </label>
                <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary">
                  <option>Derecho Laboral</option>
                  <option>Derecho Civil</option>
                  <option>Derecho Penal</option>
                  <option>Derecho Mercantil</option>
                  <option>Derecho Familiar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Abogado responsable
                </label>
                <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary">
                  <option>Braulio Reyes</option>
                  <option>Conny</option>
                  <option>Jesús Meza</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Estado
                  </label>
                  <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary">
                    <option>Activo</option>
                    <option>En proceso</option>
                    <option>Cerrado</option>
                  </select>
                </div>
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
                className="px-6 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90 transition"
              >
                Guardar asunto
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;