import { useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUser,
} from "react-icons/hi";

/* 👨‍⚖️ Mock abogados */
const MOCK_LAWYERS = [
  {
    id: "A-001",
    name: "Lic. Braulio Reyes",
    email: "braulio@monarca.com",
    phone: "352-561-6329",
    specialty: "Derecho Laboral",
  },
  {
    id: "A-002",
    name: "Lic. Jesus Meza",
    email: "jesus@monarca.com",
    phone: "352-123-4567",
    specialty: "Derecho Penal",
  },
];

const Lawyers = () => {
  const [lawyers] = useState(MOCK_LAWYERS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Abogados
          </h1>
          <p className="text-gray-600">
            Administración del equipo jurídico del despacho
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          <HiOutlinePlus />
          Nuevo abogado
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Correo</th>
              <th className="px-6 py-4 text-left">Teléfono</th>
              <th className="px-6 py-4 text-left">Especialidad</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {lawyers.map((l, index) => (
              <tr
                key={l.id}
                className={`
                border-t transition
                ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                hover:bg-primary/5
              `}
              >
                <td className="px-6 py-4 font-semibold text-primary flex items-center gap-2">
                  <HiOutlineUser />
                  {l.name}
                </td>

                <td className="px-6 py-4">{l.email}</td>
                <td className="px-6 py-4">{l.phone}</td>
                <td className="px-6 py-4 text-gray-700">
                  {l.specialty}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      title="Editar abogado"
                      className="text-primary hover:text-secondary"
                    >
                      <HiOutlinePencil size={22} />
                    </button>

                    <button
                      title="Eliminar abogado"
                      className="text-red-500 hover:text-red-600"
                    >
                      <HiOutlineTrash size={22} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR ABOGADO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">

            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Registrar abogado
              </h2>
            </div>

            {/* Formulario */}
            <div className="px-6 py-6 space-y-4">

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Nombre completo
                </label>
                <input
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  placeholder="Lic. Nombre Apellido"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Teléfono
                </label>
                <input
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Especialidad
                </label>
                <input
                  placeholder="Ej. Derecho Familiar"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>

              <button className="px-6 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90 transition">
                Guardar abogado
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Lawyers;