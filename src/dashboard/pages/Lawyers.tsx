import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import Swal from "sweetalert2";
import {
  deleteUserService,
  getUsersService,
  createUserService,
  updateUserService,
} from "../../services/user.services";
import { formatPhone } from "../../components/common/formatPhone";

const ROLE_STYLES: Record<string, { bg: string; text: string }> = {
  ADMIN: {
    bg: "bg-green-100",
    text: "text-green-700",
  },
  ABOGADO: {
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
};

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

const Lawyers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadUsers();
  }, []);

  /* 👉 Cargar abogados */
  const loadUsers = async () => {
    try {
      Swal.fire({
        title: "Cargando abogados...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [data] = await Promise.all([
        getUsersService(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);

      setUsers(data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar", "error");
    } finally {
      Swal.close();
    }
  };

  /* 👉 Crear abogado */
  const createLawyer = async () => {
    if (form.password !== form.confirmPassword) {
      return Swal.fire("Error", "Las contraseñas no coinciden", "warning");
    }

    await createUserService({
      name: form.name,
      email: form.email,
      phone: form.phone,
      specialty: form.specialty,
      avatar: form.avatar,
      password: form.password,
      role: form.role
    });

    await Swal.fire({
      icon: "success",
      title: "Abogado creado",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  /* 👉 Editar abogado */
  const updateLawyer = async () => {
    if (!editingUser) return;

    const payload: any = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      specialty: form.specialty,
      avatar: form.avatar,
      role: form.role
    };

    if (form.password) {
      if (form.password !== form.confirmPassword) {
        return Swal.fire("Error", "Las contraseñas no coinciden", "warning");
      }
      payload.password = form.password;
    }

    await updateUserService(editingUser.id, payload);

    await Swal.fire({
      icon: "success",
      title: "Abogado actualizado",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  /* 👉 Guardar */
  const saveLawyer = async () => {
    try {
      if (!form.name || !form.email) {
        return Swal.fire("Error", "Completa los campos", "warning");
      }
      if (!editingUser) {
        if (!form.password || !form.confirmPassword) {
          return Swal.fire(
            "Error",
            "Debes ingresar contraseña",
            "warning"
          );
        }

        if (form.password !== form.confirmPassword) {
          return Swal.fire(
            "Error",
            "Las contraseñas no coinciden",
            "warning"
          );
        }
      }

      editingUser ? await updateLawyer() : await createLawyer();

      setForm(emptyForm);
      setEditingUser(null);
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  /* 👉 Abrir edición */
  const openEditUser = (user: any) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      specialty: user.specialty || "",
      avatar: user.avatar || "",
      role: user.role || "",
      password: "",
      confirmPassword: "",
    });
    setIsModalOpen(true);
  };

  /* 👉 Eliminar */
  const deleteUser = (id: number) => {
    Swal.fire({
      title: "¿Eliminar abogado?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUserService(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));

        Swal.fire({
          icon: "success",
          title: "Eliminado",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  const passwordsMatch =
    editingUser || form.password === form.confirmPassword;

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary">Abogados</h1>
          <p className="text-gray-600">
            Administración del equipo jurídico
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold"
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
              <th className="px-6 py-4 text-left">Correo electrónico</th>
              <th className="px-6 py-4 text-left">Teléfono</th>
              <th className="px-6 py-4 text-left">Especialidad</th>
              <th className="px-6 py-4 text-left">Rol</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((l, index) => (
              <tr
                key={l.id}
                className={`${index % 2 ? "bg-gray-200" : ""}`}
              >
                <td className="px-6 py-4 font-semibold text-primary">
                  <div className="flex items-center gap-3">

                    <img
                      src={l.avatar || "/avatar-default.png"}
                      alt={l.name}
                      className="w-9 h-9 rounded-full object-cover border"
                    />

                    <span>{l.name}</span>

                  </div>
                </td>
                <td className="px-6 py-4">{l.email}</td>
                <td className="px-6 py-4">{formatPhone(l.phone)}</td>
                <td className="px-6 py-4">{l.specialty}</td>
                <td className="px-6 py-4">
                  <span
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full
                      text-xs font-semibold uppercase
                      ${ROLE_STYLES[l.role]?.bg || "bg-gray-100"}
                      ${ROLE_STYLES[l.role]?.text || "text-gray-700"}
                    `}
                  >
                    {l.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button
                    onClick={() => openEditUser(l)}
                    className="text-primary"
                  >
                    <HiOutlinePencil size={22} />
                  </button>

                  <button
                    onClick={() => deleteUser(l.id)}
                    className="text-red-500"
                  >
                    <HiOutlineTrash size={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">

            <div className="px-6 py-4 border-b font-bold text-primary">
              {editingUser ? "Editar abogado" : "Registrar abogado"}
            </div>

            <div className="px-6 py-6 space-y-4">
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


              {!editingUser && (
                <>
                  <div>
                    <label className="block text-sm mb-1 font-medium">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="w-full border rounded-lg px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1 font-medium">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      className="w-full border rounded-lg px-4 py-3"
                    />
                  </div>
                  {!passwordsMatch && <span className="text-red-500">Las contraseñas no coinciden</span>}
                </>
              )}

            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>

              <button
                onClick={saveLawyer}
                disabled={!passwordsMatch}
                className={`px-6 py-2 rounded-lg font-semibold text-white
                  ${passwordsMatch ? "bg-primary" : "bg-gray-400"}
                `}
              >
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