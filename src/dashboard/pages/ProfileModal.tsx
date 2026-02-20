import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import Swal from "sweetalert2";
import { updateUserService } from "../../services/user.services";

interface Props {
  open: boolean;
  onClose: () => void;
  user: any;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  specialty: "",
  avatar: "",
  role: "",
  password: "",
  confirmPassword: "",
};

const ProfileModal = ({ open, onClose, user }: Props) => {

  const [form, setForm] = useState(emptyForm);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        specialty: user.specialty || "",
        avatar: user.avatar || "",
        role: user.role || "",
        password: "",
        confirmPassword: "",
      });

      setUserId(user.id);
    }
  }, [user]);

  const updateLawyer = async () => {
    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        specialty: form.specialty,
        avatar: form.avatar,
        role: form.role
      };

      await updateUserService(userId, payload);

      await Swal.fire({
        icon: "success",
        title: "Información actualizada",
        timer: 1500,
        showConfirmButton: false,
      });
      onClose();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
    }

  };

  const avatarUrl = (userName: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName
    )}&background=1A3263&color=FFFFFF&rounded=true&size=128&bold=true`;
  }

  if (!open) return null;


  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-primary">
            Mi perfil
          </h2>

          <button onClick={onClose}>
            <HiOutlineX size={24} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <img
               src={form.avatar ? form.avatar : avatarUrl(user.name)}
              className="w-20 h-20 rounded-full border"
              alt="avatar"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">
              Nombre completo
            </label>
            <input
              placeholder="Lic. Nombre Apellido"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Correo electrónico
            </label>
            <input
              placeholder="ejemplo@correo.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Teléfono
            </label>
            <input
              type="tel"
              placeholder="3525616328"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Especialidad(es)
            </label>
            <input
              placeholder="Litigio, Mercantil, Familiar..."
              value={form.specialty}
              onChange={(e) =>
                setForm({ ...form, specialty: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              URL Imagen
            </label>
            <input
              placeholder="https://ejemplo.com/imagen.jpg"
              value={form.avatar}
              onChange={(e) =>
                setForm({ ...form, avatar: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Rol
            </label>
            <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }>
              <option value="ABOGADO">Abogado</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600"
          >
            Cancelar
          </button>

          <button
            onClick={updateLawyer}
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