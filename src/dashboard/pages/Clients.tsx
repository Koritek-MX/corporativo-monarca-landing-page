import { useState } from "react";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Swal from "sweetalert2";
import { formatPhone } from "../../components/common/formatPhone";

type ClientType = "fisica" | "moral";

interface Client {
  id: number;
  type: ClientType;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  rfc: string;
  billingEmail: string;
  address: {
    state: string;
    city: string;
    neighborhood: string;
    postalCode: string;
    street: string;
    exterior: string;
    interior: string;
  };
}

const initialClients: Client[] = [
  {
    id: 1,
    type: "fisica",
    name: "Juan",
    lastName: "Pérez López",
    phone: "3521234567",
    email: "juan@email.com",
    rfc: "PELJ900101XXX",
    billingEmail: "facturas@email.com",
    address: {
      state: "Michoacán",
      city: "La Piedad",
      neighborhood: "Centro",
      postalCode: "59300",
      street: "Juárez",
      exterior: "123",
      interior: "",
    }
  },
  {
    id: 2,
    type: "moral",
    name: "Juan",
    lastName: "Pérez López",
    phone: "3521234567",
    email: "juan@email.com",
    rfc: "PELJ900101XXX",
    billingEmail: "facturas@email.com",
    address: {
      state: "Michoacán",
      city: "La Piedad",
      neighborhood: "Centro",
      postalCode: "59300",
      street: "Juárez",
      exterior: "123",
      interior: "",
    }
  },
  {
    id: 3,
    type: "fisica",
    name: "Juan",
    lastName: "Pérez López",
    phone: "3521234567",
    email: "juan@email.com",
    rfc: "PELJ900101XXX",
    billingEmail: "facturas@email.com",
    address: {
      state: "Michoacán",
      city: "La Piedad",
      neighborhood: "Centro",
      postalCode: "59300",
      street: "Juárez",
      exterior: "123",
      interior: "",
    }
  },
  {
    id: 4,
    type: "moral",
    name: "Juan",
    lastName: "Pérez López",
    phone: "3521234567",
    email: "juan@email.com",
    rfc: "PELJ900101XXX",
    billingEmail: "facturas@email.com",
    address: {
      state: "Michoacán",
      city: "La Piedad",
      neighborhood: "Centro",
      postalCode: "59300",
      street: "Juárez",
      exterior: "123",
      interior: "",
    }
  },
  {
    id: 5,
    type: "fisica",
    name: "Juan",
    lastName: "Pérez López",
    phone: "3521234567",
    email: "juan@email.com",
    rfc: "PELJ900101XXX",
    billingEmail: "facturas@email.com",
    address: {
      state: "Michoacán",
      city: "La Piedad",
      neighborhood: "Centro",
      postalCode: "59300",
      street: "Juárez",
      exterior: "123",
      interior: "",
    }
  },
  {
    id: 6,
    type: "moral",
    name: "Juan",
    lastName: "Pérez López",
    phone: "3521234567",
    email: "juan@email.com",
    rfc: "PELJ900101XXX",
    billingEmail: "facturas@email.com",
    address: {
      state: "Michoacán",
      city: "La Piedad",
      neighborhood: "Centro",
      postalCode: "59300",
      street: "Juárez",
      exterior: "123",
      interior: "",
    }
  },
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const emptyClient: Client = {
    id: Date.now(),
    type: "fisica",
    name: "",
    lastName: "",
    phone: "",
    email: "",
    rfc: "",
    billingEmail: "",
    address: {
      state: "",
      city: "",
      neighborhood: "",
      postalCode: "",
      street: "",
      exterior: "",
      interior: "",
    },
  };

  const [form, setForm] = useState<Client>(emptyClient);

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

  const saveClient = () => {
    if (!form.name || !form.email) return;

    if (editing) {
      setClients((prev) =>
        prev.map((c) => (c.id === editing.id ? form : c))
      );
    } else {
      setClients((prev) => [...prev, form]);
    }

    setOpen(false);
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
    }).then((result) => {
      if (result.isConfirmed) {
        setClients((prev) => prev.filter((c) => c.id !== id));
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
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
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
                    inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${c.type === "fisica"
                        ? "bg-secondary/20 text-secondary"
                        : "bg-primary/20 text-primary"
                      }
                  `}
                  >
                    {c.type === "fisica" ? "Física" : "Moral"}
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
                    <HiOutlinePencil size={18} />
                  </button>
                  <button
                    onClick={() => deleteClient(c.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                    <option value="fisica">Persona Física</option>
                    <option value="moral">Persona Moral</option>
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
                </div>
              </section>

              {/* Dirección */}
              <section>
                <h3 className="font-semibold mb-4">Dirección</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input placeholder="Estado" className="border px-4 py-3 rounded-lg" />
                  <input placeholder="Municipio" className="border px-4 py-3 rounded-lg" />
                  <input placeholder="Colonia" className="border px-4 py-3 rounded-lg" />
                  <input placeholder="Código Postal" className="border px-4 py-3 rounded-lg" />
                  <input placeholder="Calle" className="border px-4 py-3 rounded-lg" />
                  <input placeholder="No. Exterior" className="border px-4 py-3 rounded-lg" />
                  <input placeholder="No. Interior" className="border px-4 py-3 rounded-lg" />
                </div>
              </section>

              {/* Cobranza */}
              <section>
                <h3 className="font-semibold mb-4">Cobranza</h3>
                <input
                  placeholder="Correo para facturación y abonos"
                  value={form.billingEmail}
                  onChange={(e) =>
                    setForm({ ...form, billingEmail: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
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
                onClick={saveClient}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold"
              >
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;