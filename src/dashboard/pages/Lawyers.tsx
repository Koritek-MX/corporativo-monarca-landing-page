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
  updatePasswordUserService,
} from "../../services/user.services";
import { formatPhone } from "../../components/common/formatPhone";
import { useAuth } from "../../components/hooks/AuthContext";

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
  isVisible: true,
  password: "",
  confirmPassword: "",
};

const emptyPassForm = {
  currentPassword: "",
  newPassword: ""
};

const Lawyers = () => {

  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [passForm, setPassForm] = useState(emptyPassForm);
  const [loadingUsers, setLoadingUsers] = useState(false);


  useEffect(() => {
    loadUsers();
  }, []);

  // const filteredUsers = users.filter(u => u.id !== user?.id);

  /* 👉 Cargar abogados */
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
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
      setLoadingUsers(false);
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
      isVisible: form.isVisible,
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
      isVisible: form.isVisible,
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

      // 👉 Validación al crear
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

      // 👉 Crear o editar usuario
      if (editingUser) {
        await updateLawyer();
      } else {
        await createLawyer();
      }

      // 👉 Cambiar contraseña (solo en edición)
      if (
        editingUser &&
        passForm.currentPassword &&
        passForm.newPassword
      ) {

        await updatePasswordUserService(
          editingUser.id,
          passForm.currentPassword,
          passForm.newPassword
        );
      }

      setForm(emptyForm);
      setPassForm(emptyPassForm);
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
      isVisible: user.isVisible || null,
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

  const isCreating = !editingUser;

  const passwordsMatch =
    !isCreating || // si estamos editando no es obligatorio
    (form.password && form.confirmPassword && form.password === form.confirmPassword);

  const isFormValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone?.trim() &&
    form.specialty.trim() &&
    form.role &&
    form.avatar.trim() &&
    passwordsMatch;


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

      {loadingUsers ? (
        <div className="py-10 text-center text-gray-500">
          Cargando abogados...
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="text-5xl mb-3">⚖️</div>
          <p className="font-semibold text-lg">
            No hay abogados registrados
          </p>
          <p className="text-sm">
            Cuando agregues uno aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary text-white uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-left">Correo electrónico</th>
                <th className="px-6 py-4 text-left">Teléfono</th>
                <th className="px-6 py-4 text-left">Especialidad</th>
                <th className="px-6 py-4 text-left">Rol</th>
                <th className="px-6 py-4 text-left">Visible</th>
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

                      <span>{l.name} {l.id == user.id ? "(Tú)" : ""}</span>

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
                  <td className="px-6 py-4">{l.isVisible ? "SI" : "NO"}</td>
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
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">

            {/* HEADER */}
            <div className="px-6 py-4 border-b font-bold text-primary">
              {editingUser ? "Editar abogado" : "Registrar abogado"}
            </div>

            {/* BODY SCROLL */}
            <div className="px-6 py-6 space-y-4 overflow-y-auto">

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Nombre completo *
                </label>
                <input
                  placeholder="Ej: Lic. Juan Perez"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Correo electrónico *
                </label>
                <input
                  placeholder="Ej: ejemplo@correo.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Teléfono *
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
                  Especialidad(es) *
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
                  URL Imagen *
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
                  Rol *
                </label>

                <select
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                >
                  <option value="ABOGADO">Abogado</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {!editingUser && (
                <>
                  <div>
                    <label className="block text-sm mb-1 font-medium">
                      Contraseña *
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
                      Confirmar contraseña *
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
                </>
              )}

              {editingUser && user?.role === "ADMIN" && (
                <>
                  <div>
                    <label className="block text-red-700 text-sm mb-5 font-medium">
                      <strong>Actualizar contraseña</strong>
                    </label>

                    <label className="block text-sm mb-1 font-medium">
                      Actual contraseña *
                    </label>

                    <input
                      type="password"
                      placeholder="Ingresa tu actual contraseña"
                      className="w-full border rounded-lg px-4 py-3"
                      onChange={(e) =>
                        setPassForm({ ...passForm, currentPassword: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1 font-medium">
                      Nueva contraseña *
                    </label>

                    <input
                      type="password"
                      placeholder="Ingresa tu nueva contraseña"
                      className="w-full border rounded-lg px-4 py-3"
                      onChange={(e) =>
                        setPassForm({ ...passForm, newPassword: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* TOGGLE VISIBILIDAD */}

              <div className="flex items-center justify-between mt-3 mb-3">
                <label className="text-sm font-medium">
                  Visible en landing page *
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, isVisible: !form.isVisible })
                  }
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors
                    ${form.isVisible ? "bg-green-500" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition
                      ${form.isVisible ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>

              {isCreating && form.confirmPassword && !passwordsMatch && (
                <p className="text-red-500 text-sm">
                  Las contraseñas no coinciden
                </p>
              )}

              <p className="text-sm font-semibold text-gray-700 mt-2">
                (*) Los campos son obligatorios.
              </p>

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t">

              <button onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>

              <button
                onClick={saveLawyer}
                disabled={!isFormValid}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition
                  ${isFormValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                {editingUser ? "Editar abogado" : "Crear abogado"}
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Lawyers;