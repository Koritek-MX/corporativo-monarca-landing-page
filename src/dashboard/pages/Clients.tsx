import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { formatPhone } from "../../components/common/formatPhone";
import type { Client, ClientType } from "../../types/client.type";
import { useState, useEffect } from "react";
import {
  getClientsService,
  createClientService,
  updateClientService,
  deleteClientService,
  updatePasswordClientService
} from "../../services/client.service";
import Swal from "sweetalert2";

const emptyClient: Client = {
  type: "FISICA",
  name: "",
  lastName: "",
  phone: "",
  email: "",
  rfc: "",
  password: "",
  confirmPassword: "",
  address: {
    state: "",
    city: "",
    colony: "",
    postalCode: "",
    street: "",
    extNumber: "",
    intNumber: "",
  },
  id: 0
};

const Clients = () => {

  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<Client>(emptyClient);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const passwordsMatch = editing || form.password === form.confirmPassword;

  const loadClients = async () => {
    try {
      Swal.fire({
        title: "Cargando clientes...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [data] = await Promise.all([
        getClientsService(),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      setClients(data);

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    } finally {
      Swal.close();
    }
  };

  const openCreate = () => {
    setForm(emptyClient);
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (client: Client) => {
    setForm(client);
    setEditing(client);
    setOpen(true);
  };

  const createClient = async () => {
    if (!form.name || !form.email) {
      Swal.fire("Error", "Nombre y correo son obligatorios", "error");
      return;
    }

    try {
      const payload = {
        type: form.type.trim().toUpperCase() as ClientType,
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        rfc: form.rfc.trim(),
        address: {
          state: form.address.state.trim(),
          city: form.address.city.trim(),
          colony: form.address.colony.trim(),
          postalCode: form.address.postalCode.trim(),
          street: form.address.street.trim(),
          extNumber: form.address.extNumber.trim(),
          intNumber: form.address.intNumber.trim()
        }
      };

      if (editing) {
        await updateClientService(editing.id, payload);

        Swal.fire({
          icon: "success",
          title: "Cliente actualizado",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createClientService(payload);

        Swal.fire({
          icon: "success",
          title: "Cliente creado",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setOpen(false);
      loadClients(); // recarga desde backend

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar el cliente", "error");
    }
  };

  const deleteClient = (id: number) => {
    Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteClientService(id);
          // Actualizar lista local
          setClients((prev) => prev.filter((c) => c.id !== id));

          Swal.fire({
            icon: "success",
            title: "Cliente eliminado",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error(error);

          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: "No se pudo eliminar el cliente",
          });
        }
      }
    });
  };

  const handleChangePassword = async () => {
    if (passwordForm.password !== passwordForm.confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }
    try {

      if (editing) {
        await updatePasswordClientService(editing.id, passwordForm.password);
        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada",
          timer: 1500,
          showConfirmButton: false,
        });
        setPasswordModalOpen(false);
      } else {
        Swal.fire("Error", "No se pudo actualizar la contraseña", "error");
      }

    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la contraseña", "error");
    }
  };


  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Clientes</h1>
          <p className="text-gray-600">
            Administración de clientes del despacho
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          <HiOutlinePlus />
          Nuevo cliente
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] md:min-w-full text-sm">
            <thead className="bg-primary text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Cliente</th>
                <th className="px-6 py-4 text-left">Régimen fiscal</th>
                <th className="px-6 py-4 text-left">Correo</th>
                <th className="px-6 py-4 text-left">Teléfono</th>
                <th className="px-6 py-4 text-left">RFC</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((c, index) => (
                <tr
                  key={c.id}
                  className={`
                border-t transition
                ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                hover:bg-primary/5
              `}
                >
                  <td className="px-6 py-4 font-medium">
                    {c.name} {c.lastName}

                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`
                    inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase
                    ${c.type === "FISICA"
                          ? "bg-secondary/20 text-secondary"
                          : "bg-primary/20 text-primary"
                        }
                  `}
                    >
                      {c.type === "FISICA" ? "Física" : "Moral"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{c.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatPhone(c.phone)}
                  </td>
                  <td className="px-6 py-4">{c.rfc}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-primary hover:text-secondary"
                    >
                      <HiOutlinePencil size={22} />
                    </button>
                    <button
                      onClick={() => deleteClient(c.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <HiOutlineTrash size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">

            {/* Header modal */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                {editing ? "Editar cliente" : "Nuevo cliente"}
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-6 max-h-[75vh] overflow-y-auto">

              {/* Información general */}
              <section>
                <h3 className="font-semibold mb-4">Información general</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as ClientType })
                    }
                    className="border rounded-lg px-4 py-3"
                  >
                    <option value="FISICA">Persona Física</option>
                    <option value="MORAL">Persona Moral</option>
                  </select>

                  <input
                    placeholder="RFC"
                    value={form.rfc}
                    onChange={(e) => setForm({ ...form, rfc: e.target.value })}
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Nombre(s)"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Apellidos"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Teléfono"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />


                  {/* SOLO cuando se crea cliente */}
                  {!editing && (
                    <>
                      <input
                        placeholder="Contraseña"
                        value={form.password || ""}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        className="border rounded-lg px-4 py-3"
                      />

                      <input
                        placeholder="Confirmar contraseña"
                        value={form.confirmPassword || ""}
                        onChange={(e) =>
                          setForm({ ...form, confirmPassword: e.target.value })
                        }
                        className="border rounded-lg px-4 py-3"
                      />
                    </>
                  )}
                </div>


                {editing && (
                  <h3 className="text-sm font-semibold
                    text-primary hover:text-secondary
                      underline transition mt-4"
                    onClick={() => setPasswordModalOpen(true)}>
                    Cambiar contraseña
                  </h3>
                )}

                {!editing && form.confirmPassword && !passwordsMatch && (
                  <p className="text-red-500 text-sm mt-1">
                    Las contraseñas no coinciden
                  </p>
                )}
              </section>

              {/* Dirección */}
              <section>
                <h3 className="font-semibold mb-4">Dirección</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    placeholder="Estado"
                    value={form.address.state}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, state: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="Municipio"
                    value={form.address.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, city: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="Colonia"
                    value={form.address.colony}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, colony: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="Código Postal"
                    value={form.address.postalCode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, postalCode: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="Calle"
                    value={form.address.street}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, street: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="No. Exterior"
                    value={form.address.extNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, extNumber: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                  <input
                    placeholder="No. Interior"
                    value={form.address.intNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: { ...form.address, intNumber: e.target.value },
                      })
                    }
                    className="border px-4 py-3 rounded-lg"
                  />
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={createClient}
                disabled={!passwordsMatch}
                className={`px-6 py-2 rounded-lg font-semibold transition
                    ${passwordsMatch
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                      `}>
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}

      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-primary">
                Cambiar contraseña
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4">

              <input
                type="password"
                placeholder="Nueva contraseña"
                value={passwordForm.password}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, password: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>

              <button
                onClick={handleChangePassword}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold"
              >
                Guardar contraseña
              </button>
            </div>

          </div>
        </div>
      )}
    </div>


  );
};

export default Clients;