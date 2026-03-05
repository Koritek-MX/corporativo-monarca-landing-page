import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { formatPhone } from "../../components/common/formatPhone";
import type { Client, ClientType } from "../../types/client.type";
import { useState, useEffect } from "react";
import {
  createClientService,
  updateClientService,
  deleteClientService,
  getClientsPaginationService
} from "../../services/client.service";
import Swal from "sweetalert2";
import Pagination from "../../components/common/Pagination";

const emptyClient: Client = {
  type: "",
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

const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
const phoneRegex = /^[0-9]{10}$/;



const Clients = () => {

  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<Client>(emptyClient);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadClients();
  }, [page]);

  const isFormValid =
    form.name.trim() &&
    form.type &&
    phoneRegex.test(form.phone.replace(/\D/g, "")) &&
    form.address.state.trim() &&
    form.address.city.trim();

  const loadClients = async () => {
    try {
      setLoadingUsers(true);
      Swal.fire({
        title: "Cargando clientes...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const [data] = await Promise.all([
        getClientsPaginationService(page, 10),
        new Promise((resolve) => setTimeout(resolve, 700)),
      ]);

      setClients(data.data);
      setTotalPages(data.totalPages);

    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
    } finally {
      setLoadingUsers(false);
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

    if (!form.name.trim()) {
      return Swal.fire("Error", "El nombre es obligatorio", "warning");
    }

    if (!phoneRegex.test(form.phone.replace(/\D/g, ""))) {
      return Swal.fire("Error", "El teléfono debe tener 10 dígitos", "warning");
    }

    if (form.rfc && !rfcRegex.test(form.rfc.trim().toUpperCase())) {
      return Swal.fire("Error", "RFC inválido", "warning");
    }

    if (!form.address.state.trim() || !form.address.city.trim()) {
      return Swal.fire("Error", "Estado y municipio son obligatorios", "warning");
    }

    try {

      Swal.fire({
        title: editing ? "Actualizando cliente..." : "Creando cliente...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = {
        type: form.type.trim().toUpperCase() as ClientType,
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.replace(/\D/g, ""),
        email: form.email.trim(),
        rfc: form.rfc.trim().toUpperCase(),
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
      } else {
        await createClientService(payload);
      }

      Swal.fire({
        icon: "success",
        title: editing ? "Cliente actualizado" : "Cliente creado",
        timer: 1500,
        showConfirmButton: false,
      });

      setOpen(false);
      loadClients();

    } catch (error) {
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

      if (!result.isConfirmed) return;

      try {
        await deleteClientService(id);
        setClients((prev) => prev.filter((c) => c.id !== id));

        if (clients.length === 1 && page > 1) {
          setPage(page - 1);
        }

        Swal.fire({
          icon: "success",
          title: "Cliente eliminado",
          timer: 1500,
          showConfirmButton: false,
        });

      } catch (error: any) {
        console.error(error);
        const message =
          error?.response?.data?.message ||
          "No se pudo eliminar el cliente";

        Swal.fire({
          icon: "warning",
          title: "No se puede eliminar",
          text: message,
        });
      }
    });
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
      {loadingUsers ? (
        <div className="py-10 text-center text-gray-500">
          Cargando clientes...
        </div>
      ) : clients.length === 0 ? (<>
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="text-5xl mb-3">👨🏻‍💼</div>
          <p className="font-semibold text-lg">
            No hay clientes registrados
          </p>
          <p className="text-sm">
            Cuando agregues uno aparecerá aquí.
          </p>
        </div>
      </>) : (<>
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
        {/* PAGINACIÓN */}
        <Pagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </>)}


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
                    <option value="">Selecciona un régimen fiscal *</option>
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
                    placeholder="Nombre(s) *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Apellido(s) "
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="border rounded-lg px-4 py-3"
                  />

                  <input
                    placeholder="Teléfono *"
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
                </div>
              </section>
              {/* Dirección */}
              <section>
                <h3 className="font-semibold mb-4">Dirección</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    placeholder="Estado *"
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
                    placeholder="Municipio *"
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
                <br />
                <label className="text-sm font-semibold text-gray-700">
                  (*) Los campos son obligatorios.
                </label>
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
                disabled={!isFormValid}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition
                  ${isFormValid
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                {editing ? "Editar cliente" : "Crear cliente"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;