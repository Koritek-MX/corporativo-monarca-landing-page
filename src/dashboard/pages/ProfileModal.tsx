import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ProfileModal = ({ open, onClose }: Props) => {
  const [form, setForm] = useState({
    name: "Braulio",
    lastName: "Reyes",
    email: "braulio@monarca.com",
    phone: "",
    specialty: "Derecho Laboral",
    license: "",
    password: "",
  });

  if (!open) return null;

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    form.name + " " + form.lastName
  )}&background=1A3263&color=FFFFFF&rounded=true&size=128&bold=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-primary">
            Mi perfil
          </h2>

          <button onClick={onClose}>
            <HiOutlineX size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-5">

          {/* Avatar */}
          <div className="flex justify-center">
            <img
              src={avatarUrl}
              className="w-20 h-20 rounded-full border"
              alt="avatar"
            />
          </div>

          {/* Nombre */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
            />

            <input
              placeholder="Apellidos"
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Correo */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
          />

          {/* Teléfono */}
          <input
            placeholder="Teléfono"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
          />

          {/* Especialidad */}
          <input
            placeholder="Especialidad jurídica"
            value={form.specialty}
            onChange={(e) =>
              setForm({ ...form, specialty: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
          />

          {/* Cédula */}
          <input
            placeholder="Cédula profesional"
            value={form.license}
            onChange={(e) =>
              setForm({ ...form, license: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Nueva contraseña (opcional)"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600"
          >
            Cancelar
          </button>

          <button
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;